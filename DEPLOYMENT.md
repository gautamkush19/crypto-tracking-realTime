# Deployment

## Render Web Service

The repository includes `render.yaml`.

Render settings:

```text
Runtime: Node
Build command: npm install && npm run build
Start command: npm start
```

Environment variables:

```text
NODE_ENV=production
COINGECKO_API_BASE=https://api.coingecko.com/api/v3
COINGECKO_DEMO_API_KEY=
```

`COINGECKO_DEMO_API_KEY` is optional. Add it only in Render's environment variable UI. Do not commit real keys.

## Local Production Check

```bash
npm install
npm run build
npm start
```

Open:

```text
http://localhost:10000
```

## Security Notes

- The browser calls only the local `/api/*` proxy.
- CoinGecko API keys, if configured, stay in server environment variables.
- Helmet sets security headers in production.
- User input is sanitized before upstream API requests.
- Browser storage contains only theme, currency, and watchlist IDs.

## Performance Notes

- Vite code splitting separates chart, motion, and router chunks.
- Pages are lazy-loaded.
- Market rows and sparklines are memoized where useful.
- Client and server cache reduce repeated CoinGecko requests.
- The refresh cadence respects public market-data cache timing.

## When to Scale

Stay with the current setup until there is real traffic pressure. Add complexity only when metrics show a need.

Likely sequence:

1. Add CDN caching for static assets.
2. Add Redis for shared API cache if running more than one server instance.
3. Add stronger distributed rate limiting if abuse appears.
4. Add a database only when accounts, synced watchlists, alerts, or portfolios are required.
