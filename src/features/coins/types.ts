export type CurrencyCode = 'usd' | 'eur' | 'gbp' | 'inr' | 'jpy';

export type TimeRange = '1' | '7' | '30' | '90' | '365';

export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_24h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;
  sparkline_in_7d?: {
    price: number[];
  };
  last_updated: string | null;
};

export type CoinSearchResult = {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
  large?: string;
};

export type SearchResponse = {
  coins: CoinSearchResult[];
};

export type TrendingCoin = {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number | null;
    thumb: string;
    small: string;
    large: string;
    data?: {
      price?: number;
      price_change_percentage_24h?: {
        usd?: number;
      };
      market_cap?: string;
      total_volume?: string;
    };
  };
};

export type TrendingResponse = {
  coins: TrendingCoin[];
};

export type GlobalMarketResponse = {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
    updated_at: number;
  };
};

export type CoinDetail = {
  id: string;
  symbol: string;
  name: string;
  image?: {
    thumb?: string;
    small?: string;
    large?: string;
  };
  description?: {
    en?: string;
  };
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    official_forum_url?: string[];
  };
  market_cap_rank: number | null;
  market_data?: {
    current_price?: Record<string, number>;
    market_cap?: Record<string, number>;
    total_volume?: Record<string, number>;
    fully_diluted_valuation?: Record<string, number>;
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
    high_24h?: Record<string, number>;
    low_24h?: Record<string, number>;
    price_change_percentage_24h?: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    ath?: Record<string, number>;
    ath_change_percentage?: Record<string, number>;
    ath_date?: Record<string, string>;
  };
  last_updated?: string;
};

export type MarketChartResponse = {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
};

export type ChartPoint = {
  timestamp: number;
  price: number;
  marketCap?: number;
  volume?: number;
};
