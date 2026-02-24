import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination as PaginationType, ITEMS_PER_PAGE_OPTIONS } from './lib';

interface PaginationProps {
  pagination: PaginationType;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export const Pagination = ({
  pagination,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) => {
  if (pagination.total === 0) return null;

  return (
    <>
      {/* Top Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 mt-4">
        {/* Items per page */}
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="items-per-page" className="text-indigo-100/80 font-medium">Show:</label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
            className="px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all bg-white/5 text-white cursor-pointer hover:border-white/40"
            aria-label="Items per page"
          >
            {ITEMS_PER_PAGE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="text-indigo-100/80">per page</span>
        </div>

        {/* Page info */}
        <div className="text-sm text-indigo-100/80" role="status" aria-live="polite">
          Showing <span className="font-semibold text-white">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
          <span className="font-semibold text-white">
            {Math.min(currentPage * itemsPerPage, pagination.total)}
          </span>{' '}
          of <span className="font-semibold text-white">{pagination.total}</span>
        </div>
      </div>

      {/* Bottom Pagination Navigation */}
      {pagination.totalPages > 1 && (
        <div className="bg-white/5 rounded-2xl shadow-xl border border-white/10 p-4 mt-4 animate-fade-in backdrop-blur">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-white/20 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer hover:scale-105 active:scale-95 hover:border-white/40"
              title="Previous page"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="w-5 h-5 text-indigo-100" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-indigo-500 text-white shadow-md scale-110'
                        : 'border border-white/20 text-indigo-100 hover:bg-white/10 hover:border-white/40 hover:scale-105 active:scale-95'
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="p-2 rounded-lg border border-white/20 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer hover:scale-105 active:scale-95 hover:border-white/40"
              title="Next page"
              aria-label="Go to next page"
            >
              <ChevronRight className="w-5 h-5 text-indigo-100" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
