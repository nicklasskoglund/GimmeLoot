import pytest


FAKE_FAVORITE = {
    "id": "fav-1",
    "user_id": "user-1",
    "giveaway_id": 42,
    "created_at": "2024-01-01T00:00:00"
}


def test_add_favorite_success(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
    mock_supabase.table.return_value.insert.return_value.execute.return_value.data = [FAKE_FAVORITE]

    response = client.post("/api/v1/favorites/42")
    assert response.status_code == 201
    assert response.json()["giveaway_id"] == 42


def test_add_favorite_duplicate(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [FAKE_FAVORITE]

    response = client.post("/api/v1/favorites/42")
    assert response.status_code == 409


def test_add_favorite_unauthorized(client, mock_supabase):
    response = client.post("/api/v1/favorites/42")
    assert response.status_code == 401


def test_delete_favorite_success(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.return_value.data = [FAKE_FAVORITE]

    response = client.delete("/api/v1/favorites/42")
    assert response.status_code == 204


def test_delete_favorite_not_found(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.return_value.data = []

    response = client.delete("/api/v1/favorites/42")
    assert response.status_code == 404


def test_list_favorites_success(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
        FAKE_FAVORITE,
        {**FAKE_FAVORITE, "id": "fav-2", "giveaway_id": 99}
    ]

    response = client.get("/api/v1/favorites")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_list_favorites_empty(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = []

    response = client.get("/api/v1/favorites")
    assert response.status_code == 200
    assert response.json() == []


def test_get_favorite_success(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [FAKE_FAVORITE]

    response = client.get("/api/v1/favorites/fav-1")
    assert response.status_code == 200
    assert response.json()["id"] == "fav-1"


def test_get_favorite_not_found(client, mock_supabase, auth_override):
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []

    response = client.get("/api/v1/favorites/ghost-id")
    assert response.status_code == 404


def test_list_favorites_unauthorized(client, mock_supabase):
    response = client.get("/api/v1/favorites")
    assert response.status_code == 401