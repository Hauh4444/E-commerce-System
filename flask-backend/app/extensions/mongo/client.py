from typing import Optional

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


def get_mongo_db(app: Optional[Flask] = None) -> Database:
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