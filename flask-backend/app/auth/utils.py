from flask import jsonify

from app.config import Config
from app.extensions.mongo import serialize_document
from app.auth import create_access_token


def generate_user_response(user):
    """Generate a Flask JSON response for a user and set a JWT access token as a cookie.

    Args:
        user (dict): User dictionary with "_id", "name", "email", and optional "role".

    Returns:
        tuple: (response_body (flask Response with serialized user), access_token (str JWT token)).
    """
    access_token = create_access_token(subject=str(user["_id"]), claims={"email": user["email"], "role": user.get("role", "customer")},)
    response_body = jsonify({"user": serialize_document({"_id": user["_id"], "name": user["name"], "email": user["email"], "role": user.get("role", "customer")})})
    response_body.set_cookie(
        key=Config.JWT_COOKIE_NAME,
        value=access_token,
        httponly=True,
        secure=Config.JWT_COOKIE_SECURE,
        samesite=Config.JWT_COOKIE_SAMESITE,
        domain=Config.JWT_COOKIE_DOMAIN,
        max_age=60 * Config.JWT_ACCESS_EXPIRES_MINUTES,
    )
    return response_body, access_token