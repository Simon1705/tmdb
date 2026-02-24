import { Film } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onAddMovie: () => void;
}

export const EmptyState = ({ hasFilters, onClearFilters, onAddMovie }: EmptyStateProps) => {
  return (
    <div className="p-12 text-center animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <Film className="w-10 h-10 text-indigo-200" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Movies Found</h3>
        <p className="text-indigo-100/80 mb-6">
          {hasFilters
            ? 'No movies match your filters. Try adjusting your search or filters.'
            : 'Get started by syncing data from TMDB or adding movies manually.'}
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/15 transition-all font-medium cursor-pointer hover:-translate-y-0.5 active:scale-95"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={onAddMovie}
            className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-400 transition-all font-medium cursor-pointer hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-indigo-500/30"
            aria-label="Add your first movie"
          >
            {hasFilters ? 'Add Movie Manually' : 'Add Your First Movie'}
          </button>
        </div>
      </div>
    </div>
  );
};
