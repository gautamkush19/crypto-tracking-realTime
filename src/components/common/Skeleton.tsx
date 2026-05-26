type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="table-skeleton" aria-label="Loading market table">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="table-skeleton-row" key={index}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      ))}
    </div>
  );
}
