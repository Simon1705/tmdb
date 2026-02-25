import { ReactNode, useRef, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

export const CollapsibleSection = ({
  title,
  count,
  isExpanded,
  onToggle,
  children,
  className = '',
}: CollapsibleSectionProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        // Get the actual height of the content
        const contentHeight = contentRef.current.scrollHeight;
        setHeight(contentHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isExpanded]);

  // Update height when content changes (e.g., images load)
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (contentRef.current) {
          setHeight(contentRef.current.scrollHeight);
        }
      });

      resizeObserver.observe(contentRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isExpanded]);

  return (
    <div className={`mt-8 ${className}`}>
      {/* Collapsible Header */}
      <button
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full flex items-center justify-between p-4 bg-slate-800/40 border border-white/15 rounded-xl hover:bg-slate-800/60 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${title}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown className="w-5 h-5 text-indigo-300" />
            </div>
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-white group-hover:text-indigo-200 transition-colors">
              {title}
            </h2>
            {count !== undefined && (
              <p className="text-sm text-indigo-100/70 mt-0.5">
                {count} {count === 1 ? 'movie' : 'movies'}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-sm text-indigo-200/80 font-medium">
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        style={{
          height: height,
          opacity: isExpanded ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div ref={contentRef} className={isExpanded ? 'mt-6' : ''}>
          {children}
        </div>
      </div>
    </div>
  );
};
