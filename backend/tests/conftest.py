import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient

from backend.main import app
from backend.utils.auth import get_current_user


@pytest.fixture
def supabase():
    return MagicMock()


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def mock_supabase(client):
    mock = MagicMock()
    app.state.supabase = mock
    return mock


@pytest.fixture
def auth_override():
    def _override():
        return {"user_id": "user-1"}
    app.dependency_overrides[get_current_user] = _override
    yield
    app.dependency_overrides.clear()