export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] rounded bg-primary/10 mb-4" />
      {/* Title */}
      <div className="h-4 bg-primary/10 rounded w-3/4 mb-2" />
      {/* Description */}
      <div className="h-3 bg-primary/10 rounded w-full mb-3" />
      {/* Price */}
      <div className="h-3 bg-primary/10 rounded w-1/3" />
    </div>
  );
}
