import pytest
from backend.utils.auth import create_access_token, decode_access_token


def test_create_and_decode_token():
    payload = {"user_id": "abc-123"}
    token = create_access_token(payload)
    decoded = decode_access_token(token)
    assert decoded["user_id"] == "abc-123"


def test_decode_invalid_token_returns_none():
    result = decode_access_token("not.a.valid.token")
    assert result is None


def test_expired_token_returns_none():
    from datetime import timedelta
    token = create_access_token({"user_id": "abc-123"}, expires_delta=timedelta(seconds=-1))
    result = decode_access_token(token)
    assert result is None