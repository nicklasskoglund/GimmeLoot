from __future__ import annotations

import logging
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Query, Request

from backend.schemas.giveaway import Giveaway, QueryRequest
from backend.services.gamerpower_client import GamerPowerClient
from backend.utils.errors import error_response

logger = logging.getLogger('api.giveaways')
router = APIRouter(prefix='/giveaways', tags=['giveaways'])


def get_http(request: Request) -> httpx.AsyncClient:
    return request.app.state.http


def get_gamerpower_client(
    http: httpx.AsyncClient = Depends(get_http),
    request: Request = None,
) -> GamerPowerClient:
    return GamerPowerClient(http, request.app.state.cache, request.app.state.rate_limiter)


@router.get("", response_model=list[Giveaway])
async def list_giveaways(
    request: Request,
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
    except RuntimeError as e:
        if 'Rate limit' in str(e):
            return error_response(429, "rate_limit_exceeded", str(e), request)
        return error_response(502, "upstream_error", str(e), request)
    except Exception as e:
        logger.exception('Failed to fetch giveaways')
        return error_response(502, "upstream_error", str(e), request)

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
    request: Request,
    term: str,
    platform: Optional[str] = Query(default=None, description="ex: steam, pc, epic-games-store"),
    only_active: bool = Query(default=False, description="Visa bara aktiva giveaways"),
    limit: Optional[int] = Query(default=None, ge=1, le=100),
    gp: GamerPowerClient = Depends(get_gamerpower_client),
):
    try:
        raw = await gp.get_giveaways(platform=platform)
    except RuntimeError as e:
        if 'Rate limit' in str(e):
            return error_response(429, "rate_limit_exceeded", str(e), request)
        return error_response(502, "upstream_error", str(e), request)
    except Exception as e:
        logger.exception('Failed to fetch giveaways for search')
        return error_response(502, "upstream_search_error", str(e), request)

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
    request: Request,
    giveaway_id: int,
    gp: GamerPowerClient = Depends(get_gamerpower_client),
):
    try:
        raw = await gp.get_giveaway_by_id(giveaway_id)
        return raw
    except httpx.HTTPStatusError as e:
        return error_response(e.response.status_code, "upstream_http_error", f"Upstream returned {e.response.status_code} for giveaway {giveaway_id}", request)
    except RuntimeError as e:
        if 'Rate limit' in str(e):
            return error_response(429, "rate_limit_exceeded", str(e), request)
        return error_response(502, "upstream_error", str(e), request)
    except Exception as e:
        return error_response(502, "upstream_giveaway_error", str(e), request)


@router.post('/query', response_model=list[Giveaway])
async def query_giveaways(
    request: Request,
    body: QueryRequest,
    gp: GamerPowerClient = Depends(get_gamerpower_client),
):
    try:
        raw = await gp.get_giveaways(
            platform=body.platform,
            giveaway_type=body.type,
            sort_by=body.sort_by,
        )
    except RuntimeError as e:
        if 'Rate limit' in str(e):
            return error_response(429, "rate_limit_exceeded", str(e), request)
        return error_response(502, "upstream_error", str(e), request)
    except Exception as e:
        logger.exception('Failed to fetch giveaways for query')
        return error_response(502, "upstream_query_error", str(e), request)

    items = [Giveaway(**g) for g in raw]
    logger.info('Upstream returned %d items', len(items))

    if body.search:
        needle = body.search.lower()
        items = [
            g for g in items
            if needle in (g.title or '').lower()
            or needle in (g.description or '').lower()
        ]

    if body.contains:
        term = body.contains.lower()
        items = [
            g for g in items
            if term in (g.title or '').lower()
            or term in (g.description or '').lower()
        ]

    if body.only_active:
        items = [g for g in items if g.status == 'Active']

    if body.min_worth is not None:
        items = [g for g in items if (g.worth_as_float() or 0) >= body.min_worth]

    logger.info('Query result: %d items', len(items))

    if body.limit:
        items = items[:body.limit]

    return items