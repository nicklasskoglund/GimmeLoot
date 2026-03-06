from __future__ import annotations

from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI

from app.api.router import api_router
from app.middlewares.request_id import RequestIdMiddleware
from app.utils.logging import setup_logging

GAMERPOWER_BASE_URL = 'https://gamerpower.com/api'


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    
    # A shared AsyncClient (faster + cleaner than creating a new one per request)
    app.state.http = httpx.AsyncClient(
        base_url=GAMERPOWER_BASE_URL,
        follow_redirects=True,
        timeout=httpx.Timeout(10.0),
        headers={'User-Agent': 'Nicklas-FastAPI-Proxy/1.0'},
    )
    yield
    await app.state.http.aclose()
    
app = FastAPI(title='GamerPower Proxy API', version='0.1.0', lifespan=lifespan)
app.add_middleware(RequestIdMiddleware)

app.include_router(api_router)

@app.get('/')
async def root():
    return {'status': 'ok'}
