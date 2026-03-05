from __future__ import annotations

import logging
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request

from app.schemas.giveaway import Giveaway
from app.services.gamerpower_client import GamerPowerClient

logger = logging.getLogger('api.giveaways')

router = APIRouter(prefix='/giveaways', tags=['giveaways'])

def get_http(request: Request) -> httpx.AsyncClient:
    return request.app.state.http

def get_gamerpower_client(http: httpx.AsyncClient = Depends(get_http)) -> GamerPowerClient:
    return GamerPowerClient(http)


@router.get("", response_model=list[Giveaway])
async def list_giveaways(
    platform: Optional[str] = Query(default=None, description="ex: steam, pc, epic-games-store"),
    giveaway_type: Optional[str] = Query(default=None, alias="type", description="ex: game, loot, beta"),
    sort_by: Optional[str] = Query(default=None, description="ex: date, value, popularity"),
    limit: Optional[int] = Query(default=None, ge=1, le=100),
    gp: GamerPowerClient = Depends(get_gamerpower_client),
):
    try:
        raw = await gp.get_giveaways(platform=platform, giveaway_type=giveaway_type, sort_by=sort_by)
    except Exception as e:
        logger.exception('Failed to fetch giveaways')
        raise HTTPException(status_code=502, detail=str(e))
    
    if limit:
        raw = raw[:limit]
        
    # “print to CLI” → this is visible in the server log
    logger.info('Returning %d giveaways', len(raw))
    return raw

@router.get('/{giveaway_id}', response_model=Giveaway)
async def giveaway_details(
    giveaway_id: int,
    gp: GamerPowerClient = Depends(get_gamerpower_client),
):
    try:
        raw = await gp.get_giveaway_by_id(giveaway_id)
        return raw
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
    