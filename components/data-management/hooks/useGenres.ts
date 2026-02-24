import { useState, useEffect } from 'react';

export const useGenres = () => {
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/movies/genres');
      const data = await response.json();
      setAllGenres(data.genres || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setAllGenres([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return {
    allGenres,
    loading,
    refetch: fetchGenres,
  };
};
