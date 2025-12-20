from datetime import date, datetime
from typing import Optional, Union

from bson import ObjectId
from bson.errors import InvalidId


def parse_object_id(oid: str) -> Optional[ObjectId]:
    """
    Convert a string to a MongoDB ObjectId.

    This function attempts to create a `bson.ObjectId` from the given string.
    If the string is not a valid ObjectId, the function returns `None`.

    Args:
        oid (str): The string representation of the ObjectId to parse.

    Returns:
        Optional[ObjectId]: The corresponding ObjectId if valid, otherwise None.
    """
    try:
        return ObjectId(oid)
    except InvalidId:
        return None


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


def serialize_document(document: dict[str, any]) -> dict[str, any]:
    """
    Serialize a MongoDB document for JSON responses.

    Converts ObjectId and datetime/date objects to strings,
    and renames '_id' to 'id'.

    Args:
        document (dict[str, any]): The MongoDB document to serialize.

    Returns:
        dict[str, any]: Serialized document.
    """
    serialized = _serialize_recursive(document)
    if "_id" in serialized:
        serialized["id"] = serialize_id(serialized.pop("_id"))
    return serialized


def _serialize_recursive(value: any) -> any:
    """
    Recursively serialize values in a document.

    Args:
        value (any): The value to serialize.

    Returns:
        any: Serialized value.
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
