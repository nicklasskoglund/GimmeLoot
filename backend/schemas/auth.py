from pydantic import BaseModel
from typing import Optional


class UserRegister(BaseModel):
    email: str
    password: str
    username: str
    

class TokenResponse(BaseModel):
    message: str
    user_id: str    # Supabase using UUID as primarykey
    access_token: str
    username: str


class UserUpdateRequest(BaseModel):
    current_password: str
    email: Optional[str] = None
    password: Optional[str] = None
    username: Optional[str] = None
    
    
class UserLogin(BaseModel):
    email: str
    password: str