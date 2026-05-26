import { SUPPORTED_CURRENCIES } from '../constants/market';
import type { CurrencyCode } from '../features/coins/types';

export function formatCurrency(
  value: number | null | undefined,
  currency: CurrencyCode,
  options?: Intl.NumberFormatOptions
) {
  if (!Number.isFinite(value ?? NaN)) {
    return '—';
  }

  const config = SUPPORTED_CURRENCIES.find((item) => item.code === currency);

  return new Intl.NumberFormat(config?.locale || 'en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: Math.abs(Number(value)) < 1 ? 6 : 2,
    ...options
  }).format(Number(value));
}

export function formatCompactCurrency(value: number | null | undefined, currency: CurrencyCode) {
  return formatCurrency(value, currency, {
    notation: 'compact',
    maximumFractionDigits: 2
  });
}

export function formatNumber(value: number | null | undefined, options?: Intl.NumberFormatOptions) {
  if (!Number.isFinite(value ?? NaN)) {
    return '—';
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...options
  }).format(Number(value));
}

export function formatPercentage(value: number | null | undefined) {
  if (!Number.isFinite(value ?? NaN)) {
    return '—';
  }

  const prefix = Number(value) > 0 ? '+' : '';
  return `${prefix}${Number(value).toFixed(2)}%`;
}

export function formatDateTime(value: string | number | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(typeof value === 'number' ? new Date(value) : new Date(value));
}

export function formatShortDate(value: string | number | null | undefined) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(typeof value === 'number' ? new Date(value) : new Date(value));
}
