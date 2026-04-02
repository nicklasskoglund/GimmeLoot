from pydantic import BaseModel
from datetime import datetime


class User(BaseModel):
    """
    Represents the public.users table in Supabase.
    """
    id: str
    email: str
    username: str
    password: str
    created_at: datetime