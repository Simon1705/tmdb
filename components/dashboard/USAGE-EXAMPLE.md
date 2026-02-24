# Dashboard Components Usage Example

## Cara Menggunakan Komponen Dashboard yang Sudah Di-refactor

### 1. Import Components dan Hooks

```typescript
'use client';

import {
  // Hooks
  useAnalytics,
  useDateFilter,
  
  // Components
  DateFilter,
  SummaryCards,
  ActiveFilterInfo,
  LoadingState,
  EmptyState,
  
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
} from '@/components/dashboard';
```

### 2. Setup State dengan Custom Hooks

```typescript
export default function Dashboard() {
  // Date filter hook
  const {
    startDate,
    endDate,
    dateMode,
    appliedFilters,
    isDateRangeInvalid,
    isFilterDirty,
    setStartDate,
    setEndDate,
    setDateMode,
    applyFilters,
    resetFilters,
  } = useDateFilter();

  // Analytics data hook
  const { analytics, loading } = useAnalytics(appliedFilters);

  // Process data for charts
  const genreData = processGenreData(analytics);
  const dateChartData = processDateChartData(analytics);
  const ratingData = processRatingData(analytics);
  const genrePerformanceData = processGenrePerformanceData(analytics);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <h1 className="text-3xl font-semibold mb-8">Analytics Dashboard</h1>

        {/* Date Filter */}
        <DateFilter
          startDate={startDate}
          endDate={endDate}
          dateMode={dateMode}
          isDateRangeInvalid={isDateRangeInvalid}
          isFilterDirty={isFilterDirty}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onDateModeChange={setDateMode}
          onApplyFilter={applyFilters}
          onResetToLastMonth={resetFilters}
          onQuickSelect={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            applyFilters();
          }}
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
        ) : !analytics || genreData.totalMovies === 0 ? (
          <EmptyState />
        ) : (
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
              movies={analytics.movies}
            />
            
            <GenrePerformanceChart
              data={genrePerformanceData}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3. Keuntungan Menggunakan Komponen Ini

1. **Separation of Concerns** - Setiap komponen punya tanggung jawab yang jelas
2. **Reusable** - Komponen bisa digunakan di halaman lain
3. **Type Safe** - Semua props dan data sudah di-type dengan TypeScript
4. **Easy to Test** - Komponen kecil lebih mudah di-test
5. **Easy to Maintain** - Perubahan di satu komponen tidak affect yang lain

### 4. File Structure

```
components/dashboard/
├── index.ts                    # Main export file
├── types.ts                    # TypeScript types
├── constants.ts                # Constants
├── utils.ts                    # Helper functions
├── tooltips.tsx               # Chart tooltips
├── DateFilter.tsx             # Date filter component
├── SummaryCards.tsx           # Summary cards
├── ActiveFilterInfo.tsx       # Active filter display
├── LoadingState.tsx           # Loading skeleton
├── EmptyState.tsx             # Empty state
├── hooks/
│   ├── useAnalytics.ts        # Analytics data hook
│   ├── useDateFilter.ts       # Date filter hook
│   ├── useMovieModal.ts       # Movie modal hook
│   ├── usePersonModal.ts      # Person modal hook
│   └── useInfiniteScroll.ts   # Infinite scroll hook
└── charts/
    ├── index.ts
    ├── GenreDistributionChart.tsx
    ├── MoviesPerDateChart.tsx
    ├── RatingDistributionChart.tsx
    └── GenrePerformanceChart.tsx
```

### 5. Next Steps

Untuk menyelesaikan refactoring:
1. Buat movie display components (MovieGrid, MovieCard)
2. Buat modal components (MovieModal, PersonModal)
3. Update main dashboard page untuk menggunakan semua komponen baru
