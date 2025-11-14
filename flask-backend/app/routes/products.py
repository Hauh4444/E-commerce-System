from http import HTTPStatus
from datetime import datetime

from bson import ObjectId
from flask import Blueprint, jsonify, request
from pymongo.errors import PyMongoError
from pydantic import BaseModel, Field, constr, confloat, conint, ValidationError
from bson.errors import InvalidId

from ..extensions import get_db
from ..utils import serialize_document, serialize_id

products_bp = Blueprint("products", __name__)


class ProductCreateSchema(BaseModel):
    name: constr(min_length=1)
    price: confloat(ge=0)
    currency: constr(min_length=1)
    description: str = ""
    inventory: conint(ge=0) = 0
    category: str | None = None
    images: list[str] = Field(default=[])
    attributes: dict = Field(default_factory=dict)


class ProductUpdateSchema(BaseModel):
    name: constr(min_length=1) | None
    price: confloat(ge=0) | None
    currency: constr(min_length=1) | None
    description: str | None
    inventory: conint(ge=0) | None
    category: str | None
    images: list[str] | None = None
    attributes: dict | None = None


def parse_object_id(oid: str):
    try:
        return ObjectId(oid)
    except InvalidId:
        return None


def error_response(error: str, status: HTTPStatus = HTTPStatus.BAD_REQUEST, details=None):
    body = {"error": error}
    if details:
        body["details"] = details
    return jsonify(body), status


@products_bp.get("/", strict_slashes=False)
def list_products():
    db = get_db()
    query_param = request.args.get("query", "").strip()
    try:
        limit = int(request.args.get("limit", 50))
    except ValueError:
        return error_response("invalid_limit", HTTPStatus.BAD_REQUEST)

    try:
        mongo_query = {}
        if query_param:
            mongo_query["name"] = {"$regex": query_param, "$options": "i"}

        products_cursor = db.products.find(mongo_query).sort("created_at", -1).limit(limit)
        products = [serialize_document(p) for p in products_cursor]
        return jsonify(products), HTTPStatus.OK
    except PyMongoError as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@products_bp.post("/")
def create_product():
    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")

    try:
        data = ProductCreateSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    db = get_db()
    product_data = data.model_dump()
    product_data.update({
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "average_review": 0,
        "reviews": 0,
    })

    result = db.products.insert_one(product_data)
    product = db.products.find_one({"_id": result.inserted_id})
    return jsonify(serialize_document(product)), HTTPStatus.CREATED


@products_bp.get("/<product_id>")
def get_product(product_id: str):
    db = get_db()
    lookup_id = parse_object_id(product_id)
    if not lookup_id:
        return error_response("invalid_product_id")

    product = db.products.find_one({"_id": lookup_id})
    if not product:
        return error_response("product_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(product)), HTTPStatus.OK


@products_bp.put("/<product_id>")
def update_product(product_id: str):
    db = get_db()
    lookup_id = parse_object_id(product_id)
    if not lookup_id:
        return error_response("invalid_product_id")

    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")

    try:
        data = ProductUpdateSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        return error_response("no_updates_provided")

    updates["updated_at"] = datetime.now()
    db.products.update_one({"_id": lookup_id}, {"$set": updates})
    product = db.products.find_one({"_id": lookup_id})
    return jsonify(serialize_document(product)), HTTPStatus.OK


@products_bp.delete("/<product_id>")
def delete_product(product_id: str):
    db = get_db()
    lookup_id = parse_object_id(product_id)
    if not lookup_id:
        return error_response("invalid_product_id")

    result = db.products.delete_one({"_id": lookup_id})
    if result.deleted_count == 0:
        return error_response("product_not_found", HTTPStatus.NOT_FOUND)

    return jsonify({"deleted": True, "product_id": serialize_id(lookup_id)}), HTTPStatus.OK
