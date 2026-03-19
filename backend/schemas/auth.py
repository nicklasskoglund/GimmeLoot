from pydantic import BaseModel


class UserRegister(BaseModel):
    email: str
    password: str
    

class TokenResponse(BaseModel):
    message: str
    user_id: str    # Supabase using UUID as primarykey
    access_token: str