from fastapi import APIRouter

from backend.routes.health import router as health_router
from backend.routes.giveaways import router as giveaways_router
from backend.routes.auth import router as auth_router
from backend.routes.favorites import router as favorites_router


api_router = APIRouter(prefix='/api/v1')
api_router.include_router(health_router)
api_router.include_router(giveaways_router)
api_router.include_router(auth_router)
api_router.include_router(favorites_router)