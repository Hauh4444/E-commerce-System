from typing import Optional

import redis
from flask import Flask, current_app, g
from pymongo import MongoClient
from pymongo.database import Database


def init_mongo(app: Flask) -> None:
    """
    Initialize MongoDB support for a Flask application.

    Registers a teardown function to close the MongoClient when the app context ends.

    Args:
        app (Flask): The Flask application instance.
    """

    @app.teardown_appcontext
    def close_connection(_: Optional[BaseException] = None) -> None:
        client: Optional[MongoClient] = g.pop("mongo_client", None)
        if client is not None:
            client.close()


def get_db(app: Optional[Flask] = None) -> Database:
    """
    Get the MongoDB database instance for the current request context.

    Args:
        app (Optional[Flask]): Flask application instance. If not provided, uses `current_app`.

    Returns:
        Database: The MongoDB database instance.
    """
    flask_app = app or current_app

    if g.get("mongo_client") is None:
        g.mongo_client = MongoClient(flask_app.config["MONGO_URI"])

    if g.get("mongo_db") is None:
        g.mongo_db = g.mongo_client[flask_app.config["MONGO_DB"]]

    return g.mongo_db


def init_redis(app: Flask) -> None:
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


def get_redis(app: Optional[Flask] = None) -> redis.Redis:
    """
    Get the Redis client for the current app context.

    Args:
        app (Optional[Flask]): Flask application instance. If not provided, uses `current_app`.

    Returns:
        redis.Redis: The Redis client instance.
    """
    flask_app = app or current_app
    return flask_app.redis_client
