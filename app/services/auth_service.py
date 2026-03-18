from fastapi import HTTPException, status

from app.utils.password import hash_password, verify_password
from app.utils.auth import create_access_token
from app.schemas.auth import TokenResponse


async def register_user(email: str, password: str, supabase) -> TokenResponse:
    existing_user = supabase.table("users").select("*").eq("email", email).execute()
    if existing_user.data:
        print(f"Email already in use")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'A user with email {email} already exists'
        )
    
    hashed = hash_password(password)
    result = supabase.table('users').insert({
        'email': email,
        'hashed_password': hashed
    }).execute()
    
    user_id = result.data[0]["id"]
    token = create_access_token({"user_id": user_id})
    return TokenResponse(message="User registered successfully!", user_id=user_id, access_token=token)


async def login_user(email: str, password: str, supabase) -> TokenResponse:
    result = supabase.table("users").select("*").eq("email", email).execute()
    user = result.data[0] if result.data else None

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password"
        )

    token = create_access_token({"user_id": user["id"]})
    return TokenResponse(message="Login successful!", user_id=user["id"], access_token=token)
