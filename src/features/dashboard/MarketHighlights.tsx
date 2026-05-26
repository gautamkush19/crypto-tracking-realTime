import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { StatusPill } from '../../components/common/StatusPill';
import type { CoinMarket, CurrencyCode } from '../coins/types';
import { formatCompactCurrency, formatCurrency } from '../../utils/format';

type MarketHighlightsProps = {
  markets: CoinMarket[];
  currency: CurrencyCode;
};

export function MarketHighlights({ markets, currency }: MarketHighlightsProps) {
  const sorted = [...markets].filter((coin) => Number.isFinite(coin.price_change_percentage_24h));
  const gainers = sorted
    .sort((a, b) => Number(b.price_change_percentage_24h) - Number(a.price_change_percentage_24h))
    .slice(0, 5);
  const losers = [...sorted]
    .sort((a, b) => Number(a.price_change_percentage_24h) - Number(b.price_change_percentage_24h))
    .slice(0, 5);

  return (
    <section className="movers-grid" id="top-movers" aria-label="Top market movers">
      <MoverList
        title="Strongest bid"
        icon={<ArrowUpRight size={18} aria-hidden="true" />}
        coins={gainers}
        currency={currency}
      />
      <MoverList
        title="Sharpest pullback"
        icon={<ArrowDownRight size={18} aria-hidden="true" />}
        coins={losers}
        currency={currency}
      />
    </section>
  );
}

function MoverList({
  title,
  icon,
  coins,
  currency
}: {
  title: string;
  icon: ReactNode;
  coins: CoinMarket[];
  currency: CurrencyCode;
}) {
  return (
    <article className="mover-panel">
      <div className="panel-heading">
        <span className="metric-icon">{icon}</span>
        <h2>{title}</h2>
      </div>

      <div className="mover-list">
        {coins.map((coin) => (
          <Link to={`/coin/${coin.id}`} className="mover-row" key={coin.id}>
            <img src={coin.image} alt="" loading="lazy" />
            <span>
              <strong>{coin.name}</strong>
              <small>
                {coin.symbol.toUpperCase()} · {formatCompactCurrency(coin.market_cap, currency)}
              </small>
            </span>
            <span className="mover-price">
              {formatCurrency(coin.current_price, currency)}
              <StatusPill value={coin.price_change_percentage_24h} compact />
            </span>
          </Link>
        ))}
      </div>
    </article>
  );
}
