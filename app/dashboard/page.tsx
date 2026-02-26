'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageTransition from '@/components/PageTransition';
import TransitionLink from '@/components/TransitionLink';
import {
  // Hooks
  useAnalytics,
  useDateFilter,
  useMovieModal,
  usePersonModal,
  useInfiniteScroll,
  useCollapsible,
  
  // Components
  CompactFilterBar,
  SummaryCards,
  LoadingState,
  EmptyState,
  MovieGrid,
  LazyChart,
  CollapsibleSection,
  
  // Utils
  processGenreData,
  processDateChartData,
  processRatingData,
  processGenrePerformanceData,
  
  // Types
  SortBy,
} from '@/components/dashboard';

// Dynamic imports for heavy chart components (code splitting)
const GenreDistributionChart = dynamic(
  () => import('@/components/dashboard/charts').then(mod => ({ default: mod.GenreDistributionChart })),
  { 
    loading: () => <ChartLoadingSkeleton />,
    ssr: false, // Charts don't need SSR
  }
);

const MoviesPerDateChart = dynamic(
  () => import('@/components/dashboard/charts').then(mod => ({ default: mod.MoviesPerDateChart })),
  { 
    loading: () => <ChartLoadingSkeleton />,
    ssr: false,
  }
);

const RatingDistributionChart = dynamic(
  () => import('@/components/dashboard/charts').then(mod => ({ default: mod.RatingDistributionChart })),
  { 
    loading: () => <ChartLoadingSkeleton />,
    ssr: false,
  }
);

const GenrePerformanceChart = dynamic(
  () => import('@/components/dashboard/charts').then(mod => ({ default: mod.GenrePerformanceChart })),
  { 
    loading: () => <ChartLoadingSkeleton />,
    ssr: false,
  }
);

// Dynamic import for modals (loaded on demand)
const DynamicMovieModal = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.MovieModal })),
  { ssr: false }
);

const DynamicPersonModal = dynamic(
  () => import('@/components/dashboard').then(mod => ({ default: mod.PersonModal })),
  { ssr: false }
);

// Chart loading skeleton component
const ChartLoadingSkeleton = () => (
  <div className="bg-slate-800/40 border border-white/15 rounded-2xl p-6 shadow-xl">
    <div className="animate-pulse">
      <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-white/5 rounded"></div>
    </div>
  </div>
);

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

  // Collapsible state for movie section
  const { isExpanded, toggle } = useCollapsible({
    storageKey: 'dashboard-movies-expanded',
    defaultExpanded: false,
  });

  // Infinite scroll hook - pass appliedFilters to trigger reset on filter change
  const {
    sortedMovies,
    displayedMovies,
    isLoadingMore,
    loadedImages,
    handleImageLoad,
  } = useInfiniteScroll(analytics?.movies, sortBy, appliedFilters);

  // Process data for charts
  const genreData = processGenreData(analytics);
  const dateChartData = processDateChartData(analytics);
  const ratingData = processRatingData(analytics);
  const genrePerformanceData = processGenrePerformanceData(analytics);

  const hasData = genreData.totalMovies > 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-10 lg:py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
            <p className="text-indigo-100/80 text-sm">Movie data insights and visualizations</p>
          </div>
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          >
            ← Back to Home
          </TransitionLink>
        </div>

        {/* Compact Filter Bar */}
        <CompactFilterBar
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
              <LazyChart>
                <GenreDistributionChart
                  data={genreData.pieChartData}
                  totalMovies={genreData.totalMovies}
                  otherGenresCount={genreData.otherGenres.length}
                />
              </LazyChart>
              
              <LazyChart>
                <MoviesPerDateChart
                  data={dateChartData}
                  dateMode={dateMode}
                />
              </LazyChart>
              
              <LazyChart>
                <RatingDistributionChart
                  data={ratingData}
                  movies={analytics?.movies || []}
                />
              </LazyChart>
              
              <LazyChart>
                <GenrePerformanceChart
                  data={genrePerformanceData}
                />
              </LazyChart>
            </div>

            {/* Movie Grid - Collapsible */}
            <CollapsibleSection
              title="Movies in Selected Period"
              count={sortedMovies.length}
              isExpanded={isExpanded}
              onToggle={toggle}
            >
              {isExpanded && (
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
              )}
            </CollapsibleSection>
          </>
        )}

        {/* Movie Modal */}
        <DynamicMovieModal
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
        <DynamicPersonModal
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
    </PageTransition>
  );
}
