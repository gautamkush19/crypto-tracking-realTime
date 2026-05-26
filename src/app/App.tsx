import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { TableSkeleton } from '../components/common/Skeleton';
import { useThemeSync } from './useThemeSync';

const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const WatchlistPage = lazy(() => import('../pages/WatchlistPage'));
const CoinDetailPage = lazy(() => import('../pages/CoinDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export function App() {
  const location = useLocation();
  useThemeSync();

  return (
    <AppShell>
      <Suspense fallback={<TableSkeleton rows={6} />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/coin/:id" element={<CoinDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </AppShell>
  );
}
