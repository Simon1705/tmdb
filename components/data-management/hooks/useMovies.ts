import { useState, useEffect } from 'react';
import { Movie, Pagination, SortBy, SortOrder, DEFAULT_ITEMS_PER_PAGE, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from '../lib';

interface UseMoviesParams {
  search: string;
  genreFilter: string[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  currentPage?: number;
  itemsPerPage?: number;
}

export const useMovies = ({
  search,
  genreFilter,
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
  currentPage = 1,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: UseMoviesParams) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: DEFAULT_ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async (skipTmdbSearch = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder,
      });

      if (search) {
        params.append('search', search);
      }

      if (genreFilter.length > 0) {
        params.append('genre', genreFilter.join(','));
        console.log('Sending genre filter:', genreFilter.join(','));
      }

      const url = `/api/movies?${params}`;
      console.log('Fetching URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      setMovies(data.movies);
      setPagination(data.pagination);

      return { movies: data.movies, hasResults: data.movies.length > 0 };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch movies';
      setError(errorMessage);
      return { movies: [], hasResults: false };
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    return fetchMovies();
  };

  useEffect(() => {
    fetchMovies();
  }, [search, genreFilter, sortBy, sortOrder, currentPage, itemsPerPage]);

  return {
    movies,
    pagination,
    loading,
    error,
    refetch,
  };
};
