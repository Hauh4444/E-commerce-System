from http import HTTPStatus
from flask import Blueprint, jsonify, request
from pydantic import BaseModel, ValidationError, Field
from typing import Optional

from app.extensions.mongo import serialize_document
from app.auth import auth_required
from app.settings import SettingsRepository
from app.utils import error_response

settings_bp = Blueprint("settings", __name__)

settings_repo = SettingsRepository()


class SettingsUpdateSchema(BaseModel):
    loginAlerts: bool = Field(default=True)
    trustedDevices: bool = Field(default=True)
    analyticsTracking: bool = Field(default=False)
    personalizedRecommendations: bool = Field(default=False)
    darkMode: Optional[bool] = None
    compactProductLayout: bool = Field(default=False)


@settings_bp.get("/", strict_slashes = False)
@auth_required
def get_settings(user):
    settings = settings_repo.get_settings_for_user(user_id=user["id"])
    if not settings:
        return error_response("list_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(settings)), HTTPStatus.OK


@settings_bp.put("/", strict_slashes = False)
@auth_required
def update_settings(user):
    payload = request.get_json()
    if payload is None:
        return error_response("invalid_json")
    try:
        data = SettingsUpdateSchema(**payload)
    except ValidationError as e:
        return error_response("invalid_payload", details=e.errors())

    updates = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
    if not updates:
        return error_response("no_updates_provided")

    updated_settings = settings_repo.update_settings_for_user(user_id=user["id"], updates=updates)
    if not updated_settings:
        return error_response("settings_not_found", HTTPStatus.NOT_FOUND)
    return jsonify(serialize_document(updated_settings)), HTTPStatus.OK