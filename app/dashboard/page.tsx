'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  // Hooks
  useAnalytics,
  useDateFilter,
  useMovieModal,
  usePersonModal,
  useInfiniteScroll,
  
  // Components
  DateFilter,
  SummaryCards,
  ActiveFilterInfo,
  LoadingState,
  EmptyState,
  MovieGrid,
  MovieModal,
  PersonModal,
  
  // Charts
  GenreDistributionChart,
  MoviesPerDateChart,
  RatingDistributionChart,
  GenrePerformanceChart,
  
  // Utils
  processGenreData,
  processDateChartData,
  processRatingData,
  processGenrePerformanceData,
  
  // Types
  SortBy,
} from '@/components/dashboard';

export default function Dashboard() {
  // Date filter hook
  const {
    startDate,
    endDate,
    dateMode,
    appliedFilters,
    quickPreset,
    isDateRangeInvalid,
    isFilterDirty,
    setStartDate,
    setEndDate,
    setDateMode,
    applyFilters,
    resetFilters,
    handleQuickSelect,
  } = useDateFilter();

  // Analytics data hook
  const { analytics, loading } = useAnalytics(appliedFilters);

  // Movie modal hook
  const {
    selectedMovie,
    isModalOpen,
    isModalMounted,
    movieDetails,
    loadingDetails,
    isLoadingFadingOut,
    openMovieModal,
    switchMovie,
    closeMovieModal,
  } = useMovieModal();

  // Person modal hook
  const {
    selectedPerson,
    isPersonModalOpen,
    personDetails,
    loadingPerson,
    openPersonModal,
    closePersonModal,
  } = usePersonModal();

  // Sort state
  const [sortBy, setSortBy] = useState<SortBy>('rating');

  // Infinite scroll hook
  const {
    sortedMovies,
    displayedMovies,
    isLoadingMore,
    loadedImages,
    handleImageLoad,
  } = useInfiniteScroll(analytics?.movies, sortBy);

  // Process data for charts
  const genreData = processGenreData(analytics);
  const dateChartData = processDateChartData(analytics);
  const ratingData = processRatingData(analytics);
  const genrePerformanceData = processGenrePerformanceData(analytics);

  const hasData = genreData.totalMovies > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-10 lg:py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
            <p className="text-indigo-100/80 text-sm">Movie data insights and visualizations</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Date Filter */}
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          dateMode={dateMode}
          quickPreset={quickPreset}
          isDateRangeInvalid={isDateRangeInvalid}
          isFilterDirty={isFilterDirty}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onDateModeChange={setDateMode}
          onApplyFilter={applyFilters}
          onResetToLastMonth={resetFilters}
          onQuickSelect={handleQuickSelect}
        />

        {/* Active Filter Info */}
        <ActiveFilterInfo
          startDate={appliedFilters.startDate}
          endDate={appliedFilters.endDate}
          dateMode={appliedFilters.dateMode}
        />

        {/* Summary Cards */}
        <SummaryCards analytics={analytics} loading={loading} />

        {/* Charts */}
        {loading ? (
          <LoadingState />
        ) : !hasData ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              <GenreDistributionChart
                data={genreData.pieChartData}
                totalMovies={genreData.totalMovies}
                otherGenresCount={genreData.otherGenres.length}
              />
              
              <MoviesPerDateChart
                data={dateChartData}
                dateMode={dateMode}
              />
              
              <RatingDistributionChart
                data={ratingData}
                movies={analytics?.movies || []}
              />
              
              <GenrePerformanceChart
                data={genrePerformanceData}
              />
            </div>

            {/* Movie Grid */}
            <MovieGrid
              movies={sortedMovies}
              sortBy={sortBy}
              displayedMovies={displayedMovies}
              isLoadingMore={isLoadingMore}
              loadedImages={loadedImages}
              onSortChange={setSortBy}
              onImageLoad={handleImageLoad}
              onMovieClick={openMovieModal}
            />
          </>
        )}

        {/* Movie Modal */}
        <MovieModal
          movie={selectedMovie}
          movieDetails={movieDetails}
          isOpen={isModalOpen}
          isMounted={isModalMounted}
          isLoading={loadingDetails}
          isLoadingFadingOut={isLoadingFadingOut}
          onClose={closeMovieModal}
          onPersonClick={openPersonModal}
          onMovieClick={switchMovie}
        />

        {/* Person Modal */}
        <PersonModal
          person={selectedPerson}
          personDetails={personDetails}
          isOpen={isPersonModalOpen}
          isLoading={loadingPerson}
          onClose={closePersonModal}
          onMovieClick={(movie) => {
            closePersonModal();
            setTimeout(() => openMovieModal(movie), 300);
          }}
        />
      </div>
    </div>
  );
}
