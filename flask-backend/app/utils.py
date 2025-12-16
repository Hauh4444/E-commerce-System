from http import HTTPStatus
from flask import jsonify
from typing import Any


def error_response(error: str, status: HTTPStatus = HTTPStatus.BAD_REQUEST, details: Any = None):
    """
    Return a standardized JSON error response.

    Args:
        error (str): Error code or message.
        status (HTTPStatus, optional): HTTP status code. Defaults to 400 Bad Request.
        details (Any, optional): Additional details to include in the response.

    Returns:
        Tuple[Response, int]: Flask JSON response and HTTP status code.
    """
    body = {"error": error}
    if details:
        body["details"] = details
    return jsonify(body), status