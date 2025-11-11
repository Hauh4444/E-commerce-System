from datetime import datetime, timedelta, timezone
from typing import Any, Dict

import jwt

from flask import current_app


def create_access_token(subject: str, claims: Dict[str, Any] | None = None) -> str:
    """Generate a signed JWT access token for a subject."""
    now = datetime.now(timezone.utc)
    expires_delta = timedelta(
        minutes=current_app.config["JWT_ACCESS_EXPIRES_MINUTES"]
    )
    payload: Dict[str, Any] = {
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
    # PyJWT returns str for >=2.0
    return token


def decode_token(token: str) -> Dict[str, Any]:
    """Verify and decode an access token."""
    return jwt.decode(
        token,
        current_app.config["JWT_SECRET_KEY"],
        algorithms=[current_app.config["JWT_ALGORITHM"]],
    )

