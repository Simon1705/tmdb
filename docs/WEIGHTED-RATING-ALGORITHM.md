# Weighted Rating Algorithm

## Problem Statement

Ketika menghitung "best genre" berdasarkan average rating, kita menghadapi masalah statistik klasik:

**Scenario:**
- Genre A: 1 film dengan rating 9.5
- Genre B: 50 film dengan average rating 8.2

Jika kita hanya menggunakan simple average, Genre A akan ranked lebih tinggi. Tapi apakah ini fair? Genre A hanya punya 1 sample, sedangkan Genre B punya 50 samples yang konsisten bagus.

## Solution: Bayesian Average (Weighted Rating)

### Formula

```
Confidence = min(sampleSize / confidenceThreshold, 1.0)
WeightedRating = (Confidence × SampleAverage) + ((1 - Confidence) × PriorMean)
```

### Components

1. **Sample Size (n)**: Jumlah film dalam genre
2. **Confidence Threshold (m)**: Jumlah minimum untuk full confidence (default: 10)
3. **Sample Average (R)**: Average rating dari genre tersebut
4. **Prior Mean (C)**: Global average rating dari semua film
5. **Confidence Score**: Seberapa yakin kita dengan sample average (0-100%)

### How It Works

#### Step 1: Calculate Confidence
```javascript
confidence = Math.min(movieCount / 10, 1.0)
```

Examples:
- 1 movie → 10% confidence
- 5 movies → 50% confidence
- 10+ movies → 100% confidence

#### Step 2: Calculate Weighted Rating
```javascript
weightedRating = (confidence × averageRating) + ((1 - confidence) × globalMean)
```

The weighted rating is a blend between:
- The genre's actual average (weighted by confidence)
- The global average (weighted by lack of confidence)

### Real Examples

Assume global mean rating = 7.0

#### Example 1: Low Sample Size
```
Genre: Horror
Movies: 2
Average Rating: 9.0
Confidence: 2/10 = 20%

Weighted Rating = (0.2 × 9.0) + (0.8 × 7.0)
                = 1.8 + 5.6
                = 7.4
```

#### Example 2: Medium Sample Size
```
Genre: Action
Movies: 5
Average Rating: 8.5
Confidence: 5/10 = 50%

Weighted Rating = (0.5 × 8.5) + (0.5 × 7.0)
                = 4.25 + 3.5
                = 7.75
```

#### Example 3: High Sample Size
```
Genre: Drama
Movies: 15
Average Rating: 8.0
Confidence: 15/10 = 100% (capped at 1.0)

Weighted Rating = (1.0 × 8.0) + (0.0 × 7.0)
                = 8.0 + 0
                = 8.0
```

### Comparison Table

| Genre | Movies | Avg Rating | Confidence | Weighted | Rank (Simple) | Rank (Weighted) |
|-------|--------|------------|------------|----------|---------------|-----------------|
| Horror | 2 | 9.0 | 20% | 7.4 | 1st ⭐ | 5th |
| Mystery | 3 | 8.8 | 30% | 7.64 | 2nd | 4th |
| Action | 5 | 8.5 | 50% | 7.75 | 3rd | 3rd |
| Comedy | 8 | 8.2 | 80% | 7.96 | 4th | 2nd |
| Drama | 15 | 8.0 | 100% | 8.0 | 5th | 1st ⭐ |

**Insight:** Drama dengan 15 films @ 8.0 avg lebih reliable daripada Horror dengan 2 films @ 9.0 avg.

## Additional Safeguards

### Minimum Threshold Filter
```javascript
const minMoviesThreshold = 2;
genres = genres.filter(g => g.movieCount >= minMoviesThreshold);
```

Genres dengan hanya 1 film di-exclude completely untuk menghindari noise.

### Confidence Visualization
Tooltip menampilkan:
- **Weighted Score**: Yang digunakan untuk ranking
- **Actual Average**: Raw data untuk transparency
- **Confidence %**: Visual indicator reliability
- **Movie Count**: Sample size

## Why This Matters

### Without Weighted Rating
```
Top 5 Genres:
1. Documentary (1 movie, 9.5 avg) ❌ Misleading
2. Biography (1 movie, 9.2 avg) ❌ Misleading
3. Musical (2 movies, 8.9 avg) ⚠️ Low confidence
4. Drama (50 movies, 8.5 avg) ✅ Reliable
5. Action (45 movies, 8.3 avg) ✅ Reliable
```

### With Weighted Rating
```
Top 5 Genres:
1. Drama (50 movies, 8.5 avg, 100% conf) ✅ Reliable
2. Action (45 movies, 8.3 avg, 100% conf) ✅ Reliable
3. Comedy (30 movies, 8.1 avg, 100% conf) ✅ Reliable
4. Thriller (20 movies, 8.0 avg, 100% conf) ✅ Reliable
5. Musical (2 movies, 8.9 avg, 20% conf) ⚠️ Noted as low confidence
```

## Industry Usage

This approach is used by:
- **IMDB**: Top 250 movies list
- **TMDB**: Popular movies ranking
- **Rotten Tomatoes**: Audience scores
- **Amazon**: Product ratings
- **Yelp**: Restaurant ratings

## Configuration

### Adjustable Parameters

```typescript
// In /app/api/analytics/route.ts

// Minimum movies required to show genre
const minMoviesThreshold = 2; // Increase for stricter filtering

// Movies needed for 100% confidence
const confidenceThreshold = 10; // Increase for more conservative weighting
```

### Tuning Guidelines

**Conservative (Favor established genres):**
```typescript
minMoviesThreshold = 5;
confidenceThreshold = 20;
```

**Balanced (Current):**
```typescript
minMoviesThreshold = 2;
confidenceThreshold = 10;
```

**Exploratory (Show emerging genres):**
```typescript
minMoviesThreshold = 1;
confidenceThreshold = 5;
```

## Mathematical Properties

### Asymptotic Behavior
- As n → 0: Weighted rating → Global mean
- As n → ∞: Weighted rating → Sample average
- Smooth transition between the two extremes

### Bias-Variance Tradeoff
- **Low confidence**: High bias (toward global mean), low variance
- **High confidence**: Low bias, higher variance (trust the sample)
- Optimal balance based on sample size

## Conclusion

Weighted rating provides:
- ✅ Fair comparison across different sample sizes
- ✅ Transparent confidence scoring
- ✅ Protection against outliers
- ✅ Statistically sound methodology
- ✅ Industry-standard approach

Users can see both the weighted score (for ranking) and actual average (for transparency) in the tooltip, making the system both accurate and transparent.
