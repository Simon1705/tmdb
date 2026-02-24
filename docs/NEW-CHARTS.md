# New Analytics Charts

## Overview
Menambahkan dua chart baru pada Analytics Dashboard untuk memberikan insight lebih mendalam tentang koleksi film.

## Chart Baru

### 1. Rating Distribution & Engagement Chart (Composed Chart)
**Lokasi:** Analytics Dashboard - Row 2, Column 1

**Deskripsi:**
- Menampilkan distribusi rating film dalam bentuk **Composed Chart** (Bar + Line)
- Film dikelompokkan berdasarkan range rating: 0-2, 2-4, 4-6, 6-8, 8-10
- **Bar Chart** (Amber gradient): Jumlah film per rating range
- **Line Chart** (Purple): Average popularity per rating range
- Menampilkan engagement metrics (popularity & vote count)

**Data Source:**
- `vote_average` - untuk rating range
- `popularity` - untuk average popularity per range
- `vote_count` - untuk average votes per range

**Multi-Metric Visualization:**
```typescript
// For each rating range, calculate:
{
  count: number of movies,
  avgPopularity: average popularity score,
  avgVotes: average vote count
}
```

**Features:**
- **Dual Y-Axis:**
  - Left axis: Movie count (bars)
  - Right axis: Average popularity (line)
- **Enhanced Interactive Tooltip** menampilkan:
  - Movie count in range
  - Average popularity score
  - Average vote count
  - Engagement indicator (High/Moderate/Low)
- **Legend** explaining visualization methodology
- **Stats Summary** menampilkan:
  - Total movies
  - Overall average rating
  - Total votes across all movies
- **Smart Insights** cards showing:
  - High quality movies count (8-10 rating)
  - Most popular rating range
- Smooth animation dengan staggered timing

**Insights You Can Get:**
1. **Quality Distribution**: Berapa banyak film berkualitas tinggi vs rendah
2. **Popularity Correlation**: Apakah film rating tinggi juga populer?
3. **Engagement Pattern**: Rating range mana yang paling banyak di-vote
4. **Hidden Gems**: Film rating tinggi tapi popularity rendah
5. **Overhyped**: Film rating rendah tapi popularity tinggi

**Use Case:**
- Identifikasi quality vs popularity correlation
- Temukan "hidden gems" (high rating, low popularity)
- Analisis engagement patterns
- Validate rating reliability dengan vote count
- Decision making untuk content curation

### 2. Genre Performance Chart
**Lokasi:** Analytics Dashboard - Row 2, Column 2

**Deskripsi:**
- Menampilkan weighted rating per genre dalam bentuk horizontal bar chart
- Menggunakan **Bayesian Average** untuk menghindari bias dari genre dengan sedikit film
- Menampilkan top 8 genre berdasarkan weighted rating tertinggi
- Menggunakan gradient emerald/green untuk visualisasi
- **Minimum 2 movies** required per genre untuk ditampilkan

**Weighted Rating Algorithm:**
```
Confidence = min(movieCount / 10, 1)  // Max confidence at 10 movies
Weighted Rating = (Confidence × Average Rating) + ((1 - Confidence) × Global Mean)
```

**Contoh:**
- Genre A: 1 movie, rating 9.0 → Filtered out (< 2 movies)
- Genre B: 2 movies, avg 8.5 → Weighted: ~7.2 (20% confidence)
- Genre C: 10 movies, avg 7.8 → Weighted: 7.8 (100% confidence)
- Genre D: 5 movies, avg 8.0 → Weighted: ~7.5 (50% confidence)

**Data Source:**
- Kombinasi `genre` dan `vote_average` dari movies
- Dihitung average rating per genre
- Applied Bayesian average untuk weighted scoring
- Diurutkan dari weighted rating tertinggi ke terendah

**Features:**
- **Enhanced Interactive Tooltip** menampilkan:
  - Nama genre
  - Weighted rating (score yang digunakan untuk ranking)
  - Actual average rating (raw average)
  - Jumlah film dalam genre
  - **Confidence level** (0-100%) dengan progress bar visual
