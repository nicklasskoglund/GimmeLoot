from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class Giveaway(BaseModel):
    model_config = ConfigDict(extra='ignore')   # tål att API:t skickar fler fält
    
    id: int
    title: str
    worth: Optional[str] = None
    thumbnail: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    open_giveaway_url: Optional[str] = Field(default=None, alias="open_giveaway_url")
    published_date: Optional[str] = None
    type: Optional[str] = None
    platforms: Optional[str] = None
    end_date: Optional[str] = None
    users: Optional[int] = None
    status: Optional[str] = None
    gamerpower_url: Optional[str] = None
    