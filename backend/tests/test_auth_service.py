import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from backend.services.auth_service import register_user, login_user, delete_user, update_user
from backend.utils.password import hash_password


async def test_register_user_success(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
    supabase.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "user-1"}
    ]
    result = await register_user("test@example.com", "password123", "testuser", supabase)
    assert result.user_id == "user-1"
    assert result.access_token is not None


async def test_register_user_duplicate_email(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1", "email": "test@example.com"}
    ]
    with pytest.raises(HTTPException) as exc:
        await register_user("test@example.com", "password123", "testuser", supabase)
    assert exc.value.status_code == 400


async def test_login_user_success(supabase):
    hashed = hash_password("password123")
    supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1", "hashed_password": hashed, "username": "testuser"}
    ]
    result = await login_user("test@example.com", "password123", supabase)
    assert result.user_id == "user-1"
    assert result.access_token is not None


async def test_login_user_not_found(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
    with pytest.raises(HTTPException) as exc:
        await login_user("ghost@example.com", "password123", supabase)
    assert exc.value.status_code == 404


async def test_login_user_wrong_password(supabase):
    hashed = hash_password("correct_password")
    supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1", "hashed_password": hashed, "username": "testuser"}
    ]
    with pytest.raises(HTTPException) as exc:
        await login_user("test@example.com", "wrong_password", supabase)
    assert exc.value.status_code == 401


async def test_delete_user_success(supabase):
    supabase.table.return_value.delete.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1"}
    ]
    await delete_user("user-1", supabase)


async def test_delete_user_not_found(supabase):
    supabase.table.return_value.delete.return_value.eq.return_value.execute.return_value.data = []
    with pytest.raises(HTTPException) as exc:
        await delete_user("ghost-id", supabase)
    assert exc.value.status_code == 404


async def test_update_user_no_fields(supabase):
    hashed = hash_password("password123")
    supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1", "hashed_password": hashed}
    ]
    with pytest.raises(HTTPException) as exc:
        await update_user("user-1", "password123", None, None, None, supabase)
    assert exc.value.status_code == 400