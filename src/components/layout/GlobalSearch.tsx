import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { searchCoins } from '../../services/coinGeckoService';
import { sanitizeSearchTerm } from '../../utils/sanitize';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';

type GlobalSearchProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Array<{ id: string; name: string; symbol: string; thumb: string; rank?: number | null }>>([]);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebouncedValue(query, 260);
  const cleanQuery = useMemo(() => sanitizeSearchTerm(debouncedQuery), [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || cleanQuery.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    searchCoins(cleanQuery)
      .then((data) => {
        if (!isMounted) return;
        setResults(
          data.coins.slice(0, 8).map((coin) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            thumb: coin.thumb,
            rank: coin.market_cap_rank
          }))
        );
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError instanceof Error ? requestError.message : 'Search failed. Try another query.'
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cleanQuery, isOpen]);

  function openCoin(coinId: string) {
    navigate(`/coin/${coinId}`);
    setQuery('');
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="search-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search crypto assets"
        >
          <button className="search-backdrop" onClick={onClose} aria-label="Close search" />
          <motion.div
            className="search-panel"
            initial={{ scale: 0.96, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 12, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="search-input-wrap">
              <Search size={18} aria-hidden="true" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Bitcoin, ETH, Solana..."
                aria-label="Search by coin name or symbol"
              />
              <Button variant="ghost" size="icon" icon={<X size={18} />} onClick={onClose} aria-label="Close search" />
            </div>

            <div className="search-results">
              {query.length < 2 ? (
                <p className="muted-copy">Type at least two characters to search CoinGecko assets.</p>
              ) : null}

              {isLoading ? (
                <>
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-14 w-full rounded-lg" />
                </>
              ) : null}

              {error ? <p className="inline-error">{error}</p> : null}

              {!isLoading &&
                !error &&
                results.map((coin) => (
                  <button className="search-result-row" key={coin.id} onClick={() => openCoin(coin.id)}>
                    <img src={coin.thumb} alt="" loading="lazy" />
                    <span>
                      <strong>{coin.name}</strong>
                      <small>{coin.symbol.toUpperCase()}</small>
                    </span>
                    <em>{coin.rank ? `#${coin.rank}` : 'Unranked'}</em>
                  </button>
                ))}

              {!isLoading && !error && query.length >= 2 && results.length === 0 ? (
                <p className="muted-copy">No matching assets found.</p>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
