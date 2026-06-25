function SkeletonCard() {
  return (
    <div className="news-card skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-image" />
      <div className="card-body">
        <div className="skeleton skeleton-line tiny" />
        <div className="skeleton skeleton-line title" />
        <div className="skeleton skeleton-line title short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line medium" />
        <div className="skeleton skeleton-line footer" />
      </div>
    </div>
  );
}

export function NewsSkeleton() {
  return (
    <div className="news-grid" aria-label="Loading news">
      {Array.from({ length: 6 }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
