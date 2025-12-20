from http import HTTPStatus
from flask import Blueprint, jsonify, request
from pydantic import BaseModel, constr, ValidationError, Field

from app.extensions.mongo import serialize_id, serialize_document
from app.auth import auth_required
from app.lists import ListsRepository
from app.utils import error_response

lists_bp = Blueprint("lists", __name__)

lists_repo = ListsRepository()


class ListCreateSchema(BaseModel):
    name: constr(min_length=1)
    product_ids: list[str] = Field(default=[])


class ListUpdateSchema(BaseModel):
    name: constr(min_length=1) | None
    product_ids: list[str] | None = None


@lists_bp.get("/", strict_slashes=False)
@auth_required
def list_lists(user):
    try:
        lists_cursor = lists_repo.get_lists_for_user(user_id=user["id"])
        return jsonify([serialize_document(l) for l in lists_cursor]), HTTPStatus.OK
    except Exception as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@lists_bp.post("/")
@auth_required
def create_list(user):
    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")

    try:
        data = ListCreateSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    if data.name == "Wishlist":
        return error_response("cannot_create_wishlist", HTTPStatus.FORBIDDEN)

    try:
        new_list = lists_repo.create_list(user_id=user["id"], name=data.name, product_ids=data.product_ids)
        return jsonify(serialize_document(new_list)), HTTPStatus.CREATED
    except Exception as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@lists_bp.get("/<list_id>")
@auth_required
def get_list(user, list_id: str):
    lst = lists_repo.get_list_by_id(user_id=user["id"], list_id=list_id)
    if not lst:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(lst)), HTTPStatus.OK


@lists_bp.put("/<list_id>")
@auth_required
def update_list(user, list_id: str):
    lst = lists_repo.get_list_by_id(user_id=user["id"], list_id=list_id)
    if not lst:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    if lst["name"] == "Wishlist":
        return error_response("cannot_modify_wishlist", HTTPStatus.FORBIDDEN)

    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")
    try:
        data = ListUpdateSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    if data.name == "Wishlist":
        return error_response("cannot_update_list", HTTPStatus.FORBIDDEN)

    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        return error_response("no_updates_provided")

    updated_list = lists_repo.update_list(user_id=user["id"], list_id=list_id, updates=updates)
    if not updated_list:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(updated_list)), HTTPStatus.OK


@lists_bp.post("/<list_id>/product/<product_id>")
@auth_required
def add_product_to_list(user, list_id: str, product_id: str):
    updated_list = lists_repo.add_product(user_id=user["id"], list_id=list_id, product_id=product_id)
    if not updated_list:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(updated_list)), HTTPStatus.OK


@lists_bp.delete("/<list_id>/product/<product_id>")
@auth_required
def remove_product_from_list(user, list_id: str, product_id: str):
    updated_list, removed = lists_repo.remove_product(user_id=user["id"], list_id=list_id, product_id=product_id)
    if not updated_list:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    if not removed:
        return error_response("product_not_in_list", HTTPStatus.BAD_REQUEST)
    return jsonify(serialize_document(updated_list)), HTTPStatus.OK


@lists_bp.delete("/<list_id>")
@auth_required
def delete_list(user, list_id: str):
    lst = lists_repo.get_list_by_id(user_id=user["id"], list_id=list_id)
    if not lst:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    if lst["name"] == "Wishlist":
        return error_response("cannot_delete_wishlist", HTTPStatus.FORBIDDEN)

    deleted = lists_repo.delete_list(user_id=user["id"], list_id=list_id)
    if not deleted:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    return jsonify({"deleted": True, "list_id": serialize_id(list_id)}), HTTPStatus.OK
