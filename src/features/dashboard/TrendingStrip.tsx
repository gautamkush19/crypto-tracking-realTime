import { Link } from 'react-router-dom';
import { StatusPill } from '../../components/common/StatusPill';
import { Skeleton } from '../../components/common/Skeleton';
import type { TrendingResponse } from '../coins/types';

type TrendingStripProps = {
  data: TrendingResponse | null;
  isLoading: boolean;
};

export function TrendingStrip({ data, isLoading }: TrendingStripProps) {
  return (
    <section className="content-band trending-band" aria-label="Trending assets">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Live signal</span>
          <h2>Trending on CoinGecko</h2>
        </div>
        <p>Search momentum, refreshed through the backend cache.</p>
      </div>

      <div className="trending-grid">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <Skeleton className="h-24 rounded-lg" key={index} />)
          : data?.coins.slice(0, 6).map(({ item }) => (
              <Link className="trending-card" to={`/coin/${item.id}`} key={item.id}>
                <img src={item.small || item.thumb} alt="" loading="lazy" />
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.symbol}</small>
                </span>
                <StatusPill value={item.data?.price_change_percentage_24h?.usd} compact />
              </Link>
            ))}
      </div>
    </section>
  );
}
