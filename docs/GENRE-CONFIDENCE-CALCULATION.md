# Genre Performance - Multi-Factor Confidence Calculation

## Overview

Confidence score untuk Genre Performance telah di-upgrade dari **single-factor** (movie count only) menjadi **multi-factor composite** yang menggabungkan:
1. **Sample Size** (jumlah movie)
2. **Vote Reliability** (average votes per movie)
3. **Rating Consistency** (standard deviation)

## Why Multi-Factor?

### Problem dengan Single Factor (Movie Count Only):

**Scenario 1: Many Movies, Low Engagement**
```
Genre: Action
Movies: 15
Avg Votes: 50 per movie
Avg Rating: 8.0

Old Confidence: 100% (15 movies ≥ 10)
Problem: Low votes = unreliable ratings
```

**Scenario 2: Few Movies, High Variance**
```
Genre: Horror
Movies: 5
Ratings: [9.0, 8.5, 4.0, 3.5, 9.5]
Avg Rating: 6.9

Old Confidence: 50% (5 movies)
Problem: High variance = inconsistent quality
```

**Scenario 3: Few Movies, Highly Consistent**
```
Genre: Drama
Movies: 5
Ratings: [8.2, 8.3, 8.1, 8.4, 8.0]
Avg Rating: 8.2
Avg Votes: 2000 per movie

Old Confidence: 50% (5 movies)
Problem: Undervalued - very consistent + high engagement
```

### Solution: Multi-Factor Confidence

Menggabungkan 3 faktor untuk confidence yang lebih akurat dan nuanced.

## Calculation Formula

### Step 1: Calculate Individual Confidence Factors

#### 1. Sample Size Confidence (0-1)
```typescript
sampleConfidence = min(movieCount / 10, 1.0)
```

**Scaling:**
- 1 movie → 10% confidence
- 5 movies → 50% confidence
- 10+ movies → 100% confidence

**Why 10?**
- Statistical significance typically requires 10+ samples
- Balances between strictness and practicality
- Aligns with Bayesian average threshold

#### 2. Vote Reliability Confidence (0-1)
```typescript
avgVotes = totalVotes / movieCount
voteConfidence = min(avgVotes / 1000, 1.0)
```

**Scaling:**
- 0 votes → 0% confidence
- 500 votes → 50% confidence
- 1000+ votes → 100% confidence

**Why 1000?**
- TMDB considers 1000+ votes as highly reliable
- Aligns with engagement score thresholds
- Provides good distribution

#### 3. Consistency Confidence (0-1)
```typescript
// Calculate standard deviation
variance = Σ(rating - avgRating)² / movieCount
stdDev = √variance

// Invert for confidence (lower stdDev = higher confidence)
consistencyConfidence = max(0, 1 - (stdDev / 3))
```

**Scaling:**
- StdDev 0 → 100% confidence (perfect consistency)
- StdDev 1.5 → 50% confidence (moderate variance)
- StdDev 3+ → 0% confidence (high variance)

**Why 3?**
- Rating scale is 0-10, so max theoretical stdDev ≈ 5
- Practical stdDev for genres typically 0-3
- StdDev > 3 indicates very inconsistent quality

### Step 2: Weighted Composite
```typescript
compositeConfidence = 
  (sampleConfidence × 0.5) +    // 50% weight
  (voteConfidence × 0.3) +       // 30% weight
  (consistencyConfidence × 0.2)  // 20% weight
```

**Weighting Rationale:**
- **50% Sample Size** - Most important, foundation of statistical validity
- **30% Vote Reliability** - Important for rating trustworthiness
- **20% Consistency** - Useful but less critical than sample size

### Step 3: Apply to Bayesian Average
```typescript
weightedRating = (compositeConfidence × avgRating) + 
                 ((1 - compositeConfidence) × globalMean)
```

The composite confidence is used in Bayesian average calculation, making weighted ratings more nuanced.

## Real Examples

### Example 1: High Confidence (All Factors Strong)
```
Genre: Drama
Movies: 15
Avg Rating: 8.2
Avg Votes: 1,500
Ratings: [8.0, 8.1, 8.2, 8.3, 8.4, 8.1, 8.2, 8.3, 8.0, 8.5, 8.2, 8.1, 8.3, 8.2, 8.4]
StdDev: 0.14

Sample Confidence = min(15/10, 1) = 100%
Vote Confidence = min(1500/1000, 1) = 100%
Consistency Confidence = max(0, 1 - 0.14/3) = 95%

Composite = (1.0 × 0.5) + (1.0 × 0.3) + (0.95 × 0.2)
          = 0.5 + 0.3 + 0.19
          = 99%

Result: Very High Confidence ✓✓✓
```

