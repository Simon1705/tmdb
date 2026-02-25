import useSWR from 'swr';
import { Movie, Pagination, SortBy, SortOrder, DEFAULT_ITEMS_PER_PAGE, DEFAULT_SORT_BY, DEFAULT_SORT_ORDER } from '../lib';
import { fetcher } from '@/lib/fetcher';

interface UseMoviesParams {
  search: string;
  genreFilter: string[];
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  currentPage?: number;
  itemsPerPage?: number;
}

interface MoviesResponse {
  movies: Movie[];
  pagination: Pagination;
}

export const useMovies = ({
  search,
  genreFilter,
  sortBy = DEFAULT_SORT_BY,
  sortOrder = DEFAULT_SORT_ORDER,
  currentPage = 1,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: UseMoviesParams) => {
  // Build URL with params
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
  }

  const url = `/api/movies?${params}`;

  const { data, error, isLoading, mutate } = useSWR<MoviesResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30 seconds
      keepPreviousData: true,
    }
  );

  return {
    movies: data?.movies || [],
    pagination: data?.pagination || {
      page: 1,
      limit: DEFAULT_ITEMS_PER_PAGE,
      total: 0,
      totalPages: 0,
    },
    loading: isLoading,
    error: error?.message || null,
    refetch: mutate,
  };
};
