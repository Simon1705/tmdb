import { useState } from 'react';
import { MovieDetails } from '../lib/types';
import { MODAL_ANIMATION_DELAY } from '../lib/constants';

export const useMovieModal = () => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isLoadingFadingOut, setIsLoadingFadingOut] = useState(false);

  const fetchMovieDetails = async (apiId: number) => {
    setLoadingDetails(true);
    setIsLoadingFadingOut(false);
    setMovieDetails(null);
    try {
      const response = await fetch(`/api/movies/${apiId}/details`);
      if (response.ok) {
        const data = await response.json();
        setMovieDetails(data);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      // Start fade-out animation
      setIsLoadingFadingOut(true);
      // Wait for animation to complete before removing loading state
      setTimeout(() => {
        setLoadingDetails(false);
        setIsLoadingFadingOut(false);
      }, 300);
    }
  };

  const openMovieModal = async (movie: any) => {
    // If movie doesn't have complete data (from similar movies), fetch from TMDB
    if (!movie.backdrop_path || !movie.genre) {
      setIsModalOpen(true);
      setIsModalClosing(false);
      document.body.style.overflow = 'hidden';
      setLoadingDetails(true);
      
      setTimeout(() => {
        setIsModalMounted(true);
      }, 10);
      
      // Fetch complete movie data from TMDB via our API
      try {
        const response = await fetch(`/api/movies/tmdb/${movie.api_id || movie.id}`);
        if (response.ok) {
          const completeData = await response.json();
          setSelectedMovie(completeData);
          fetchMovieDetails(completeData.api_id);
        } else {
          // Fallback to incomplete data
          setSelectedMovie(movie);
          fetchMovieDetails(movie.api_id || movie.id);
        }
      } catch (error) {
        console.error('Error fetching complete movie data:', error);
        setSelectedMovie(movie);
        fetchMovieDetails(movie.api_id || movie.id);
      } finally {
        setLoadingDetails(false);
      }
    } else {
      setSelectedMovie(movie);
      setIsModalOpen(true);
      setIsModalClosing(false);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        setIsModalMounted(true);
      }, 10);
      fetchMovieDetails(movie.api_id);
    }
  };

  const switchMovie = async (movie: any) => {
    // Switch to new movie without closing modal
    setLoadingDetails(true);
    setMovieDetails(null);
    
    // If movie doesn't have complete data, fetch from TMDB
    if (!movie.backdrop_path || !movie.genre) {
      try {
        const response = await fetch(`/api/movies/tmdb/${movie.api_id || movie.id}`);
        if (response.ok) {
          const completeData = await response.json();
          setSelectedMovie(completeData);
          fetchMovieDetails(completeData.api_id);
        } else {
          setSelectedMovie(movie);
          fetchMovieDetails(movie.api_id || movie.id);
        }
      } catch (error) {
        console.error('Error fetching complete movie data:', error);
        setSelectedMovie(movie);
        fetchMovieDetails(movie.api_id || movie.id);
      } finally {
        setLoadingDetails(false);
      }
    } else {
      setSelectedMovie(movie);
      fetchMovieDetails(movie.api_id);
    }
  };

  const closeMovieModal = () => {
    setIsModalMounted(false);
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedMovie(null);
      setIsModalClosing(false);
      setMovieDetails(null);
      document.body.style.overflow = 'unset';
    }, MODAL_ANIMATION_DELAY);
  };

  return {
    selectedMovie,
    isModalOpen,
    isModalClosing,
    isModalMounted,
    movieDetails,
    loadingDetails,
    isLoadingFadingOut,
    openMovieModal,
    switchMovie,
    closeMovieModal,
  };
};
