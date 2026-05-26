import { fetchJson } from './apiClient';
import type {
  CoinDetail,
  CoinMarket,
  CurrencyCode,
  GlobalMarketResponse,
  MarketChartResponse,
  SearchResponse,
  TimeRange,
  TrendingResponse
} from '../features/coins/types';
import { sanitizeCoinId, sanitizeSearchTerm } from '../utils/sanitize';

export function getMarkets(options: {
  currency: CurrencyCode;
  page?: number;
  perPage?: number;
  ids?: string[];
  force?: boolean;
}) {
  return fetchJson<CoinMarket[]>(
    '/api/markets',
    {
      vs_currency: options.currency,
      page: options.page ?? 1,
      per_page: options.perPage ?? 100,
      ids: options.ids?.map(sanitizeCoinId).filter(Boolean).join(','),
      sparkline: true,
      price_change_percentage: '1h,24h,7d'
    },
    { ttlMs: 55_000, force: options.force }
  );
}

export function getCoinDetail(id: string, currency: CurrencyCode) {
  return fetchJson<CoinDetail>(
    `/api/coins/${sanitizeCoinId(id)}`,
    {
      market_data: true,
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
      sparkline: false
    },
    { ttlMs: 90_000 + currency.length }
  );
}

export function getMarketChart(id: string, currency: CurrencyCode, days: TimeRange) {
  return fetchJson<MarketChartResponse>(
    `/api/coins/${sanitizeCoinId(id)}/market_chart`,
    {
      vs_currency: currency,
      days,
      interval: Number(days) > 1 ? 'hourly' : undefined,
      precision: 'full'
    },
    { ttlMs: 45_000 }
  );
}

export function searchCoins(query: string) {
  const cleanQuery = sanitizeSearchTerm(query);

  return fetchJson<SearchResponse>(
    '/api/search',
    {
      query: cleanQuery
    },
    { ttlMs: 120_000 }
  );
}

export function getTrendingCoins() {
  return fetchJson<TrendingResponse>('/api/trending', {}, { ttlMs: 300_000 });
}

export function getGlobalMarket() {
  return fetchJson<GlobalMarketResponse>('/api/global', {}, { ttlMs: 300_000 });
}
