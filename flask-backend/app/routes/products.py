from http import HTTPStatus

from bson import ObjectId
from flask import Blueprint, jsonify, request
from pymongo.errors import PyMongoError

from ..extensions import mongo_client
from ..utils import serialize_document, serialize_id

products_bp = Blueprint("products", __name__)


@products_bp.get("/", strict_slashes=False)
def list_products():
    db = mongo_client.get_db()
    query_param = request.args.get("query", "").strip()
    limit = int(request.args.get("limit", 50))

    try:
        mongo_query: dict[str, any] = {}
        if query_param:
            mongo_query["name"] = {"$regex": query_param, "$options": "i"}

        products_cursor = (
            db.products.find(mongo_query)
            .sort("created_at", -1)
            .limit(limit)
        )

        products: list[dict[str, any]] = [
            serialize_document(product) for product in products_cursor
        ]
        return jsonify(products), HTTPStatus.OK
    except PyMongoError as e:
        return jsonify({"error": f"Database error: {str(e)}"}), HTTPStatus.INTERNAL_SERVER_ERROR

@products_bp.post("/")
def create_product():
    payload = request.get_json(force=True, silent=False) or {}
    required_fields = {"name", "price", "currency"}
    if not required_fields.issubset(payload):
        return (
            {
                "error": "missing_fields",
                "details": f"Required fields: {', '.join(sorted(required_fields))}",
            },
            HTTPStatus.BAD_REQUEST,
        )

    db = mongo_client.get_db()
    result = db.products.insert_one(
        {
            "name": payload["name"],
            "description": payload.get("description", ""),
            "price": float(payload["price"]),
            "currency": payload["currency"],
            "inventory": int(payload.get("inventory", 0)),
            "created_at": payload.get("created_at"),
            "updated_at": payload.get("updated_at"),
            "category": payload.get("category"),
            "images": payload.get("images", []),
            "attributes": payload.get("attributes", {}),
            "average_review": 0,
            "reviews": 0
        }
    )

    product = db.products.find_one({"_id": result.inserted_id})
    return jsonify(serialize_document(product)), HTTPStatus.CREATED


@products_bp.get("/<product_id>")
def get_product(product_id: str):
    db = mongo_client.get_db()
    try:
        lookup_id = ObjectId(product_id)
    except Exception:
        return {"error": "invalid_product_id"}, HTTPStatus.BAD_REQUEST
    product = db.products.find_one({"_id": lookup_id})
    if not product:
        return {"error": "product_not_found"}, HTTPStatus.NOT_FOUND
    return jsonify(serialize_document(product)), HTTPStatus.OK


@products_bp.put("/<product_id>")
def update_product(product_id: str):
    db = mongo_client.get_db()
    try:
        lookup_id = ObjectId(product_id)
    except Exception:
        return {"error": "invalid_product_id"}, HTTPStatus.BAD_REQUEST

    payload = request.get_json(force=True, silent=False) or {}
    mutable_fields = {
        "name",
        "description",
        "price",
        "currency",
        "inventory",
        "category",
        "images",
        "attributes",
    }
    updates = {field: payload[field] for field in mutable_fields if field in payload}
    if not updates:
        return {"error": "no_updates_provided"}, HTTPStatus.BAD_REQUEST

    db.products.update_one({"_id": lookup_id}, {"$set": updates})
    product = db.products.find_one({"_id": lookup_id})
    return jsonify(serialize_document(product)), HTTPStatus.OK


@products_bp.delete("/<product_id>")
def delete_product(product_id: str):
    db = mongo_client.get_db()
    try:
        lookup_id = ObjectId(product_id)
    except Exception:
        return {"error": "invalid_product_id"}, HTTPStatus.BAD_REQUEST

    result = db.products.delete_one({"_id": lookup_id})
    if result.deleted_count == 0:
        return {"error": "product_not_found"}, HTTPStatus.NOT_FOUND
    return {"deleted": True, "product_id": serialize_id(lookup_id)}, HTTPStatus.OK


