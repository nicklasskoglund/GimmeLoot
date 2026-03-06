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
    contains: Optional[str] = Query(default=None, description="Free text search in title/description"),
    only_active: bool = Query(default=False, description="Show only active giveaways"),
    min_worth: Optional[float] = Query(default=None, description="Minimum value in dollars, ex: 9.99"),
    gp: GamerPowerClient = Depends(get_gamerpower_client),
):
    try:
        raw = await gp.get_giveaways(platform=platform, giveaway_type=giveaway_type, sort_by=sort_by)
    except Exception as e:
        logger.exception('Failed to fetch giveaways')
        raise HTTPException(status_code=502, detail=str(e))

    items = [Giveaway(**g) for g in raw]
    logger.info('Upstream returned %d items', len(items))

    if contains:
        term = contains.lower()
        items = [g for g in items if term in (g.title or '').lower()
                 or term in (g.description or '').lower()]

    if only_active:
        items = [g for g in items if g.status == 'Active']

    if min_worth is not None:
        items = [g for g in items if (g.worth_as_float() or 0) >= min_worth]

    logger.info(
        'After local filtering: %d items (contains=%s, only_active=%s, min_worth=%s)',
        len(items), contains, only_active, min_worth,
    )

    if limit:
        items = items[:limit]

    return items


@router.get('/search/{term}', response_model=list[Giveaway])
async def search_giveaways(
    term: str,
    platform: Optional[str] = Query(default=None, description="ex: steam, pc, epic-games-store"),
    only_active: bool = Query(default=False, description="Visa bara aktiva giveaways"),
    limit: Optional[int] = Query(default=None, ge=1, le=100),
    gp: GamerPowerClient = Depends(get_gamerpower_client),
):
    try:
        raw = await gp.get_giveaways(platform=platform)
    except Exception as e:
        logger.exception('Failed to fetch giveaways for search')
        raise HTTPException(status_code=502, detail=str(e))

    items = [Giveaway(**g) for g in raw]
    needle = term.lower()

    items = [
        g for g in items
        if needle in (g.title or '').lower()
        or needle in (g.description or '').lower()
    ]

    if only_active:
        items = [g for g in items if g.status == 'Active']

    logger.info('Search "%s" → %d matches', term, len(items))

    if limit:
        items = items[:limit]

    return items


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
