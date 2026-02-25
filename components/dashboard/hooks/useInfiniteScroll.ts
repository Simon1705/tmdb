import { useState, useEffect } from 'react';
import { Movie, SortBy, AppliedFilters } from '../lib/types';
import { INITIAL_DISPLAYED_MOVIES, LOAD_MORE_MOVIES_COUNT, SCROLL_THRESHOLD, LOAD_MORE_DELAY } from '../lib/constants';

export const useInfiniteScroll = (
  movies: Movie[] | undefined, 
  sortBy: SortBy,
  appliedFilters?: AppliedFilters
) => {
  const [displayedMovies, setDisplayedMovies] = useState(INITIAL_DISPLAYED_MOVIES);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Reset when movies, sort, or filters change
  useEffect(() => {
    setDisplayedMovies(INITIAL_DISPLAYED_MOVIES);
    setLoadedImages(new Set());
  }, [movies, sortBy, appliedFilters?.startDate, appliedFilters?.endDate, appliedFilters?.dateMode]);

  const getSortedMovies = () => {
    if (!movies) return [];
    
    const moviesCopy = [...movies];
    
    switch (sortBy) {
      case 'rating':
        return moviesCopy.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'popularity':
        return moviesCopy.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case 'title':
        return moviesCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'date':
        return moviesCopy.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
      default:
        return moviesCopy;
    }
  };

  const sortedMovies = getSortedMovies();

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !movies) return;
      
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - SCROLL_THRESHOLD;
      
      if (scrollPosition >= bottomPosition && displayedMovies < sortedMovies.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setDisplayedMovies(prev => Math.min(prev + LOAD_MORE_MOVIES_COUNT, sortedMovies.length));
          setIsLoadingMore(false);
        }, LOAD_MORE_DELAY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedMovies, movies, isLoadingMore, sortBy]);

  const handleImageLoad = (movieId: string) => {
    setLoadedImages(prev => new Set(prev).add(movieId));
  };

  return {
    sortedMovies,
    displayedMovies,
    isLoadingMore,
    loadedImages,
    handleImageLoad,
  };
};
