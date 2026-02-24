# Rating Distribution Enhancement - Multi-Metric Visualization

## Overview

Rating Distribution chart telah di-upgrade dari simple histogram menjadi **Composed Chart** yang menampilkan multiple metrics untuk analisis yang lebih mendalam.

## What Changed

### Before (Simple Histogram)
- ✅ Bar chart showing movie count per rating range
- ❌ No engagement metrics
- ❌ No popularity correlation
- ❌ Limited insights

### After (Composed Chart)
- ✅ Bar chart showing movie count per rating range
- ✅ Line chart showing average popularity per range
- ✅ Tooltip with vote count and engagement indicator
- ✅ Multiple insights and correlations
- ✅ Dual Y-axis for better comparison

## New Metrics

### 1. Average Popularity
**What it shows:** Seberapa populer film dalam rating range tersebut

**Calculation:**
```typescript
avgPopularity = totalPopularity / movieCount
```

**Insights:**
- High rating + High popularity = Quality content yang diakui
- High rating + Low popularity = Hidden gems
- Low rating + High popularity = Overhyped content
- Low rating + Low popularity = Skip-worthy content

### 2. Average Vote Count
**What it shows:** Seberapa banyak orang yang me-rate film dalam range tersebut

**Calculation:**
```typescript
avgVotes = totalVotes / movieCount
```

**Combined with Popularity for Engagement Score:**
```typescript
voteScore = (avgVotes / 5000) × 100 (capped at 100)
popularityScore = (avgPopularity / 500) × 100 (capped at 100)
engagementScore = (voteScore × 0.7) + (popularityScore × 0.3)
```

**Engagement Levels:**
- **High engagement:** ≥60 score (Trusted ratings, high votes + popularity)
- **Moderate engagement:** 30-59 score (Fairly reliable, decent engagement)
- **Low engagement:** <30 score (Less reliable, limited engagement)

**Why Composite Score?**
- Vote count alone doesn't show current interest
- Popularity alone doesn't show historical engagement
- 70/30 weighting balances reliability (votes) with relevance (popularity)

## Visual Design

### Chart Components

```
┌─────────────────────────────────────────────┐
│  Rating Distribution & Engagement           │
├─────────────────────────────────────────────┤
│                                             │
│  [Bar Chart - Movie Count]                  │
│  [Line Chart - Avg Popularity]              │
│                                             │
│  Left Y-Axis: Movie Count                   │
│  Right Y-Axis: Avg Popularity               │
│  X-Axis: Rating Ranges (0-2, 2-4, ...)     │
│                                             │
├─────────────────────────────────────────────┤
│  [Info Box] Explaining metrics              │
│  [Stats] Total movies, avg rating, votes    │
│  [Insights] High quality count, popular     │
└─────────────────────────────────────────────┘
```

