import { useEffect, useState } from 'react';
import { Movie } from './lib';

interface MovieFormModalProps {
  movie: Partial<Movie> | null;
  isOpen: boolean;
  isClosing: boolean;
  isOpening: boolean;
  isSaving?: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (updates: Partial<Movie>) => void;
}

export const MovieFormModal = ({
  movie,
  isOpen,
  isClosing,
  isOpening,
  isSaving = false,
  onClose,
  onSave,
  onChange,
}: MovieFormModalProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen && !isClosing) {
      // Opening
      setShouldRender(true);
      // Trigger animation after render
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else if (isClosing) {
      // Closing
      setIsAnimating(false);
      // Remove from DOM after animation
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isClosing]);

  if (!shouldRender || !movie) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-white/10 backdrop-blur-xl rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-white/15 transition-all duration-300 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-white">
            {movie.id ? '✏️ Edit Movie' : '➕ Add New Movie'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-indigo-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={onSave}>
          <div className="grid gap-5">
            <div>
              <label htmlFor="movie-title" className="block text-sm font-semibold text-indigo-100 mb-2">
                Movie Title <span className="text-red-300">*</span>
              </label>
              <input
                id="movie-title"
                type="text"
                required
                value={movie.title || ''}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Enter movie title"
                className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all text-white placeholder-indigo-200 bg-white/5"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="release-date" className="block text-sm font-semibold text-indigo-100 mb-2">
                  Release Date <span className="text-red-300">*</span>
                </label>
                <input
                  id="release-date"
                  type="date"
                  required
                  value={movie.release_date || ''}
                  onChange={(e) => onChange({ release_date: e.target.value })}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all text-white bg-white/5"
                />
              </div>
              <div>
                <label htmlFor="genre" className="block text-sm font-semibold text-indigo-100 mb-2">
                  Genre <span className="text-red-300">*</span>
                </label>
                <input
                  id="genre"
                  type="text"
                  required
                  value={movie.genre || ''}
                  onChange={(e) => onChange({ genre: e.target.value })}
                  placeholder="e.g., Action, Drama"
                  className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all text-white placeholder-indigo-200 bg-white/5"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="overview" className="block text-sm font-semibold text-indigo-100 mb-2">
                Overview
              </label>
              <textarea
                id="overview"
                rows={4}
                value={movie.overview || ''}
                onChange={(e) => onChange({ overview: e.target.value })}
                placeholder="Brief description of the movie..."
                className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all resize-none text-white placeholder-indigo-200 bg-white/5"
              />
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-sm font-semibold text-indigo-100 mb-2">
                Rating (0-10)
              </label>
              <input
                id="rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={movie.vote_average || 0}
                onChange={(e) => onChange({ vote_average: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all text-white bg-white/5"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-400 transition-all font-semibold shadow-lg shadow-indigo-500/30 cursor-pointer hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSaving && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSaving ? 'Saving...' : (movie.id ? 'Save Changes' : 'Add Movie')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-6 py-3 bg-white/10 text-white rounded-full hover:bg-white/15 transition-all font-semibold cursor-pointer hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
