from datetime import date, datetime
from typing import Any, Optional, Union

from bson import ObjectId


def serialize_id(value: Union[ObjectId, str, None]) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, ObjectId):
        return str(value)
    return value


def serialize_document(document: dict) -> dict:
    serialized = _serialize_value(document)
    if "_id" in serialized:
        serialized["id"] = serialize_id(serialized.pop("_id"))
    return serialized


def _serialize_value(value: Any) -> Any:
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, list):
        return [_serialize_value(item) for item in value]
    if isinstance(value, dict):
        return {key: _serialize_value(item) for key, item in value.items()}
    return value


