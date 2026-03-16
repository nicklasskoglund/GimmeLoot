# GimmeLoot 🎁

A FastAPI proxy built on top of the free [GamerPower API](https://www.gamerpower.com/api-read).
Exposes a clean REST API for querying game giveaways – with filtering, caching, rate limiting and a React frontend.

Built for learning purposes and tested via Postman.

## Tech stack

- **Backend:** Python, FastAPI, httpx, Supabase
- **Frontend:** React, TypeScript, Vite
- **Config:** pydantic-settings, python-dotenv

## Requirements

- Python 3.11+
- Node.js 18+
- A Supabase project

## Getting started

1. Create a `.env` file in the project root:
```env
ALLOWED_ORIGINS_STR=<YOUR-FRONTEND-URL>
GAMERPOWER_BASE_URL=<GAMERPOWER-API-URL>
SUPABASE_URL=<YOUR-SUPABASE-URL>
SUPABASE_KEY=<YOUR-SUPABASE-ANON-KEY>
```

2. Install dependencies and start the backend:
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

3. Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

## Base URL
```
http://<YOUR-HOST>/api/v1
```

## Endpoints

### Health

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Returns status for API, cache, rate limiter and database |

### Giveaways

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/giveaways` | List giveaways with optional filtering |
| `GET` | `/api/v1/giveaways/{id}` | Get a single giveaway by ID |
| `GET` | `/api/v1/giveaways/search/{term}` | Search giveaways by keyword |
| `POST` | `/api/v1/giveaways/query` | Filter giveaways via JSON body |

### Query params – `GET /api/v1/giveaways`

| Param | Type | Description |
|---|---|---|
| `platform` | string | Filter by platform, ex: `steam`, `pc`, `epic-games-store` |
| `type` | string | Filter by type, ex: `game`, `loot`, `beta` |
| `sort_by` | string | Sort results, ex: `date`, `value`, `popularity` |
| `contains` | string | Case-insensitive search in title/description |
| `only_active` | bool | If `true`, returns only active giveaways |
| `min_worth` | float | Minimum worth in USD, ex: `9.99` |
| `limit` | int | Max number of results (1–100) |

### Query params – `GET /api/v1/giveaways/search/{term}`

| Param | Type | Description |
|---|---|---|
| `platform` | string | Pre-filter upstream by platform |
| `only_active` | bool | If `true`, returns only active giveaways |
| `limit` | int | Max number of results (1–100) |

### Request body – `POST /api/v1/giveaways/query`

| Field | Type | Description |
|---|---|---|
| `platform` | string | Filter by platform, ex: `steam`, `pc` |
| `type` | string | Filter by type, ex: `game`, `loot` |
| `sort_by` | string | Sort results, ex: `date`, `value`, `popularity` |
| `contains` | string | Case-insensitive match in title/description |
| `only_active` | bool | If `true`, returns only active giveaways |
| `min_worth` | float | Minimum worth in USD |
| `search` | string | Broader keyword search in title/description |
| `limit` | int | Max number of results (1–100) |

## Example requests
```
GET  /api/v1/health
GET  /api/v1/giveaways
GET  /api/v1/giveaways?platform=steam&type=loot&sort_by=popularity&limit=5
GET  /api/v1/giveaways?contains=fortnite&only_active=true
GET  /api/v1/giveaways?min_worth=15&only_active=true
GET  /api/v1/giveaways/525
GET  /api/v1/giveaways/search/steam?only_active=true&limit=3
POST /api/v1/giveaways/query
{"platform": "steam", "only_active": true, "min_worth": 10, "limit": 5}
```

## Project structure
```
app/
  main.py
  core/
    config.py
  api/
    router.py
    routes/
      health.py
      giveaways.py
  services/
    gamerpower_client.py
    supabase_client.py
    cache.py
    rate_limiter.py
  schemas/
    giveaway.py
  middlewares/
    request_id.py
  utils/
    logging.py
    errors.py
frontend/
  src/
    App.tsx
    main.tsx
    index.css
  index.html
  vite.config.ts
  tsconfig.json
  package.json
```

## Middleware

All responses include an `X-Request-ID` header for request tracing.
If the header is present in the incoming request it is propagated, otherwise a UUID is generated.