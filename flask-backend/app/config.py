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

    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_ACCESS_EXPIRES_MINUTES: int = int(os.getenv("JWT_ACCESS_EXPIRES_MINUTES", "60"))

    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "change-me")
