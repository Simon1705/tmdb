# Custom Hooks Explanation

Dokumentasi lengkap tentang fungsi setiap custom hook di project ini.

---

## 📊 DASHBOARD HOOKS

### 1. useAnalytics
**File:** `components/dashboard/hooks/useAnalytics.ts`

**Fungsi:** Fetch dan cache data analytics dari API

**What it does:**
- Fetch data movies berdasarkan filter (startDate, endDate, dateMode)
- Cache data dengan SWR (60s cache, 120s stale)
- Process data untuk summary stats (total movies, avg rating, top genre)
- Return loading state dan error handling

**Usage:**
```typescript
const { analytics, loading } = useAnalytics(appliedFilters);
// analytics.summary.totalMovies
// analytics.movies[]
```

**Why needed:** Centralize data fetching logic, automatic caching, reusable across components

---

### 2. useDateFilter
**File:** `components/dashboard/hooks/useDateFilter.ts`

**Fungsi:** Manage state untuk date range filter

**What it does:**
- Track startDate, endDate, dateMode (synced/release)
- Track appliedFilters (yang sudah di-apply)
- Detect quick presets (Today, Last 30 Days, etc.)
- Validate date range (start tidak boleh > end)
- Track dirty state (ada perubahan belum di-apply)

**Usage:**
```typescript
const {
  startDate,
  endDate,
  appliedFilters,
  isFilterDirty,
  applyFilters,
  handleQuickSelect
} = useDateFilter();
```

**Why needed:** Complex filter logic, multiple states, validation, preset detection

---

### 3. useMovieModal
**File:** `components/dashboard/hooks/useMovieModal.ts`

**Fungsi:** Manage state untuk movie detail modal

**What it does:**
- Track selected movie
- Fetch movie details dari API (cast, crew, etc.)
- Handle modal open/close dengan animation states
- Switch between movies tanpa close modal
- Loading states dengan fade transitions

**Usage:**
```typescript
const {
  selectedMovie,
  isModalOpen,
  movieDetails,
  openMovieModal,
  closeMovieModal,
  switchMovie
} = useMovieModal();
```

**Why needed:** Complex modal logic, API fetching, animation states, movie switching

---

### 4. usePersonModal
**File:** `components/dashboard/hooks/usePersonModal.ts`

**Fungsi:** Manage state untuk person (actor/director) detail modal

**What it does:**
- Track selected person
- Fetch person details dari TMDB API
- Handle modal open/close
- Loading states

**Usage:**
```typescript
const {
  selectedPerson,
  isPersonModalOpen,
  personDetails,
  openPersonModal,
  closePersonModal
} = usePersonModal();
```

**Why needed:** Similar to useMovieModal, tapi untuk person data

---

### 5. useInfiniteScroll
**File:** `components/dashboard/hooks/useInfiniteScroll.ts`

**Fungsi:** Implement infinite scroll pagination untuk movie grid

**What it does:**
- Sort movies berdasarkan sortBy (rating, popularity, title, date)
- Track displayed movies count (start 20, load 20 more)
- Detect scroll position dengan scroll event listener
- Track loaded images untuk skeleton states
- Reset saat filter/sort berubah

**Usage:**
```typescript
const {
  sortedMovies,
  displayedMovies,
  isLoadingMore,
  loadedImages,
  handleImageLoad
} = useInfiniteScroll(movies, sortBy, appliedFilters);
```

**Why needed:** Performance optimization, better UX, handle large datasets

---

### 6. useIntersectionObserver
**File:** `components/dashboard/hooks/useIntersectionObserver.ts`

**Fungsi:** Detect when element is visible in viewport

**What it does:**
- Use Intersection Observer API
- Track visibility state
- Track "has been visible" untuk triggerOnce
- Configurable threshold dan rootMargin

**Usage:**
```typescript
const { elementRef, isVisible, hasBeenVisible } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: '100px',
  triggerOnce: true
});
```

**Why needed:** Lazy loading charts, performance optimization, load on demand

---

### 7. useCollapsible
**File:** `components/dashboard/hooks/useCollapsible.ts`

**Fungsi:** Manage collapsible section state dengan localStorage persistence

**What it does:**
- Track expanded/collapsed state
- Save state ke localStorage
- Load state dari localStorage on mount
- Animation state tracking

**Usage:**
```typescript
const { isExpanded, toggle } = useCollapsible({
  storageKey: 'dashboard-movies-expanded',
  defaultExpanded: false
});
```

**Why needed:** Persist user preference, reusable collapsible logic

---

## 📝 DATA MANAGEMENT HOOKS

### 8. useMovies
**File:** `components/data-management/hooks/useMovies.ts`

**Fungsi:** Fetch dan cache movies list untuk data management page

**What it does:**
- Fetch movies dengan pagination, search, filter, sort
- Cache dengan SWR (30s cache)
- Build query params dari filters
- Return movies, total count, loading state

**Usage:**
```typescript
const { movies, totalMovies, loading } = useMovies({
  page,
  search: debouncedSearch,
  genre: selectedGenre,
  sortBy,
  sortOrder
});
```

**Why needed:** Centralize data fetching, automatic caching, query building

---

### 9. useGenres
**File:** `components/data-management/hooks/useGenres.ts`

**Fungsi:** Fetch dan cache genre list

**What it does:**
- Fetch unique genres dari database
- Cache dengan SWR (5min cache)
- Return genres array dan loading state

**Usage:**
```typescript
const { genres, loading } = useGenres();
```

**Why needed:** Reusable genre fetching, long cache (genres jarang berubah)

