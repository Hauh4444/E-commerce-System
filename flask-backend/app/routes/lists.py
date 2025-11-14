from http import HTTPStatus
from datetime import datetime
from flask import Blueprint, jsonify, request
from pydantic import BaseModel, constr, ValidationError, Field
from pymongo.errors import PyMongoError
from typing import List as TList

from ..extensions import get_db
from ..services.auth_decorators import auth_required
from ..utils import error_response, parse_object_id, serialize_document, serialize_id

lists_bp = Blueprint("lists", __name__)


class ListCreateSchema(BaseModel):
    name: constr(min_length=1)
    product_ids: TList[str] = Field(default=[])


class ListUpdateSchema(BaseModel):
    name: constr(min_length=1) | None
    product_ids: TList[str] | None = None


@lists_bp.get("/", strict_slashes=False)
@auth_required
def list_lists(user):
    db = get_db()
    try:
        lists_cursor = db.lists.find({"user_id": user["id"]}).sort("created_at", -1)
        lists = [serialize_document(l) for l in lists_cursor]
        return jsonify(lists), HTTPStatus.OK
    except PyMongoError as e:
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

    db = get_db()
    list_data = data.model_dump()
    list_data.update({
        "user_id": user["id"],
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
    })

    try:
        result = db.lists.insert_one(list_data)
        new_list = db.lists.find_one({"_id": result.inserted_id})
        return jsonify(serialize_document(new_list)), HTTPStatus.CREATED
    except PyMongoError as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@lists_bp.get("/<list_id>")
@auth_required
def get_list(user, list_id: str):
    db = get_db()
    lookup_id = parse_object_id(list_id)
    if not lookup_id:
        return error_response("invalid_list_id")

    lst = db.lists.find_one({"_id": lookup_id, "user_id": user["id"]})
    if not lst:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(lst)), HTTPStatus.OK


@lists_bp.put("/<list_id>")
@auth_required
def update_list(user, list_id: str):
    db = get_db()
    lookup_id = parse_object_id(list_id)
    if not lookup_id:
        return error_response("invalid_list_id")

    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")

    try:
        data = ListUpdateSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        return error_response("no_updates_provided")

    updates["updated_at"] = datetime.now()

    try:
        result = db.lists.update_one({"_id": lookup_id, "user_id": user["id"]}, {"$set": updates})
        if result.matched_count == 0:
            return error_response("list_not_found", HTTPStatus.NOT_FOUND)
        updated_list = db.lists.find_one({"_id": lookup_id})
        return jsonify(serialize_document(updated_list)), HTTPStatus.OK
    except PyMongoError as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@lists_bp.post("/<list_id>/product/<product_id>")
@auth_required
def add_product_to_list(user, list_id: str, product_id: str):
    db = get_db()
    lookup_id = parse_object_id(list_id)
    if not lookup_id:
        return error_response("invalid_list_id")

    try:
        product_obj_id = parse_object_id(product_id)
        if not product_obj_id:
            return error_response("invalid_product_id")

        result = db.lists.update_one(
            {"_id": lookup_id, "user_id": user["id"]},
            {
                "$addToSet": {"product_ids": product_obj_id},
                "$set": {"updated_at": datetime.now()}
            }
        )

        if result.matched_count == 0:
            return error_response("list_not_found", HTTPStatus.NOT_FOUND)

        updated_list = db.lists.find_one({"_id": lookup_id})
        return jsonify(serialize_document(updated_list)), HTTPStatus.OK

    except PyMongoError as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@lists_bp.delete("/<list_id>/product/<product_id>")
@auth_required
def remove_product_from_list(user, list_id: str, product_id: str):
    db = get_db()
    lookup_id = parse_object_id(list_id)
    if not lookup_id:
        return error_response("invalid_list_id")

    try:
        # Convert product_id string to ObjectId
        product_obj_id = parse_object_id(product_id)
        if not product_obj_id:
            return error_response("invalid_product_id")

        result = db.lists.update_one(
            {"_id": lookup_id, "user_id": user["id"]},
            {"$pull": {"product_ids": product_obj_id}, "$set": {"updated_at": datetime.now()}}
        )

        if result.matched_count == 0:
            return error_response("list_not_found", HTTPStatus.NOT_FOUND)
        if result.modified_count == 0:
            return error_response("product_not_in_list", HTTPStatus.BAD_REQUEST)

        updated_list = db.lists.find_one({"_id": lookup_id})
        return jsonify(serialize_document(updated_list)), HTTPStatus.OK

    except PyMongoError as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)


@lists_bp.delete("/<list_id>")
@auth_required
def delete_list(user, list_id: str):
    db = get_db()
    lookup_id = parse_object_id(list_id)
    if not lookup_id:
        return error_response("invalid_list_id")

    try:
        result = db.lists.delete_one({"_id": lookup_id, "user_id": user["id"]})
        if result.deleted_count == 0:
            return error_response("list_not_found", HTTPStatus.NOT_FOUND)
        return jsonify({"deleted": True, "list_id": serialize_id(lookup_id)}), HTTPStatus.OK
    except PyMongoError as e:
        return error_response(f"Database error: {str(e)}", HTTPStatus.INTERNAL_SERVER_ERROR)
