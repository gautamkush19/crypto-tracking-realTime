import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Star } from 'lucide-react';
import { Button } from '../components/common/Button';
import { MetricTile } from '../components/common/MetricTile';
import { PageTransition } from '../components/common/PageTransition';
import { RetryState } from '../components/common/RetryState';
import { Skeleton } from '../components/common/Skeleton';
import { StatusPill } from '../components/common/StatusPill';
import { TIME_RANGES } from '../constants/market';
import { PriceChart } from '../features/coins/PriceChart';
import { useCoinDetail, useMarketChart } from '../features/coins/useMarkets';
import type { TimeRange } from '../features/coins/types';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMarketStore } from '../store/useMarketStore';
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatShortDate
} from '../utils/format';
import { safeExternalUrl, stripHtml } from '../utils/sanitize';

export default function CoinDetailPage() {
  const { id } = useParams();
  const [range, setRange] = useState<TimeRange>('7');
  const currency = useMarketStore((state) => state.currency);
  const isWatched = useMarketStore((state) => (id ? state.isWatched(id) : false));
  const toggleWatchlist = useMarketStore((state) => state.toggleWatchlist);
  const coin = useCoinDetail(id, currency);
  const chart = useMarketChart(id, currency, range);
  const detail = coin.data;
  const marketData = detail?.market_data;
  const homepage = safeExternalUrl(detail?.links?.homepage?.find(Boolean));
  const description = useMemo(() => stripHtml(detail?.description?.en).slice(0, 520), [detail]);

  useDocumentTitle(detail?.name || 'Asset');

  if (coin.error) {
    return (
      <PageTransition>
        <RetryState message={coin.error} />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="detail-toolbar">
        <Link className="button button-ghost button-md" to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to markets</span>
        </Link>
      </div>

      <section className="coin-hero">
        <div className="coin-title-block">
          {coin.isLoading ? (
            <>
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-14 w-72 rounded-lg" />
            </>
          ) : (
            <>
              <img src={detail?.image?.large || detail?.image?.small} alt="" loading="lazy" />
              <div>
                <span className="eyebrow">Rank #{detail?.market_cap_rank || '—'}</span>
                <h1>{detail?.name}</h1>
                <p>{detail?.symbol?.toUpperCase()}</p>
              </div>
            </>
          )}
        </div>

        <div className="coin-actions">
          {homepage ? (
            <a className="external-link" href={homepage} target="_blank" rel="noreferrer">
              Website
              <ExternalLink size={15} aria-hidden="true" />
            </a>
          ) : null}
          {id ? (
            <Button
              variant={isWatched ? 'primary' : 'secondary'}
              icon={<Star size={16} fill={isWatched ? 'currentColor' : 'none'} aria-hidden="true" />}
              onClick={() => toggleWatchlist(id)}
            >
              {isWatched ? 'Saved' : 'Watch'}
            </Button>
          ) : null}
        </div>
      </section>

      <section className="detail-grid">
        <article className="chart-panel">
          <div className="chart-panel-header">
            <div>
              <span className="eyebrow">Price history</span>
              <h2>{formatCurrency(marketData?.current_price?.[currency], currency)}</h2>
            </div>
            <div className="segmented-control" aria-label="Chart range">
              {TIME_RANGES.map((item) => (
                <button
                  key={item.value}
                  className={range === item.value ? 'active' : ''}
                  onClick={() => setRange(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {chart.error ? (
            <RetryState message={chart.error} />
          ) : (
            <PriceChart data={chart.data} currency={currency} isLoading={chart.isLoading} />
          )}
        </article>

        <aside className="coin-summary">
          <MetricTile
            label="24h change"
            value={<StatusPill value={marketData?.price_change_percentage_24h} />}
            detail={`7d ${formatPercentage(marketData?.price_change_percentage_7d)}`}
          />
          <MetricTile
            label="Market cap"
            value={formatCompactCurrency(marketData?.market_cap?.[currency], currency)}
            detail="Current circulating value"
          />
          <MetricTile
            label="Volume"
            value={formatCompactCurrency(marketData?.total_volume?.[currency], currency)}
            detail="24h reported turnover"
          />
          <MetricTile
            label="ATH"
            value={formatCurrency(marketData?.ath?.[currency], currency)}
            detail={`${formatPercentage(marketData?.ath_change_percentage?.[currency])} since ${formatShortDate(
              marketData?.ath_date?.[currency]
            )}`}
          />
        </aside>
      </section>

      <section className="coin-fundamentals">
        <article>
          <span className="eyebrow">Asset profile</span>
          <h2>Context</h2>
          <p>{description || 'CoinGecko does not currently provide a readable description for this asset.'}</p>
        </article>

        <div className="fundamental-grid">
          <MetricTile
            label="Circulating supply"
            value={formatNumber(marketData?.circulating_supply, { notation: 'compact' })}
            detail={detail?.symbol?.toUpperCase()}
          />
          <MetricTile
            label="Total supply"
            value={formatNumber(marketData?.total_supply, { notation: 'compact' })}
            detail="Reported supply"
          />
          <MetricTile
            label="Max supply"
            value={formatNumber(marketData?.max_supply, { notation: 'compact' })}
            detail="Protocol cap"
          />
          <MetricTile
            label="24h range"
            value={`${formatCurrency(marketData?.low_24h?.[currency], currency)} - ${formatCurrency(
              marketData?.high_24h?.[currency],
              currency
            )}`}
            detail="Observed market range"
          />
        </div>
      </section>
    </PageTransition>
  );
}
