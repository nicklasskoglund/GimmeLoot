from __future__ import annotations

import logging
from typing import Any, Optional

import httpx


logger = logging.getLogger('gamerpower.client')


class GamerPowerClient:
    def __init__(self, http: httpx.AsyncClient):
        self.http = http
        
    async def get_giveaways(
        self,
        platform: Optional[str] = None,
        giveaway_type: Optional[str] = None,
        sort_by: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        params: dict[str, str] = {}
        if platform:
            params['platform'] = platform
        if giveaway_type:
            params['type'] = giveaway_type
        if sort_by:
            params['sort-by'] = sort_by     # GamerPower uses 'sort-by'
            
        logger.info('GET /giveaways params=%s', params)
        
        try:
            r = await self.http.get('/giveaways', params=params)
        except httpx.RequestError as e:
            logger.exception('Upstream request failed')
            raise RuntimeError(f'Upstream request error: {e}') from e
        
        # GamerPower documents, among others, 200 (OK) and 201 (no active giveaways) :contentReference[oaicite:1]{index=1}
        if r.status_code == 201:
            return []
        
        r.raise_for_status()
        data = r.json()
        if isinstance(data, list):
            logger.info('Upstream returned %d giveaways', len(data))
            return data
        
        # fallback (if the API were to change format)
        return[data]
    
    async def get_giveaway_by_id(self, giveaway_id: int) -> dict[str, Any]:
        logger.info('GET /giveaway?id=%s', giveaway_id)
        r = await self.http.get('/giveaway', params={'id': str(giveaway_id)})
        r.raise_for_status()
        return r.json()
    