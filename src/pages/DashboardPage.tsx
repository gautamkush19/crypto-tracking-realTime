import { RetryState } from "../components/common/RetryState";
import { PageTransition } from "../components/common/PageTransition";
import { HeroSection } from "../components/hero/HeroSection";
import { MarketTable } from "../features/coins/MarketTable";
import {
  useGlobalMarket,
  useMarkets,
  useTrendingCoins,
} from "../features/coins/useMarkets";
import { MarketHighlights } from "../features/dashboard/MarketHighlights";
import { MarketOverview } from "../features/dashboard/MarketOverview";
import { TrendingStrip } from "../features/dashboard/TrendingStrip";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useMarketStore } from "../store/useMarketStore";

export default function DashboardPage() {
  useDocumentTitle("Markets");
  const currency = useMarketStore((state) => state.currency);
  const markets = useMarkets(currency);
  const globalMarket = useGlobalMarket();
  const trending = useTrendingCoins();

  return (
    <PageTransition>
      <HeroSection />

      <MarketOverview
        globalMarket={globalMarket.data}
        isLoading={globalMarket.isLoading}
        currency={currency}
      />

      {markets.error ? (
        <RetryState message={markets.error} onRetry={markets.refetch} />
      ) : (
        <>
          <TrendingStrip data={trending.data} isLoading={trending.isLoading} />

          <MarketHighlights markets={markets.data || []} currency={currency} />

          <MarketTable
            markets={markets.data || []}
            currency={currency}
            isLoading={markets.isLoading}
            isRefreshing={markets.isRefreshing}
            onRefresh={markets.refetch}
          />
        </>
      )}
    </PageTransition>
  );
}
