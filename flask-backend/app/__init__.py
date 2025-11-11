from typing import Optional, Type

from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import mongo_client
from .routes import register_routes


def create_app(config_object: Optional[Type[Config]] = None) -> Flask:
    """Application factory for the ecommerce backend."""
    app = Flask(__name__)
    app.config.from_object(config_object or Config)

    mongo_client.init_app(app)
    register_routes(app)

    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    @app.route("/health", methods=["GET"])
    def health_check():
        return {"status": "ok"}, 200

    return app

