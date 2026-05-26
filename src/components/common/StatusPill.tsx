import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { formatPercentage } from '../../utils/format';

type StatusPillProps = {
  value: number | null | undefined;
  compact?: boolean;
};

export function StatusPill({ value, compact = false }: StatusPillProps) {
  const numericValue = Number(value);
  const direction = Number.isFinite(numericValue)
    ? numericValue > 0
      ? 'positive'
      : numericValue < 0
        ? 'negative'
        : 'neutral'
    : 'neutral';

  const Icon = direction === 'positive' ? ArrowUpRight : direction === 'negative' ? ArrowDownRight : Minus;

  return (
    <span className={`status-pill ${direction} ${compact ? 'compact' : ''}`}>
      <Icon size={14} aria-hidden="true" />
      {formatPercentage(value)}
    </span>
  );
}
