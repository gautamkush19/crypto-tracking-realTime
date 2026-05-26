import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_WATCHLIST } from '../constants/market';
import type { CurrencyCode } from '../features/coins/types';
import { sanitizeCoinId } from '../utils/sanitize';

type ThemeMode = 'dark' | 'light';

type MarketStore = {
  theme: ThemeMode;
  currency: CurrencyCode;
  watchlist: string[];
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setCurrency: (currency: CurrencyCode) => void;
  toggleWatchlist: (coinId: string) => void;
  isWatched: (coinId: string) => boolean;
};

export const useMarketStore = create<MarketStore>()(
  persist(
    (set, get) => ({
      theme: getInitialTheme(),
      currency: 'usd',
      watchlist: DEFAULT_WATCHLIST,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setCurrency: (currency) => set({ currency }),
      toggleWatchlist: (coinId) => {
        const cleanId = sanitizeCoinId(coinId);
        if (!cleanId) return;

        set((state) => {
          const exists = state.watchlist.includes(cleanId);
          return {
            watchlist: exists
              ? state.watchlist.filter((id) => id !== cleanId)
              : [...state.watchlist, cleanId]
          };
        });
      },
      isWatched: (coinId) => get().watchlist.includes(sanitizeCoinId(coinId))
    }),
    {
      name: 'aurelian-ui-v1',
      partialize: (state) => ({
        theme: state.theme,
        currency: state.currency,
        watchlist: state.watchlist
      })
    }
  )
);

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
