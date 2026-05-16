/**
 * Skeleton Card Component
 * Loading placeholder for audit cards and other data cards
 * Uses shimmer animation for better perceived performance
 */

interface SkeletonCardProps {
  count?: number;
  variant?: 'audit' | 'summary' | 'notification';
}

export function SkeletonCard({ count = 3, variant = 'audit' }: SkeletonCardProps) {
  const shimmer = 'animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]';

  if (variant === 'summary') {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className={`h-8 w-12 rounded ${shimmer} mb-2`} />
            <div className={`h-4 w-16 rounded ${shimmer}`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'notification') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3">
            <div className={`h-10 w-10 rounded-full ${shimmer} flex-shrink-0`} />
            <div className="flex-1 space-y-2">
              <div className={`h-4 w-3/4 rounded ${shimmer}`} />
              <div className={`h-3 w-full rounded ${shimmer}`} />
              <div className={`h-3 w-1/3 rounded ${shimmer}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className={`h-5 w-2/3 rounded ${shimmer}`} />
              <div className={`h-4 w-full rounded ${shimmer}`} />
            </div>
            <div className={`h-6 w-20 rounded-full ${shimmer}`} />
          </div>
          <div className="flex gap-2">
            <div className={`h-4 w-24 rounded ${shimmer}`} />
            <div className={`h-4 w-20 rounded ${shimmer}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
