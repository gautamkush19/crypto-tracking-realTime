# API Flow

## Request Path

```text
UI component
  -> feature hook
  -> src/services/coinGeckoService.ts
  -> src/services/apiClient.ts
  -> /api/* Express route
  -> CoinGecko
```

Components do not call `fetch` directly. This keeps loading states, cache behavior, and API shape changes contained.

## Client Cache

`apiClient.ts` keeps a small in-memory browser cache and deduplicates in-flight requests. This prevents multiple renders from triggering duplicate network calls.

Typical TTLs:

- Markets: about 55 seconds
- Coin details: about 90 seconds
- Charts: about 45 seconds
- Search: about 120 seconds
- Trending/global: about 5 minutes

## Server Cache

`server/index.js` keeps a matching in-memory cache. If CoinGecko fails and the server has previous data, it returns stale data with an `X-Data-Stale` header instead of breaking the UI.

## Sanitization

The server validates:

- Allowed query parameter names per endpoint
- Coin ID characters
- Search text length and characters
- Numeric bounds for pagination and chart days

The client also sanitizes search terms and coin IDs before building URLs.

## CoinGecko Endpoints Used

- `/coins/markets`
- `/coins/{id}`
- `/coins/{id}/market_chart`
- `/search`
- `/search/trending`
- `/global`

The app uses public/demo endpoints only. Paid CoinGecko-only features are not required for v1.

## Failure Handling

The UI includes:

- Loading skeletons
- Retry states
- Empty states
- Stale server fallback when available
- Error boundary for unexpected UI failures

The server does not leak upstream stack traces or internal errors to the browser.
