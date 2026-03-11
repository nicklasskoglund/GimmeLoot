from fastapi import APIRouter, Request

router = APIRouter(tags=['health'])

@router.get('/health')
async def health(request: Request):
    cache = request.app.state.cache
    return {
        'status': 'ok',
        'cache': {
            'ttl_seconds': cache.ttl,
            'entries': cache.size,
        },
    }