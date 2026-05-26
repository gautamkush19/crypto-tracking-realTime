import { useCallback, useEffect, useMemo, useState } from 'react';
import { MARKET_REFRESH_MS } from '../../constants/market';
import {
  getCoinDetail,
  getGlobalMarket,
  getMarketChart,
  getMarkets,
  getTrendingCoins
} from '../../services/coinGeckoService';
import type {
  ChartPoint,
  CoinDetail,
  CoinMarket,
  CurrencyCode,
  GlobalMarketResponse,
  TimeRange,
  TrendingResponse
} from './types';

type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
};

export function useMarkets(currency: CurrencyCode, ids?: string[]) {
  const [state, setState] = useState<AsyncState<CoinMarket[]>>({
    data: null,
    isLoading: true,
    isRefreshing: false,
    error: null
  });

  const stableIds = useMemo(() => ids?.join(','), [ids]);
  const hasEmptyIdFilter = Array.isArray(ids) && ids.length === 0;

  const loadMarkets = useCallback(
    async (force = false) => {
      if (hasEmptyIdFilter) {
        setState({ data: [], isLoading: false, isRefreshing: false, error: null });
        return;
      }

      setState((current) => ({
        ...current,
        isLoading: !current.data,
        isRefreshing: Boolean(current.data),
        error: null
      }));

      try {
        const data = await getMarkets({
          currency,
          perPage: ids?.length ? Math.min(Math.max(ids.length, 1), 250) : 100,
          ids,
          force
        });

        setState({ data, isLoading: false, isRefreshing: false, error: null });
      } catch (error) {
        setState((current) => ({
          ...current,
          isLoading: false,
          isRefreshing: false,
          error: error instanceof Error ? error.message : 'Unable to load market data.'
        }));
      }
    },
    [currency, ids, stableIds, hasEmptyIdFilter]
  );

  useEffect(() => {
    void loadMarkets();
  }, [loadMarkets]);

  useEffect(() => {
    if (hasEmptyIdFilter) return;
    const interval = window.setInterval(() => void loadMarkets(true), MARKET_REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [hasEmptyIdFilter, loadMarkets]);

  return { ...state, refetch: () => loadMarkets(true) };
}

export function useGlobalMarket() {
  const [state, setState] = useState<AsyncState<GlobalMarketResponse>>({
    data: null,
    isLoading: true,
    isRefreshing: false,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    getGlobalMarket()
      .then((data) => {
        if (isMounted) setState({ data, isLoading: false, isRefreshing: false, error: null });
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            isRefreshing: false,
            error: error instanceof Error ? error.message : 'Unable to load market overview.'
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

export function useTrendingCoins() {
  const [state, setState] = useState<AsyncState<TrendingResponse>>({
    data: null,
    isLoading: true,
    isRefreshing: false,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    getTrendingCoins()
      .then((data) => {
        if (isMounted) setState({ data, isLoading: false, isRefreshing: false, error: null });
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            isRefreshing: false,
            error: error instanceof Error ? error.message : 'Unable to load trending coins.'
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

export function useCoinDetail(coinId: string | undefined, currency: CurrencyCode) {
  const [state, setState] = useState<AsyncState<CoinDetail>>({
    data: null,
    isLoading: true,
    isRefreshing: false,
    error: null
  });

  useEffect(() => {
    if (!coinId) return;
    let isMounted = true;

    setState((current) => ({ ...current, isLoading: !current.data, error: null }));

    getCoinDetail(coinId, currency)
      .then((data) => {
        if (isMounted) setState({ data, isLoading: false, isRefreshing: false, error: null });
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            isRefreshing: false,
            error: error instanceof Error ? error.message : 'Unable to load coin detail.'
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [coinId, currency]);

  return state;
}

export function useMarketChart(
  coinId: string | undefined,
  currency: CurrencyCode,
  range: TimeRange
) {
  const [state, setState] = useState<AsyncState<ChartPoint[]>>({
    data: null,
    isLoading: true,
    isRefreshing: false,
    error: null
  });

  useEffect(() => {
    if (!coinId) return;
    let isMounted = true;

    setState((current) => ({
      ...current,
      isLoading: !current.data,
      isRefreshing: Boolean(current.data),
      error: null
    }));

    getMarketChart(coinId, currency, range)
      .then((data) => {
        const points = data.prices.map(([timestamp, price], index) => ({
          timestamp,
          price,
          marketCap: data.market_caps[index]?.[1],
          volume: data.total_volumes[index]?.[1]
        }));

        if (isMounted) setState({ data: points, isLoading: false, isRefreshing: false, error: null });
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            isRefreshing: false,
            error: error instanceof Error ? error.message : 'Unable to load chart data.'
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [coinId, currency, range]);

  return state;
}
