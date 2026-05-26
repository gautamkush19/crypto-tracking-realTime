# Architecture

## System Shape

Aurelian uses a small full-stack architecture:

```text
Browser -> React/Vite app -> /api Express proxy -> CoinGecko API
```

This keeps the app simple enough for Render's free or low-cost web service while still protecting future API keys from client bundles.

## Frontend

The frontend is feature-oriented:

- `src/app`: app shell and app-level effects
- `src/components`: shared layout and reusable UI primitives
- `src/features`: product features such as market tables, charts, dashboard panels, and hooks
- `src/services`: API client and CoinGecko service wrappers
- `src/store`: client state that belongs across routes
- `src/utils`: formatting and sanitization helpers

React Router splits dashboard, watchlist, detail, and fallback pages. Page modules are lazy-loaded to keep the initial bundle smaller.

## Backend Boundary

The Express server does four jobs:

- Serve Vite in development and static `dist` files in production
- Proxy approved CoinGecko endpoints
- Sanitize all query and path inputs before upstream requests
- Cache successful responses in memory and return stale data during upstream failures

The proxy is intentionally not a fake enterprise API. For Level-1 scale, an in-memory cache and limiter are enough. Later, this boundary can move to Redis, a CDN, or a dedicated API service without rewriting the React data layer.

## State Strategy

Zustand stores:

- Theme
- Selected currency
- Watchlist coin IDs

Only non-sensitive preferences are persisted to browser storage. No secrets, private balances, auth tokens, or portfolio values are stored.

## Scaling Direction

Current implementation:

- One Render web service
- In-memory cache
- Static asset serving from Express
- CoinGecko rate-limit-aware refresh cadence

Future upgrade points:

- CDN in front of static assets
- Redis for shared cache if multiple server instances are added
- Load balancer if traffic requires horizontal scaling
- Auth and database only if user accounts become a product requirement
- Dedicated backend rate limiter if abuse exceeds simple in-memory protection

## Tradeoffs

- Express proxy adds one runtime but improves security and future API-key handling.
- Local watchlist is simpler and privacy-friendly, but it does not sync across devices.
- Recharts is heavier than hand-drawn SVG, but it gives accessible, maintainable chart behavior without writing chart logic from scratch.
