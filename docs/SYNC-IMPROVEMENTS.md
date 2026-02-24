# Sync Improvements Documentation

## Problem Statement

### Issue 1: Incorrect Record Counting
Ketika sync dilakukan kedua kali, sistem menghitung semua 60 records sebagai "created" padahal seharusnya "updated" karena data sudah ada.

**Root Cause:**
- Logika `data.created_at === data.updated_at` tidak reliable
- Supabase upsert tidak selalu return data yang akurat untuk pengecekan
- Trigger `updated_at` bisa membuat timestamp berbeda

### Issue 2: Data Duplication
Setiap sync selalu fetch 60 movies yang sama (popular movies page 1-3), sehingga tidak ada data baru yang masuk.

**Root Cause:**
- Hanya fetch dari endpoint `/movie/popular`
- Popular movies relatif statis (tidak berubah sering)
- Tidak ada variasi dalam data source

## Solutions Implemented

### Solution 1: Pre-check Existing Records

**Before:**
```typescript
const { data, error } = await supabase
  .from('movies')
  .upsert(movieData, { onConflict: 'api_id' })
  .select('created_at, updated_at')
  .single();

if (data.created_at === data.updated_at) {
  recordsCreated++;
} else {
  recordsUpdated++;
}
```

**After:**
```typescript
// Get existing movie api_ids BEFORE sync
const { data: existingMovies } = await supabase
  .from('movies')
  .select('api_id');

const existingApiIds = new Set(existingMovies?.map(m => m.api_id) || []);

// During sync
const isExisting = existingApiIds.has(movie.id);

const { error } = await supabase
  .from('movies')
  .upsert(movieData, { onConflict: 'api_id' });

if (isExisting) {
  recordsUpdated++;
} else {
  recordsCreated++;
  existingApiIds.add(movie.id); // Prevent double counting
}
```

**Benefits:**
- ✅ Accurate counting of created vs updated records
- ✅ No dependency on timestamp comparison
- ✅ Prevents double counting if movie appears in multiple categories
- ✅ More efficient (no need to select created_at/updated_at)

### Solution 2: Multiple Data Sources

**Before:**
```typescript
// Only fetch from popular movies (3 pages)
for (let page = 1; page <= 3; page++) {
  const movies = await fetchPopularMovies(page);
  // Process movies...
}
```

**After:**
```typescript
// Fetch from 4 different categories (1 page each)
const fetchFunctions = [
  { fn: fetchPopularMovies, name: 'Popular' },
  { fn: fetchTopRatedMovies, name: 'Top Rated' },
  { fn: fetchNowPlayingMovies, name: 'Now Playing' },
  { fn: fetchUpcomingMovies, name: 'Upcoming' },
];

for (const { fn, name } of fetchFunctions) {
  const movies = await fn(1);
  // Process movies...
}
```

**New TMDB Functions Added:**
1. `fetchPopularMovies()` - Most popular movies
2. `fetchTopRatedMovies()` - Highest rated movies
3. `fetchNowPlayingMovies()` - Currently in theaters
4. `fetchUpcomingMovies()` - Coming soon

**Benefits:**
- ✅ More variety in data (4 categories vs 1)
- ✅ ~80 unique movies per sync (vs 60 duplicates)
- ✅ Better representation of different movie types
- ✅ More interesting data for analytics
- ✅ Each sync brings potentially new data

## Technical Details

### Data Flow

```
1. Fetch existing api_ids from database
   ↓
2. Create Set for O(1) lookup
   ↓
3. For each category (Popular, Top Rated, Now Playing, Upcoming):
   ↓
   3a. Fetch movies from TMDB API
   ↓
   3b. For each movie:
       - Check if api_id exists in Set
       - Upsert to database
       - Count as created or updated
       - Add to Set if new (prevent double counting)
   ↓
4. Log sync results to sync_logs table
```

### Error Handling

**Improved:**
- Try-catch per category (one failure doesn't stop others)
- Detailed error logging with category name
- Graceful degradation

```typescript
for (const { fn, name } of fetchFunctions) {
  try {
    const movies = await fn(1);
    // Process...
  } catch (error) {
    console.error(`Error fetching ${name} movies:`, error);
    // Continue with other categories
  }
}
```

## Performance Considerations

### Before:
- 3 API calls to TMDB (3 pages of popular)
- 60 database upserts with SELECT
- ~60 duplicate checks via timestamp

### After:
- 1 initial SELECT to get existing api_ids
- 4 API calls to TMDB (4 categories)
- ~80 database upserts (no SELECT needed)
- O(1) duplicate checks via Set

**Result:** Similar performance, better data quality

## Testing Scenarios

### Scenario 1: First Sync (Empty Database)
```
Expected:
- Fetched: ~80 movies
- Created: ~80 movies
- Updated: 0 movies
```

### Scenario 2: Second Sync (Same Day)
```
Expected:
- Fetched: ~80 movies
- Created: 0-10 movies (new entries in categories)
- Updated: ~70-80 movies (existing movies)
```

### Scenario 3: Sync After 1 Week
```
Expected:
- Fetched: ~80 movies
- Created: ~20-30 movies (new popular/upcoming movies)
- Updated: ~50-60 movies (still popular movies)
```

## API Endpoints Used

### TMDB API Endpoints:
1. `/movie/popular` - Popular movies
2. `/movie/top_rated` - Top rated movies
3. `/movie/now_playing` - Currently in theaters
4. `/movie/upcoming` - Coming soon

All endpoints support pagination and return ~20 movies per page.

## Database Impact

### Before:
- 60 records after first sync
- 60 records after second sync (no growth)
- All records from same category

### After:
- ~80 unique records after first sync
- ~80-90 records after second sync (some growth)
- Diverse records from 4 categories

## Future Enhancements

### Potential Improvements:
1. **Incremental Sync**: Only fetch movies released after last sync
2. **Smart Pagination**: Fetch more pages if many new records found
3. **Category Selection**: Let user choose which categories to sync
4. **Scheduled Sync**: Auto-sync daily/weekly
5. **Sync History**: Show detailed sync logs in UI
6. **Conflict Resolution**: Handle rating/popularity changes
7. **Batch Processing**: Process movies in batches for better performance

### Advanced Features:
1. **Delta Sync**: Only update changed fields
2. **Webhook Integration**: Real-time updates from TMDB
3. **Multi-language Support**: Fetch movies in different languages
4. **Genre-based Sync**: Fetch by specific genres
5. **Date Range Sync**: Fetch movies from specific time period

## Monitoring

### Metrics to Track:
- Average sync duration
- Success/failure rate
- New records per sync
- Updated records per sync
- API rate limit usage
- Database growth rate

### Logs to Monitor:
```typescript
console.log('Sync started');
console.log(`Fetched ${recordsFetched} movies`);
console.log(`Created ${recordsCreated} new records`);
console.log(`Updated ${recordsUpdated} existing records`);
console.log('Sync completed successfully');
```

## Conclusion

Perbaikan ini menyelesaikan kedua masalah:
1. ✅ Record counting sekarang akurat (created vs updated)
2. ✅ Data lebih bervariasi (4 kategori vs 1)
3. ✅ Setiap sync berpotensi membawa data baru
4. ✅ Better error handling
5. ✅ More efficient duplicate checking

**Impact:**
- Better data quality
- More accurate sync logs
- More interesting analytics
- Better user experience
