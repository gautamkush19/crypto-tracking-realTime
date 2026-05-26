import type { ReactNode } from 'react';

type MetricTileProps = {
  label: string;
  value: ReactNode;
  detail?: ReactNode;
  icon?: ReactNode;
};

export function MetricTile({ label, value, detail, icon }: MetricTileProps) {
  return (
    <article className="metric-tile">
      <div className="metric-tile-top">
        <span>{label}</span>
        {icon ? <div className="metric-icon">{icon}</div> : null}
      </div>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  );
}
