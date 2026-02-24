import { Search, Film, Plus, Loader } from 'lucide-react';
import { TmdbMovie } from './lib';

interface TmdbResultsProps {
  results: TmdbMovie[];
  addingMovieId: number | null;
  onAddMovie: (movieId: number) => void;
}

export const TmdbResults = ({ results, addingMovieId, onAddMovie }: TmdbResultsProps) => {
  if (results.length === 0) return null;

  return (
    <div className="mt-6 bg-white/5 rounded-2xl shadow-xl p-6 border border-white/10 animate-fade-in backdrop-blur">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-500 rounded-lg shadow-md">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Found on TMDB</h2>
          <p className="text-sm text-indigo-100/80">
            No results in your database. Here are {results.length} movie{results.length > 1 ? 's' : ''} from TMDB:
          </p>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/10 shadow-xl max-h-96 overflow-y-auto custom-scrollbar">
        {results.map((movie, index) => (
          <div
            key={movie.id}
            className="flex items-center gap-4 p-4 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-all duration-200 group animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Poster */}
            <div className="flex-shrink-0 w-16 h-24 bg-gray-200 rounded overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <Film className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate group-hover:text-indigo-200 transition-colors">
                {movie.title}
              </h3>
              <p className="text-sm text-indigo-100/80">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </p>
              <p className="text-xs text-indigo-200/80 line-clamp-2 mt-1">
                {movie.overview || 'No overview available'}
              </p>
            </div>

            {/* Add Button */}
            <button
              onClick={() => onAddMovie(movie.id)}
              disabled={addingMovieId === movie.id}
              className="flex-shrink-0 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/20 disabled:cursor-not-allowed text-white rounded-full font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30 cursor-pointer hover:-translate-y-0.5 active:scale-95"
              aria-label={`Add ${movie.title} to database`}
            >
              {addingMovieId === movie.id ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
