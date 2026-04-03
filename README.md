<div align="center">
  <img src="./assets/gimmeloot-logo.png" width="110" alt="GimmeLoot logo" />
  <br/>
  <img src="./assets/gimmeloot-title.svg" width="260" alt="GimmeLoot" />
  <br/><br/>

  ![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python)
  ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
  ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
  ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
  ![CI](https://github.com/nicklasskoglund/GimmeLoot/actions/workflows/ci.yml/badge.svg?branch=main)
  ![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?style=flat-square&logo=pre-commit)
  ![gitleaks](https://img.shields.io/badge/protected%20by-gitleaks-blue?style=flat-square)
  ![CodeQL](https://github.com/nicklasskoglund/GimmeLoot/actions/workflows/codeql.yml/badge.svg?branch=main)
</div>

> A fullstack app for discovering free game giveaways — powered by the [GamerPower API](https://www.gamerpower.com/api-read).

🚀 **Try it live:** _coming soon_

<!-- Add screenshot here once deployed -->
<!-- ![GimmeLoot Screenshot](./assets/screenshot.png) -->

---

## Features

- 🎮 Browse and search free game giveaways across all platforms
- 🔍 Filter by platform, type, worth and activity status
- ❤️ Save favourite giveaways to your personal list
- 🔐 JWT-based authentication — register, login and manage your account
- ⚡ Server-side caching and rate limiting
- 🩺 Health endpoint exposing API, cache, rate limiter and database status

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, httpx, pyjwt, bcrypt |
| Frontend | React, TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Config | pydantic-settings |
| Testing | pytest, Vitest, React Testing Library, Cypress |
| Security | Gitleaks, detect-secrets, Dependabot, GitHub Secret Scanning, CodeQL |

---

## Getting started

Running locally requires Python 3.11+, Node.js 18+ and your own Supabase project. Configure your environment variables in a `.env` file in the project root before starting.

### Backend
```bash
pip install -r requirements.txt
python backend/app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Endpoints

All endpoints are prefixed with `/api/v1`.

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `PATCH /auth/user`
- `DELETE /auth/user`

### Favorites
- `POST /favorites/{giveaway_id}`
- `GET /favorites`
- `GET /favorites/{favorite_id}`
- `DELETE /favorites/{giveaway_id}`

### Giveaways
- `GET /giveaways`
- `GET /giveaways/{giveaway_id}`
- `GET /giveaways/search/{term}`
- `POST /giveaways/query`

### Health
- `GET /health`

<details>
<summary>Query parameters & request bodies</summary>

### Query params — `GET /api/v1/giveaways`

| Param | Type | Description |
|---|---|---|
| `platform` | string | Filter by platform, e.g. `steam`, `pc`, `epic-games-store` |
| `type` | string | Filter by type, e.g. `game`, `loot`, `beta` |
| `sort_by` | string | Sort results, e.g. `date`, `value`, `popularity` |
| `contains` | string | Case-insensitive search in title/description |
| `only_active` | bool | If `true`, returns only active giveaways |
| `min_worth` | float | Minimum worth in USD |
| `limit` | int | Max number of results (1–100) |

### Query params — `GET /api/v1/giveaways/search/{term}`

| Param | Type | Description |
|---|---|---|
| `platform` | string | Pre-filter upstream by platform |
| `only_active` | bool | If `true`, returns only active giveaways |
| `limit` | int | Max number of results (1–100) |

### Request body — `POST /api/v1/giveaways/query`

| Field | Type | Description |
|---|---|---|
| `platform` | string | Filter by platform |
| `type` | string | Filter by type |
| `sort_by` | string | Sort results |
| `contains` | string | Case-insensitive match in title/description |
| `only_active` | bool | If `true`, returns only active giveaways |
| `min_worth` | float | Minimum worth in USD |
| `search` | string | Broader keyword search in title/description |
| `limit` | int | Max number of results (1–100) |

### Example requests
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

</details>

---

## Project structure
```
backend/
├── app.py                  # Entry point
├── main.py
├── core/
│   └── config.py
├── middlewares/
│   └── request_id.py
├── models/
│   ├── user.py
│   └── favorite.py
├── schemas/
│   ├── auth.py
│   ├── favorites.py
│   └── giveaway.py
├── routes/
│   ├── router.py
│   ├── auth.py
│   ├── favorites.py
│   ├── giveaways.py
│   └── health.py
├── services/
│   ├── auth_service.py
│   ├── cache.py
│   ├── favorites_service.py
│   ├── gamerpower_client.py
│   ├── rate_limiter.py
│   └── supabase_client.py
├── tests/
│   ├── conftest.py
│   ├── test_auth_routes.py
│   ├── test_auth_service.py
│   ├── test_auth_utils.py
│   ├── test_favorites_routes.py
│   └── test_favorites_service.py
└── utils/
    ├── auth.py
    ├── errors.py
    ├── logging.py
    └── password.py

frontend/
├── cypress/
│   └── e2e/
│       ├── login.cy.ts
│       └── protected_route.cy.ts
├── public/
├── src/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── favorites.ts
│   │   └── giveaways.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── GiveawayCard.tsx
│   │   ├── GiveawayList.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── SearchBar.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── AccountPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── GiveawayDetailPage.tsx
│   │   ├── GiveawaysPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── RegisterPage.tsx
│   ├── types/
│   │   └── giveaway.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── vite.config.ts
```

---

## Testing

### Backend
```bash
pytest --tb=short -q
```

### Frontend
```bash
cd frontend
npm run test        # Vitest unit tests
npm run test:e2e    # Cypress E2E tests
```

---

## Security

GimmeLoot uses three layers of secret scanning:

- **GitHub Secret Scanning** — enabled in repository settings; automatically detects leaked tokens from known providers (AWS, Stripe, etc.)
- **Gitleaks in GitHub Actions** — runs on every push and pull request via `.github/workflows/secret-scan.yml`, catching a broader range of patterns than the built-in scanner
- **Local pre-commit hooks** — `gitleaks` and `detect-secrets` configured in `.pre-commit-config.yaml`; secrets are blocked before they ever leave the developer's machine
- **CodeQL** — static analysis workflow scanning Python and TypeScript for security vulnerabilities; runs on every push and pull request, and on a weekly schedule

Dependencies are monitored by **Dependabot**, with alerts enabled for both the Python and npm ecosystems.

---

## Roadmap

- [ ] Leaderboard — most saved giveaways across all users
- [ ] Pagination — browse large result sets page by page
- [ ] Platform filtering in the UI — filter by Steam, Epic, GOG and more directly in the frontend
- [ ] Deployment guide — full Railway + Supabase setup walkthrough

---

## Deployment

_Coming in v1.0.0._

Designed to be deployed with **Railway** (backend + frontend) and **Supabase** (database).

---

## Author

**Nicklas Skoglund**
[GitHub](https://github.com/nicklasskoglund) · [LinkedIn](https://www.linkedin.com/in/nicklas-skoglund)