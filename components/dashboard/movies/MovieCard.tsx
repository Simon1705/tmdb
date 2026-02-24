import { Film, Star } from 'lucide-react';
import { Movie } from '../lib/types';

interface MovieCardProps {
  movie: Movie;
  isImageLoaded: boolean;
  onImageLoad: (movieId: string) => void;
  onClick: (movie: Movie) => void;
}

export const MovieCard = ({ movie, isImageLoaded, onImageLoad, onClick }: MovieCardProps) => {
  return (
    <div
      onClick={() => onClick(movie)}
      className="bg-slate-800/40 border border-white/15 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:z-10 cursor-pointer group"
    >
      <div className="relative aspect-[2/3] bg-gray-200">
        {/* Skeleton loader */}
        {!isImageLoaded && movie.poster_path && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/20 to-white/10 animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <Film className="w-12 h-12 text-indigo-200 animate-pulse" />
            </div>
          </div>
        )}
        
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            onLoad={() => onImageLoad(movie.id)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <Film className="w-12 h-12 text-gray-500" />
          </div>
        )}
        
        {/* Rating badge on poster */}
        {movie.vote_average && (
          <div className="absolute top-2 right-2 bg-black/90 rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent bg-opacity-0 group-hover:bg-opacity-90 transition-all duration-300 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
          <div className="text-white w-full">
            <h3 className="font-bold text-sm line-clamp-2 mb-2">{movie.title}</h3>
            {movie.overview && (
              <p className="text-xs text-gray-300 line-clamp-3 mb-2">{movie.overview}</p>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 bg-blue-600 rounded-full">{(movie as any).genre}</span>
              <span className="text-gray-300">{movie.release_date?.split('-')[0]}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Movie info below poster */}
      <div className="p-3 bg-white/5">
        <h3 className="font-bold text-sm text-white mb-2 leading-tight group-hover:text-indigo-200 transition-colors" title={movie.title}>
          {movie.title.length > 25 ? `${movie.title.substring(0, 25)}...` : movie.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-0.5 bg-indigo-500/20 text-indigo-100 rounded-md text-xs font-medium">
            {(movie as any).genre}
          </span>
          <span className="text-xs font-semibold text-indigo-200">{movie.release_date?.split('-')[0]}</span>
        </div>
      </div>
    </div>
  );
};
