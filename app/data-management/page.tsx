'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import SyncButton from '@/components/data-management/SyncButton';
import DeleteAllButton from '@/components/data-management/DeleteAllButton';
import {
  // Hooks
  useToast,
  useModal,
  useDebounce,
  useMovies,
  useTmdbSearch,
  useMovieActions,
  useGenres,
  usePosterZoom,
  // Components
  Toast,
  SearchBar,
  GenreFilter,
  Pagination,
  MovieTable,
  EmptyState,
  TmdbResults,
  MovieFormModal,
  DeleteConfirmModal,
  // Types
  Movie,
  SortBy,
  SortOrder,
  DEFAULT_ITEMS_PER_PAGE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
} from '@/components/data-management';
import { PosterZoomModal } from '@/components/data-management/PosterZoomModal';

export default function DataManagement() {
  // State
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT_ORDER);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);

  // Debounced search
  const debouncedSearch = useDebounce(search);

  // Custom hooks
  const { toast, showToast, hideToast } = useToast();
  const { allGenres, refetch: refetchGenres } = useGenres();
  const { isOpen: isPosterZoomOpen, posterData, openPosterZoom, closePosterZoom } = usePosterZoom();
  
  const { movies, pagination, loading, refetch: refetchMovies } = useMovies({
    search: debouncedSearch,
    genreFilter,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage,
  });

  const {
    tmdbResults,
    showTmdbResults,
    isTmdbSearching,
    addingMovieId,
    searchTMDB,
    addMovieFromTMDB,
    clearTmdbResults,
  } = useTmdbSearch();

  const {
    editingMovie,
    isSaving,
    isDeleting,
    startEdit,
    updateEditingMovie,
    cancelEdit,
    saveMovie,
    deleteMovie,
  } = useMovieActions(
    (message: string) => showToast(message, 'success'),
    (message: string) => showToast(message, 'error')
  );

  // Modal states
  const {
    showModal: showEditModal,
    isModalClosing: isEditModalClosing,
    isModalOpening: isEditModalOpening,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const {
    showModal: showDeleteModal,
    isModalClosing: isDeleteModalClosing,
    isModalOpening: isDeleteModalOpening,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  // Auto-search TMDB when no database results
  useEffect(() => {
    if (movies.length === 0 && debouncedSearch && !genreFilter.length && !loading) {
      searchTMDB(debouncedSearch);
    } else if (movies.length > 0) {
      clearTmdbResults();
    }
  }, [movies.length, debouncedSearch, genreFilter.length, loading]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, genreFilter]);

  // Handlers
  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const toggleGenre = (genre: string) => {
    setGenreFilter(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setGenreFilter([]);
    setCurrentPage(1);
  };

  const handleAddMovie = () => {
    startEdit();
    openEditModal();
  };

  const handleEditMovie = (movie: Movie) => {
    startEdit(movie);
    openEditModal();
  };

  const handleSaveMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success = await saveMovie();
    if (success) {
      closeEditModal();
      refetchMovies();
      refetchGenres();
    }
  };

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie);
    openDeleteModal();
  };

  const handleConfirmDelete = async () => {
    if (movieToDelete) {
      const success = await deleteMovie(movieToDelete.id);
      if (success) {
        closeDeleteModal();
        setMovieToDelete(null);
        refetchMovies();
        refetchGenres();
      }
    }
  };

  const handleAddFromTmdb = (movieId: number) => {
    addMovieFromTMDB(
      movieId,
      () => {
        showToast('Movie added successfully!', 'success');
        refetchMovies();
        refetchGenres();
      },
      (error) => showToast(error, 'error')
    );
  };

  const handleSyncComplete = () => {
    refetchMovies();
    refetchGenres();
  };

  const hasFilters = search !== '' || genreFilter.length > 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-10 lg:py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">Data Management</h1>
            <p className="text-indigo-100/80">Manage movie data with CRUD operations</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/15 text-white">
                {pagination.total} Movies
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-100">
                {allGenres.length} Genres
              </div>
            </div>
          </div>
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          >
            ← Back to Home
          </TransitionLink>
        </div>

        {/* Controls */}
        <div className="bg-white/5 rounded-2xl shadow-xl p-6 mb-6 border border-white/10 backdrop-blur overflow-visible relative z-20">
          {/* Search and Filter Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4 overflow-visible">
            <SearchBar
              search={search}
              debouncedSearch={debouncedSearch}
              isTmdbSearching={isTmdbSearching}
              onSearchChange={setSearch}
              onClear={() => setSearch('')}
            />
            
            <GenreFilter
              genres={allGenres}
              selectedGenres={genreFilter}
              showDropdown={showGenreDropdown}
              onToggleDropdown={() => setShowGenreDropdown(!showGenreDropdown)}
              onToggleGenre={toggleGenre}
            />
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <button
              onClick={handleAddMovie}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 font-medium cursor-pointer hover:-translate-y-0.5 active:scale-95"
              aria-label="Add new movie"
            >
              <Plus className="w-5 h-5" />
              Add Movie
            </button>
            
            <SyncButton onSyncComplete={handleSyncComplete} />
            
            <DeleteAllButton 
              totalMovies={pagination.total}
              onDeleteComplete={handleSyncComplete}
              onShowToast={showToast}
            />
            
            {hasFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/20 text-white rounded-full hover:bg-white/10 hover:border-white/40 transition-all font-medium shadow-sm cursor-pointer hover:-translate-y-0.5 active:scale-95 animate-fade-in"
                aria-label="Clear all filters"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
            
            <div className="ml-auto flex items-center gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="items-per-page" className="text-indigo-100/80 font-medium">Show:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                  className="px-3 py-2 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all bg-slate-800 text-white cursor-pointer hover:border-white/40 [&>option]:bg-slate-800 [&>option]:text-white"
                  aria-label="Items per page"
                >
                  <option value={5} className="bg-slate-800 text-white">5</option>
                  <option value={10} className="bg-slate-800 text-white">10</option>
                  <option value={20} className="bg-slate-800 text-white">20</option>
                  <option value={50} className="bg-slate-800 text-white">50</option>
                </select>
                <span className="text-indigo-100/80">per page</span>
              </div>

              {/* Total count */}
              <div className="flex items-center gap-2 text-sm text-indigo-100/80">
                <span className="font-medium">Total:</span>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full font-semibold border border-white/15">
                  {pagination.total} {pagination.total === 1 ? 'movie' : 'movies'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 rounded-2xl shadow-xl overflow-hidden border border-white/10 backdrop-blur relative z-10">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white/15 border-t-indigo-400 mb-4"></div>
              <p className="text-indigo-100 font-medium">Loading movies...</p>
            </div>
          ) : movies.length === 0 ? (
            <EmptyState
              hasFilters={hasFilters}
              onClearFilters={handleClearFilters}
              onAddMovie={handleAddMovie}
            />
          ) : (
            <MovieTable
              movies={movies}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onEdit={handleEditMovie}
              onDelete={handleDeleteClick}
              onPosterClick={openPosterZoom}
            />
          )}
        </div>

        {/* Pagination Navigation - Bottom */}
        {!loading && pagination.total > 0 && pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        {/* TMDB Results Section */}
        {showTmdbResults && (
          <TmdbResults
            results={tmdbResults}
            addingMovieId={addingMovieId}
            onAddMovie={handleAddFromTmdb}
          />
        )}
      </div>

      {/* Modals */}
      <MovieFormModal
        movie={editingMovie}
        isOpen={showEditModal}
        isClosing={isEditModalClosing}
        isOpening={isEditModalOpening}
        isSaving={isSaving}
        onClose={() => {
          closeEditModal();
          cancelEdit();
        }}
        onSave={handleSaveMovie}
        onChange={updateEditingMovie}
      />

      <DeleteConfirmModal
        movie={movieToDelete}
        isOpen={showDeleteModal}
        isClosing={isDeleteModalClosing}
        isOpening={isDeleteModalOpening}
        isDeleting={isDeleting}
        onClose={() => {
          closeDeleteModal();
          setMovieToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />

      {/* Poster Zoom Modal */}
      <PosterZoomModal
        isOpen={isPosterZoomOpen}
        onClose={closePosterZoom}
        posterUrl={posterData.posterUrl}
        title={posterData.title}
      />
      </div>
    </PageTransition>
  );
}
