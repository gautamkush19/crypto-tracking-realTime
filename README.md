# Aurelian Crypto Terminal

Aurelian is a premium crypto price tracking web application built with React, Vite, Express, Tailwind CSS, Framer Motion, Recharts, Zustand, Lucide React, and the CoinGecko Demo/Public API.

The app is intentionally sized for Level-1 scale: 0-1K users, low-cost Render deployment, a simple server boundary, and upgrade-friendly code without pretending to be an enterprise platform.

## Features

- Global crypto market overview
- CoinGecko-powered market table with search, sorting, sparklines, and manual refresh
- Coin detail pages with price chart, fundamentals, description sanitization, and official link validation
- Trending assets and top movers
- Local browser watchlist
- Dark and light themes
- Responsive layouts for mobile, tablet, laptop, and ultra-wide screens
- Server-side CoinGecko proxy with input sanitization, response caching, stale fallback, and basic rate limiting

## Tech Stack

- React + TypeScript
- Vite
- Express
- Tailwind CSS + custom CSS tokens
- Framer Motion
- Recharts
- Zustand
- Lucide React
- CoinGecko Demo/Public API

## Quick Start

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:10000
```

## Environment

Copy `.env.example` to `.env` for local configuration.

```bash
PORT=10000
COINGECKO_API_BASE=https://api.coingecko.com/api/v3
COINGECKO_DEMO_API_KEY=
```

`COINGECKO_DEMO_API_KEY` is optional. If you add one, keep it server-side only.

## Scripts

```bash
npm run dev      # Express + Vite middleware
npm run build    # TypeScript check + Vite build
npm start        # Production server
```

## API References

- CoinGecko market data: `GET /coins/markets`
- Coin details: `GET /coins/{id}`
- Coin chart: `GET /coins/{id}/market_chart`
- Search: `GET /search`
- Trending: `GET /search/trending`
- Global market: `GET /global`

See `API_FLOW.md` for the internal request path.
