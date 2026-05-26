export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = {
  ttlMs?: number;
  force?: boolean;
  signal?: AbortSignal;
};

const responseCache = new Map<string, { expiresAt: number; value: unknown }>();
const inFlightRequests = new Map<string, Promise<unknown>>();

// This client centralizes API caching and error normalization. It prevents
// repeated component renders from becoming repeated CoinGecko proxy calls.
export async function fetchJson<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  options: RequestOptions = {}
): Promise<T> {
  const url = buildUrl(path, params);
  const cacheKey = url.toString();
  const ttlMs = options.ttlMs ?? 45_000;
  const cached = responseCache.get(cacheKey);

  if (!options.force && cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const existingRequest = inFlightRequests.get(cacheKey);
  if (!options.force && existingRequest) {
    return existingRequest as Promise<T>;
  }

  const request = executeRequest<T>(url, ttlMs, options.signal);
  inFlightRequests.set(cacheKey, request);

  try {
    return await request;
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}

async function executeRequest<T>(url: URL, ttlMs: number, signal?: AbortSignal) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { accept: 'application/json' },
    signal
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      body?.message || 'Market data request failed. Please retry shortly.',
      response.status
    );
  }

  responseCache.set(url.toString(), {
    expiresAt: Date.now() + ttlMs,
    value: body
  });

  return body as T;
}

function buildUrl(path: string, params: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, window.location.origin);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    url.searchParams.set(key, String(value));
  }

  url.searchParams.sort();
  return url;
}
