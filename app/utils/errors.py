from __future__ import annotations

from fastapi import Request
from fastapi.responses import JSONResponse


def error_response(
    status_code: int,
    error: str,
    message: str,
    request: Request | None = None,
) -> JSONResponse:
    body: dict = {'error': error, 'message': message}
    if request is not None:
        rid = getattr(request.state, 'request_id', None)
        if rid:
            body['request_id'] = rid
    return JSONResponse(status_code=status_code, content=body)
