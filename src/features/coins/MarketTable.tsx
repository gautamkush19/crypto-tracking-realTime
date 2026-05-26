import { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownUp, RefreshCcw, Search, Star } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Sparkline } from '../../components/common/Sparkline';
import { StatusPill } from '../../components/common/StatusPill';
import { TableSkeleton } from '../../components/common/Skeleton';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useMarketStore } from '../../store/useMarketStore';
import { formatCompactCurrency, formatCurrency } from '../../utils/format';
import { sanitizeSearchTerm } from '../../utils/sanitize';
import type { CoinMarket, CurrencyCode } from './types';

type SortKey = 'rank' | 'price' | 'change' | 'volume' | 'marketCap';

type MarketTableProps = {
  markets: CoinMarket[];
  currency: CurrencyCode;
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  title?: string;
};

export function MarketTable({
  markets,
  currency,
  isLoading,
  isRefreshing,
  onRefresh,
  title = 'Market board'
}: MarketTableProps) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rank');
  const debouncedQuery = useDebouncedValue(query, 180);
  const cleanQuery = sanitizeSearchTerm(debouncedQuery).toLowerCase();

  const filteredMarkets = useMemo(() => {
    const filtered = cleanQuery
      ? markets.filter((coin) =>
          `${coin.name} ${coin.symbol} ${coin.id}`.toLowerCase().includes(cleanQuery)
        )
      : markets;

    return [...filtered].sort((a, b) => {
      if (sortKey === 'price') return Number(b.current_price) - Number(a.current_price);
      if (sortKey === 'change') return Number(b.price_change_percentage_24h) - Number(a.price_change_percentage_24h);
      if (sortKey === 'volume') return Number(b.total_volume) - Number(a.total_volume);
      if (sortKey === 'marketCap') return Number(b.market_cap) - Number(a.market_cap);
      return Number(a.market_cap_rank || 9999) - Number(b.market_cap_rank || 9999);
    });
  }, [cleanQuery, markets, sortKey]);

  return (
    <section className="content-band market-board" aria-label={title}>
      <div className="section-heading board-heading">
        <div>
          <span className="eyebrow">Execution view</span>
          <h2>{title}</h2>
        </div>

        <div className="board-controls">
          <label className="table-search">
            <Search size={16} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter loaded markets"
              aria-label="Filter loaded markets"
            />
          </label>

          <label className="sort-select">
            <ArrowDownUp size={15} aria-hidden="true" />
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
              <option value="rank">Rank</option>
              <option value="marketCap">Market cap</option>
              <option value="volume">Volume</option>
              <option value="price">Price</option>
              <option value="change">24h change</option>
            </select>
          </label>

          <Button
            variant="secondary"
            icon={<RefreshCcw size={16} aria-hidden="true" />}
            onClick={onRefresh}
            isLoading={isRefreshing}
          >
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? <TableSkeleton rows={10} /> : null}

      {!isLoading && filteredMarkets.length === 0 ? (
        <EmptyState
          title="No assets match this view"
          description="Adjust the filter or refresh market data to rebuild the board."
        />
      ) : null}

      {!isLoading && filteredMarkets.length > 0 ? (
        <div className="market-table-wrap">
          <table className="market-table">
            <thead>
              <tr>
                <th scope="col">Asset</th>
                <th scope="col">Price</th>
                <th scope="col">1h</th>
                <th scope="col">24h</th>
                <th scope="col">7d</th>
                <th scope="col">Volume</th>
                <th scope="col">Market cap</th>
                <th scope="col">7d flow</th>
                <th scope="col">
                  <span className="sr-only">Watchlist</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMarkets.map((coin) => (
                <MarketRow coin={coin} currency={currency} key={coin.id} />
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

const MarketRow = memo(function MarketRow({
  coin,
  currency
}: {
  coin: CoinMarket;
  currency: CurrencyCode;
}) {
  const isWatched = useMarketStore((state) => state.isWatched(coin.id));
  const toggleWatchlist = useMarketStore((state) => state.toggleWatchlist);

  return (
    <tr>
      <td data-label="Asset">
        <Link className="asset-cell" to={`/coin/${coin.id}`}>
          <span className="rank">#{coin.market_cap_rank || '—'}</span>
          <img src={coin.image} alt="" loading="lazy" />
          <span>
            <strong>{coin.name}</strong>
            <small>{coin.symbol.toUpperCase()}</small>
          </span>
        </Link>
      </td>
      <td data-label="Price">{formatCurrency(coin.current_price, currency)}</td>
      <td data-label="1h">
        <StatusPill value={coin.price_change_percentage_1h_in_currency} compact />
      </td>
      <td data-label="24h">
        <StatusPill value={coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h} compact />
      </td>
      <td data-label="7d">
        <StatusPill value={coin.price_change_percentage_7d_in_currency} compact />
      </td>
      <td data-label="Volume">{formatCompactCurrency(coin.total_volume, currency)}</td>
      <td data-label="Market cap">{formatCompactCurrency(coin.market_cap, currency)}</td>
      <td data-label="7d flow">
        <Sparkline prices={coin.sparkline_in_7d?.price} trend={coin.price_change_percentage_7d_in_currency} />
      </td>
      <td data-label="Watchlist">
        <button
          className={`watch-button ${isWatched ? 'active' : ''}`}
          onClick={() => toggleWatchlist(coin.id)}
          aria-label={isWatched ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
        >
          <Star size={16} fill={isWatched ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
});
