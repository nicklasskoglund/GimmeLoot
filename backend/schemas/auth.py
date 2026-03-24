from pydantic import BaseModel
from typing import Optional


class UserRegister(BaseModel):
    email: str
    password: str
    

class TokenResponse(BaseModel):
    message: str
    user_id: str    # Supabase using UUID as primarykey
    access_token: str


class UserUpdateRequest(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None