import useSWR from 'swr';
import { Analytics, AppliedFilters } from '../lib/types';
import { fetcher } from '@/lib/fetcher';

export const useAnalytics = (appliedFilters: AppliedFilters) => {
  const url = `/api/analytics?startDate=${appliedFilters.startDate}&endDate=${appliedFilters.endDate}&dateMode=${appliedFilters.dateMode}`;
  
  const { data, error, isLoading, mutate } = useSWR<Analytics>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1 minute - prevent duplicate requests
      keepPreviousData: true, // Keep previous data while fetching new
    }
  );

  return { 
    analytics: data || null, 
    loading: isLoading,
    error,
    refetch: mutate,
  };
};
