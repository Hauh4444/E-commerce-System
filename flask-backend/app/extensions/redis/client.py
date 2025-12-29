from typing import Optional

import redis
from flask import Flask, current_app


def init_redis(app: Flask):
    """
    Initialize Redis client for a Flask application and store in app context.

    Args:
        app (Flask): The Flask application instance.
    """
    app.redis_client = redis.Redis(
        host=app.config.get("REDIS_HOST", "localhost"),
        port=app.config.get("REDIS_PORT", 6379),
        db=app.config.get("REDIS_DB", 0),
        decode_responses=True,  # Store strings instead of bytes
    )


def get_redis_client(app: Optional[Flask] = None):
    """
    Get the Redis client for the current app context.

    Args:
        app (Optional[Flask]): Flask application instance. If not provided, uses `current_app`.

    Returns:
        redis.Redis: The Redis client instance.
    """
    flask_app = app or current_app
    return flask_app.redis_client
