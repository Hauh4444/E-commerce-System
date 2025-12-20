from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from flask import current_app
from jwt import InvalidTokenError, ExpiredSignatureError


def create_access_token(subject: str, claims: Optional[dict[str, any]] = None) -> str:
    """
    Generate a signed JWT access token for a given subject.

    Args:
        subject (str): The unique identifier for the token subject (e.g., user ID or email).
        claims (Optional[dict[str, any]]): Additional claims to include in the token payload.

    Returns:
        str: The encoded JWT access token.
    """
    now = datetime.now(timezone.utc)
    expires_delta = timedelta(minutes=current_app.config["JWT_ACCESS_EXPIRES_MINUTES"])

    payload: dict[str, any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }

    if claims:
        payload.update(claims)

    token = jwt.encode(
        payload,
        current_app.config["JWT_SECRET_KEY"],
        algorithm=current_app.config["JWT_ALGORITHM"],
    )

    return token


def decode_token(token: str) -> dict[str, any]:
    """
    Verify and decode a JWT access token.

    Args:
        token (str): The JWT token to decode.

    Returns:
        dict[str, any]: The decoded token payload.

    Raises:
        jwt.ExpiredSignatureError: If the token has expired.
        jwt.InvalidTokenError: If the token is invalid or cannot be decoded.
    """
    try:
        payload = jwt.decode(
            token,
            current_app.config["JWT_SECRET_KEY"],
            algorithms=[current_app.config["JWT_ALGORITHM"]],
        )
        return payload
    except ExpiredSignatureError as e:
        raise ExpiredSignatureError("Token has expired") from e
    except InvalidTokenError as e:
        raise InvalidTokenError("Invalid token") from e
