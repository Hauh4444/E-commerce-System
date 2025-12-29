import os
from dataclasses import dataclass


@dataclass
class Config:
    """Default configuration for the Flask application."""

    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    DEBUG: bool = bool(int(os.getenv("FLASK_DEBUG", "0")))
    TESTING: bool = bool(int(os.getenv("FLASK_TESTING", "0")))
    SECRET_KEY: str = os.getenv("FLASK_SECRET_KEY", "change-me")

    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB: str = os.getenv("MONGO_DB", "ecommerce")

    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: str = os.getenv("REDIS_PORT", 6379)

    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_EXPIRES_MINUTES: int = int(os.getenv("JWT_ACCESS_EXPIRES_MINUTES", "43200"))
    JWT_COOKIE_NAME: str = os.getenv("JWT_COOKIE_NAME", "access_token")
    JWT_COOKIE_SECURE: bool = os.getenv("JWT_COOKIE_SECURE", "0") == "1"
    JWT_COOKIE_SAMESITE: str = os.getenv("JWT_COOKIE_SAMESITE", "Lax")
    JWT_COOKIE_DOMAIN: str | None = os.getenv("JWT_COOKIE_DOMAIN", None)

    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "change-me")