- **Info Box** menjelaskan weighted rating methodology
- Stats summary menampilkan:
  - Jumlah genre yang ditampilkan
  - Top genre dengan weighted rating tertinggi + jumlah film
- Info badge jika ada lebih dari 8 genre (menampilkan total)

**Use Case:**
- Identifikasi genre mana yang **consistently** memiliki film berkualitas tinggi
- Menghindari misleading data dari genre dengan 1-2 film saja
- Membantu decision making untuk sync film genre tertentu
- Analisis preferensi kualitas per genre dengan confidence level

## Technical Implementation

### Backend Changes (`/app/api/analytics/route.ts`)

```typescript
// Rating Distribution with Engagement Metrics
const ratingDistribution = genreData.reduce((acc, movie) => {
  const rating = movie.vote_average || 0;
  let range = '';
  if (rating >= 0 && rating < 2) range = '0-2';
  else if (rating >= 2 && rating < 4) range = '2-4';
  else if (rating >= 4 && rating < 6) range = '4-6';
  else if (rating >= 6 && rating < 8) range = '6-8';
  else if (rating >= 8 && rating <= 10) range = '8-10';
  
  if (range) {
    if (!acc[range]) {
      acc[range] = { count: 0, totalPopularity: 0, totalVotes: 0 };
    }
    acc[range].count += 1;
    acc[range].totalPopularity += movie.popularity || 0;
    acc[range].totalVotes += movie.vote_count || 0;
  }
  return acc;
}, {});

// Calculate averages for each range
const ratingDistributionWithMetrics = Object.entries(ratingDistribution)
  .reduce((acc, [range, data]) => {
    acc[range] = {
      count: data.count,
      avgPopularity: data.count > 0 ? data.totalPopularity / data.count : 0,
      avgVotes: data.count > 0 ? data.totalVotes / data.count : 0,
    };
    return acc;
  }, {});

// Genre Performance
const genreStats = genreData.reduce((acc, movie) => {
  const genre = movie.genre;
  const rating = movie.vote_average || 0;
  
  if (!acc[genre]) {
    acc[genre] = { total: 0, count: 0 };
  }
  acc[genre].total += rating;
  acc[genre].count += 1;
  
  return acc;
}, {});

// Calculate global mean rating for Bayesian average
const totalRatings = genreData.reduce((sum, movie) => sum + (movie.vote_average || 0), 0);
const globalMeanRating = genreData.length > 0 ? totalRatings / genreData.length : 0;

// Minimum movies threshold to avoid single-movie bias
const minMoviesThreshold = 2;

const genrePerformance = Object.entries(genreStats)
  .filter(([_, stats]) => stats.count >= minMoviesThreshold)
  .map(([genre, stats]) => {
    const averageRating = stats.count > 0 ? stats.total / stats.count : 0;
    
    // Bayesian average: more movies = more confidence
    const confidence = Math.min(stats.count / 10, 1); // Max at 10 movies
    const weightedRating = (confidence * averageRating) + ((1 - confidence) * globalMeanRating);
    
    return {
      genre,
      averageRating,
      weightedRating,
      movieCount: stats.count,
      confidence: confidence * 100,
    };
  })
  .sort((a, b) => b.weightedRating - a.weightedRating);
```

**Why Bayesian Average?**
- Prevents single high-rated movie from dominating rankings
- Balances quality (rating) with quantity (sample size)
- More statistically sound for comparison
- Used by IMDB, TMDB, and other rating platforms

### Frontend Changes (`/app/dashboard/page.tsx`)

**New Imports:**
```typescript
import { ComposedChart, Line, Area } from 'recharts';
```

**New Custom Tooltips:**
- `CustomRatingTooltip` - Enhanced dengan popularity, vote count, dan engagement indicator
- `CustomGenrePerformanceTooltip` - untuk Genre Performance chart dengan detail:
  - Weighted Score (untuk ranking)
  - Actual Average (raw data)
  - Movie count
  - Confidence level dengan visual progress bar

