import json
from http import HTTPStatus
from datetime import datetime

from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
from pydantic import BaseModel, EmailStr, constr, ValidationError

from ..extensions import get_db, get_redis
from ..services.jwt_tokens import create_access_token
from ..config import Config
from ..utils import serialize_document

auth_bp = Blueprint("auth", __name__)

JWT_ACCESS_EXPIRES_MINUTES = Config.JWT_ACCESS_EXPIRES_MINUTES


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
        return {"error": "invalid_json"}, HTTPStatus.BAD_REQUEST

    try:
        data = RegisterSchema(**payload)
    except ValidationError as e:
        return {"error": "invalid_payload", "details": e.errors()}, HTTPStatus.BAD_REQUEST

    db = get_db()
    email = str(data.email).lower()

    if db.users.find_one({"email": email}):
        return {"error": "email_in_use"}, HTTPStatus.CONFLICT

    user_data = {
        "name": data.name,
        "email": email,
        "password_hash": generate_password_hash(data.password),
        "role": "customer",
        "created_at": datetime.now(),
    }

    insert_result = db.users.insert_one(user_data)
    user_doc = db.users.find_one({"_id": insert_result.inserted_id})

    response_body = generate_user_response(user_doc)
    return jsonify(response_body), HTTPStatus.CREATED


@auth_bp.post("/login")
def login():
    payload = request.get_json()
    if payload is None:
        return {"error": "invalid_json"}, HTTPStatus.BAD_REQUEST

    try:
        data = LoginSchema(**payload)
    except ValidationError as e:
        return {"error": "invalid_payload", "details": e.errors()}, HTTPStatus.BAD_REQUEST

    db = get_db()
    email = str(data.email).lower()
    user = db.users.find_one({"email": email})

    if not user or not check_password_hash(user["password_hash"], data.password):
        return {"error": "invalid_credentials"}, HTTPStatus.UNAUTHORIZED

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

    redis_client = get_redis()
    redis_key = f"user_session:{access_token}"
    redis_client.set(redis_key, json.dumps(user_data), ex=(60 * JWT_ACCESS_EXPIRES_MINUTES))

    return jsonify({
        "access_token": access_token,
        "token_type": "Bearer",
        "user": user_data,
    }), HTTPStatus.OK