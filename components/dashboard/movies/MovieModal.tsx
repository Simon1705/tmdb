import { X, Star, Calendar, Globe, Film, TrendingUp } from 'lucide-react';
import { format } from 'date-fns/format';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Movie, MovieDetails } from '../lib/types';

interface MovieModalProps {
  movie: Movie | null;
  movieDetails: MovieDetails | null;
  isOpen: boolean;
  isMounted: boolean;
  isLoading: boolean;
  isLoadingFadingOut?: boolean;
  onClose: () => void;
  onPersonClick?: (personId: number, personName: string) => void;
  onMovieClick?: (movie: any) => void;
}

export const MovieModal = ({
  movie,
  movieDetails,
  isOpen,
  isMounted,
  isLoading,
  isLoadingFadingOut = false,
  onClose,
  onPersonClick,
  onMovieClick,
}: MovieModalProps) => {
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

  if (!isOpen || !movie) return null;

  const movieData = movie as any;

  const modalContent = (
    <div 
      className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out ${
          isMounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className={`absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl transition-opacity duration-300 ${
            isLoadingFadingOut ? 'opacity-0' : 'opacity-100'
          }`}>
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-indigo-400 mb-3"></div>
              <p className="text-white font-semibold">Loading movie details...</p>
            </div>
          </div>
        )}

        {/* Content wrapper with fade-in animation */}
        <div className={`transition-opacity duration-500 ease-out ${
          isLoading && !isLoadingFadingOut ? 'opacity-30' : 'opacity-100'
        }`}>
        {/* Header with backdrop */}
        <div className="relative h-56 md:h-64 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
          <div className="absolute inset-0">
            {movieData.backdrop_path ? (
              <>
                <img
                  src={`https://image.tmdb.org/t/p/original${movieData.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <Film className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-slate-800/90 hover:bg-slate-700 rounded-full transition-all cursor-pointer group z-10 border border-white/30"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-4 md:p-6">
              <div className="flex gap-4 items-end max-w-6xl mx-auto">
                <div className="hidden md:block flex-shrink-0 w-28 lg:w-32 rounded-lg overflow-hidden shadow-2xl border-2 border-white/10">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
                      <Film className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-white pb-1">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg leading-tight">{movie.title}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-yellow-500 text-black px-2.5 py-1 rounded-lg font-bold shadow-lg text-sm">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/30 text-sm">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-medium">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 bg-blue-600 rounded-lg font-semibold shadow-lg text-sm">
                      {movieData.genre || 'Unknown'}
                    </div>
                    {movieData.original_language && (
                      <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/30 text-sm">
                        <Globe className="w-3.5 h-3.5" />
                        <span className="font-medium">{movieData.original_language.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 max-w-6xl mx-auto text-white">
          {/* Overview */}
          <div className="mb-5">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
              <div className="w-1 h-5 bg-indigo-400 rounded-full"></div>
              Synopsis
            </h3>
            {movie.overview ? (
              <p className="text-indigo-100/90 leading-relaxed text-sm line-clamp-3">{movie.overview}</p>
            ) : (
              <p className="text-indigo-200/60 leading-relaxed text-sm italic">No synopsis available for this movie.</p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <div className="relative overflow-hidden bg-white/10 rounded-lg p-3 border border-white/15 hover:border-white/25 transition-all group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
              <Star className="w-6 h-6 text-amber-300 mb-1 relative z-10" />
              <p className="text-2xl font-bold text-white relative z-10">
                {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
              </p>
              <p className="text-xs text-indigo-100/80 relative z-10">Rating</p>
            </div>

            <div className="relative overflow-hidden bg-white/10 rounded-lg p-3 border border-white/15 hover:border-white/25 transition-all group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
              <TrendingUp className="w-6 h-6 text-purple-200 mb-1 relative z-10" />
              <p className="text-2xl font-bold text-white relative z-10">
                {movie.popularity ? movie.popularity.toFixed(0) : 'N/A'}
              </p>
              <p className="text-xs text-indigo-100/80 relative z-10">Popularity</p>
            </div>

            <div className="relative overflow-hidden bg-white/10 rounded-lg p-3 border border-white/15 hover:border-white/25 transition-all group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
              <Calendar className="w-6 h-6 text-emerald-200 mb-1 relative z-10" />
              <p className="text-xl font-bold text-white relative z-10">
                {movie.release_date && movie.release_date !== 'Invalid Date' 
                  ? format(new Date(movie.release_date), 'MMM yyyy')
                  : 'Unknown'}
              </p>
              <p className="text-xs text-indigo-100/80 relative z-10">Release</p>
            </div>

            <div className="relative overflow-hidden bg-white/10 rounded-lg p-3 border border-white/15 hover:border-white/25 transition-all group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-400/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
              <Film className="w-6 h-6 text-indigo-200 mb-1 relative z-10" />
              <p className="text-lg font-bold text-white relative z-10 truncate">
                {movieData.genre || 'Unknown'}
              </p>
              <p className="text-xs text-indigo-100/80 relative z-10">Genre</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white/10 rounded-lg p-4 border border-white/15 mb-4">
            <div className="grid grid-cols-2 gap-2 text-xs text-indigo-100/80">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                <span>Language</span>
                <span className="font-bold text-white">{movieData.original_language?.toUpperCase() || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                <span>Votes</span>
                <span className="font-bold text-white">{movieData.vote_count ? movieData.vote_count.toLocaleString() : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                <span>Added</span>
                <span className="font-bold text-white">
                  {movieData.created_at 
                    ? format(new Date(movieData.created_at), 'MMM d, yy')
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                <span>Updated</span>
                <span className="font-bold text-white">
                  {movieData.updated_at 
                    ? format(new Date(movieData.updated_at), 'MMM d, yy')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <a
            href={`https://www.themoviedb.org/movie/${movie.api_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl mb-4"
          >
            <Globe className="w-4 h-4 relative z-10" />
            <span className="relative z-10">View on TMDB</span>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </a>

          {/* Loading state */}
          {isLoading && (
            <div className="mt-4 bg-slate-800/50 rounded-lg p-6 text-center border border-white/20">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-white/20 border-t-indigo-400"></div>
              <p className="text-xs text-indigo-100/80 mt-2">Loading trailer & cast...</p>
            </div>
          )}

          {!isLoading && movieDetails && (
            <>
              {/* Trailer Section */}
              <div className="mt-4">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                  Official Trailer
                </h3>
                {movieDetails.trailer ? (
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-white/15">
                    <iframe
                      src={`https://www.youtube.com/embed/${movieDetails.trailer.key}`}
                      title={movieDetails.trailer.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  <div className="relative aspect-video bg-slate-800/50 rounded-lg overflow-hidden shadow-lg border border-white/20 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Film className="w-12 h-12 text-indigo-300/50 mx-auto mb-3" />
                      <p className="text-indigo-200/80 text-sm font-medium">No trailer available</p>
                      <p className="text-indigo-200/60 text-xs mt-1">Trailer for this movie is not yet available</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Cast & Crew Section */}
              {movieDetails.cast && movieDetails.cast.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                    Cast & Crew
                  </h3>

                  {/* Director */}
                  {movieDetails.director && (
                    <div 
                      onClick={() => onPersonClick?.(movieDetails.director!.id, movieDetails.director!.name)}
                      className="mb-3 p-3 bg-gradient-to-r from-purple-900/40 to-purple-800/40 rounded-lg border border-purple-400/40 cursor-pointer hover:border-purple-400/60 hover:from-purple-900/50 hover:to-purple-800/50 transition-all"
                    >
                      <p className="text-xs font-semibold text-purple-300 mb-2">DIRECTOR</p>
                      <div className="flex items-center gap-3">
                        {movieDetails.director.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${movieDetails.director.profile_path}`}
                            alt={movieDetails.director.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/50 shadow-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center border-2 border-purple-400/50">
                            <span className="text-purple-200 font-bold text-lg">
                              {movieDetails.director.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <p className="font-bold text-sm text-white">{movieDetails.director.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Cast Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {movieDetails.cast.slice(0, 8).map((person) => (
                      <div 
                        key={person.id} 
                        onClick={() => onPersonClick?.(person.id, person.name)}
                        className="bg-slate-800/50 rounded-lg p-2 border border-white/20 hover:border-white/40 hover:bg-slate-800/70 transition-all cursor-pointer"
                      >
                        {person.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            className="w-full aspect-square object-cover rounded-lg mb-1.5 shadow-md"
                          />
                        ) : (
                          <div className="w-full aspect-square bg-slate-700/50 rounded-lg mb-1.5 flex items-center justify-center border border-white/20">
                            <span className="text-indigo-200 font-bold text-lg">
                              {person.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <p className="font-semibold text-xs text-white truncate" title={person.name}>
                          {person.name}
                        </p>
                        <p className="text-xs text-indigo-200/80 truncate" title={person.character}>
                          {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {movieDetails.reviews && movieDetails.reviews.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                    User Reviews ({movieDetails.reviews.length})
                  </h3>
                  <div className="space-y-3">
                    {movieDetails.reviews.map((review) => (
                      <div key={review.id} className="bg-slate-800/50 rounded-lg p-3 border border-white/20">
                        <div className="flex items-start gap-3 mb-2">
                          {review.author_details.avatar_path ? (
                            <img
                              src={review.author_details.avatar_path.startsWith('/https') 
                                ? review.author_details.avatar_path.substring(1)
                                : `https://image.tmdb.org/t/p/w92${review.author_details.avatar_path}`
                              }
                              alt={review.author}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center border-2 border-amber-400/50">
                              <span className="text-amber-200 font-bold">
                                {review.author.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-sm text-white">{review.author_details.name || review.author}</p>
                              {review.author_details.rating && (
                                <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="text-xs font-semibold text-amber-200">{review.author_details.rating}/10</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-indigo-200/60">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <p className="text-sm text-indigo-100/90 leading-relaxed line-clamp-4">
                          {review.content}
                        </p>
                        <a 
                          href={review.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs text-indigo-300 hover:text-indigo-200 underline"
                        >
                          Read full review →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Movies Section */}
              {movieDetails.similarMovies && movieDetails.similarMovies.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    Similar Movies
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {movieDetails.similarMovies.map((similarMovie) => (
                      <div 
                        key={similarMovie.id}
                        onClick={() => {
                          if (onMovieClick) {
                            onMovieClick({ ...similarMovie, api_id: similarMovie.id });
                          }
                        }}
                        className="bg-slate-800/50 rounded-lg overflow-hidden border border-white/20 hover:border-white/40 hover:bg-slate-800/70 transition-all cursor-pointer group"
                      >
                        {similarMovie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${similarMovie.poster_path}`}
                            alt={similarMovie.title}
                            className="w-full aspect-[2/3] object-cover"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-slate-700/50 flex items-center justify-center">
                            <Film className="w-6 h-6 text-indigo-200" />
                          </div>
                        )}
                        <div className="p-1.5">
                          <p className="text-xs text-white font-semibold truncate group-hover:text-indigo-200 transition-colors" title={similarMovie.title}>
                            {similarMovie.title}
                          </p>
                          {similarMovie.vote_average && similarMovie.vote_average > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-indigo-200">{similarMovie.vote_average.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </div> {/* End content wrapper */}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
