from datetime import datetime
from http import HTTPStatus

from bson import ObjectId
from flask import Blueprint, jsonify, request

from ..extensions import mongo_client
from ..utils import serialize_document

orders_bp = Blueprint("orders", __name__)


@orders_bp.get("/")
def list_orders():
    db = mongo_client.get_db()
    orders = [
        serialize_document(order)
        for order in db.orders.find().sort("created_at", -1)
    ]
    return jsonify(orders), HTTPStatus.OK


@orders_bp.get("/<order_id>")
def get_order(order_id: str):
    db = mongo_client.get_db()
    try:
        lookup_id = ObjectId(order_id)
    except Exception:
        return {"error": "invalid_order_id"}, HTTPStatus.BAD_REQUEST

    order = db.orders.find_one({"_id": lookup_id})
    if not order:
        return {"error": "order_not_found"}, HTTPStatus.NOT_FOUND
    return jsonify(serialize_document(order)), HTTPStatus.OK


@orders_bp.post("/")
def create_order():
    payload = request.get_json(force=True, silent=False) or {}
    required_fields = {"user_id", "items", "total"}
    if not required_fields.issubset(payload):
        return (
            {
                "error": "missing_fields",
                "details": f"Required fields: {', '.join(sorted(required_fields))}",
            },
            HTTPStatus.BAD_REQUEST,
        )

    db = mongo_client.get_db()
    order = {
        "user_id": payload["user_id"],
        "items": payload["items"],
        "total": float(payload["total"]),
        "currency": payload.get("currency", "USD"),
        "status": payload.get("status", "pending"),
        "shipping_address": payload.get("shipping_address"),
        "billing_address": payload.get("billing_address"),
        "created_at": payload.get("created_at") or datetime.utcnow(),
        "updated_at": payload.get("updated_at") or datetime.utcnow(),
    }
    result = db.orders.insert_one(order)
    order = db.orders.find_one({"_id": result.inserted_id})
    return jsonify(serialize_document(order)), HTTPStatus.CREATED


@orders_bp.patch("/<order_id>")
def update_order(order_id: str):
    payload = request.get_json(force=True, silent=False) or {}
    mutable_fields = {"status", "tracking_number", "updated_at"}
    updates = {field: payload[field] for field in mutable_fields if field in payload}

    if not updates:
        return {"error": "no_updates_provided"}, HTTPStatus.BAD_REQUEST

    db = mongo_client.get_db()
    try:
        lookup_id = ObjectId(order_id)
    except Exception:
        return {"error": "invalid_order_id"}, HTTPStatus.BAD_REQUEST

    updates.setdefault("updated_at", datetime.utcnow())
    result = db.orders.update_one({"_id": lookup_id}, {"$set": updates})
    if result.matched_count == 0:
        return {"error": "order_not_found"}, HTTPStatus.NOT_FOUND
    order = db.orders.find_one({"_id": lookup_id})
    return jsonify(serialize_document(order)), HTTPStatus.OK


