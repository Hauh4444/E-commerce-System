from http import HTTPStatus

from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import mongo_client
from ..services.jwt_tokens import create_access_token
from ..utils import serialize_document

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    payload = request.get_json(force=True, silent=False) or {}
    required_fields = {"name", "email", "password"}
    if not required_fields.issubset(payload):
        return (
            {
                "error": "missing_fields",
                "details": f"Required fields: {', '.join(sorted(required_fields))}",
            },
            HTTPStatus.BAD_REQUEST,
        )

    db = mongo_client.get_db()
    email = payload["email"].lower()
    if db.users.find_one({"email": email}):
        return {"error": "email_in_use"}, HTTPStatus.CONFLICT

    user_data = {
        "name": payload["name"],
        "email": email,
        "password_hash": generate_password_hash(payload["password"]),
        "role": payload.get("role", "customer"),
        "created_at": payload.get("created_at"),
    }
    insert_result = db.users.insert_one(user_data)
    user_doc = db.users.find_one({"_id": insert_result.inserted_id})

    access_token = create_access_token(
        subject=str(user_doc["_id"]),
        claims={"email": user_doc["email"], "role": user_doc.get("role", "customer")},
    )

    response_body = {
        "access_token": access_token,
        "token_type": "Bearer",
        "user": serialize_document(
            {
                "_id": user_doc["_id"],
                "name": user_doc["name"],
                "email": user_doc["email"],
                "role": user_doc.get("role", "customer"),
            }
        ),
    }
    return jsonify(response_body), HTTPStatus.CREATED


@auth_bp.post("/login")
def login():
    payload = request.get_json(force=True, silent=False) or {}
    required_fields = {"email", "password"}
    if not required_fields.issubset(payload):
        return (
            {
                "error": "missing_fields",
                "details": f"Required fields: {', '.join(sorted(required_fields))}",
            },
            HTTPStatus.BAD_REQUEST,
        )

    db = mongo_client.get_db()
    email = payload["email"].lower()
    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], payload["password"]):
        return {"error": "invalid_credentials"}, HTTPStatus.UNAUTHORIZED

    access_token = create_access_token(
        subject=str(user["_id"]),
        claims={"email": user["email"], "role": user.get("role", "customer")},
    )
    response_body = {
        "access_token": access_token,
        "token_type": "Bearer",
        "user": serialize_document(
            {
                "_id": user["_id"],
                "name": user["name"],
                "email": user["email"],
                "role": user.get("role", "customer")
            }
        ),
    }
    return jsonify(response_body), HTTPStatus.OK

