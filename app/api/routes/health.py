from fastapi import APIRouter, Request

router = APIRouter(tags=['health'])

@router.get('/health')
async def health(request: Request):
    cache = request.app.state.cache
    rl = request.app.state.rate_limiter
    return {
        'status': 'ok',
        'cache': {
            'ttl_seconds': cache.ttl,
            'entries': cache.size,
        },
        'rate_limiter': {
            'max_calls': rl.max_calls,
            'period_seconds': rl.period,
            'calls_in_window': len(rl._calls),
        },
    }