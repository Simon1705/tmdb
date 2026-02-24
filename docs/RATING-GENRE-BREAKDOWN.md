# Rating Distribution & Genre Breakdown Chart

## Overview

Chart ini menggantikan "Rating Distribution & Engagement" dengan visualisasi yang lebih informatif menggunakan **stacked bar chart** untuk menampilkan breakdown genre di setiap rating range.

## What Changed

### Before: Rating Distribution & Engagement
- **Type:** Composed Chart (Bar + Line)
- **Metrics:** 
  - Bar: Movie count per rating range
  - Line: Average popularity
  - Tooltip: Engagement score (70% votes + 30% popularity)
- **Focus:** Engagement metrics

### After: Rating Distribution & Genre Breakdown
- **Type:** Stacked Bar Chart
- **Metrics:**
  - Stacked bars: Genre composition per rating range
  - Each color: Different genre
  - Height: Total movies in that range
- **Focus:** Genre distribution across ratings

## Why This Change?

### More Informative
- ✅ Shows **which genres** dominate each rating range
- ✅ Visual comparison of genre performance
- ✅ Easier to spot patterns (e.g., "Drama dominates high ratings")

### Less Redundant
- ❌ Engagement score was complex and not widely used
- ❌ Popularity metric already shown in other contexts
- ✅ Genre breakdown provides unique insights

### Better Storytelling
- "What genres are in the 8-10 rating range?" → Immediately visible
- "Does Action perform better than Drama?" → Easy to compare
- "Are low-rated movies dominated by specific genres?" → Clear answer

## Implementation

### Backend Changes

**File:** `app/api/analytics/route.ts`

```typescript
// Rating distribution with genre breakdown
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
      acc[range] = { count: 0, genres: {} };
    }
    acc[range].count += 1;
    acc[range].genres[movie.genre] = (acc[range].genres[movie.genre] || 0) + 1;
  }
  return acc;
}, {});
```

**Data Structure:**
```json
{
  "6-8": {
    "count": 45,
    "genres": {
      "Drama": 15,
      "Action": 12,
      "Comedy": 10,
      "Thriller": 8
    }
  }
}
```

### Frontend Changes

**File:** `app/dashboard/page.tsx`

#### 1. Data Preparation
```typescript
// Get all unique genres
const allGenres = new Set<string>();
ratingRanges.forEach(range => {
  const data = analytics?.ratingDistribution?.[range];
  if (data?.genres) {
    Object.keys(data.genres).forEach(genre => allGenres.add(genre));
  }
});

// Prepare data for stacked bar chart
const ratingChartData = ratingRanges.map(range => {
  const data = analytics?.ratingDistribution?.[range];
  const chartData: any = { range };
  
  // Add each genre as a separate key
  if (data?.genres) {
    Object.entries(data.genres).forEach(([genre, count]) => {
      chartData[genre] = count;
    });
  }
  
  return chartData;
});
```

**Example Output:**
```javascript
[
  { range: '6-8', Drama: 15, Action: 12, Comedy: 10, Thriller: 8 },
  { range: '8-10', Drama: 20, Action: 5, Comedy: 3 }
]
```

#### 2. Custom Tooltip
```typescript
const CustomRatingGenreTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const sortedGenres = payload.sort((a, b) => b.value - a.value);
    const totalMovies = sortedGenres.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3">
        <p className="font-bold text-gray-900 mb-2">Rating {label}</p>
        <div className="mb-2 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-600">Total Movies:</span>
          <span className="font-semibold text-blue-600">{totalMovies}</span>
        </div>
        <div className="space-y-1.5">
          {sortedGenres.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.fill }}></div>
                <span className="text-xs text-gray-700">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">{item.value}</span>
                <span className="text-xs text-gray-500">
                  ({((item.value / totalMovies) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
```

#### 3. Stacked Bar Chart
```typescript
<BarChart data={ratingChartData}>
  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
  <XAxis dataKey="range" label={{ value: 'Rating Range' }} />
  <YAxis label={{ value: 'Movie Count', angle: -90 }} />
  <Tooltip content={<CustomRatingGenreTooltip />} />
  <Legend iconType="square" />
  
  {/* Dynamic bars for each genre */}
  {Array.from(allGenres).map((genre, index) => (
    <Bar 
      key={genre}
      dataKey={genre}
      stackId="a"
      fill={COLORS[index % COLORS.length]}
      animationBegin={index * 100}
      animationDuration={800}
    />
  ))}
</BarChart>
```

## Visual Example

### Chart Display
```
Rating 6-8:
┌─────────────────────────────────┐
│ ████████ Drama (15)             │
│ ██████ Action (12)              │
│ █████ Comedy (10)               │
│ ████ Thriller (8)               │
└─────────────────────────────────┘
Total: 45 movies
```

### Tooltip on Hover
```
┌─────────────────────────────┐
│ Rating 6-8                  │
├─────────────────────────────┤
│ Total Movies: 45            │
├─────────────────────────────┤
│ ■ Drama      15  (33%)      │
│ ■ Action     12  (27%)      │
│ ■ Comedy     10  (22%)      │
│ ■ Thriller    8  (18%)      │
└─────────────────────────────┘
```

