from pydantic import BaseModel
from datetime import datetime


class FavoriteResponse(BaseModel):
    id: str
    user_id: str
    giveaway_id: int
    created_at: datetime