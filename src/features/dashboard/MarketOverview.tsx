import { Activity, Coins, DollarSign, Landmark } from 'lucide-react';
import { MetricTile } from '../../components/common/MetricTile';
import { Skeleton } from '../../components/common/Skeleton';
import { StatusPill } from '../../components/common/StatusPill';
import type { CurrencyCode, GlobalMarketResponse } from '../coins/types';
import { formatCompactCurrency, formatNumber } from '../../utils/format';

type MarketOverviewProps = {
  globalMarket: GlobalMarketResponse | null;
  isLoading: boolean;
  currency: CurrencyCode;
};

export function MarketOverview({ globalMarket, isLoading, currency }: MarketOverviewProps) {
  if (isLoading) {
    return (
      <section className="metric-grid" aria-label="Loading market overview">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </section>
    );
  }

  const data = globalMarket?.data;
  const btcDominance = data?.market_cap_percentage?.btc;

  return (
    <section className="metric-grid" aria-label="Global crypto market overview">
      <MetricTile
        label="Total market cap"
        value={formatCompactCurrency(data?.total_market_cap?.[currency], currency)}
        detail={<StatusPill value={data?.market_cap_change_percentage_24h_usd} compact />}
        icon={<DollarSign size={17} aria-hidden="true" />}
      />
      <MetricTile
        label="24h volume"
        value={formatCompactCurrency(data?.total_volume?.[currency], currency)}
        detail="Across tracked exchanges"
        icon={<Activity size={17} aria-hidden="true" />}
      />
      <MetricTile
        label="BTC dominance"
        value={`${formatNumber(btcDominance)}%`}
        detail="Market cap share"
        icon={<Landmark size={17} aria-hidden="true" />}
      />
      <MetricTile
        label="Active assets"
        value={formatNumber(data?.active_cryptocurrencies, { maximumFractionDigits: 0 })}
        detail={`${formatNumber(data?.markets, { maximumFractionDigits: 0 })} markets`}
        icon={<Coins size={17} aria-hidden="true" />}
      />
    </section>
  );
}
