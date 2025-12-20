import json
from http import HTTPStatus

from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash
from pydantic import BaseModel, EmailStr, constr, ValidationError

from app.config import Config
from app.extensions.mongo import serialize_document
from app.extensions.redis import get_redis_client
from app.auth import auth_required, create_access_token, AuthRepository
from app.settings import SettingsRepository
from app.lists import ListsRepository
from app.utils import error_response

auth_bp = Blueprint("auth", __name__)

auth_repo = AuthRepository()
settings_repo = SettingsRepository()
lists_repo = ListsRepository()


class RegisterSchema(BaseModel):
    name: constr(min_length=1)
    email: EmailStr
    password: constr(min_length=8)


class LoginSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


def generate_user_response(user):
    access_token = create_access_token(
        subject=str(user["_id"]),
        claims={"email": user["email"], "role": user.get("role", "customer")},
    )
    return {
        "access_token": access_token,
        "token_type": "Bearer",
        "user": serialize_document(
            {
                "_id": user["_id"],
                "name": user["name"],
                "email": user["email"],
                "role": user.get("role", "customer"),
            }
        ),
    }


@auth_bp.post("/register")
def register():
    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")

    try:
        data = RegisterSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    if auth_repo.find_user_by_email(email=data.email):
        return error_response("email_in_use", status=HTTPStatus.CONFLICT)

    user_doc = auth_repo.create_user(name=data.name, email=data.email, password=data.password)

    settings_repo.create_settings(user_id=user_doc["user_id"])
    lists_repo.create_list(user_id=user_doc["user_id"], name="Wishlist", product_ids=[])

    response_body = generate_user_response(user=user_doc)
    return jsonify(response_body), HTTPStatus.CREATED


@auth_bp.post("/login")
def login():
    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")

    try:
        data = LoginSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    user = auth_repo.find_user_by_email(email=data.email)
    if not user or not check_password_hash(pwhash=user["password_hash"], password=data.password):
        return error_response("invalid_credentials", status=HTTPStatus.UNAUTHORIZED)

    access_token = create_access_token(
        subject=str(user["_id"]),
        claims={"email": user["email"], "role": user.get("role", "customer")},
    )

    user_data = serialize_document({
        "_id": user["_id"],
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "customer"),
    })

    redis_client = get_redis_client()
    redis_key = f"user_session:{access_token}"
    redis_client.set(redis_key, json.dumps(user_data), ex=(60 * Config.JWT_ACCESS_EXPIRES_MINUTES))

    return jsonify({
        "access_token": access_token,
        "token_type": "Bearer",
        "user": user_data,
    }), HTTPStatus.OK


@auth_bp.delete("/delete")
@auth_required
def delete_account(user):
    db_user = auth_repo.find_user_by_id(user_id=user["id"])
    if not db_user:
        return error_response("user_not_found", status=HTTPStatus.NOT_FOUND)

    auth_repo.delete_user(user_id=user["id"])

    redis_client = get_redis_client()
    keys = redis_client.keys(f"user_session:*")
    for key in keys:
        value = redis_client.get(key)
        if value and json.loads(value).get("_id") == str(user["id"]):
            redis_client.delete(key)

    return jsonify({"message": "account_deleted"}), HTTPStatus.OK