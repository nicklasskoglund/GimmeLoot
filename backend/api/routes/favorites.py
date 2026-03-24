from __future__ import annotations

from fastapi import APIRouter, Depends, Request, status

from backend.schemas.favorites import FavoriteResponse
from backend.services.favorites_service import add_favorite, remove_favorite, get_favorites, get_favorite
from backend.utils.auth import get_current_user

router = APIRouter(
    prefix='/favorites',
    tags=['favorites']
)


@router.post('/{giveaway_id}', response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
async def create_favorite(giveaway_id: int, request: Request, current_user: dict = Depends(get_current_user)):
    return add_favorite(current_user['user_id'], giveaway_id, request.app.state.supabase)


@router.delete('/{giveaway_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_favorite(giveaway_id: int, request: Request, current_user: dict = Depends(get_current_user)):
    remove_favorite(current_user['user_id'], giveaway_id, request.app.state.supabase)
    
    
@router.get('', response_model=list[FavoriteResponse])
async def list_favorites(request: Request, current_user: dict = Depends(get_current_user)):
    return get_favorites(current_user['user_id'], request.app.state.supabase)


@router.get('/{favorite_id}', response_model=FavoriteResponse)
async def read_favorite(favorite_id: str, request: Request, current_user: dict = Depends(get_current_user)):
    return get_favorite(current_user['user_id'], favorite_id, request.app.state.supabase)