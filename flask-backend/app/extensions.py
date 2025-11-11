from typing import Optional

from flask import Flask, current_app, g
from pymongo import MongoClient
from pymongo.database import Database


class MongoClientWrapper:
    """Provides access to MongoDB within the Flask app context."""

    def init_app(self, app: Flask) -> None:
        @app.teardown_appcontext
        def close_connection(_: Optional[BaseException]) -> None:
            client: Optional[MongoClient] = g.pop("mongo_client", None)
            if client is not None:
                client.close()

    def get_db(self, app: Optional[Flask] = None) -> Database:
        flask_app = app or current_app
        if "mongo_client" not in g:
            g.mongo_client = MongoClient(flask_app.config["MONGO_URI"])
        if "mongo_db" not in g:
            g.mongo_db = g.mongo_client[flask_app.config["MONGO_DB"]]
        return g.mongo_db


mongo_client = MongoClientWrapper()