### Example 2: Moderate Confidence (Mixed Factors)
```
Genre: Action
Movies: 6
Avg Rating: 7.8
Avg Votes: 600
Ratings: [8.5, 7.2, 8.0, 7.5, 8.1, 7.5]
StdDev: 0.48

Sample Confidence = min(6/10, 1) = 60%
Vote Confidence = min(600/1000, 1) = 60%
Consistency Confidence = max(0, 1 - 0.48/3) = 84%

Composite = (0.6 × 0.5) + (0.6 × 0.3) + (0.84 × 0.2)
          = 0.3 + 0.18 + 0.168
          = 65%

Result: Moderate Confidence ✓✓
```

### Example 3: Low Confidence (Weak Factors)
```
Genre: Horror
Movies: 3
Avg Rating: 6.5
Avg Votes: 200
Ratings: [8.5, 5.0, 6.0]
StdDev: 1.8

Sample Confidence = min(3/10, 1) = 30%
Vote Confidence = min(200/1000, 1) = 20%
Consistency Confidence = max(0, 1 - 1.8/3) = 40%

Composite = (0.3 × 0.5) + (0.2 × 0.3) + (0.4 × 0.2)
          = 0.15 + 0.06 + 0.08
          = 29%

Result: Low Confidence ⚠
```

### Example 4: Deceptive High Sample (Low Votes)
```
Genre: Comedy
Movies: 12
Avg Rating: 7.5
Avg Votes: 80
Ratings: [7.0, 7.5, 8.0, 7.2, 7.8, 7.3, 7.6, 7.4, 7.7, 7.5, 7.1, 7.9]
StdDev: 0.29

Sample Confidence = min(12/10, 1) = 100%
Vote Confidence = min(80/1000, 1) = 8%
Consistency Confidence = max(0, 1 - 0.29/3) = 90%

Composite = (1.0 × 0.5) + (0.08 × 0.3) + (0.9 × 0.2)
          = 0.5 + 0.024 + 0.18
          = 70%

Result: Good Confidence ✓✓
Note: Sample size is great, but low votes drag down overall confidence
```

### Example 5: Consistent but Small Sample
```
Genre: Thriller
Movies: 4
Avg Rating: 8.5
Avg Votes: 1,200
Ratings: [8.4, 8.5, 8.6, 8.5]
StdDev: 0.08

Sample Confidence = min(4/10, 1) = 40%
Vote Confidence = min(1200/1000, 1) = 100%
Consistency Confidence = max(0, 1 - 0.08/3) = 97%

Composite = (0.4 × 0.5) + (1.0 × 0.3) + (0.97 × 0.2)
          = 0.2 + 0.3 + 0.194
          = 69%

Result: Good Confidence ✓✓
Note: Small sample, but high votes + consistency boost confidence
```

## Tooltip Display

### Enhanced Tooltip
```
Drama
─────────────────────────
Weighted Score: 8.2 ⭐
Actual Avg: 8.5 ⭐
Movies: 15
Avg Votes: 1,500
Consistency: ±0.14
─────────────────────────
Overall Confidence: 99%
[████████████████████] 

• Sample Size: 100%
• Vote Reliability: 100%
• Consistency: 95%
```

### Breakdown Explanation
- **Sample Size:** Based on movie count (10+ = 100%)
- **Vote Reliability:** Based on avg votes (1000+ = 100%)
- **Consistency:** Based on rating variance (lower = better)

## Confidence Levels

### Very High (≥80%)
**Characteristics:**
- Many movies (10+)
- High votes (1000+)
- Low variance (<0.5 stdDev)

**Interpretation:**
- Extremely reliable
- Safe for recommendations
- Statistically significant

### High (60-79%)
**Characteristics:**
- Good sample (6-10 movies)
- Decent votes (500-1000)
- Moderate variance (0.5-1.0 stdDev)

**Interpretation:**
- Reliable
- Good for recommendations
- Fairly confident

