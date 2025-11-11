from http import HTTPStatus

from bson import ObjectId
from flask import Blueprint, jsonify, request

from ..extensions import mongo_client
from ..utils import serialize_document, serialize_id

cart_bp = Blueprint("cart", __name__)


@cart_bp.get("/<user_id>")
def get_cart(user_id: str):
    db = mongo_client.get_db()
    cart = db.carts.find_one({"user_id": user_id})
    if not cart:
        empty_cart = {"user_id": user_id, "items": []}
        return jsonify(_serialize_cart(empty_cart)), HTTPStatus.OK
    return jsonify(_serialize_cart(cart)), HTTPStatus.OK


@cart_bp.post("/<user_id>/items")
def add_item(user_id: str):
    payload = request.get_json(force=True, silent=False) or {}
    required_fields = {"product_id", "quantity"}
    if not required_fields.issubset(payload):
        return (
            {
                "error": "missing_fields",
                "details": f"Required fields: {', '.join(sorted(required_fields))}",
            },
            HTTPStatus.BAD_REQUEST,
        )

    db = mongo_client.get_db()
    item = {
        "_id": ObjectId(),
        "product_id": payload["product_id"],
        "quantity": int(payload["quantity"]),
    }
    db.carts.update_one(
        {"user_id": user_id},
        {"$push": {"items": item}},
        upsert=True,
    )
    cart = db.carts.find_one({"user_id": user_id})
    return jsonify(_serialize_cart(cart)), HTTPStatus.CREATED


@cart_bp.put("/<user_id>/items/<item_id>")
def update_item(user_id: str, item_id: str):
    payload = request.get_json(force=True, silent=False) or {}
    update_fields = {}
    if "quantity" in payload:
        update_fields["items.$.quantity"] = int(payload["quantity"])
    if "product_id" in payload:
        update_fields["items.$.product_id"] = payload["product_id"]

    if not update_fields:
        return {"error": "no_updates_provided"}, HTTPStatus.BAD_REQUEST

    db = mongo_client.get_db()
    try:
        lookup_id = ObjectId(item_id)
    except Exception:
        return {"error": "invalid_item_id"}, HTTPStatus.BAD_REQUEST

    result = db.carts.update_one(
        {"user_id": user_id, "items._id": lookup_id},
        {"$set": update_fields},
    )
    if result.matched_count == 0:
        return {"error": "cart_item_not_found"}, HTTPStatus.NOT_FOUND
    cart = db.carts.find_one({"user_id": user_id})
    return jsonify(_serialize_cart(cart)), HTTPStatus.OK


@cart_bp.delete("/<user_id>/items/<item_id>")
def remove_item(user_id: str, item_id: str):
    db = mongo_client.get_db()
    try:
        lookup_id = ObjectId(item_id)
    except Exception:
        return {"error": "invalid_item_id"}, HTTPStatus.BAD_REQUEST

    result = db.carts.update_one(
        {"user_id": user_id},
        {"$pull": {"items": {"_id": lookup_id}}},
    )
    if result.modified_count == 0:
        return {"error": "cart_item_not_found"}, HTTPStatus.NOT_FOUND
    cart = db.carts.find_one({"user_id": user_id})
    return jsonify(_serialize_cart(cart)), HTTPStatus.OK


@cart_bp.delete("/<user_id>")
def clear_cart(user_id: str):
    db = mongo_client.get_db()
    db.carts.delete_one({"user_id": user_id})
    return {"cleared": True, "user_id": user_id}, HTTPStatus.OK


def _serialize_cart(cart: dict | None) -> dict:
    if not cart:
        return {"items": [], "user_id": None}
    serialized = serialize_document(cart)
    serialized["items"] = [
        {
            "id": serialize_id(item.get("_id")),
            "product_id": item.get("product_id"),
            "quantity": item.get("quantity", 0),
        }
        for item in cart.get("items", [])
    ]
    return serialized


