from __future__ import annotations
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    allowed_origins: list[str] = ["http://localhost:5173"]
    supabase_url: str
    supabase_key: str


settings = Settings()