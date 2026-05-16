/**
 * Pull-to-Refresh wrapper component
 * Wraps children and adds pull-down gesture to refresh
 * Native-feeling mobile interaction
 */

import { useState, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  children: ReactNode;
}

export function PullToRefresh({ onRefresh, isRefreshing, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const PULL_THRESHOLD = 80; // Distance to trigger refresh
  const MAX_PULL = 120; // Maximum visual pull distance

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only allow pull if at top of scroll
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling) return;

    const touchY = e.touches[0].clientY;
    const delta = touchY - touchStartY.current;

    if (delta > 0 && containerRef.current && containerRef.current.scrollTop === 0) {
      // Apply resistance to make it feel natural
      const resistedDelta = Math.min(delta * 0.4, MAX_PULL);
      setPullDistance(resistedDelta);
    }
  }, [isPulling]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    setIsPulling(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      // Trigger refresh
      setPullDistance(MAX_PULL * 0.6);
      await onRefresh();
    }

    // Always reset
    setPullDistance(0);
  }, [isPulling, pullDistance, isRefreshing, onRefresh]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto overscroll-y-contain"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex items-center justify-center transition-transform duration-200"
        style={{
          height: pullDistance > 0 ? pullDistance : 0,
          opacity: pullDistance > 10 ? 1 : 0,
        }}
      >
        {isRefreshing ? (
          <Loader2 className="w-5 h-5 text-[#1A7A4A] animate-spin" />
        ) : (
          <div
            className="flex flex-col items-center"
            style={{
              transform: `rotate(${(pullDistance / PULL_THRESHOLD) * 180}deg)`,
              transition: 'transform 0.2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A7A4A" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