## Use Cases

### 1. Genre Performance Analysis
**Question:** "Which genres consistently get high ratings?"

**Answer:** Look at 8-10 range → See which genres dominate

**Example:**
- 8-10 range: Drama (20), Documentary (8), Biography (5)
- Insight: Drama and Documentary perform best

### 2. Genre Distribution Patterns
**Question:** "Are certain genres more common in specific rating ranges?"

**Answer:** Compare genre heights across ranges

**Example:**
- Action: High in 6-8, low in 8-10
- Drama: Consistent across all ranges
- Comedy: Peaks in 4-6 range

### 3. Quality Control
**Question:** "Do we have too many low-rated movies in certain genres?"

**Answer:** Check 0-4 ranges for genre composition

**Example:**
- 0-2 range: Horror (15), Thriller (10)
- Action needed: Review Horror movie selection

### 4. Collection Balance
**Question:** "Is our collection balanced across genres and ratings?"

**Answer:** Visual scan of stacked bars

**Example:**
- All ranges dominated by Drama → Need more variety
- Action only in 6-8 → Need high-rated Action films

## Insights You Can Get

### Pattern Recognition
- ✅ "Drama dominates high ratings"
- ✅ "Comedy peaks in mid-range ratings"
- ✅ "Horror concentrated in low ratings"
- ✅ "Documentary rare but highly rated"

### Collection Gaps
- ✅ "No Sci-Fi in 8-10 range"
- ✅ "Too many low-rated Horror films"
- ✅ "Action underrepresented in high ratings"

### Genre Characteristics
- ✅ "Drama has wide rating distribution"
- ✅ "Documentary consistently high-rated"
- ✅ "Comedy tends toward mid-range"

## Comparison with Other Charts

### vs. Genre Distribution (Pie Chart)
- **Pie Chart:** Total count per genre (quantity)
- **This Chart:** Genre distribution across ratings (quality + quantity)
- **Complementary:** Use both for complete picture

### vs. Genre Performance (Bar Chart)
- **Genre Performance:** Average rating per genre (quality)
- **This Chart:** Genre count per rating range (distribution)
- **Complementary:** Performance shows average, this shows spread

### Example Scenario
**Genre: Action**
- **Pie Chart:** 32 movies (20% of collection)
- **Genre Performance:** 7.5 average rating
- **This Chart:** 
  - 6-8 range: 20 movies
  - 8-10 range: 5 movies
  - 4-6 range: 7 movies
- **Insight:** Action has decent average (7.5) but most are in 6-8 range, few reach 8-10

## Stats Summary

The chart includes a stats summary bar showing:

1. **Total Movies:** Sum of all movies across all ranges
2. **Avg Rating:** Overall average rating of all movies
3. **Genres:** Number of unique genres in the dataset

## Tooltip Guide

Compact guide below the chart:
```
? Hover for details: See genre breakdown for each rating range • 
  Each color represents a different genre • 
  Stacked bars show total movies in that rating range
```

## Color Coding

Uses the same color palette as other charts for consistency:
```javascript
const COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Green
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#6366F1'  // Indigo
];
```

## Performance Considerations

### Efficient Data Structure
- Single pass through movies to build genre breakdown
- O(n) complexity where n = number of movies
- Minimal memory overhead

### Dynamic Bar Generation
- Bars generated dynamically based on available genres
- No hardcoded genre list
- Automatically adapts to data

### Animation Stagger
- Each bar animates with 100ms delay
- Creates smooth, professional appearance
- Total animation: 800ms per bar

## Future Enhancements

### 1. Genre Filtering
Add ability to click legend to show/hide specific genres:
```typescript
const [hiddenGenres, setHiddenGenres] = useState<Set<string>>(new Set());

const toggleGenre = (genre: string) => {
  const newHidden = new Set(hiddenGenres);
  if (newHidden.has(genre)) {
    newHidden.delete(genre);
  } else {
    newHidden.add(genre);
  }
  setHiddenGenres(newHidden);
};
```

### 2. Percentage View Toggle
Switch between absolute counts and percentages:
```typescript
const [viewMode, setViewMode] = useState<'count' | 'percentage'>('count');

// In chart data preparation
const chartData = viewMode === 'percentage' 
  ? normalizeToPercentage(ratingChartData)
  : ratingChartData;
```

### 3. Export Data
Add button to export genre breakdown as CSV:
```typescript
const exportToCSV = () => {
  const csv = convertToCSV(ratingChartData);
  downloadFile(csv, 'rating-genre-breakdown.csv');
};
```

### 4. Drill-Down
Click on a bar segment to see movie list:
```typescript
const handleBarClick = (data: any) => {
  const { range, genre } = data;
  const movies = getMoviesByRangeAndGenre(range, genre);
  openMovieListModal(movies);
};
```

## Conclusion

The Rating Distribution & Genre Breakdown chart provides:
- ✅ **Clear visualization** of genre composition across ratings
- ✅ **Actionable insights** for collection management
- ✅ **Pattern recognition** for genre performance
- ✅ **Complementary data** to other analytics charts

This change makes the dashboard more informative and useful for understanding the relationship between genres and ratings in your movie collection.
