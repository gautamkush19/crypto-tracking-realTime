import { memo, useMemo } from 'react';

type SparklineProps = {
  prices?: number[];
  trend?: number | null;
};

function SparklineComponent({ prices = [], trend = 0 }: SparklineProps) {
  const path = useMemo(() => buildSparklinePath(prices.slice(-80)), [prices]);
  const stroke = Number(trend) >= 0 ? 'var(--positive)' : 'var(--negative)';

  if (!path) {
    return <div className="sparkline-empty" aria-label="No sparkline data" />;
  }

  return (
    <div className="sparkline" aria-hidden="true">
      <svg viewBox="0 0 120 42" role="img" focusable="false">
        <path d={path.area} fill={stroke} opacity="0.12" />
        <path d={path.line} fill="none" stroke={stroke} strokeLinecap="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

export const Sparkline = memo(SparklineComponent);

function buildSparklinePath(values: number[]) {
  const cleanValues = values.filter((value) => Number.isFinite(value));
  if (cleanValues.length < 2) return null;

  const width = 120;
  const height = 42;
  const min = Math.min(...cleanValues);
  const max = Math.max(...cleanValues);
  const range = max - min || 1;

  const points = cleanValues.map((value, index) => {
    const x = (index / (cleanValues.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 4) - 2;
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(' ');

  const area = `${line} L${width} ${height} L0 ${height} Z`;

  return { line, area };
}
