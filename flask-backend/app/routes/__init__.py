from flask import Flask

from .auth import auth_bp
from .products import products_bp
from .payments import payments_bp
from .lists import lists_bp


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
