from typing import List
from http import HTTPStatus

import stripe
from flask import Blueprint, request, jsonify
from pydantic import BaseModel, ValidationError, constr, confloat, conint

from ..config import Config

payments_bp = Blueprint("payments", __name__)

stripe.api_key = Config.STRIPE_SECRET_KEY
FRONTEND_URL = Config.FRONTEND_URL


class CheckoutItem(BaseModel):
    product_name: constr(min_length=1)
    amount: confloat(ge=0)
    quantity: conint(ge=1)
    currency: constr(min_length=1)

class CheckoutSessionSchema(BaseModel):
    items: List[CheckoutItem]


def error_response(error: str, status: HTTPStatus = HTTPStatus.BAD_REQUEST, details=None):
    body = {"error": error}
    if details:
        body["details"] = details
    return jsonify(body), status


@payments_bp.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")

    try:
        data = CheckoutSessionSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": item.currency.lower(),
                        "product_data": {"name": item.product_name},
                        "unit_amount": int(item.amount * 100),
                    },
                    "quantity": item.quantity,
                }
                for item in data.items
            ],
            mode="payment",
            success_url=f"{FRONTEND_URL}/?checkout_complete=true",
            cancel_url=f"{FRONTEND_URL}/cart",
        )
        return jsonify({"url": session.url}), HTTPStatus.CREATED
    except stripe.error.StripeError as e:
        return error_response("stripe_error", details=str(e), status=HTTPStatus.BAD_REQUEST)