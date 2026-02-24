import { useState } from 'react';
import { TmdbMovie } from '../lib';

export const useTmdbSearch = () => {
  const [tmdbResults, setTmdbResults] = useState<TmdbMovie[]>([]);
  const [showTmdbResults, setShowTmdbResults] = useState(false);
  const [isTmdbSearching, setIsTmdbSearching] = useState(false);
  const [addingMovieId, setAddingMovieId] = useState<number | null>(null);

  const searchTMDB = async (query: string) => {
    if (!query.trim()) {
      setTmdbResults([]);
      setShowTmdbResults(false);
      return;
    }

    setIsTmdbSearching(true);
    try {
      const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (response.ok) {
        setTmdbResults(data.results || []);
        setShowTmdbResults(true);
      } else {
        console.error('TMDB search failed:', data.error);
        setTmdbResults([]);
        setShowTmdbResults(false);
      }
    } catch (error) {
      console.error('Error searching TMDB:', error);
      setTmdbResults([]);
      setShowTmdbResults(false);
    } finally {
      setIsTmdbSearching(false);
    }
  };

  const addMovieFromTMDB = async (
    movieId: number,
    onSuccess?: () => void,
    onError?: (message: string) => void
  ) => {
    setAddingMovieId(movieId);
    try {
      const response = await fetch('/api/movies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess?.();
        // Remove from TMDB results
        setTmdbResults(prev => prev.filter(m => m.id !== movieId));
        if (tmdbResults.length <= 1) {
          setShowTmdbResults(false);
        }
      } else if (response.status === 409) {
        onError?.('Movie already exists in database');
      } else {
        onError?.(data.error || 'Failed to add movie');
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      onError?.('Error adding movie');
    } finally {
      setAddingMovieId(null);
    }
  };

  const clearTmdbResults = () => {
    setTmdbResults([]);
    setShowTmdbResults(false);
  };

  return {
    tmdbResults,
    showTmdbResults,
    isTmdbSearching,
    addingMovieId,
    searchTMDB,
    addMovieFromTMDB,
    clearTmdbResults,
  };
};
