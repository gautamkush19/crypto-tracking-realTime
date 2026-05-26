import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { PageTransition } from '../components/common/PageTransition';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Not found');

  return (
    <PageTransition>
      <EmptyState
        title="That market view does not exist"
        description="Return to the dashboard and continue from live CoinGecko market data."
        action={
          <Link className="button button-primary button-md" to="/">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to dashboard</span>
          </Link>
        }
      />
    </PageTransition>
  );
}
