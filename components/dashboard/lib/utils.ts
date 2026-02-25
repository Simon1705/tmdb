import { format } from 'date-fns/format';
import { Analytics } from './types';

// Process genre distribution data for pie chart
export const processGenreData = (analytics: Analytics | null) => {
  if (!analytics?.genreDistribution) return { pieChartData: [], topGenres: [], otherGenres: [], totalMovies: 0 };

  const genreChartData = Object.entries(analytics.genreDistribution)
    .map(([name, value]) => ({
      name,
      value: value as number,
    }))
    .sort((a, b) => b.value - a.value);

  const topGenres = genreChartData.slice(0, 4);
  const otherGenres = genreChartData.slice(4);
  const othersTotal = otherGenres.reduce((sum, item) => sum + item.value, 0);
  
  const pieChartData = othersTotal > 0 
    ? [...topGenres, { name: 'Others', value: othersTotal }]
    : topGenres;

  const totalMovies = pieChartData.reduce((sum, item) => sum + item.value, 0);
  const pieChartDataWithTotal = pieChartData.map(item => ({
    ...item,
    total: totalMovies,
  }));

  return {
    pieChartData: pieChartDataWithTotal,
    topGenres,
    otherGenres,
    totalMovies,
  };
};

// Process date chart data
export const processDateChartData = (analytics: Analytics | null) => {
  if (!analytics?.moviesPerDate) return [];

  return Object.entries(analytics.moviesPerDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: format(new Date(date), 'MMM dd'),
      fullDate: date,
      count: count as number,
    }));
};

// Process rating distribution data
export const processRatingData = (analytics: Analytics | null) => {
  if (!analytics?.ratingDistribution) return [];

  const ratingRanges = ['0-2', '2-4', '4-6', '6-8', '8-10'];
  return ratingRanges.map(range => {
    const data = analytics.ratingDistribution[range];
    return {
      range,
      count: data?.count || 0,
      avgPopularity: data?.avgPopularity ? parseFloat(data.avgPopularity.toFixed(1)) : 0,
    };
  });
};

// Process genre performance data
export const processGenrePerformanceData = (analytics: Analytics | null) => {
  if (!analytics?.genrePerformance) return [];

  return analytics.genrePerformance
    .slice(0, 8) // Top 8 genres
    .map((item) => ({
      genre: item.genre,
      rating: Number(item.averageRating.toFixed(2)),
      count: item.movieCount,
      confidence: Math.round(item.confidence),
    }));
};
