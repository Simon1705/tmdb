import { X, Film, Star, Calendar } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PersonDetails } from '../lib/types';

interface PersonModalProps {
  person: { id: number; name: string } | null;
  personDetails: PersonDetails | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onMovieClick?: (movie: any) => void;
}

export const PersonModal = ({
  person,
  personDetails,
  isOpen,
  isLoading,
  onClose,
  onMovieClick,
}: PersonModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !person) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-slate-800/90 hover:bg-slate-700 rounded-full transition-all group border border-white/30"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {isLoading ? (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-slate-800/50 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 bg-slate-800/50 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-slate-800/50 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ) : personDetails ? (
            <div className="flex items-center gap-4">
              {personDetails.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${personDetails.profile_path}`}
                  alt={personDetails.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-purple-400/50 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-purple-500/30 flex items-center justify-center border-4 border-purple-400/50">
                  <span className="text-purple-200 font-bold text-3xl">
                    {personDetails.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 text-white">
                <h2 className="text-3xl font-bold mb-1">{personDetails.name}</h2>
                <p className="text-purple-200/80 text-sm">
                  {personDetails.known_for_department || 'Actor'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-purple-500/30 flex items-center justify-center border-4 border-purple-400/50">
                <span className="text-purple-200 font-bold text-3xl">
                  {person.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 text-white">
                <h2 className="text-3xl font-bold mb-1">{person.name}</h2>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 text-white">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-purple-400"></div>
              <p className="text-sm text-purple-100/80 mt-3">Loading details...</p>
            </div>
          ) : personDetails ? (
            <>
              {/* Biography */}
              {personDetails.biography && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <div className="w-1 h-5 bg-purple-400 rounded-full"></div>
                    Biography
                  </h3>
                  <p className="text-purple-100/90 leading-relaxed text-sm">
                    {personDetails.biography}
                  </p>
                </div>
              )}

              {/* Personal Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {personDetails.birthday && (
                  <div className="bg-white/10 rounded-lg p-3 border border-white/15">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-purple-300" />
                      <p className="text-xs text-purple-200/80">Birthday</p>
                    </div>
                    <p className="text-sm font-bold text-white">
                      {new Date(personDetails.birthday).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                
                {personDetails.place_of_birth && (
                  <div className="bg-white/10 rounded-lg p-3 border border-white/15">
                    <p className="text-xs text-purple-200/80 mb-1">Place of Birth</p>
                    <p className="text-sm font-bold text-white">{personDetails.place_of_birth}</p>
                  </div>
                )}
                
                {personDetails.known_for_department && (
                  <div className="bg-white/10 rounded-lg p-3 border border-white/15">
                    <p className="text-xs text-purple-200/80 mb-1">Known For</p>
                    <p className="text-sm font-bold text-white">{personDetails.known_for_department}</p>
                  </div>
                )}
              </div>

              {/* Known For Movies */}
              {personDetails.movies && personDetails.movies.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-400 rounded-full"></div>
                    Known For
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {personDetails.movies.map((movie: any) => (
                      <div 
                        key={movie.id}
                        onClick={() => {
                          if (onMovieClick) {
                            onMovieClick({ ...movie, api_id: movie.id });
                          }
                        }}
                        className="bg-slate-800/50 rounded-lg overflow-hidden border border-white/20 hover:border-white/40 hover:bg-slate-800/70 transition-all cursor-pointer group"
                      >
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full aspect-[2/3] object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-slate-700/50 flex items-center justify-center">
                            <Film className="w-6 h-6 text-purple-200" />
                          </div>
                        )}
                        <div className="p-2">
                          <p className="text-xs text-white font-semibold truncate group-hover:text-purple-200 transition-colors" title={movie.title}>
                            {movie.title}
                          </p>
                          {movie.vote_average && movie.vote_average > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-purple-200">{movie.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-purple-200/80">Failed to load person details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
