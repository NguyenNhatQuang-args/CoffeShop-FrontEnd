const Pulse = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
          <Pulse className="h-4 w-20 mb-4" />
          <Pulse className="h-8 w-24 mb-2" />
          <Pulse className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <Pulse className="h-5 w-48" />
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 p-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Pulse key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
      <Pulse className="h-6 w-48 mb-8" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <Pulse className="h-4 w-24 mb-2" />
          <Pulse className="h-10 w-full" />
        </div>
      ))}
      <Pulse className="h-10 w-32 mt-4" />
    </div>
  );
}
