import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 10000);
const coinGeckoBaseUrl =
  process.env.COINGECKO_API_BASE || 'https://api.coingecko.com/api/v3';
const coinGeckoDemoKey = process.env.COINGECKO_DEMO_API_KEY || '';

const app = express();
const responseCache = new Map();
const requestBuckets = new Map();

const CACHE_POLICIES = {
  markets: 58_000,
  chart: 45_000,
  coin: 90_000,
  global: 300_000,
  trending: 300_000,
  search: 120_000
};

const allowedMarketParams = new Set([
  'vs_currency',
  'ids',
  'category',
  'order',
  'per_page',
  'page',
  'sparkline',
  'price_change_percentage',
  'locale',
  'precision'
]);

const allowedChartParams = new Set(['vs_currency', 'days', 'interval', 'precision']);
const allowedCoinParams = new Set([
  'localization',
  'tickers',
  'market_data',
  'community_data',
  'developer_data',
  'sparkline'
]);

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'"],
            imgSrc: [
              "'self'",
              'https://assets.coingecko.com',
              'https://coin-images.coingecko.com',
              'data:'
            ],
            fontSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"]
          }
        }
      : false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Tiny in-memory limiter for Level-1 scale. It protects the proxy from
// accidental UI loops and basic abuse without introducing external state.
app.use('/api', (req, res, next) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const bucket = requestBuckets.get(ip) || { count: 0, resetAt: now + 60_000 };

  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + 60_000;
  }

  bucket.count += 1;
  requestBuckets.set(ip, bucket);

  if (bucket.count > 70) {
    res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
    return res.status(429).json({
      message: 'Too many market data requests. Please wait a moment and try again.'
    });
  }

  return next();
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'aurelian-crypto-terminal' });
});

app.get('/api/markets', async (req, res) => {
  const params = sanitizeQuery(req.query, allowedMarketParams);

  params.set('vs_currency', params.get('vs_currency') || 'usd');
  params.set('order', params.get('order') || 'market_cap_desc');
  params.set('per_page', clampNumericParam(params.get('per_page'), 1, 250, 100));
  params.set('page', clampNumericParam(params.get('page'), 1, 50, 1));
  params.set('sparkline', params.get('sparkline') || 'true');
  params.set(
    'price_change_percentage',
    params.get('price_change_percentage') || '1h,24h,7d'
  );

  await proxyCoinGecko(req, res, '/coins/markets', params, CACHE_POLICIES.markets);
});

app.get('/api/coins/:id', async (req, res) => {
  const coinId = normalizeCoinId(req.params.id);
  if (!coinId) {
    return res.status(400).json({ message: 'Invalid coin id.' });
  }

  const params = sanitizeQuery(req.query, allowedCoinParams);
  params.set('localization', params.get('localization') || 'false');
  params.set('tickers', params.get('tickers') || 'false');
  params.set('market_data', params.get('market_data') || 'true');
  params.set('community_data', params.get('community_data') || 'false');
  params.set('developer_data', params.get('developer_data') || 'false');
  params.set('sparkline', params.get('sparkline') || 'false');

  await proxyCoinGecko(req, res, `/coins/${coinId}`, params, CACHE_POLICIES.coin);
});

app.get('/api/coins/:id/market_chart', async (req, res) => {
  const coinId = normalizeCoinId(req.params.id);
  if (!coinId) {
    return res.status(400).json({ message: 'Invalid coin id.' });
  }

  const params = sanitizeQuery(req.query, allowedChartParams);
  params.set('vs_currency', params.get('vs_currency') || 'usd');
  params.set('days', clampNumericParam(params.get('days'), 1, 365, 7));
  params.set('precision', params.get('precision') || 'full');

  await proxyCoinGecko(
    req,
    res,
    `/coins/${coinId}/market_chart`,
    params,
    CACHE_POLICIES.chart
  );
});

app.get('/api/search', async (req, res) => {
  const query = sanitizeSearchQuery(String(req.query.query || ''));
  if (!query) {
    return res.json({ coins: [], exchanges: [], icos: [], categories: [], nfts: [] });
  }

  const params = new URLSearchParams({ query });
  await proxyCoinGecko(req, res, '/search', params, CACHE_POLICIES.search);
});

app.get('/api/trending', async (req, res) => {
  await proxyCoinGecko(req, res, '/search/trending', new URLSearchParams(), CACHE_POLICIES.trending);
});

app.get('/api/global', async (req, res) => {
  await proxyCoinGecko(req, res, '/global', new URLSearchParams(), CACHE_POLICIES.global);
});

if (isProduction) {
  const distPath = path.join(projectRoot, 'dist');
  app.use(express.static(distPath, { maxAge: '1y', immutable: true }));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    root: projectRoot,
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Unexpected server error.' });
});

app.listen(port, () => {
  console.log(`Aurelian running on http://localhost:${port}`);
});

async function proxyCoinGecko(req, res, pathname, params, ttlMs) {
  const url = new URL(`${coinGeckoBaseUrl}${pathname}`);
  params.sort();
  url.search = params.toString();

  const cacheKey = `${pathname}?${url.searchParams.toString()}`;
  const cached = responseCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(cached.status).json(cached.data);
  }

  try {
    const upstreamResponse = await fetch(url, {
      method: 'GET',
      headers: buildCoinGeckoHeaders(),
      signal: AbortSignal.timeout(10_000)
    });

    const body = await upstreamResponse.json().catch(() => ({
      message: 'CoinGecko returned a non-JSON response.'
    }));

    if (!upstreamResponse.ok) {
      if (cached) {
        res.setHeader('X-Data-Stale', 'true');
        return res.status(200).json(cached.data);
      }

      return res.status(upstreamResponse.status).json({
        message: normalizeUpstreamError(body),
        status: upstreamResponse.status
      });
    }

    responseCache.set(cacheKey, {
      data: body,
      expiresAt: now + ttlMs,
      status: upstreamResponse.status
    });

    res.setHeader('X-Cache', 'MISS');
    return res.status(upstreamResponse.status).json(body);
  } catch (error) {
    if (cached) {
      res.setHeader('X-Data-Stale', 'true');
      return res.status(200).json(cached.data);
    }

    return res.status(502).json({
      message:
        error?.name === 'TimeoutError'
          ? 'CoinGecko request timed out. Please retry shortly.'
          : 'Unable to reach CoinGecko right now.'
    });
  }
}

function buildCoinGeckoHeaders() {
  const headers = {
    accept: 'application/json',
    'user-agent': 'aurelian-crypto-terminal/1.0'
  };

  if (coinGeckoDemoKey) {
    headers['x-cg-demo-api-key'] = coinGeckoDemoKey;
  }

  return headers;
}

function sanitizeQuery(query, allowedKeys) {
  const params = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(query)) {
    if (!allowedKeys.has(key)) continue;

    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (typeof value !== 'string' || value.length > 220) continue;

    const cleanedValue = value.replace(/[^\w.,:-]/g, '').slice(0, 220);
    if (cleanedValue) {
      params.set(key, cleanedValue);
    }
  }

  return params;
}

function sanitizeSearchQuery(query) {
  return query.replace(/[^\w\s.-]/g, '').trim().slice(0, 80);
}

function normalizeCoinId(id) {
  const normalized = String(id || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 80);

  return normalized.length > 0 ? normalized : null;
}

function clampNumericParam(value, min, max, fallback) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return String(fallback);
  }

  return String(Math.min(Math.max(Math.trunc(numericValue), min), max));
}
