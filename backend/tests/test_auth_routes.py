import pytest
from backend.utils.password import hash_password


def test_register_success(client, mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
    mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [{"id": "user-1"}]

    response = client.post("/api/v1/auth/register", json={
        "email": "new@example.com",
        "password": "password123",
        "username": "newuser"
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user_id"] == "user-1"


def test_register_duplicate_email(client, mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1", "email": "existing@example.com"}
    ]
    response = client.post("/api/v1/auth/register", json={
        "email": "existing@example.com",
        "password": "password123",
        "username": "user"
    })
    assert response.status_code == 400


def test_login_success(client, mock_supabase):
    hashed = hash_password("password123")
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1", "hashed_password": hashed, "username": "testuser"}
    ]
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_wrong_password(client, mock_supabase):
    hashed = hash_password("correct")
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1", "hashed_password": hashed, "username": "testuser"}
    ]
    response = client.post("/api/v1/auth/login", json={
        "email": "test@example.com",
        "password": "wrong"
    })
    assert response.status_code == 401


def test_login_user_not_found(client, mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
    response = client.post("/api/v1/auth/login", json={
        "email": "ghost@example.com",
        "password": "password123"
    })
    assert response.status_code == 404


def test_delete_user_success(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.delete.return_value.eq.return_value.execute.return_value.data = [{"id": "user-1"}]
    response = client.delete("/api/v1/auth/user")
    assert response.status_code == 204


def test_delete_user_unauthorized(client, mock_supabase):
    response = client.delete("/api/v1/auth/user")
    assert response.status_code == 401


def test_update_user_success(client, mock_supabase, auth_override):
    hashed = hash_password("oldpass")
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        {"id": "user-1", "hashed_password": hashed}
    ]
    mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [{"id": "user-1"}]

    response = client.patch("/api/v1/auth/user", json={
        "current_password": "oldpass",
        "email": "new@example.com"
    })
    assert response.status_code == 200