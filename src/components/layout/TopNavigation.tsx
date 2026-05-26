import { BarChart3, Moon, Search, Star, SunMedium, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { PRODUCT_NAME, SUPPORTED_CURRENCIES } from '../../constants/market';
import { useMarketStore } from '../../store/useMarketStore';
import { Button } from '../common/Button';
import { GlobalSearch } from './GlobalSearch';

export function TopNavigation() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const theme = useMarketStore((state) => state.theme);
  const currency = useMarketStore((state) => state.currency);
  const setCurrency = useMarketStore((state) => state.setCurrency);
  const toggleTheme = useMarketStore((state) => state.toggleTheme);

  return (
    <>
      <header className="top-navigation">
        <NavLink className="brand-mark" to="/" aria-label={`${PRODUCT_NAME} dashboard`}>
          <span aria-hidden="true">Au</span>
          <strong>{PRODUCT_NAME}</strong>
        </NavLink>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/" end>
            <BarChart3 size={16} aria-hidden="true" />
            Markets
          </NavLink>
          <NavLink to="/watchlist">
            <Star size={16} aria-hidden="true" />
            Watchlist
          </NavLink>
          <a href="#top-movers">
            <TrendingUp size={16} aria-hidden="true" />
            Movers
          </a>
        </nav>

        <div className="nav-actions">
          <Button
            variant="ghost"
            className="search-trigger"
            icon={<Search size={17} aria-hidden="true" />}
            onClick={() => setIsSearchOpen(true)}
          >
            Search
          </Button>

          <label className="currency-select">
            <span className="sr-only">Currency</span>
            <select value={currency} onChange={(event) => setCurrency(event.target.value as typeof currency)}>
              {SUPPORTED_CURRENCIES.map((item) => (
                <option value={item.code} key={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <Button
            variant="ghost"
            size="icon"
            icon={theme === 'dark' ? <SunMedium size={18} /> : <Moon size={18} />}
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          />
        </div>
      </header>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
