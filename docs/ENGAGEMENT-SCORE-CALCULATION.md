# Engagement Score Calculation

## Overview

Engagement Score adalah **composite metric** yang menggabungkan **vote count** dan **popularity** untuk mengukur seberapa engaged audience dengan film dalam rating range tertentu.

## Why Composite Score?

### Problem dengan Single Metric:

**Vote Count Only:**
- ❌ Film lama bisa punya banyak votes tapi tidak populer lagi
- ❌ Tidak mencerminkan current interest

**Popularity Only:**
- ❌ Film baru bisa populer tapi belum banyak di-vote
- ❌ Tidak mencerminkan historical engagement

**Composite Score:**
- ✅ Menggabungkan historical engagement (votes) + current interest (popularity)
- ✅ Lebih balanced dan representative
- ✅ Lebih akurat untuk decision making

## Calculation Formula

### Step 1: Normalize Vote Count (0-100 scale)
```typescript
voteScore = min((avgVotes / 5000) * 100, 100)
```

**Scaling:**
- 0 votes → 0 score
- 2,500 votes → 50 score
- 5,000+ votes → 100 score (capped)

**Why 5000?**
- Based on TMDB data, 5000+ votes indicates very high engagement
- Most popular movies have 1000-5000 votes
- Provides good distribution across ranges

### Step 2: Normalize Popularity (0-100 scale)
```typescript
popularityScore = min((avgPopularity / 500) * 100, 100)
```

**Scaling:**
- 0 popularity → 0 score
- 250 popularity → 50 score
- 500+ popularity → 100 score (capped)

**Why 500?**
- TMDB popularity scores typically range 0-500
- Very popular movies: 300-500
- Moderate: 100-300
- Low: 0-100

### Step 3: Weighted Composite
```typescript
engagementScore = (voteScore × 0.7) + (popularityScore × 0.3)
```

**Weighting Rationale:**
- **70% Vote Count** - More reliable, historical data
- **30% Popularity** - Current interest, trending factor

**Why 70/30?**
- Vote count is more stable and reliable
- Popularity can fluctuate (trending, seasonal)
- Balance between historical and current engagement

### Step 4: Determine Level
```typescript
if (engagementScore >= 60) → High engagement ✓
else if (engagementScore >= 30) → Moderate engagement ~
else → Low engagement ⚠
```

## Examples

### Example 1: Classic High-Rated Movie
```
Avg Votes: 4,500
Avg Popularity: 120

Vote Score = (4500 / 5000) × 100 = 90
Popularity Score = (120 / 500) × 100 = 24
Engagement Score = (90 × 0.7) + (24 × 0.3) = 63 + 7.2 = 70.2

Result: ✓ High engagement (70)
```
**Interpretation:** Banyak orang sudah nonton dan rate (historical engagement tinggi), meskipun popularity saat ini moderate.

### Example 2: Trending New Movie
```
Avg Votes: 800
Avg Popularity: 450

Vote Score = (800 / 5000) × 100 = 16
Popularity Score = (450 / 500) × 100 = 90
Engagement Score = (16 × 0.7) + (90 × 0.3) = 11.2 + 27 = 38.2

Result: ~ Moderate engagement (38)
```
**Interpretation:** Sedang trending (popularity tinggi) tapi belum banyak yang rate (votes masih rendah). Perlu waktu untuk accumulate votes.

### Example 3: Hidden Gem
```
Avg Votes: 1,200
Avg Popularity: 45

Vote Score = (1200 / 5000) × 100 = 24
Popularity Score = (45 / 500) × 100 = 9
Engagement Score = (24 × 0.7) + (9 × 0.3) = 16.8 + 2.7 = 19.5

Result: ⚠ Low engagement (20)
```
**Interpretation:** Film bagus tapi kurang dikenal (hidden gem). Low popularity dan moderate votes.

### Example 4: Blockbuster
```
Avg Votes: 8,000 (capped at 5000)
Avg Popularity: 520 (capped at 500)

Vote Score = (5000 / 5000) × 100 = 100 (capped)
Popularity Score = (500 / 500) × 100 = 100 (capped)
Engagement Score = (100 × 0.7) + (100 × 0.3) = 70 + 30 = 100

Result: ✓ High engagement (100)
```
**Interpretation:** Blockbuster dengan engagement maksimal di semua metrics.

### Example 5: Obscure Movie
```
Avg Votes: 150
Avg Popularity: 12

Vote Score = (150 / 5000) × 100 = 3
Popularity Score = (12 / 500) × 100 = 2.4
Engagement Score = (3 × 0.7) + (2.4 × 0.3) = 2.1 + 0.72 = 2.82

Result: ⚠ Low engagement (3)
```
**Interpretation:** Film sangat obscure, minimal engagement di semua metrics.

## Visual Representation

