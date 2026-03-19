from fastapi import APIRouter, Request, status

from backend.schemas.auth import UserRegister, TokenResponse
from backend.services.auth_service import register_user, login_user

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