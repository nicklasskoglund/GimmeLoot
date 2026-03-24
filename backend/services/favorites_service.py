from __future__ import annotations

import logging
from supabase import Client
from backend.utils.errors import AppError

logger = logging.getLogger('gamerpower.favorites')


def add_favorite(user_id: str, giveaway_id: int, supabase: Client) -> dict:
    existing = (
        supabase.table('favorites')
        .select('id')
        .eq('user_id', user_id)
        .eq('giveaway_id', giveaway_id)
        .execute()
    )
    if existing.data:
        raise AppError(status_code=409, detail='Giveaway already in favorites')
    
    result = (
        supabase.table('favorites')
        .insert({'user_id': user_id, 'giveaway_id': giveaway_id})
        .execute()
    )
    return result.data[0]


def remove_favorite(user_id: str, giveaway_id: int, supabase: Client) -> None:
    result = (
        supabase.table('favorites')
        .delete()
        .eq('user_id', user_id)
        .eq('giveaway_id', giveaway_id)
        .execute()
    )
    if not result.data:
        raise AppError(status_code=404, detail='Favorite not found')
    
    
def get_favorites(user_id: str, supabase: Client) -> list[dict]:
    result = (
        supabase.table('favorites')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', desc=True)
        .execute()
    )
    return result.data


def get_favorite(user_id: str, favorite_id: str, supabase: Client) -> dict:
    result = (
        supabase.table('favorites')
        .select('*')
        .eq('id', favorite_id)
        .eq('user_id', user_id)
        .execute()
    )
    if not result.data:
        raise AppError(status_code=404, detail='Favorite not found')
    return result.data[0]