from typing import Optional, Type, Tuple, Dict

from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import init_mongo, init_redis
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
    init_redis(app)
    register_routes(app)

    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

    @app.route("/health", methods=["GET"])
    def health_check() -> Tuple[Dict[str, str], int]:
        return {"status": "ok"}, 200

    @app.route("/health/redis", methods=["GET"])
    def redis_health_check() -> Tuple[Dict[str, str], int]:
        from .extensions import get_redis

        try:
            redis_client = get_redis()
            pong = redis_client.ping()
            if pong:
                return {"redis_status": "ok"}, 200
            return {"redis_status": "unreachable"}, 500
        except Exception as e:
            return {"redis_status": "error", "details": str(e)}, 500

    @app.route("/health/mongo", methods=["GET"])
    def mongo_health_check() -> Tuple[Dict[str, str], int]:
        from .extensions import get_db

        try:
            db = get_db()
            db.command("ping")
            return {"mongo_status": "ok"}, 200
        except Exception as e:
            return {"mongo_status": "error", "details": str(e)}, 500

    return app
