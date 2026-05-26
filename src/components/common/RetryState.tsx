import { RefreshCcw } from 'lucide-react';
import { Button } from './Button';

type RetryStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function RetryState({ title = 'Market data paused', message, onRetry }: RetryStateProps) {
  return (
    <section className="retry-state" role="alert">
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" icon={<RefreshCcw size={16} aria-hidden="true" />} onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </section>
  );
}
