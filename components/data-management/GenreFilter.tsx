interface GenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  showDropdown: boolean;
  onToggleDropdown: () => void;
  onToggleGenre: (genre: string) => void;
}

export const GenreFilter = ({
  genres,
  selectedGenres,
  showDropdown,
  onToggleDropdown,
  onToggleGenre,
}: GenreFilterProps) => {
  return (
    <div className="lg:w-64">
      <label htmlFor="genre-filter" className="block text-sm font-semibold text-indigo-100 mb-2">
        Filter by Genre
      </label>
      <div className="relative">
        <button
          id="genre-filter"
          type="button"
          onClick={onToggleDropdown}
          className="w-full px-4 py-3 border border-white/15 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all bg-white/5 shadow-sm hover:border-white/30 text-left flex items-center justify-between text-white hover:shadow-md"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-label="Filter movies by genre"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg">🎬</span>
            <span>
              {selectedGenres.length === 0 
                ? 'All Genres' 
                : `${selectedGenres.length} genre${selectedGenres.length > 1 ? 's' : ''}`}
            </span>
          </span>
          <svg 
            className={`w-5 h-5 text-indigo-200 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showDropdown && (
          <>
            {/* Backdrop to close dropdown */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={onToggleDropdown}
              aria-hidden="true"
            />
            
            {/* Dropdown menu */}
            <div 
              className="absolute z-50 w-full mt-2 bg-slate-900 border border-white/15 rounded-lg shadow-xl max-h-64 overflow-y-auto animate-fade-in"
              role="listbox"
              aria-label="Genre filter options"
            >
              <div className="p-2">
                {genres.length === 0 ? (
                  <div className="px-3 py-4 text-center text-indigo-200 text-sm">
                    No genres available
                  </div>
                ) : (
                  genres.map(genre => (
                    <label
                      key={genre}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-all group hover:scale-[1.02]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => onToggleGenre(genre)}
                        className="w-4 h-4 text-indigo-500 border-2 border-white/30 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer bg-transparent"
                        aria-label={`Filter by ${genre}`}
                      />
                      <span className="text-white group-hover:text-indigo-200 font-medium flex-1">
                        🎭 {genre}
                      </span>
                      {selectedGenres.includes(genre) && (
                        <span className="text-indigo-300 text-xs">✓</span>
                      )}
                    </label>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Selected genres tags */}
      {selectedGenres.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 animate-fade-in">
          {selectedGenres.map(genre => (
            <span
              key={genre}
              className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-100 rounded-full text-xs font-semibold hover:bg-indigo-500/30 transition-colors animate-scale-in"
            >
              {genre}
              <button
                onClick={() => onToggleGenre(genre)}
                className="hover:bg-white/10 rounded-full p-0.5 transition-all cursor-pointer hover:scale-110"
                aria-label={`Remove ${genre} filter`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