**New Data Processing:**
```typescript
// Rating distribution with engagement metrics
const ratingChartData = ratingRanges.map(range => {
  const data = analytics?.ratingDistribution?.[range];
  return {
    range,
    count: data?.count || 0,
    avgPopularity: data?.avgPopularity ? parseFloat(data.avgPopularity.toFixed(1)) : 0,
    avgVotes: data?.avgVotes ? Math.round(data.avgVotes) : 0,
  };
});

// Genre performance data with weighted rating
const genrePerformanceData = (analytics?.genrePerformance || [])
  .slice(0, 8) // Top 8 genres
  .map((item: any) => ({
    genre: item.genre,
    rating: parseFloat(item.weightedRating.toFixed(2)),
    averageRating: parseFloat(item.averageRating.toFixed(2)),
    count: item.movieCount,
    confidence: Math.round(item.confidence),
  }));
```

## Chart Layout

Dashboard sekarang memiliki 4 chart dalam grid 2x2:

```
┌─────────────────────┬─────────────────────┐
│  Genre Distribution │  Movies by Date     │
│  (Pie Chart)        │  (Bar Chart)        │
├─────────────────────┼─────────────────────┤
│  Rating Distribution│  Genre Performance  │
│  (Histogram)        │  (Horizontal Bar)   │
└─────────────────────┴─────────────────────┘
```

## Key Improvements

### Weighted Rating System
Genre Performance chart sekarang menggunakan **Bayesian Average** untuk mengatasi masalah:

**Problem:**
- Genre dengan 1 film rating 9.0 akan ranked lebih tinggi dari genre dengan 20 film avg 8.5
- Tidak fair karena sample size berbeda drastis

**Solution:**
```
Confidence Score = min(movieCount / 10, 1.0)
Weighted Rating = (Confidence × Avg Rating) + ((1 - Confidence) × Global Mean)
```

**Example Scenarios:**

| Genre | Movies | Avg Rating | Confidence | Global Mean | Weighted Rating | Rank |
|-------|--------|------------|------------|-------------|-----------------|------|
| Horror | 1 | 9.0 | 10% | 7.0 | 7.2 | ❌ Filtered |
| Drama | 2 | 8.5 | 20% | 7.0 | 7.3 | 4th |
| Action | 5 | 8.0 | 50% | 7.0 | 7.5 | 3rd |
| Comedy | 10 | 7.8 | 100% | 7.0 | 7.8 | 2nd |
| Thriller | 15 | 8.2 | 100% | 7.0 | 8.2 | 1st |

**Benefits:**
- More reliable rankings
- Rewards consistency over outliers
- Transparent confidence scoring
- Minimum threshold prevents noise

## Color Scheme

- **Rating Distribution:** Amber gradient (#F59E0B → #D97706)
- **Genre Performance:** Emerald gradient (#10B981 → #059669)
- Konsisten dengan existing charts (Blue & Purple)

## Responsive Design

- Grid otomatis menjadi 1 kolom pada mobile devices
- Chart height fixed 280px untuk konsistensi
- Tooltips responsive dan readable di semua screen sizes

## Future Enhancements

Potential chart additions:
1. Movies Per Year Timeline (Line Chart)
2. Popularity vs Rating Scatter Plot
3. Language Distribution (Pie Chart)
4. Vote Count Distribution (Bar Chart)
5. Monthly Trend Chart (Line Chart with trend line)

## Testing

Untuk test chart baru:
1. Pastikan ada data movies dengan `vote_average` di database
2. Sync beberapa movies dari TMDB
3. Buka Analytics Dashboard
4. Verify kedua chart baru muncul dengan data yang benar
5. Test interactivity (hover tooltips)
6. Test responsive di berbagai screen sizes

## Notes

- Chart menggunakan Recharts library yang sudah ada
- Tidak ada dependency baru yang ditambahkan
- Performance optimal karena data sudah di-aggregate di backend
- Chart animation smooth dengan duration 800ms
