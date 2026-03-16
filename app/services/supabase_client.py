from __future__ import annotations

import logging
from supabase import create_client, Client
from app.core.config import settings

logger = logging.getLogger('gamerpower.supabase')


def create_supabase_client() -> Client:
    client = create_client(settings.supabase_url, settings.supabase_key)
    logger.info('Supabase client created')
    return client
