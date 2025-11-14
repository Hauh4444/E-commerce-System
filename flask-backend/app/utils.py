from datetime import date, datetime
from typing import Any, Dict, List, Optional, Union

from bson import ObjectId


def serialize_id(value: Union[ObjectId, str, None]) -> Optional[str]:
    """
    Serialize a MongoDB ObjectId or string to a string.

    Args:
        value (Union[ObjectId, str, None]): The value to serialize.

    Returns:
        Optional[str]: Serialized string representation of the ID, or None.
    """
    if value is None:
        return None
    if isinstance(value, ObjectId):
        return str(value)
    return value


def serialize_document(document: Dict[str, Any]) -> Dict[str, Any]:
    """
    Serialize a MongoDB document for JSON responses.

    Converts ObjectId and datetime/date objects to strings,
    and renames '_id' to 'id'.

    Args:
        document (Dict[str, Any]): The MongoDB document to serialize.

    Returns:
        Dict[str, Any]: Serialized document.
    """
    serialized = _serialize_recursive(document)
    if "_id" in serialized:
        serialized["id"] = serialize_id(serialized.pop("_id"))
    return serialized


def _serialize_recursive(value: Any) -> Any:
    """
    Recursively serialize values in a document.

    Args:
        value (Any): The value to serialize.

    Returns:
        Any: Serialized value.
    """
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, list):
        return [_serialize_recursive(item) for item in value]
    if isinstance(value, dict):
        return {key: _serialize_recursive(item) for key, item in value.items()}
    return value
