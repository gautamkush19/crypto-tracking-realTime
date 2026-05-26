import type { CurrencyCode, TimeRange } from '../features/coins/types';

export const PRODUCT_NAME = 'Aurelian';

export const SUPPORTED_CURRENCIES: Array<{
  code: CurrencyCode;
  label: string;
  symbol: string;
  locale: string;
}> = [
  { code: 'usd', label: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'eur', label: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'gbp', label: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'inr', label: 'INR', symbol: '₹', locale: 'en-IN' },
  { code: 'jpy', label: 'JPY', symbol: '¥', locale: 'ja-JP' }
];

export const TIME_RANGES: Array<{ value: TimeRange; label: string }> = [
  { value: '1', label: '1D' },
  { value: '7', label: '7D' },
  { value: '30', label: '30D' },
  { value: '90', label: '90D' },
  { value: '365', label: '1Y' }
];

export const DEFAULT_WATCHLIST = ['bitcoin', 'ethereum', 'solana', 'chainlink'];

export const MARKET_REFRESH_MS = 60_000;
