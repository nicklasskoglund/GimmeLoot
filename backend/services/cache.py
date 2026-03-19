from __future__ import annotations

import time
import logging
from typing import Any, Optional

logger = logging.getLogger('gamerpower.cache')


class TTLCache:
    def __init__(self, ttl: int = 60):
        self._ttl = ttl
        self._store: dict[str, tuple[Any, float]] = {}
        
    def _make_key(self, **kwargs: Any) -> str:
        parts = sorted(f'{k}={v}' for k, v in kwargs.items() if v is not None)
        return '|'.join(parts) or '__all__'
    
    def get(self, **kwargs: Any) -> Optional[Any]:
        key = self._make_key(**kwargs)
        entry = self._store.get(key)
        if entry is None:
            logger.debug('Cache MISS key=%s', key)
            return None
        value, expires_at = entry
        if time.monotonic() > expires_at:
            logger.debug("Cache EXPIRED key=%s", key)
            del self._store[key]
            return None
        logger.debug('Cache HIT key=%s', key)
        return value
    
    def set(self, value: Any, **kwargs: Any) -> None:
        key = self._make_key(**kwargs)
        self._store[key] = (value, time.monotonic() + self._ttl)
        logger.debug('Cache SET key=%s ttl=%s', key, self._ttl)
        
    @property
    def size(self) -> int:
        return len(self._store)
    
    @property
    def ttl(self) -> int:
        return self._ttl
    