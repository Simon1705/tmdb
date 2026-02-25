import { Film } from 'lucide-react';
import { Movie, SortBy } from '../lib/types';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  sortBy: SortBy;
  displayedMovies: number;
  isLoadingMore: boolean;
  loadedImages: Set<string>;
  onSortChange: (sortBy: SortBy) => void;
  onImageLoad: (movieId: string) => void;
  onMovieClick: (movie: Movie) => void;
}

export const MovieGrid = ({
  movies,
  sortBy,
  displayedMovies,
  isLoadingMore,
  loadedImages,
  onSortChange,
  onImageLoad,
  onMovieClick,
}: MovieGridProps) => {
  if (!movies || movies.length === 0) return null;

  const displayedMoviesList = movies.slice(0, displayedMovies);

  return (
    <div>
      {/* Sort dropdown */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-indigo-100/80">
          Showing {Math.min(displayedMovies, movies.length)} of {movies.length}{' '}
          {movies.length === 1 ? 'movie' : 'movies'}
        </p>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-indigo-100">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="dark-select px-4 py-2 bg-slate-800/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all text-sm font-medium text-white cursor-pointer hover:border-white/40"
          >
            <option value="rating">⭐ Highest Rating</option>
            <option value="popularity">🔥 Most Popular</option>
            <option value="title">🔤 Title (A-Z)</option>
            <option value="date">📅 Newest Release</option>
          </select>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {displayedMoviesList.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isImageLoaded={loadedImages.has(movie.id)}
            onImageLoad={onImageLoad}
            onClick={onMovieClick}
          />
        ))}
      </div>

      {/* Loading indicator for infinite scroll */}
      {isLoadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-indigo-400"></div>
          <span className="ml-3 text-indigo-100/80">Loading more movies...</span>
        </div>
      )}

      {/* End of list indicator */}
      {displayedMovies >= movies.length && movies.length > 24 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-indigo-100">
            <Film className="w-4 h-4 text-indigo-200" />
            You've reached the end - {movies.length} movies loaded
          </div>
        </div>
      )}
    </div>
  );
};
