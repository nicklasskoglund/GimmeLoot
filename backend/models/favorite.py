from pydantic import BaseModel
from datetime import datetime


class Favorite(BaseModel):
    """
    Represents the public.favorites table in Supabase.
    """
    id: str
    user_id: str
    giveaway_id: int
    created_at: datetime