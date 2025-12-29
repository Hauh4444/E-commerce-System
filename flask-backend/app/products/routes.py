from http import HTTPStatus
from flask import Blueprint, jsonify, request
from pydantic import BaseModel, Field, constr, confloat, conint, ValidationError
from urllib3.exceptions import HTTPWarning

from app.extensions.mongo import serialize_id, serialize_document
from app.auth import auth_required
from app.products import ProductsRepository
from app.utils import error_response

products_bp = Blueprint("products", __name__)

products_repo = ProductsRepository()


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


@products_bp.get("/", strict_slashes=False)
def list_products():
    query_param = request.args.get("query", "").strip()
    ids_param = request.args.get("ids", "").strip()
    try:
        limit = int(request.args.get("limit", 50))
    except ValueError:
        return error_response("invalid_limit", HTTPStatus.BAD_REQUEST)

    ids_list = ids_param.split(",") if ids_param else None
    try:
        products = products_repo.list_products(query=query_param, ids=ids_list, limit=limit)
        return jsonify([serialize_document(p) for p in products]), HTTPStatus.OK
    except Exception as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@products_bp.get("/<product_id>")
def get_product(product_id: str):
    product = products_repo.get_product_by_id(product_id=product_id)
    if not product:
        return error_response("product_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(product)), HTTPStatus.OK


@products_bp.get("/<product_id>/reviews")
def get_product_reviews(product_id: str):
    product_reviews = products_repo.get_product_reviews(product_id=product_id)
    if not product_reviews:
        return error_response("product_reviews_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(product_reviews)), HTTPStatus.OK


@products_bp.post("/")
@auth_required
def create_product(user):
    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")
    try:
        data = ProductCreateSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    try:
        product = products_repo.create_product(user_id=user["id"], product_data=data.model_dump())
        return jsonify(serialize_document(product)), HTTPStatus.CREATED
    except Exception as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@products_bp.put("/<product_id>")
@auth_required
def update_product(user, product_id: str):
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

    product = products_repo.update_product(user_id=user["id"], product_id=product_id, updates=updates)
    if not product:
        return error_response("product_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(product)), HTTPStatus.OK


@products_bp.delete("/<product_id>")
@auth_required
def delete_product(user, product_id: str):
    deleted = products_repo.delete_product(user_id=user["id"], product_id=product_id)
    if not deleted:
        return error_response("product_not_found", HTTPStatus.NOT_FOUND)
    return jsonify({"deleted": True, "product_id": serialize_id(product_id)}), HTTPStatus.OK
