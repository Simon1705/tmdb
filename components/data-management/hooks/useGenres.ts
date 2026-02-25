import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface GenresResponse {
  genres: string[];
}

export const useGenres = () => {
  const { data, error, isLoading, mutate } = useSWR<GenresResponse>(
    '/api/movies/genres',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 300000, // 5 minutes - genres rarely change
      revalidateIfStale: false, // Don't revalidate unless manually triggered
    }
  );

  return {
    allGenres: data?.genres || [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
};
