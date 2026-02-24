import { useState } from 'react';
import { Movie } from '../lib';

export const useMovieActions = (
  onSuccess?: (message: string) => void,
  onError?: (message: string) => void
) => {
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const startEdit = (movie?: Movie) => {
    if (movie) {
      setEditingMovie(movie);
    } else {
      // New movie
      setEditingMovie({
        api_id: Math.floor(Math.random() * 1000000000),
        title: '',
        release_date: '',
        genre: '',
        overview: '',
        vote_average: 0,
      });
    }
  };

  const updateEditingMovie = (updates: Partial<Movie>) => {
    setEditingMovie(prev => prev ? { ...prev, ...updates } : null);
  };

  const cancelEdit = () => {
    setEditingMovie(null);
    setIsSaving(false);
  };

  const saveMovie = async () => {
    if (!editingMovie || isSaving) return false;

    setIsSaving(true);
    try {
      const method = editingMovie.id ? 'PUT' : 'POST';
      const url = editingMovie.id ? `/api/movies/${editingMovie.id}` : '/api/movies';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMovie),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onSuccess?.(
          editingMovie.id ? 'Movie updated successfully!' : 'Movie added successfully!'
        );
        setEditingMovie(null);
        return true;
      } else {
        onError?.(`Failed to save movie: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error saving movie:', error);
      onError?.(`Error saving movie: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteMovie = async (id: string) => {
    if (isDeleting) return false;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      const data = await response.json();
      
      if (response.ok) {
        onSuccess?.('Movie deleted successfully!');
        return true;
      } else {
        onError?.(`Failed to delete movie: ${data.error || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      onError?.(`Error deleting movie: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    editingMovie,
    isSaving,
    isDeleting,
    startEdit,
    updateEditingMovie,
    cancelEdit,
    saveMovie,
    deleteMovie,
  };
};
