from flask import Flask

from .auth import auth_bp
from .cart import cart_bp
from .orders import orders_bp
from .products import products_bp
from .users import users_bp


def register_routes(app: Flask) -> None:
    app.register_blueprint(products_bp, url_prefix="/products")
    app.register_blueprint(cart_bp, url_prefix="/cart")
    app.register_blueprint(orders_bp, url_prefix="/orders")
    app.register_blueprint(users_bp, url_prefix="/users")
    app.register_blueprint(auth_bp, url_prefix="/auth")


