from typing import Optional, Type, Tuple, Dict

from flask import Flask
from flask_cors import CORS

from app.auth import auth_bp
from app.products import products_bp
from app.payments import payments_bp
from app.lists import lists_bp

from app.config import Config
from app.extensions.mongo import init_mongo
from app.extensions.redis import init_redis


def register_routes(app: Flask) -> None:
    """
    Register all Flask blueprints for the application.

    Args:
        app (Flask): The Flask application instance.
    """
    blueprints = [
        (products_bp, "/products"),
        (auth_bp, "/auth"),
        (payments_bp, "/payments"),
        (lists_bp, "/lists"),
    ]

    for bp, prefix in blueprints:
        app.register_blueprint(bp, url_prefix=prefix)



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
    init_redis(app)
    register_routes(app)

    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    @app.route("/health", methods=["GET"])
    def health_check() -> Tuple[Dict[str, str], int]:
        return {"status": "ok"}, 200

    @app.route("/health/redis", methods=["GET"])
    def redis_health_check() -> Tuple[Dict[str, str], int]:
        from .extensions.redis import get_redis_client

        try:
            redis_client = get_redis_client()
            pong = redis_client.ping()
            if pong:
                return {"redis_status": "ok"}, 200
            return {"redis_status": "unreachable"}, 500
        except Exception as e:
            return {"redis_status": "error", "details": str(e)}, 500

    @app.route("/health/mongo", methods=["GET"])
    def mongo_health_check() -> Tuple[Dict[str, str], int]:
        from .extensions.mongo import get_mongo_db

        try:
            mongo_db = get_mongo_db()
            pong = mongo_db.command("ping")
            if pong:
                return {"mongo_status": "ok"}, 200
            return {"mongo_status": "unreachable"}, 500
        except Exception as e:
            return {"mongo_status": "error", "details": str(e)}, 500

    return app
