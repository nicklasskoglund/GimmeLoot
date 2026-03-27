import pytest
from unittest.mock import MagicMock
from backend.services.favorites_service import add_favorite, remove_favorite, get_favorites, get_favorite
from backend.utils.errors import AppError


def test_add_favorite_success(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
    supabase.table.return_value.insert.return_value.execute.return_value.data = [
        {"id": "fav-1", "user_id": "user-1", "giveaway_id": 42, "created_at": "2024-01-01T00:00:00"}
    ]
    result = add_favorite("user-1", 42, supabase)
    assert result["giveaway_id"] == 42


def test_add_favorite_duplicate(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
        {"id": "fav-1"}
    ]
    with pytest.raises(AppError) as exc:
        add_favorite("user-1", 42, supabase)
    assert exc.value.status_code == 409


def test_remove_favorite_success(supabase):
    supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
        {"id": "fav-1"}
    ]
    remove_favorite("user-1", 42, supabase)


def test_remove_favorite_not_found(supabase):
    supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
    with pytest.raises(AppError) as exc:
        remove_favorite("user-1", 42, supabase)
    assert exc.value.status_code == 404


def test_get_favorites_returns_list(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = [
        {"id": "fav-1", "user_id": "user-1", "giveaway_id": 42, "created_at": "2024-01-01T00:00:00"},
        {"id": "fav-2", "user_id": "user-1", "giveaway_id": 99, "created_at": "2024-01-02T00:00:00"},
    ]
    result = get_favorites("user-1", supabase)
    assert len(result) == 2
    assert result[0]["giveaway_id"] == 42


def test_get_favorites_empty(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = []
    result = get_favorites("user-1", supabase)
    assert result == []


def test_get_favorite_success(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
        {"id": "fav-1", "user_id": "user-1", "giveaway_id": 42, "created_at": "2024-01-01T00:00:00"}
    ]
    result = get_favorite("user-1", "fav-1", supabase)
    assert result["id"] == "fav-1"


def test_get_favorite_not_found(supabase):
    supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
    with pytest.raises(AppError) as exc:
        get_favorite("user-1", "ghost-id", supabase)
    assert exc.value.status_code == 404