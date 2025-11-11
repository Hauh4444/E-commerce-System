from http import HTTPStatus

from bson import ObjectId
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash

from ..extensions import mongo_client
from ..utils import serialize_document

users_bp = Blueprint("users", __name__)


@users_bp.get("/")
def list_users():
    db = mongo_client.get_db()
    users = [
        serialize_document({"_id": user["_id"], "email": user["email"], "role": user.get("role", "customer")})
        for user in db.users.find({}, {"email": 1, "role": 1})
    ]
    return jsonify(users), HTTPStatus.OK


@users_bp.post("/")
def create_user():
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
    if db.users.find_one({"email": payload["email"]}):
        return {"error": "email_in_use"}, HTTPStatus.CONFLICT

    user = {
        "email": payload["email"],
        "password_hash": generate_password_hash(payload["password"]),
        "role": payload.get("role", "customer"),
    }
    result = db.users.insert_one(user)
    user_doc = db.users.find_one({"_id": result.inserted_id}, {"email": 1, "role": 1})
    return jsonify(serialize_document(user_doc)), HTTPStatus.CREATED


@users_bp.get("/<user_id>")
def get_user(user_id: str):
    db = mongo_client.get_db()
    try:
        lookup_id = ObjectId(user_id)
    except Exception:
        return {"error": "invalid_user_id"}, HTTPStatus.BAD_REQUEST

    user = db.users.find_one({"_id": lookup_id}, {"email": 1, "role": 1})
    if not user:
        return {"error": "user_not_found"}, HTTPStatus.NOT_FOUND
    return jsonify(serialize_document(user)), HTTPStatus.OK