### Color Scheme
- **Bars:** Amber gradient (#F59E0B → #D97706)
- **Line:** Purple (#A855F7)
- **Dots:** Purple with larger active dots

## Enhanced Tooltip

### Information Displayed
```
Rating 6-8
─────────────────────
Movies: 45
Avg Popularity: 127.3
Avg Votes: 1,234
─────────────────────
✓ High engagement
Score: [████████░░] 65
```

### Engagement Score Calculation
**Composite metric combining votes + popularity:**
```typescript
voteScore = (avgVotes / 5000) × 100 (capped at 100)
popularityScore = (avgPopularity / 500) × 100 (capped at 100)
engagementScore = (voteScore × 0.7) + (popularityScore × 0.3)
```

**Why Composite?**
- Vote count = Historical engagement (reliable but may be outdated)
- Popularity = Current interest (relevant but may fluctuate)
- 70/30 weighting balances reliability with relevance

### Engagement Indicators
- ✓ High engagement (≥60 score) - Reliable, high votes + popularity
- ~ Moderate engagement (30-59 score) - Fairly reliable, decent engagement
- ⚠ Low engagement (<30 score) - Less reliable, limited data

**Visual Progress Bar:**
- Green bar (≥60): High engagement
- Amber bar (30-59): Moderate engagement
- Red bar (<30): Low engagement

See `/docs/ENGAGEMENT-SCORE-CALCULATION.md` for detailed explanation.

## Use Cases & Insights

### 1. Quality vs Popularity Analysis
**Question:** Apakah film berkualitas tinggi juga populer?

**How to read:**
- Compare bar height (quality) with line position (popularity)
- If line trends upward with bars → Quality correlates with popularity
- If line is flat → Popularity independent of quality

### 2. Hidden Gems Discovery
**Question:** Ada film bagus yang kurang dikenal?

**How to identify:**
- Look for high rating ranges (6-8, 8-10)
- Check if popularity line is low
- Check vote count in tooltip
- Low popularity + High rating + Decent votes = Hidden gem

### 3. Overhyped Content Detection
**Question:** Ada film populer tapi rating rendah?

**How to identify:**
- Look for low rating ranges (0-2, 2-4, 4-6)
- Check if popularity line is high
- High popularity + Low rating = Overhyped

### 4. Rating Reliability
**Question:** Seberapa reliable rating di setiap range?

**How to check:**
- Hover tooltip to see avg votes
- High vote count = More reliable
- Low vote count = Less reliable (small sample)

### 5. Collection Quality Assessment
**Question:** Apakah koleksi film saya berkualitas?

**How to assess:**
- Check distribution of bars
- More bars on right (high ratings) = Good collection
- More bars on left (low ratings) = Need curation

## Real-World Examples

### Example 1: Quality Collection
```
Rating Range | Movies | Avg Pop | Avg Votes | Insight
─────────────┼────────┼─────────┼───────────┼─────────────────
0-2          | 2      | 45.2    | 234       | Few bad movies
2-4          | 5      | 67.8    | 456       | Some mediocre
4-6          | 15     | 89.3    | 789       | Decent amount
6-8          | 35     | 145.6   | 1,234     | Strong collection
8-10         | 20     | 178.9   | 2,456     | Excellent picks ✓
```
**Insight:** Great collection with most movies in 6-10 range. High ratings also have high engagement.

### Example 2: Hidden Gems Collection
```
Rating Range | Movies | Avg Pop | Avg Votes | Insight
─────────────┼────────┼─────────┼───────────┼─────────────────
0-2          | 1      | 23.4    | 123       | Minimal bad
2-4          | 3      | 34.5    | 234       | Few mediocre
4-6          | 8      | 56.7    | 456       | Some average
6-8          | 25     | 67.8    | 789       | Many good ones
8-10         | 15     | 45.6    | 567       | Hidden gems! 💎
```
**Insight:** High-rated movies have lower popularity - you've found hidden gems!

### Example 3: Mainstream Collection
```
Rating Range | Movies | Avg Pop | Avg Votes | Insight
─────────────┼────────┼─────────┼───────────┼─────────────────
0-2          | 0      | 0       | 0         | No bad movies
2-4          | 2      | 234.5   | 3,456     | Few popular bad
4-6          | 20     | 345.6   | 4,567     | Many mainstream
6-8          | 25     | 456.7   | 5,678     | Popular good
8-10         | 5      | 567.8   | 6,789     | Few excellent
```
**Insight:** Collection focused on popular mainstream movies across all ratings.

## Smart Insights Cards

The chart automatically generates insight cards:

### High Quality Card (Green)
```
┌─────────────────────────────┐
│ High Quality: 20 movies     │
│ rated 8-10                  │
└─────────────────────────────┘
```
Shows when there are movies in 8-10 range.

### Most Popular Card (Purple)
```
┌─────────────────────────────┐
│ Most Popular: 6-8 range     │
└─────────────────────────────┘
```
Shows which rating range has highest average popularity.

## Technical Details

### Data Structure
```typescript
interface RatingDistributionData {
  range: string;           // "0-2", "2-4", etc.
  count: number;           // Number of movies
  avgPopularity: number;   // Average popularity score
  avgVotes: number;        // Average vote count
}
```

### Backend Calculation
```typescript
// Aggregate data per range
const ratingDistribution = movies.reduce((acc, movie) => {
  const range = getRatingRange(movie.vote_average);
  
  if (!acc[range]) {
    acc[range] = { count: 0, totalPopularity: 0, totalVotes: 0 };
  }
  
  acc[range].count += 1;
  acc[range].totalPopularity += movie.popularity;
  acc[range].totalVotes += movie.vote_count;
  
  return acc;
}, {});

// Calculate averages
const withMetrics = Object.entries(ratingDistribution).map(([range, data]) => ({
  range,
  count: data.count,
  avgPopularity: data.count > 0 ? data.totalPopularity / data.count : 0,
  avgVotes: data.count > 0 ? data.totalVotes / data.count : 0,
}));
```

### Frontend Rendering
```typescript
<ComposedChart data={ratingChartData}>
  {/* Dual Y-Axis */}
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />
  
  {/* Bar for movie count */}
  <Bar yAxisId="left" dataKey="count" fill="amber" />
  
  {/* Line for popularity */}
  <Line yAxisId="right" dataKey="avgPopularity" stroke="purple" />
</ComposedChart>
```

## Performance Considerations

- ✅ Data aggregated in backend (efficient)
- ✅ Only 5 data points (rating ranges)
- ✅ Smooth animations with staggered timing
- ✅ Responsive design for all screen sizes
- ✅ Tooltip renders on-demand

## Future Enhancements

Potential additions:
1. **Genre breakdown** per rating range (stacked bars)
2. **Time-based comparison** (rating distribution over time)
3. **Language distribution** per rating range
4. **Export data** to CSV for further analysis
5. **Filtering** by genre/year to see specific distributions

## Conclusion

The enhanced Rating Distribution chart provides:
- ✅ Multi-dimensional analysis (quality + engagement)
- ✅ Actionable insights for content curation
- ✅ Visual correlation between metrics
- ✅ Reliability indicators (vote counts)
- ✅ Automatic insight generation

This makes it one of the most informative charts in the dashboard for understanding your movie collection's quality and engagement patterns.
