import { useEffect } from 'react';
import { useMarketStore } from '../store/useMarketStore';

export function useThemeSync() {
  const theme = useMarketStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0b0f17' : '#f7f4ef'
    );
  }, [theme]);
}
