import { ReactNode } from 'react';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

interface LazyChartProps {
  children: ReactNode;
  height?: string;
  className?: string;
}

const ChartSkeleton = ({ height = 'h-80' }: { height?: string }) => (
  <div className={`bg-slate-800/40 border border-white/15 rounded-2xl p-6 shadow-xl ${height}`}>
    <div className="animate-pulse">
      <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
      <div className="h-full bg-white/5 rounded"></div>
    </div>
  </div>
);

export const LazyChart = ({ children, height = 'h-80', className = '' }: LazyChartProps) => {
  const { elementRef, isVisible, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px', // Start loading 100px before visible
    triggerOnce: true,
  });

  return (
    <div ref={elementRef} className={className}>
      {hasBeenVisible ? children : <ChartSkeleton height={height} />}
    </div>
  );
};
