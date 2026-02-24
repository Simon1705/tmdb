# Analytics Dashboard - Quick Guide

## Chart Overview

### 1. Genre Distribution (Pie Chart)
**What:** Distribusi film berdasarkan genre
**Insight:** Genre mana yang paling banyak di koleksi

### 2. Movies by Date (Bar Chart)
**What:** Timeline penambahan/release film
**Insight:** Trend penambahan film per tanggal

### 3. Rating Distribution & Engagement (Composed Chart) ⭐ NEW
**What:** Distribusi rating + popularity + vote count
**Insight:** 
- Kualitas koleksi film
- Korelasi rating vs popularity
- Hidden gems (rating tinggi, popularity rendah)
- Overhyped content (rating rendah, popularity tinggi)
- Reliability rating (vote count)

**How to Read:**
- **Bars (Amber):** Jumlah film per rating range
- **Line (Purple):** Average popularity per range
- **Tooltip:** Shows count, popularity, votes, engagement level

### 4. Genre Performance (Horizontal Bar) ⭐ ENHANCED
**What:** Weighted rating per genre (confidence-based)
**Insight:**
- Genre mana yang consistently berkualitas
- Reliability per genre (confidence score)
- Fair comparison (tidak bias oleh genre dengan 1 film)

**How to Read:**
- **Bar length:** Weighted rating (for ranking)
- **Tooltip:** Shows weighted score, actual average, movie count, confidence %
- **Longer bar + High confidence = Reliable quality genre**

## Quick Insights

### Finding Hidden Gems
1. Look at Rating Distribution chart
2. Check 8-10 rating range
3. If purple line is LOW → Hidden gems!
4. Hover to see vote count (should be decent)

### Assessing Collection Quality
1. Look at Rating Distribution bars
2. More bars on right (6-10) = Good collection
3. More bars on left (0-4) = Need curation
4. Check if high ratings also have high votes (reliable)

### Finding Best Genres
1. Look at Genre Performance chart
2. Top bars = Best weighted ratings
3. Hover to see confidence %
4. High confidence (>80%) = Reliable
5. Low confidence (<30%) = Need more samples

### Detecting Overhyped Movies
1. Look at Rating Distribution chart
2. Check 0-4 rating ranges
3. If purple line is HIGH → Overhyped content
4. Popular but low quality

## Tooltip Guide

### Rating Distribution Tooltip
```
Rating 6-8
─────────────────────
Movies: 45           ← Jumlah film
Avg Popularity: 127.3 ← Seberapa populer
Avg Votes: 1,234     ← Seberapa banyak votes
─────────────────────
✓ High engagement    ← Reliability indicator
```

**Engagement Levels:**
- ✓ High (≥60 score) - Very reliable, high votes + popularity
- ~ Moderate (30-59 score) - Fairly reliable, decent engagement
- ⚠ Low (<30 score) - Less reliable, limited engagement

**Engagement Score Formula:**
```
Vote Score = (avgVotes / 5000) × 100 (capped at 100)
Popularity Score = (avgPopularity / 500) × 100 (capped at 100)
Engagement Score = (Vote Score × 70%) + (Popularity Score × 30%)
```

**Why Composite Score?**
- Combines historical engagement (votes) + current interest (popularity)
- More balanced than single metric
- 70/30 weighting favors reliable vote data over fluctuating popularity

### Genre Performance Tooltip
```
Drama
─────────────────────
Weighted Score: 8.2  ← For ranking
Actual Avg: 8.5      ← Raw average
Movies: 15           ← Sample size
─────────────────────
Confidence: 100%     ← Reliability
[████████████████]   ← Visual indicator
```

**Confidence Levels:**
- 100% (10+ movies) - Fully reliable
- 50% (5 movies) - Moderately reliable
- 20% (2 movies) - Low reliability
- <2 movies - Filtered out

**NEW: Multi-Factor Confidence (Current):**
```
Composite Confidence = 
  (Sample Size × 50%) +
  (Vote Reliability × 30%) +
  (Rating Consistency × 20%)
```

**Factors:**
- **Sample Size:** Movie count (10+ = 100%)
- **Vote Reliability:** Avg votes per movie (1000+ = 100%)
- **Rating Consistency:** Lower variance = higher confidence

**Example:**
```
Genre: Drama
Movies: 8 → Sample: 80%
Avg Votes: 1,500 → Votes: 100%
StdDev: 0.3 → Consistency: 90%

Composite = (80% × 0.5) + (100% × 0.3) + (90% × 0.2) = 88%
```

See `/docs/GENRE-CONFIDENCE-CALCULATION.md` for detailed explanation.

## Common Questions

### Q: Why is my favorite genre not showing?
**A:** Genre needs minimum 2 movies to appear in Genre Performance chart.

### Q: Why is Genre A ranked lower than Genre B despite higher average?
**A:** Weighted rating considers sample size. Genre B has more movies (higher confidence).

### Q: What's the difference between Weighted Score and Actual Avg?
**A:** 
- **Actual Avg:** Simple average of all ratings
- **Weighted Score:** Adjusted for confidence (more movies = more reliable)

### Q: How do I find hidden gems?
**A:** Look for high rating ranges (8-10) with low popularity line in Rating Distribution chart.

### Q: What does "High engagement" mean?
**A:** Movies in that rating range have many votes (>1000), making ratings more reliable.

### Q: Can I adjust the confidence threshold?
**A:** Yes, edit `minMoviesThreshold` and `confidenceThreshold` in `/app/api/analytics/route.ts`

## Tips & Tricks

### 1. Use Date Filters
- Filter by "Last Synced" to see recent additions
- Filter by "Release Date" to see movie eras
- Compare different time periods

### 2. Cross-Reference Charts
- Check Genre Distribution + Genre Performance together
- Popular genre ≠ High quality genre
- Find balance between quantity and quality

### 3. Look for Patterns
- Does popularity correlate with rating?
- Which genres are consistently good?
- Are newer movies better rated?

### 4. Export Insights
- Take screenshots for reports
- Note down hidden gems to promote
- Track improvements over time

## Keyboard Shortcuts

- **Hover:** Show detailed tooltip
- **Click genre in pie chart:** (Future: Filter other charts)
- **Scroll:** Infinite scroll in movie grid below

## Mobile Tips

- Charts stack vertically on mobile
- Tooltips are touch-friendly
- Swipe to scroll through movies
- Pinch to zoom on charts (if needed)

## Need More Details?

See full documentation:
- `/docs/NEW-CHARTS.md` - Complete chart documentation
- `/docs/WEIGHTED-RATING-ALGORITHM.md` - Algorithm deep dive
- `/docs/RATING-DISTRIBUTION-ENHANCEMENT.md` - Rating chart details
- `/docs/CHART-ENHANCEMENTS-SUMMARY.md` - Technical summary
