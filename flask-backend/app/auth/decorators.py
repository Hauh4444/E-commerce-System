import json
from functools import wraps
from http import HTTPStatus

from flask import request, jsonify
from jwt import InvalidTokenError, ExpiredSignatureError, DecodeError

from app.auth.jwt import decode_token
from app.extensions.mongo import parse_object_id
from app.extensions.redis import get_redis_client


def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get("access_token")
        if not token:
            return jsonify({"error": "missing_token"}), HTTPStatus.UNAUTHORIZED

        try:
            payload = decode_token(token)
        except (InvalidTokenError, ExpiredSignatureError, DecodeError):
            return jsonify({"error": "invalid_token"}), HTTPStatus.UNAUTHORIZED

        redis_client = get_redis_client()
        user_json = redis_client.get(f"user_session:{token}")
        if not user_json:
            return jsonify({"error": "session_expired"}), HTTPStatus.UNAUTHORIZED

        if isinstance(user_json, bytes):
            user_json = user_json.decode("utf-8")
        user = json.loads(user_json)

        if payload.get("sub") != user.get("user_id"):
            return jsonify({"error": "session_mismatch"}), HTTPStatus.UNAUTHORIZED

        user_id_obj = parse_object_id(user.get("user_id"))
        if not user_id_obj:
            return jsonify({"error": "invalid_user_id"}), HTTPStatus.UNAUTHORIZED
        user["id"] = user_id_obj

        return f(user, *args, **kwargs)

    return decorated
