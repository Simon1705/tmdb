import { Search } from 'lucide-react';

interface SearchBarProps {
  search: string;
  debouncedSearch: string;
  isTmdbSearching: boolean;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar = ({ 
  search, 
  debouncedSearch, 
  isTmdbSearching,
  onSearchChange, 
  onClear 
}: SearchBarProps) => {
  return (
    <div className="flex-1">
      <label htmlFor="search-input" className="block text-sm font-semibold text-indigo-100 mb-2">
        Search Movies
      </label>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-200 w-5 h-5 group-focus-within:text-white transition-colors" />
        <input
          id="search-input"
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border border-white/15 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all bg-white/5 shadow-sm hover:border-white/30 text-white placeholder-indigo-200/70"
          aria-label="Search movies by title"
        />
        {search && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {search !== debouncedSearch && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-indigo-400" aria-label="Searching"></div>
            )}
            <button
              onClick={onClear}
              className="text-indigo-200 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      {search && search !== debouncedSearch && (
        <p className="text-xs text-indigo-100/80 mt-1 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></span>
          Searching database...
        </p>
      )}
      {isTmdbSearching && (
        <p className="text-xs text-indigo-100 mt-1 flex items-center gap-1 font-medium">
          <span className="inline-block w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></span>
          Searching TMDB...
        </p>
      )}
    </div>
  );
};