### Tooltip Display
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

**Components:**
1. **Icon & Label:** ✓/~/⚠ + High/Moderate/Low
2. **Progress Bar:** Visual representation (color-coded)
3. **Numeric Score:** 0-100 for precision

**Color Coding:**
- **Green (≥60):** High engagement
- **Amber (30-59):** Moderate engagement
- **Red (<30):** Low engagement

## Engagement Levels Breakdown

### High Engagement (≥60)
**Characteristics:**
- Many votes (typically >2000)
- Good popularity (typically >150)
- Well-established audience
- Reliable ratings

**What it means:**
- Film widely watched and rated
- Strong community engagement
- Ratings are trustworthy
- Good candidate for recommendations

### Moderate Engagement (30-59)
**Characteristics:**
- Decent votes (500-2000)
- Moderate popularity (50-150)
- Growing audience
- Fairly reliable ratings

**What it means:**
- Film has some traction
- Ratings somewhat reliable
- Could be trending up or down
- Worth monitoring

### Low Engagement (<30)
**Characteristics:**
- Few votes (<500)
- Low popularity (<50)
- Limited audience
- Less reliable ratings

**What it means:**
- Niche or obscure film
- Ratings less reliable (small sample)
- Could be hidden gem or just unpopular
- Needs more data for confidence

## Use Cases

### 1. Content Curation
**High engagement films:**
- Safe to recommend
- Proven track record
- Broad appeal

**Low engagement films:**
- Risky to recommend
- May be hidden gems
- Need manual review

### 2. Rating Reliability
**High engagement:**
- Trust the ratings
- Large sample size
- Statistically significant

**Low engagement:**
- Take ratings with grain of salt
- Small sample size
- May not be representative

### 3. Trending Detection
**High popularity + Low votes:**
- Currently trending
- New release
- Watch for vote accumulation

**Low popularity + High votes:**
- Classic/older film
- Established reputation
- Not currently trending

### 4. Hidden Gems Discovery
**High rating + Low engagement:**
- Potential hidden gem
- Underrated
- Worth promoting

**Low rating + High engagement:**
- Overhyped
- Disappointing despite popularity
- Avoid recommending

## Configuration

### Adjusting Thresholds

In `/app/dashboard/page.tsx`, you can adjust:

```typescript
// Vote normalization (default: 5000)
const voteScore = Math.min((data.avgVotes / 5000) * 100, 100);

// Popularity normalization (default: 500)
const popularityScore = Math.min((data.avgPopularity / 500) * 100, 100);

// Weighting (default: 70/30)
const engagementScore = (voteScore * 0.7) + (popularityScore * 0.3);

// Level thresholds (default: 60/30)
if (engagementScore >= 60) // High
else if (engagementScore >= 30) // Moderate
else // Low
```

### Tuning Guidelines

**For Stricter Engagement:**
```typescript
voteScore = Math.min((data.avgVotes / 10000) * 100, 100); // Higher bar
engagementScore >= 70 // High threshold
```

**For More Lenient:**
```typescript
voteScore = Math.min((data.avgVotes / 2500) * 100, 100); // Lower bar
engagementScore >= 50 // High threshold
```

**For Popularity-Focused:**
```typescript
engagementScore = (voteScore * 0.5) + (popularityScore * 0.5); // 50/50
```

**For Vote-Focused:**
```typescript
engagementScore = (voteScore * 0.9) + (popularityScore * 0.1); // 90/10
```

## Comparison with Other Platforms

### IMDB
- Uses vote count primarily
- Weighted rating for top lists
- Similar concept, different implementation

### TMDB
- Uses popularity score (our source)
- Combines multiple factors
- Our approach aligns with their methodology

### Rotten Tomatoes
- Separate audience score and critic score
- We combine into single engagement metric
- More holistic view

## Limitations

1. **Capped Values:** Scores capped at 100 may lose granularity for very popular films
2. **Static Weights:** 70/30 may not be optimal for all use cases
3. **No Time Decay:** Doesn't account for recency (old votes weighted same as new)
4. **Platform-Specific:** Based on TMDB data, may not translate to other platforms

## Future Enhancements

1. **Time Decay:** Weight recent votes/popularity higher
2. **Genre-Specific Weights:** Different weights for different genres
3. **Adaptive Thresholds:** Adjust based on overall collection
4. **Trend Detection:** Track engagement changes over time
5. **Confidence Intervals:** Show uncertainty in engagement score

## Conclusion

Engagement Score provides a **balanced, composite metric** that combines:
- ✅ Historical engagement (votes)
- ✅ Current interest (popularity)
- ✅ Visual representation (progress bar)
- ✅ Clear categorization (High/Moderate/Low)

This makes it a powerful tool for assessing film engagement and making data-driven decisions about content curation and recommendations.
