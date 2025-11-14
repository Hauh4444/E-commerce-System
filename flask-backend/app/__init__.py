from typing import Optional, Type, Tuple, Dict

from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import init_mongo
from .routes import register_routes


def create_app(config_object: Optional[Type[Config]] = None) -> Flask:
    """
    Application factory for the ecommerce backend.

    Args:
        config_object (Optional[Type[Config]]): Flask configuration class. Defaults to `Config`.

    Returns:
        Flask: Configured Flask application instance.
    """
    app = Flask(__name__)
    app.config.from_object(config_object or Config)

    init_mongo(app)
    register_routes(app)

    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    @app.route("/health", methods=["GET"])
    def health_check() -> Tuple[Dict[str, str], int]:
        return {"status": "ok"}, 200

    return app