---

### 10. useDebounce
**File:** `components/data-management/hooks/useDebounce.ts`

**Fungsi:** Debounce value untuk optimize search input

**What it does:**
- Delay update value sampai user berhenti mengetik
- Clear timeout saat value berubah lagi
- Return debounced value

**Usage:**
```typescript
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);
// Use debouncedSearch untuk API call
```

**Why needed:** Reduce API calls, better performance, better UX

---

### 11. useModal
**File:** `components/data-management/hooks/useModal.ts`

**Fungsi:** Generic modal state management

**What it does:**
- Track modal open/close state
- Track selected item (movie untuk edit)
- Open/close functions

**Usage:**
```typescript
const { isOpen, selectedItem, openModal, closeModal } = useModal<Movie>();
```

**Why needed:** Reusable modal logic, type-safe

---

### 12. useMovieActions
**File:** `components/data-management/hooks/useMovieActions.ts`

**Fungsi:** Handle CRUD operations untuk movies

**What it does:**
- Add movie (POST /api/movies/add)
- Update movie (PUT /api/movies/[id])
- Delete movie (DELETE /api/movies/[id])
- Mutate SWR cache setelah action
- Show toast notifications
- Error handling

**Usage:**
```typescript
const { addMovie, updateMovie, deleteMovie, loading } = useMovieActions();
```

**Why needed:** Centralize CRUD logic, cache invalidation, error handling

---

### 13. useTmdbSearch
**File:** `components/data-management/hooks/useTmdbSearch.ts`

**Fungsi:** Search movies dari TMDB API

**What it does:**
- Search movies by query
- Debounce search input
- Return search results
- Loading state

**Usage:**
```typescript
const { results, loading, searchMovies } = useTmdbSearch();
```

**Why needed:** External API integration, debounced search

---

### 14. usePosterZoom
**File:** `components/data-management/hooks/usePosterZoom.ts`

**Fungsi:** Manage poster zoom modal state

**What it does:**
- Track modal open/close
- Track poster URL dan title
- Open/close functions

**Usage:**
```typescript
const { isOpen, posterUrl, title, openZoom, closeZoom } = usePosterZoom();
```

**Why needed:** Reusable zoom modal logic

---

### 15. useToast
**File:** `components/data-management/hooks/useToast.ts`

**Fungsi:** Manage toast notification state

**What it does:**
- Show toast dengan message dan type (success/error)
- Auto-hide setelah 3 detik
- Track visibility state

**Usage:**
```typescript
const { toast, showToast, hideToast } = useToast();
showToast('Movie added!', 'success');
```

**Why needed:** Centralize notification logic, auto-hide, reusable

---

## 🎯 WHY USE CUSTOM HOOKS?

### Benefits:

**1. Reusability**
- Logic bisa dipakai di multiple components
- DRY principle (Don't Repeat Yourself)

**2. Separation of Concerns**
- Business logic terpisah dari UI
- Easier to test
- Easier to maintain

**3. Cleaner Components**
- Components fokus ke rendering
- Logic di hooks
- More readable code

**4. State Management**
- No need Redux/Zustand untuk simple state
- Hooks cukup untuk local state
- Composable

**5. Performance**
- Caching dengan SWR
- Debouncing
- Lazy loading
- Optimized re-renders

---

## 📊 HOOK CATEGORIES

### Data Fetching (5 hooks)
- useAnalytics
- useMovies
- useGenres
- useTmdbSearch
- (useMovieModal & usePersonModal juga fetch data)

### State Management (6 hooks)
- useDateFilter
- useModal
- useCollapsible
- usePosterZoom
- useToast
- useInfiniteScroll

### UI Behavior (2 hooks)
- useIntersectionObserver
- useDebounce

### CRUD Operations (1 hook)
- useMovieActions

### Modal Management (2 hooks)
- useMovieModal
- usePersonModal

---

## 💡 BEST PRACTICES

### When to Create Custom Hook:

✅ **DO create hook when:**
- Logic dipakai di 2+ components
- Complex state management
- Side effects (API calls, subscriptions)
- Reusable behavior (debounce, intersection observer)

❌ **DON'T create hook when:**
- Simple useState yang cuma dipakai 1 component
- No reusability
- Over-engineering

### Naming Convention:
- Always start with `use` (React rule)
- Descriptive name (useMovies, not useData)
- Verb-based (useDebounce, useFetch)

### Hook Composition:
Hooks bisa pakai hooks lain:
```typescript
function useMovies() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // ✅
  // ...
}
```

---

## 🎓 INTERVIEW TALKING POINTS

**Q: Kenapa pakai custom hooks?**
A: "Untuk reusability, separation of concerns, dan cleaner code. Misalnya `useDebounce` saya pakai di search untuk reduce API calls, `useInfiniteScroll` untuk pagination, dan `useAnalytics` untuk data fetching dengan caching."

**Q: Apa bedanya dengan Redux?**
A: "Custom hooks cukup untuk local state dan simple global state. Redux overkill untuk project ini. Hooks lebih lightweight, easier to understand, dan cukup powerful dengan SWR untuk caching."

**Q: Bagaimana handle complex state?**
A: "Saya combine multiple hooks. Contoh: `useDateFilter` handle filter state, `useAnalytics` fetch data, `useInfiniteScroll` handle pagination. Each hook has single responsibility."

---

**Total Custom Hooks:** 15  
**Lines of Code Saved:** ~2000+ (estimated)  
**Reusability:** High  
**Maintainability:** Excellent  

Last Updated: February 2026
