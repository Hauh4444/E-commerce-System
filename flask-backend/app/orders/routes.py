import stripe
from http import HTTPStatus
from flask import Blueprint, jsonify, request
from pydantic import BaseModel, constr, confloat, conint, ValidationError, Field

from app.config import Config
from app.extensions.mongo import serialize_document
from app.auth import auth_required
from app.orders import OrdersRepository
from app.utils import error_response

orders_bp = Blueprint("orders", __name__)

orders_repo = OrdersRepository()

stripe.api_key = Config.STRIPE_SECRET_KEY
FRONTEND_URL = Config.FRONTEND_URL


class OrderCreateSchema(BaseModel):
    product_ids: list[str] = Field(default=[])
    name: constr(min_length=1)
    address: constr(min_length=10)


class CheckoutItemSchema(BaseModel):
    product_id: str
    product_name: constr(min_length=1)
    amount: confloat(ge=0)
    quantity: conint(ge=1)
    currency: constr(min_length=1)


class OrderWithPaymentSchema(BaseModel):
    items: list[CheckoutItemSchema]
    name: constr(min_length=1)
    address: constr(min_length=10)


@orders_bp.get("/", strict_slashes=False)
@auth_required
def list_orders(user):
    try:
        orders_cursor = orders_repo.get_orders_for_user(user_id=user["id"])
        return jsonify([serialize_document(o) for o in orders_cursor]), HTTPStatus.OK
    except Exception as e:
        return error_response("Database error", details=str(e), status=HTTPStatus.INTERNAL_SERVER_ERROR)


@orders_bp.post("/")
@auth_required
def create_order_with_payment(user):
    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")

    try:
        data = OrderWithPaymentSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors(), status=HTTPStatus.BAD_REQUEST)

    try:
        new_order = orders_repo.create_order(
            user_id=user["id"],
            product_ids=[item.product_id for item in data.items],
            name=data.name,
            address=data.address,
        )
        from app.orders.utils import create_stripe_session_with_rollback
        session_url = create_stripe_session_with_rollback(user_id=user["id"], order_id=new_order["_id"], items=data.items)
        return jsonify({"order_id": str(new_order["_id"]), "url": session_url}), HTTPStatus.CREATED
    except Exception as e:
        return error_response("Database error", details=str(e), status=HTTPStatus.INTERNAL_SERVER_ERROR)