import { useState, useEffect } from 'react';
import { Analytics, AppliedFilters } from '../lib/types';

export const useAnalytics = (appliedFilters: AppliedFilters) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [appliedFilters.startDate, appliedFilters.endDate, appliedFilters.dateMode]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics?startDate=${appliedFilters.startDate}&endDate=${appliedFilters.endDate}&dateMode=${appliedFilters.dateMode}`
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading, refetch: fetchAnalytics };
};