### Moderate (40-59%)
**Characteristics:**
- Small sample (3-5 movies)
- Low votes (200-500)
- Some variance (1.0-1.5 stdDev)

**Interpretation:**
- Somewhat reliable
- Use with caution
- Need more data

### Low (<40%)
**Characteristics:**
- Very small sample (<3 movies)
- Very low votes (<200)
- High variance (>1.5 stdDev)

**Interpretation:**
- Unreliable
- Avoid recommendations
- Insufficient data

## Use Cases

### 1. Genre Recommendation Priority
**High confidence genres:**
- Prioritize for recommendations
- Trust the weighted ratings
- Safe choices

**Low confidence genres:**
- Deprioritize or exclude
- Need more data
- Risky choices

### 2. Data Collection Strategy
**Low vote confidence:**
- Focus on promoting these genres
- Encourage more ratings
- Sync more popular movies

**Low sample confidence:**
- Sync more movies in this genre
- Diversify collection
- Build sample size

**Low consistency confidence:**
- Review individual movies
- May have quality issues
- Consider curation

### 3. Quality Assessment
**High consistency + High rating:**
- Consistently good genre
- Reliable quality
- Strong recommendation

**Low consistency + High rating:**
- Hit or miss genre
- Some gems, some duds
- Selective recommendation

### 4. Trend Detection
**Increasing votes over time:**
- Genre gaining popularity
- Monitor for trends
- Potential growth area

**Decreasing consistency:**
- Quality declining
- Review recent additions
- May need curation

## Configuration

### Adjusting Weights

In `/app/api/analytics/route.ts`:

```typescript
// Current (Balanced)
const compositeConfidence = 
  (sampleConfidence * 0.5) +
  (voteConfidence * 0.3) +
  (consistencyConfidence * 0.2);
```

**Sample-Focused (Conservative):**
```typescript
const compositeConfidence = 
  (sampleConfidence * 0.7) +
  (voteConfidence * 0.2) +
  (consistencyConfidence * 0.1);
```

**Vote-Focused (Engagement Priority):**
```typescript
const compositeConfidence = 
  (sampleConfidence * 0.4) +
  (voteConfidence * 0.4) +
  (consistencyConfidence * 0.2);
```

**Consistency-Focused (Quality Priority):**
```typescript
const compositeConfidence = 
  (sampleConfidence * 0.4) +
  (voteConfidence * 0.2) +
  (consistencyConfidence * 0.4);
```

### Adjusting Thresholds

```typescript
// Sample size (default: 10)
const sampleConfidence = Math.min(stats.count / 10, 1);

// Vote reliability (default: 1000)
const voteConfidence = Math.min(avgVotes / 1000, 1);

// Consistency (default: 3)
const consistencyConfidence = Math.max(0, 1 - (stdDev / 3));
```

## Comparison: Old vs New

### Scenario: Action Genre
```
Movies: 6
Avg Rating: 7.8
Avg Votes: 300
StdDev: 1.2

OLD (Movie Count Only):
Confidence = 6/10 = 60%

NEW (Multi-Factor):
Sample = 60%
Votes = 30%
Consistency = 60%
Composite = (0.6×0.5) + (0.3×0.3) + (0.6×0.2) = 51%

Difference: -9% (more conservative, more accurate)
```

### Scenario: Drama Genre
```
Movies: 8
Avg Rating: 8.3
Avg Votes: 1,500
StdDev: 0.3

OLD (Movie Count Only):
Confidence = 8/10 = 80%

NEW (Multi-Factor):
Sample = 80%
Votes = 100%
Consistency = 90%
Composite = (0.8×0.5) + (1.0×0.3) + (0.9×0.2) = 88%

Difference: +8% (rewards high engagement + consistency)
```

## Benefits

✅ **More Accurate:** Considers multiple reliability factors
✅ **More Nuanced:** Distinguishes between different types of confidence
✅ **More Transparent:** Shows breakdown of confidence sources
✅ **More Actionable:** Identifies specific areas for improvement
✅ **More Fair:** Rewards consistency and engagement, not just quantity

## Conclusion

Multi-factor confidence provides a **holistic, statistically sound** approach to assessing genre performance reliability by combining:
- Sample size (statistical validity)
- Vote reliability (rating trustworthiness)
- Rating consistency (quality stability)

This makes genre rankings more accurate and recommendations more reliable.
