# Standard library
from __future__ import annotations
from contextlib import asynccontextmanager

# Third-party
import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

# Local
from backend.api.router import api_router
from backend.middlewares.request_id import RequestIdMiddleware
from backend.utils.logging import setup_logging
from backend.services.cache import TTLCache
from backend.services.rate_limiter import RateLimiter
from backend.services.supabase_client import create_supabase_client
from backend.core.config import settings
from backend.utils.errors import error_response, AppError


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    app.state.supabase = create_supabase_client()
    
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
    
app = FastAPI(title='GamerPower Proxy API', version='0.10.0', lifespan=lifespan)

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return error_response(exc.status_code, "error", exc.detail, request)

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
