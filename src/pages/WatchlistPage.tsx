import { Link } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { PageTransition } from '../components/common/PageTransition';
import { RetryState } from '../components/common/RetryState';
import { MarketTable } from '../features/coins/MarketTable';
import { useMarkets } from '../features/coins/useMarkets';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useMarketStore } from '../store/useMarketStore';

export default function WatchlistPage() {
  useDocumentTitle('Watchlist');
  const currency = useMarketStore((state) => state.currency);
  const watchlist = useMarketStore((state) => state.watchlist);
  const markets = useMarkets(currency, watchlist);

  return (
    <PageTransition>
      <section className="page-intro">
        <span className="eyebrow">Personal market radar</span>
        <h1>Watchlist</h1>
        <p>
          Your saved assets stay in local browser storage only. No secrets, portfolios, or private
          positions are stored by this app.
        </p>
      </section>

      {watchlist.length === 0 ? (
        <EmptyState
          title="Your watchlist is empty"
          description="Add assets from the market board or coin detail screens to build a focused scan list."
          action={
            <Link className="button button-primary button-md" to="/">
              <Search size={16} aria-hidden="true" />
              <span>Browse markets</span>
            </Link>
          }
        />
      ) : null}

      {markets.error ? <RetryState message={markets.error} onRetry={markets.refetch} /> : null}

      {watchlist.length > 0 && !markets.error ? (
        <MarketTable
          title="Saved assets"
          markets={markets.data || []}
          currency={currency}
          isLoading={markets.isLoading}
          isRefreshing={markets.isRefreshing}
          onRefresh={markets.refetch}
        />
      ) : null}

      <section className="privacy-note">
        <Star size={16} aria-hidden="true" />
        <p>Stored locally for convenience. Move to account sync later by replacing the store adapter.</p>
      </section>
    </PageTransition>
  );
}
