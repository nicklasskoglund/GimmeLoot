# GimmeLoot 🎁

A beginner-friendly FastAPI proxy on top of the free [GamerPower API](https://www.gamerpower.com/api-read).
Built for learning purposes – tested via Postman.

## Requirements

- Python 3.11+
- Dependencies listed in `requirements.txt`

## Getting started
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Base URL
```
http://127.0.0.1:8000/api/v1
```

## Endpoints

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ "status": "ok" }` |

### Giveaways

| Method | Path | Description |
|---|---|---|
| `GET` | `/giveaways` | List giveaways with optional filtering |
| `GET` | `/giveaways/{id}` | Get a single giveaway by ID |
| `GET` | `/giveaways/search/{term}` | Search giveaways by keyword |

### Query params – `GET /giveaways`

| Param | Type | Description |
|---|---|---|
| `platform` | string | Filter by platform, ex: `steam`, `pc`, `epic-games-store` |
| `type` | string | Filter by type, ex: `game`, `loot`, `beta` |
| `sort_by` | string | Sort results, ex: `date`, `value`, `popularity` |
| `contains` | string | Case-insensitive search in title/description |
| `only_active` | bool | If `true`, returns only active giveaways |
| `min_worth` | float | Minimum worth in USD, ex: `9.99` |
| `limit` | int | Max number of results (1–100) |

### Query params – `GET /giveaways/search/{term}`

| Param | Type | Description |
|---|---|---|
| `platform` | string | Pre-filter upstream by platform |
| `only_active` | bool | If `true`, returns only active giveaways |
| `limit` | int | Max number of results (1–100) |

## Example requests
```
GET /api/v1/health
GET /api/v1/giveaways
GET /api/v1/giveaways?platform=steam&type=loot&sort_by=popularity&limit=5
GET /api/v1/giveaways?contains=fortnite&only_active=true
GET /api/v1/giveaways?min_worth=15&only_active=true
GET /api/v1/giveaways/525
GET /api/v1/giveaways/search/steam?only_active=true&limit=3
```

## Project structure
```
app/
  main.py
  api/
    router.py
    routes/
      health.py
      giveaways.py
  services/
    gamerpower_client.py
  schemas/
    giveaway.py
  middlewares/
    request_id.py
  utils/
    logging.py
```

## Middleware

All responses include an `X-Request-ID` header for request tracing.
If the header is present in the incoming request it is propagated, otherwise a UUID is generated.