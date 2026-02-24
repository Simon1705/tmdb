import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const dateMode = searchParams.get('dateMode') || 'synced'; // 'synced' or 'release'
    
    const dateField = dateMode === 'synced' ? 'updated_at' : 'release_date';

    // Genre distribution and movies list
    let genreQuery = supabase
      .from('movies')
      .select('*');

    if (startDate && endDate) {
      if (dateMode === 'synced') {
        // For updated_at (timestamp), we need to include the full day
        genreQuery = genreQuery
          .gte('updated_at', `${startDate}T00:00:00`)
          .lte('updated_at', `${endDate}T23:59:59`);
      } else {
        // For release_date (date), use as is
        genreQuery = genreQuery
          .gte('release_date', startDate)
          .lte('release_date', endDate);
      }
    }

    const { data: genreData, error: genreError } = await genreQuery;
    if (genreError) throw genreError;

    const genreDistribution = genreData.reduce((acc: Record<string, number>, movie) => {
      acc[movie.genre] = (acc[movie.genre] || 0) + 1;
      return acc;
    }, {});

    // Movies per date
    const moviesPerDate = genreData.reduce((acc: Record<string, number>, movie) => {
      const dateValue = dateMode === 'synced' 
        ? (movie as any).updated_at?.split('T')[0] 
        : (movie as any).release_date;
      if (dateValue) {
        acc[dateValue] = (acc[dateValue] || 0) + 1;
      }
      return acc;
    }, {});

    // Rating distribution with popularity
    const ratingDistribution = genreData.reduce((acc: Record<string, { count: number; totalPopularity: number }>, movie) => {
      const rating = movie.vote_average || 0;
      let range = '';
      if (rating >= 0 && rating < 2) range = '0-2';
      else if (rating >= 2 && rating < 4) range = '2-4';
      else if (rating >= 4 && rating < 6) range = '4-6';
      else if (rating >= 6 && rating < 8) range = '6-8';
      else if (rating >= 8 && rating <= 10) range = '8-10';
      
      if (range) {
        if (!acc[range]) {
          acc[range] = { count: 0, totalPopularity: 0 };
        }
        acc[range].count += 1;
        acc[range].totalPopularity += movie.popularity || 0;
      }
      return acc;
    }, {});

    // Calculate averages for each range
    const ratingDistributionWithMetrics = Object.entries(ratingDistribution).reduce((acc: Record<string, any>, [range, data]) => {
      acc[range] = {
        count: data.count,
        avgPopularity: data.count > 0 ? data.totalPopularity / data.count : 0,
      };
      return acc;
    }, {});

    // Genre performance (average rating per genre with Bayesian average)
    const genreStats = genreData.reduce((acc: Record<string, { 
      total: number; 
      count: number; 
    }>, movie) => {
      const genre = movie.genre;
      const rating = movie.vote_average || 0;
      
      if (!acc[genre]) {
        acc[genre] = { total: 0, count: 0 };
      }
      acc[genre].total += rating;
      acc[genre].count += 1;
      
      return acc;
    }, {});

    // Calculate global mean rating
    const totalRatings = genreData.reduce((sum, movie) => sum + (movie.vote_average || 0), 0);
    const globalMeanRating = genreData.length > 0 ? totalRatings / genreData.length : 0;
    
    // Minimum movies threshold
    const minMoviesThreshold = 3; // Genre must have at least 3 movies
    
    const genrePerformance = Object.entries(genreStats)
      .filter(([_, stats]) => stats.count >= minMoviesThreshold)
      .map(([genre, stats]) => {
        const averageRating = stats.count > 0 ? stats.total / stats.count : 0;
        
        // Simple confidence based on movie count only
        const confidence = Math.min((stats.count / 10) * 100, 100);
        
        return {
          genre,
          averageRating,
          movieCount: stats.count,
          confidence: Math.round(confidence),
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating); // Sort by actual average rating

    // Summary stats
    const totalMovies = genreData.length;
    const mostPopularGenre = Object.entries(genreDistribution)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';
    
    // Calculate average rating across all movies
    const averageRating = totalMovies > 0 
      ? genreData.reduce((sum, movie) => sum + (movie.vote_average || 0), 0) / totalMovies 
      : 0;

    return NextResponse.json({
      genreDistribution,
      moviesPerDate,
      ratingDistribution: ratingDistributionWithMetrics,
      genrePerformance,
      movies: genreData,
      summary: {
        totalMovies,
        mostPopularGenre,
        totalGenres: Object.keys(genreDistribution).length,
        averageRating,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
