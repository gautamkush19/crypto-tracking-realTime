import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { useEffect, useRef, useState } from 'react';
import { Skeleton } from '../../components/common/Skeleton';
import type { ChartPoint, CurrencyCode } from './types';
import { formatCurrency, formatDateTime } from '../../utils/format';

type PriceChartProps = {
  data: ChartPoint[] | null;
  currency: CurrencyCode;
  isLoading: boolean;
};

export function PriceChart({ data, currency, isLoading }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 430 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    function updateDimensions(rect: DOMRectReadOnly) {
      setDimensions({
        width: Math.max(Math.floor(rect.width), 320),
        height: Math.max(Math.floor(rect.height), 320)
      });
    }

    updateDimensions(element.getBoundingClientRect());

    const observer = new ResizeObserver(([entry]) => {
      updateDimensions(entry.contentRect);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [data, isLoading]);

  if (isLoading) {
    return <Skeleton className="h-96 w-full rounded-lg" />;
  }

  const first = data?.[0]?.price;
  const last = data?.[data.length - 1]?.price;
  const isPositive = Number(last) >= Number(first);

  return (
    <div className="price-chart" ref={containerRef} aria-label="Historical price chart">
      {dimensions.width > 0 ? (
        <AreaChart
          width={dimensions.width}
          height={dimensions.height}
          data={data || []}
          margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="priceChartFill" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="5%"
                stopColor={isPositive ? 'var(--positive)' : 'var(--negative)'}
                stopOpacity={0.32}
              />
              <stop
                offset="95%"
                stopColor={isPositive ? 'var(--positive)' : 'var(--negative)'}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--line-subtle)" strokeDasharray="3 10" vertical={false} />
          <XAxis
            dataKey="timestamp"
            minTickGap={32}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatDateTime(value).replace(',', '')}
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatCurrency(value, currency, { notation: 'compact' })}
            width={88}
          />
          <Tooltip
            cursor={{ stroke: 'var(--text-muted)', strokeDasharray: '4 6' }}
            content={({ active, payload }) => {
              const point = payload?.[0]?.payload as ChartPoint | undefined;
              if (!active || !point) return null;

              return (
                <div className="chart-tooltip">
                  <strong>{formatCurrency(point.price, currency)}</strong>
                  <span>{formatDateTime(point.timestamp)}</span>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? 'var(--positive)' : 'var(--negative)'}
            fill="url(#priceChartFill)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            isAnimationActive
            animationDuration={650}
          />
        </AreaChart>
      ) : null}
    </div>
  );
}
