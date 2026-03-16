# Standard library
from __future__ import annotations
from contextlib import asynccontextmanager

# Third-party
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Local
from app.api.router import api_router
from app.middlewares.request_id import RequestIdMiddleware
from app.utils.logging import setup_logging
from app.services.cache import TTLCache
from app.services.rate_limiter import RateLimiter
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    
    # A shared AsyncClient (faster + cleaner than creating a new one per request)
    app.state.http = httpx.AsyncClient(
        base_url=settings.gamerpower_base_url,
        follow_redirects=True,
        timeout=httpx.Timeout(10.0),
        headers={'User-Agent': 'Nicklas-FastAPI-Proxy/1.0'},
    )
    app.state.cache = TTLCache(ttl=60)
    app.state.rate_limiter = RateLimiter(max_calls=5, period=1.0)
    yield
    await app.state.http.aclose()
    
app = FastAPI(title='GamerPower Proxy API', version='0.6.0', lifespan=lifespan)
app.add_middleware(RequestIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get('/')
async def root():
    return {'status': 'ok'}
