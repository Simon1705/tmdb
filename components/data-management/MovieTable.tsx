import { Edit, Trash2, ArrowUpDown, Film } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { getPosterUrl } from '@/lib/tmdb';
import { Movie, SortBy, SortOrder } from './lib';

interface MovieTableProps {
  movies: Movie[];
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSort: (column: SortBy) => void;
  onEdit: (movie: Movie) => void;
  onDelete: (movie: Movie) => void;
}

export const MovieTable = ({
  movies,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: MovieTableProps) => {
  const SortButton = ({ column, label }: { column: SortBy; label: string }) => (
    <button
      onClick={() => onSort(column)}
      className="flex items-center gap-2 font-semibold text-indigo-100/90 hover:text-white transition-colors group"
    >
      {label}
      <ArrowUpDown className="w-4 h-4 opacity-60 group-hover:opacity-100" />
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-indigo-100/90">
              Poster
            </th>
            <th className="px-6 py-4 text-left">
              <SortButton column="title" label="Title" />
            </th>
            <th className="px-6 py-4 text-left">
              <SortButton column="release_date" label="Release Date" />
            </th>
            <th className="px-6 py-4 text-left">
              <SortButton column="genre" label="Genre" />
            </th>
            <th className="px-6 py-4 text-left">
              <SortButton column="vote_average" label="Rating" />
            </th>
            <th className="px-6 py-4 text-left">
              <SortButton column="updated_at" label="Last Updated" />
            </th>
            <th className="px-6 py-4 text-right font-semibold text-indigo-100/90">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {movies.map((movie) => (
            <tr key={movie.id} className="hover:bg-white/5 transition-all duration-200 group">
              <td className="px-6 py-4">
                <div className="relative w-16 h-24 rounded-lg overflow-hidden shadow-md bg-white/10 group-hover:shadow-lg transition-shadow duration-200">
                  {movie.poster_path ? (
                    <Image
                      src={getPosterUrl(movie.poster_path, 'w185')}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/20">
                      <Film className="w-8 h-8 text-indigo-200" />
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-white group-hover:text-indigo-200 transition-colors">{movie.title}</div>
              </td>
              <td className="px-6 py-4 text-indigo-100/80">
                {format(new Date(movie.release_date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-100 rounded-full text-sm font-medium group-hover:bg-indigo-500/30 transition-all">
                  {movie.genre}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1 text-white">
                  <span className="text-amber-400">⭐</span>
                  <span className="font-semibold">
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-indigo-100/80 text-sm">
                {format(new Date(movie.updated_at), 'MMM dd, yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(movie)}
                    className="p-2 text-indigo-200 hover:bg-white/10 rounded-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
                    title="Edit movie"
                    aria-label={`Edit ${movie.title}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(movie)}
                    className="p-2 text-red-300 hover:bg-white/10 rounded-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
                    title="Delete movie"
                    aria-label={`Delete ${movie.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
