from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.giveaways import router as giveaways_router
from app.api.routes.auth import router as auth_router
from app.api.routes.favorites import router as favorites_router


api_router = APIRouter(prefix='/api/v1')
api_router.include_router(health_router)
api_router.include_router(giveaways_router)
api_router.include_router(auth_router)
api_router.include_router(favorites_router)