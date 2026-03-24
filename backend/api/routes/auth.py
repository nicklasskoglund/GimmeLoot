from fastapi import APIRouter, Depends, Request, status

from backend.schemas.auth import UserRegister, TokenResponse, UserUpdateRequest
from backend.services.auth_service import register_user, login_user, delete_user, update_user
from backend.utils.auth import get_current_user

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def user_register(body: UserRegister, request: Request) -> TokenResponse:
    return await register_user(body.email, body.password, request.app.state.supabase)


@router.post("/login", response_model=TokenResponse)
async def user_login(body: UserRegister, request: Request) -> TokenResponse:
    return await login_user(body.email, body.password, request.app.state.supabase)


@router.delete("/user", status_code=status.HTTP_204_NO_CONTENT)
async def delete_account(request: Request, current_user: dict = Depends(get_current_user)):
    await delete_user(current_user['user_id'], request.app.state.supabase)
    
    
@router.put("/user")
async def update_account(body: UserUpdateRequest, request: Request, current_user: dict = Depends(get_current_user)):
    return await update_user(current_user["user_id"], body.email, body.password, request.app.state.supabase)