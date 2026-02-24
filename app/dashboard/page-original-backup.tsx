'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, Area } from 'recharts';
import { Calendar, TrendingUp, Film, Award, Database, BarChart3, Star, X, Clock, Globe } from 'lucide-react';
import { subMonths, format } from 'date-fns';
import Link from 'next/link';
import { getGenreName } from '@/lib/tmdb';

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4', '#F97316', '#6366F1'];

// Custom Tooltip Components
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = payload[0].payload.total || 0;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3">
        <p className="font-bold text-gray-900 mb-1">{data.name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{data.value}</span> movies
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {percentage}% of total
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3">
        <p className="font-bold text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{payload[0].value}</span> {payload[0].value === 1 ? 'movie' : 'movies'}
        </p>
      </div>
    );
  }
  return null;
};

const CustomRatingPopularityTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const barData = payload.find((p: any) => p.dataKey === 'count');
    const lineData = payload.find((p: any) => p.dataKey === 'avgPopularity');
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3 min-w-[180px]">
        <p className="font-bold text-gray-900 mb-2">Rating {label}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Movies:</span>
            <span className="font-semibold text-blue-600">{barData?.value || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Avg Popularity:</span>
            <span className="font-semibold text-purple-600">
              {lineData?.value ? parseFloat(lineData.value).toFixed(1) : '0.0'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const CustomGenrePerformanceTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3 min-w-[180px]">
        <p className="font-bold text-gray-900 mb-2">{data.genre}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Average Rating:</span>
            <span className="font-semibold text-emerald-600">{data.rating} ⭐</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Movies:</span>
            <span className="font-semibold text-gray-700">{data.count}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Confidence:</span>
              <span className="text-xs font-bold text-blue-600">{data.confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${data.confidence}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 italic">
              {data.count} {data.count === 1 ? 'movie' : 'movies'} • 10+ = 100%
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const defaultStartDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
  const defaultEndDate = format(new Date(), 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [dateMode, setDateMode] = useState<'synced' | 'release'>('synced');
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    dateMode: 'synced' as 'synced' | 'release',
  });
  const [quickPreset, setQuickPreset] = useState<'today' | 'this-month' | 'last-30' | 'last-3' | 'last-6' | 'last-year' | 'custom'>('last-30');
  const [displayedMovies, setDisplayedMovies] = useState(24);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'title' | 'date'>('rating');
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [personDetails, setPersonDetails] = useState<any>(null);
  const [loadingPerson, setLoadingPerson] = useState(false);
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  const isDateRangeInvalid = new Date(startDate).getTime() > new Date(endDate).getTime();
  const isFilterDirty =
    startDate !== appliedFilters.startDate ||
    endDate !== appliedFilters.endDate ||
    dateMode !== appliedFilters.dateMode;

  useEffect(() => {
    fetchAnalytics();
    setDisplayedMovies(24); // Reset to 24 when filters change
    setLoadedImages(new Set()); // Reset loaded images
  }, [appliedFilters.startDate, appliedFilters.endDate, appliedFilters.dateMode]);

  const handleImageLoad = (movieId: string) => {
    setLoadedImages(prev => new Set(prev).add(movieId));
  };

  const openMovieModal = (movie: any) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    setIsModalClosing(false);
    document.body.style.overflow = 'hidden';
    // Trigger animation after mount
    setTimeout(() => {
      setIsModalMounted(true);
    }, 10);
    // Fetch additional details
    fetchMovieDetails(movie.api_id);
  };

  const fetchMovieDetails = async (apiId: number) => {
    setLoadingDetails(true);
    setMovieDetails(null);
    try {
      const response = await fetch(`/api/movies/${apiId}/details`);
      if (response.ok) {
        const data = await response.json();
        setMovieDetails(data);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const openPersonModal = async (personId: number, personName: string) => {
    setSelectedPerson({ id: personId, name: personName });
    setIsPersonModalOpen(true);
    setLoadingPerson(true);
    setPersonDetails(null);
    document.body.style.overflow = 'hidden';
    
    try {
      const response = await fetch(`/api/people/${personId}`);
      if (response.ok) {
        const data = await response.json();
        setPersonDetails(data);
      }
    } catch (error) {
      console.error('Error fetching person details:', error);
    } finally {
      setLoadingPerson(false);
    }
  };

  const closePersonModal = () => {
    setIsPersonModalOpen(false);
    setSelectedPerson(null);
    setPersonDetails(null);
    document.body.style.overflow = 'unset';
  };

  const closeMovieModal = () => {
    setIsModalMounted(false);
    setIsModalClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedMovie(null);
      setIsModalClosing(false);
      setMovieDetails(null);
      document.body.style.overflow = 'unset';
    }, 250);
  };

  const getSortedMovies = () => {
    if (!analytics?.movies) return [];
    
    const movies = [...analytics.movies];
    
    switch (sortBy) {
      case 'rating':
        return movies.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'popularity':
        return movies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      case 'title':
        return movies.sort((a, b) => a.title.localeCompare(b.title));
      case 'date':
        return movies.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
      default:
        return movies;
    }
  };

  const sortedMovies = getSortedMovies();

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !analytics?.movies) return;
      
      const sortedMovies = getSortedMovies();
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = document.documentElement.scrollHeight - 500;
      
      if (scrollPosition >= bottomPosition && displayedMovies < sortedMovies.length) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setDisplayedMovies(prev => Math.min(prev + 24, sortedMovies.length));
          setIsLoadingMore(false);
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedMovies, analytics, isLoadingMore, sortBy]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/analytics?startDate=${appliedFilters.startDate}&endDate=${appliedFilters.endDate}&dateMode=${appliedFilters.dateMode}`
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: 'today' | 'this-month' | 'last-30' | 'last-3' | 'last-6' | 'last-year') => {
    const today = new Date();
    const todayFormatted = format(today, 'yyyy-MM-dd');
    let nextStartDate = todayFormatted;

    if (preset === 'this-month') {
      const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
      nextStartDate = format(firstDate, 'yyyy-MM-dd');
    } else if (preset === 'last-30') {
      nextStartDate = format(subMonths(today, 1), 'yyyy-MM-dd');
    } else if (preset === 'last-3') {
      nextStartDate = format(subMonths(today, 3), 'yyyy-MM-dd');
    } else if (preset === 'last-6') {
      nextStartDate = format(subMonths(today, 6), 'yyyy-MM-dd');
    } else if (preset === 'last-year') {
      nextStartDate = format(subMonths(today, 12), 'yyyy-MM-dd');
    }

    setStartDate(nextStartDate);
    setEndDate(todayFormatted);
    setQuickPreset(preset);
  };

  const handleApplyFilter = () => {
    if (isDateRangeInvalid) return;

    setAppliedFilters({
      startDate,
      endDate,
      dateMode,
    });
  };

  const resetToLastMonth = () => {
    applyPreset('last-30');
  };

  const genreChartData = Object.entries(analytics?.genreDistribution || {})
    .map(([name, value]) => ({
      name,
      value: value as number,
    }))
    .sort((a, b) => b.value - a.value); // Sort by value descending

  // Group small genres into "Others"
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

  const dateChartData = Object.entries(analytics?.moviesPerDate || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: format(new Date(date), 'MMM dd'),
      fullDate: date,
      count,
    }));

  // Limit bar chart to last 20 data points for better readability
  const limitedDateChartData = dateChartData.slice(-20);

  // Rating distribution data with popularity
  const ratingRanges = ['0-2', '2-4', '4-6', '6-8', '8-10'];
  const ratingChartData = ratingRanges.map(range => {
    const data = analytics?.ratingDistribution?.[range];
    return {
      range,
      count: data?.count || 0,
      avgPopularity: data?.avgPopularity ? parseFloat(data.avgPopularity.toFixed(1)) : 0,
    };
  });

  // Genre performance data
  const genrePerformanceData = (analytics?.genrePerformance || [])
    .slice(0, 8) // Top 8 genres
    .map((item: any) => ({
      genre: item.genre,
      rating: parseFloat(item.averageRating.toFixed(2)),
      count: item.movieCount,
      confidence: Math.round(item.confidence),
    }));

  const hasData = pieChartData.length > 0 || dateChartData.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-10 lg:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
            <p className="text-indigo-100/80 text-sm">Movie data insights and visualizations</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Date Filter */}
        <div className="bg-slate-800/40 border border-white/15 rounded-2xl shadow-xl p-6 mb-8">
          {/* Date Mode Toggle */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <label className="block text-sm font-semibold text-indigo-100 mb-3">
              Filter By
            </label>
            <div className="inline-flex rounded-lg border border-white/20 bg-slate-800/60 p-1 shadow-sm">
              <button
                onClick={() => {
                  setDateMode('synced');
                  setTimeout(() => {
                    setAppliedFilters({
                      startDate,
                      endDate,
                      dateMode: 'synced',
                    });
                  }, 0);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  dateMode === 'synced'
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-indigo-100 hover:text-white hover:bg-white/5'
                }`}
              >
                🔄 Last Synced
              </button>
              <button
                onClick={() => {
                  setDateMode('release');
                  setTimeout(() => {
                    setAppliedFilters({
                      startDate,
                      endDate,
                      dateMode: 'release',
                    });
                  }, 0);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  dateMode === 'release'
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-indigo-100 hover:text-white hover:bg-white/5'
                }`}
              >
                🎬 Release Date
              </button>
            </div>
            <p className="text-xs text-indigo-100/80 mt-2">
              {dateMode === 'synced' 
                ? '🔄 Shows movies by their last sync/update date' 
                : '🎥 Shows movies by their theatrical release date'}
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500 rounded-lg shadow-sm">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Date Range Filter</h3>
                <p className="text-sm text-indigo-100/80">Select period to analyze</p>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-indigo-100 mb-2">
                  From
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-inner shadow-black/10 hover:border-white/25"
                  />
                </div>
              </div>
              
              <div className="hidden sm:flex items-end pb-3">
                <div className="w-8 h-0.5 bg-white/20"></div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-semibold text-indigo-100 mb-2">
                  To
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-inner shadow-black/10 hover:border-white/25"
                  />
                </div>
              </div>
              
              <button
                onClick={() => {
                  setStartDate(format(subMonths(new Date(), 1), 'yyyy-MM-dd'));
                  setEndDate(format(new Date(), 'yyyy-MM-dd'));
                }}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/15 hover:border-white/30 transition-all font-semibold shadow-md shadow-black/10 whitespace-nowrap cursor-pointer"
              >
                Reset to Last Month
              </button>

              <button
                onClick={handleApplyFilter}
                disabled={isDateRangeInvalid || !isFilterDirty}
                className={`px-6 py-3 rounded-lg font-semibold shadow-md whitespace-nowrap cursor-pointer transition-all ${
                  isDateRangeInvalid || !isFilterDirty
                    ? 'bg-gray-600 border border-gray-500 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 hover:border-indigo-400 shadow-indigo-500/30'
                }`}
              >
                {isFilterDirty ? 'Apply Filter' : 'Applied'}
              </button>
            </div>
          </div>
          
          {/* Quick Filters */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs font-medium text-indigo-100/80 mb-2">Quick Select:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const today = format(new Date(), 'yyyy-MM-dd');
                  setStartDate(today);
                  setEndDate(today);
                  setTimeout(() => {
                    setAppliedFilters({
                      startDate: today,
                      endDate: today,
                      dateMode,
                    });
                  }, 0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
                  appliedFilters.startDate === format(new Date(), 'yyyy-MM-dd') && appliedFilters.endDate === format(new Date(), 'yyyy-MM-dd')
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-indigo-400'
                    : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => {
                  const today = format(new Date(), 'yyyy-MM-dd');
                  const firstDay = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
                  setStartDate(firstDay);
                  setEndDate(today);
                  setTimeout(() => {
                    setAppliedFilters({
                      startDate: firstDay,
                      endDate: today,
                      dateMode,
                    });
                  }, 0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
                  appliedFilters.startDate === format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd') && appliedFilters.endDate === format(new Date(), 'yyyy-MM-dd')
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-indigo-400'
                    : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => {
                  const today = format(new Date(), 'yyyy-MM-dd');
                  const last30 = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
                  setStartDate(last30);
                  setEndDate(today);
                  setTimeout(() => {
                    setAppliedFilters({
                      startDate: last30,
                      endDate: today,
                      dateMode,
                    });
                  }, 0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
                  appliedFilters.startDate === format(subMonths(new Date(), 1), 'yyyy-MM-dd') && appliedFilters.endDate === format(new Date(), 'yyyy-MM-dd')
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-indigo-400'
                    : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => {
                  const today = format(new Date(), 'yyyy-MM-dd');
                  const last3 = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
                  setStartDate(last3);
                  setEndDate(today);
                  setTimeout(() => {
                    setAppliedFilters({
                      startDate: last3,
                      endDate: today,
                      dateMode,
                    });
                  }, 0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
                  appliedFilters.startDate === format(subMonths(new Date(), 3), 'yyyy-MM-dd') && appliedFilters.endDate === format(new Date(), 'yyyy-MM-dd')
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-indigo-400'
                    : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                Last 3 Months
              </button>
              <button
                onClick={() => {
                  const today = format(new Date(), 'yyyy-MM-dd');
                  const last6 = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
                  setStartDate(last6);
                  setEndDate(today);
                  setTimeout(() => {
                    setAppliedFilters({
                      startDate: last6,
                      endDate: today,
                      dateMode,
                    });
                  }, 0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
                  appliedFilters.startDate === format(subMonths(new Date(), 6), 'yyyy-MM-dd') && appliedFilters.endDate === format(new Date(), 'yyyy-MM-dd')
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-indigo-400'
                    : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                Last 6 Months
              </button>
              <button
                onClick={() => {
                  const today = format(new Date(), 'yyyy-MM-dd');
                  const lastYear = format(subMonths(new Date(), 12), 'yyyy-MM-dd');
                  setStartDate(lastYear);
                  setEndDate(today);
                  setTimeout(() => {
                    setAppliedFilters({
                      startDate: lastYear,
                      endDate: today,
                      dateMode,
                    });
                  }, 0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
                  appliedFilters.startDate === format(subMonths(new Date(), 12), 'yyyy-MM-dd') && appliedFilters.endDate === format(new Date(), 'yyyy-MM-dd')
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 border-indigo-400'
                    : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
                }`}
              >
                Last Year
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Info */}
        <div className="bg-slate-800/40 border border-white/15 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-indigo-100">
              Showing movies {dateMode === 'synced' ? 'synced' : 'released'} from <span className="font-semibold text-white">{format(new Date(startDate), 'MMM dd, yyyy')}</span> to <span className="font-semibold text-white">{format(new Date(endDate), 'MMM dd, yyyy')}</span>
              <span className="text-indigo-200 ml-2">({Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days)</span>
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/40 border border-white/15 rounded-xl shadow-xl p-6 hover:-translate-y-1 hover:border-white/25 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-100/80">Total Movies</p>
                {loading ? (
                  <div className="h-9 w-16 bg-white/10 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mt-1">{analytics?.summary?.totalMovies || 0}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-white/15 rounded-xl shadow-xl p-6 hover:-translate-y-1 hover:border-white/25 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-100/80">Most Popular Genre</p>
                {loading ? (
                  <div className="h-8 w-24 bg-white/10 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-2xl font-bold text-white mt-1 truncate">{analytics?.summary?.mostPopularGenre}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-white/15 rounded-xl shadow-xl p-6 hover:-translate-y-1 hover:border-white/25 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-100/80">Total Genres</p>
                {loading ? (
                  <div className="h-9 w-16 bg-white/10 animate-pulse rounded mt-1"></div>
                ) : (
                  <p className="text-3xl font-bold text-white mt-1">{analytics?.summary?.totalGenres || 0}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Loading Skeleton for Charts */}
            <div className="bg-slate-800/40 rounded-xl shadow-xl p-6 border border-white/15">
              <div className="h-6 w-48 bg-white/10 animate-pulse rounded mb-6"></div>
              <div className="h-[300px] bg-white/10 animate-pulse rounded"></div>
            </div>
            <div className="bg-slate-800/40 rounded-xl shadow-xl p-6 border border-white/15">
              <div className="h-6 w-48 bg-white/10 animate-pulse rounded mb-6"></div>
              <div className="h-[300px] bg-white/10 animate-pulse rounded"></div>
            </div>
          </div>
        ) : !hasData ? (
          <div className="bg-slate-800/40 rounded-2xl shadow-xl p-12 text-center border border-white/15">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-10 h-10 text-indigo-200" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
              <p className="text-indigo-100/80 mb-6">
                No movies found in the selected date range. Try adjusting your filters or sync data first.
              </p>
              <Link
                href="/data-management"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors font-medium shadow-lg shadow-indigo-500/30"
              >
                <Database className="w-4 h-4" />
                Go to Data Management
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-slate-800/40 rounded-2xl shadow-xl p-6 border border-white/15 hover:border-white/25 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Genre Distribution</h2>
                <p className="text-sm text-indigo-100/80 mt-1">Top genres by movie count</p>
              </div>
              <div className="px-3 py-1 bg-white/10 text-indigo-100 rounded-full text-xs font-semibold shadow-sm border border-white/20">
                Pie Chart
              </div>
            </div>
            
            {/* Chart and Legend Side by Side */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Chart */}
              <div className="flex-shrink-0 w-full lg:w-auto">
                <ResponsiveContainer width={280} height={280}>
                  <PieChart>
                    <Pie
                      data={pieChartDataWithTotal}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={3}
                      animationBegin={0}
                      animationDuration={800}
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(null)}
                    >
                      {pieChartDataWithTotal.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === 'Others' ? '#9CA3AF' : COLORS[index % COLORS.length]}
                          className="transition-all cursor-pointer"
                          style={{
                            opacity: activePieIndex === null || activePieIndex === index ? 1 : 0.3,
                            filter: activePieIndex === index ? 'brightness(1.2)' : 'none',
                          }}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomPieTooltip />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend - Right Side */}
              <div className="flex-1 w-full">
                <div className="space-y-2">
                  {pieChartData.map((entry: any, index: number) => (
                    <div 
                      key={index}
                      onMouseEnter={() => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(null)}
                      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-all cursor-pointer group ${
                        activePieIndex === index
                          ? 'bg-white/15 border-white/40 scale-105 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div 
                          className={`rounded-full flex-shrink-0 transition-all ${
                            activePieIndex === index ? 'w-5 h-5 ring-2 ring-white/50' : 'w-4 h-4'
                          }`}
                          style={{ backgroundColor: entry.name === 'Others' ? '#9CA3AF' : COLORS[index % COLORS.length] }}
                        ></div>
                        <span className={`text-sm font-medium truncate transition-colors ${
                          activePieIndex === index ? 'text-white' : 'text-indigo-100 group-hover:text-white'
                        }`}>
                          {entry.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-lg font-bold transition-colors ${
                          activePieIndex === index ? 'text-white' : 'text-white'
                        }`}>
                          {entry.value}
                        </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded transition-all ${
                          activePieIndex === index 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/10 text-indigo-200'
                        }`}>
                          {((entry.value / totalMovies) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Show info if data was grouped */}
            {otherGenres.length > 0 && (
              <div className="mt-4 text-xs text-indigo-200 bg-white/5 rounded-lg p-2 border border-white/10">
                ℹ️ Showing top 4 genres. {otherGenres.length} other genres grouped as "Others"
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-800/40 rounded-2xl shadow-xl p-6 border border-white/15 hover:border-white/25 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Movies by {dateMode === 'synced' ? 'Sync' : 'Release'} Date</h2>
                <p className="text-sm text-indigo-100/80 mt-1">Recent timeline distribution</p>
              </div>
              <div className="px-3 py-1 bg-white/10 text-emerald-100 rounded-full text-xs font-semibold shadow-sm border border-white/20">
                Bar Chart
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart 
                data={limitedDateChartData}
                margin={{ top: 5, right: 5, left: -20, bottom: limitedDateChartData.length > 10 ? 5 : 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#E5E7EB', fontSize: 11 }}
                  tickLine={{ stroke: '#475569' }}
                  angle={limitedDateChartData.length > 10 ? -30 : 0}
                  textAnchor={limitedDateChartData.length > 10 ? 'end' : 'middle'}
                  height={limitedDateChartData.length > 10 ? 70 : 30}
                  dy={limitedDateChartData.length > 10 ? 10 : 0}
                />
                <YAxis 
                  tick={{ fill: '#E5E7EB', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  content={<CustomBarTooltip />} 
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(#colorGradient)" 
                  name="Movies"
                  radius={[8, 8, 0, 0]}
                  animationBegin={0}
                  animationDuration={800}
                  className="hover:opacity-80 transition-opacity"
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            
            {/* Stats summary */}
            <div className="mt-3 flex items-center justify-between text-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <span className="text-indigo-100/80">Total Movies:</span>
                <span className="font-bold text-white">{dateChartData.reduce((sum, item) => sum + (item.count as number), 0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-100/80">Showing:</span>
                <span className="font-bold text-white">{limitedDateChartData.length} of {dateChartData.length} days</span>
              </div>
            </div>
            
            {/* Show info if data was limited */}
            {dateChartData.length > 20 && (
              <div className="mt-3 text-xs text-indigo-200 bg-white/5 rounded-lg p-2 border border-white/10">
                ℹ️ Showing last 20 dates for better readability. Total: {dateChartData.length} dates
              </div>
            )}
          </div>

          {/* Rating Distribution Chart */}
          {/* Rating Distribution & Popularity Chart */}
          <div className="bg-slate-800/40 rounded-2xl shadow-xl p-6 border border-white/15 hover:border-white/25 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Rating Distribution & Popularity</h2>
                <p className="text-sm text-indigo-100/80 mt-1">Movie count by rating with average popularity</p>
              </div>
              <div className="px-3 py-1 bg-white/10 text-amber-100 rounded-full text-xs font-semibold shadow-sm border border-white/20">
                Composed Chart
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart 
                data={ratingChartData}
                margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: '#E5E7EB', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  label={{ value: 'Rating Range', position: 'insideBottom', offset: -5, fill: '#E5E7EB', fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fill: '#E5E7EB', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  allowDecimals={false}
                  label={{ value: 'Movie Count', angle: -90, position: 'insideLeft', fill: '#E5E7EB', fontSize: 11 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: '#E5E7EB', fontSize: 12 }}
                  tickLine={{ stroke: '#475569' }}
                  label={{ value: 'Avg Popularity', angle: 90, position: 'insideRight', fill: '#E5E7EB', fontSize: 11 }}
                />
                <Tooltip 
                  content={<CustomRatingPopularityTooltip />} 
                  cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="circle"
                />
                <Bar 
                  yAxisId="left"
                  dataKey="count" 
                  fill="url(#ratingGradient)" 
                  name="Movies"
                  radius={[8, 8, 0, 0]}
                  animationBegin={0}
                  animationDuration={800}
                />
                <Line 
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgPopularity" 
                  stroke="#A855F7"
                  strokeWidth={3}
                  name="Avg Popularity"
                  dot={{ fill: '#A855F7', r: 5 }}
                  activeDot={{ r: 7 }}
                  animationBegin={400}
                  animationDuration={800}
                />
                <defs>
                  <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#D97706" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
                                  
            {/* Stats summary */}
            <div className="mt-3 flex items-center justify-between text-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="text-indigo-100/80">Total Movies:</span>
                <span className="font-bold text-white">
                  {analytics?.movies ? analytics.movies.length : 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-100/80">Avg Rating:</span>
                <span className="font-bold text-white">
                  {analytics?.movies && analytics.movies.length > 0
                    ? (analytics.movies.reduce((sum: number, m: any) => sum + (m.vote_average || 0), 0) / analytics.movies.length).toFixed(2)
                    : '0.00'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-100/80">Avg Popularity:</span>
                <span className="font-bold text-white">
                  {analytics?.movies && analytics.movies.length > 0
                    ? (analytics.movies.reduce((sum: number, m: any) => sum + (m.popularity || 0), 0) / analytics.movies.length).toFixed(1)
                    : '0.0'}
                </span>
              </div>
            </div>
          </div>

          {/* Genre Performance Chart */}
          <div className="bg-slate-800/40 rounded-2xl shadow-xl p-6 border border-white/15 hover:border-white/25 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Genre Performance</h2>
                <p className="text-sm text-indigo-100/80 mt-1">Average rating by genre</p>
              </div>
              <div className="px-3 py-1 bg-white/10 text-emerald-100 rounded-full text-xs font-semibold shadow-sm border border-white/20">
                Bar Chart
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart 
                data={genrePerformanceData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  type="number"
                  domain={[0, 10]}
                  tick={{ fill: '#E5E7EB', fontSize: 11 }}
                  tickLine={{ stroke: '#475569' }}
                  label={{ value: 'Average Rating', position: 'insideBottom', offset: -5, fill: '#E5E7EB', fontSize: 11 }}
                />
                <YAxis 
                  type="category"
                  dataKey="genre"
                  tick={{ fill: '#E5E7EB', fontSize: 11 }}
                  tickLine={{ stroke: '#475569' }}
                  width={80}
                />
                <Tooltip 
                  content={<CustomGenrePerformanceTooltip />} 
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                <Bar 
                  dataKey="rating" 
                  fill="url(#genreGradient)" 
                  name="Rating"
                  radius={[0, 8, 8, 0]}
                  animationBegin={0}
                  animationDuration={800}
                  className="hover:opacity-80 transition-opacity"
                />
                <defs>
                  <linearGradient id="genreGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
                      
            {/* Stats summary */}
            <div className="mt-3 flex items-center justify-between text-sm bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-indigo-100/80">Genres Shown:</span>
                <span className="font-bold text-white">{genrePerformanceData.length}</span>
              </div>
              {genrePerformanceData.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-indigo-100/80">Top Genre:</span>
                  <span className="font-bold text-white">{genrePerformanceData[0]?.genre}</span>
                  <span className="text-emerald-300">({genrePerformanceData[0]?.rating} ⭐)</span>
                  <span className="text-xs text-blue-300">({genrePerformanceData[0]?.count} movies)</span>
                </div>
              )}
            </div>
            
            {/* Show info if data was limited */}
            {analytics?.genrePerformance && analytics.genrePerformance.length > 8 && (
              <div className="mt-3 text-xs text-indigo-200 bg-white/5 rounded-lg p-2 border border-white/10">
                ℹ️ Showing top 8 genres by average rating. Total: {analytics.genrePerformance.length} genres (min. 3 movies each)
              </div>
            )}
          </div>
        </div>
        )}

        {/* Movies Grid */}
        {!loading && hasData && analytics?.movies && analytics.movies.length > 0 && (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Movies in Selected Period</h2>
                <p className="text-sm text-indigo-100/80 mt-1">
                  Showing {Math.min(displayedMovies, sortedMovies.length)} of {sortedMovies.length} {sortedMovies.length === 1 ? 'movie' : 'movies'}
                </p>
              </div>
              
              {/* Sort dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-indigo-100">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="dark-select px-4 py-2 bg-slate-800/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all text-sm font-medium text-white cursor-pointer hover:border-white/40"
                >
                  <option value="rating">⭐ Highest Rating</option>
                  <option value="popularity">🔥 Most Popular</option>
                  <option value="title">🔤 Title (A-Z)</option>
                  <option value="date">📅 Newest Release</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedMovies.slice(0, displayedMovies).map((movie: any) => (
                <div
                  key={movie.id}
                  onClick={() => openMovieModal(movie)}
                  className="bg-slate-800/40 border border-white/15 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:z-10 cursor-pointer group"
                >
                  <div className="relative aspect-[2/3] bg-gray-200">
                    {/* Skeleton loader */}
                    {!loadedImages.has(movie.id) && movie.poster_path && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/20 to-white/10 animate-pulse">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Film className="w-12 h-12 text-indigo-200 animate-pulse" />
                        </div>
                      </div>
                    )}
                    
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        loading="lazy"
                        onLoad={() => handleImageLoad(movie.id)}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          loadedImages.has(movie.id) ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                        <Film className="w-12 h-12 text-gray-500" />
                      </div>
                    )}
                    
                    {/* Rating badge on poster */}
                    {movie.vote_average && (
                      <div className="absolute top-2 right-2 bg-black/90 rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-xs font-semibold">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent bg-opacity-0 group-hover:bg-opacity-90 transition-all duration-300 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
                      <div className="text-white w-full">
                        <h3 className="font-bold text-sm line-clamp-2 mb-2">{movie.title}</h3>
                        {movie.overview && (
                          <p className="text-xs text-gray-300 line-clamp-3 mb-2">{movie.overview}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 bg-blue-600 rounded-full">{movie.genre}</span>
                          <span className="text-gray-300">{movie.release_date?.split('-')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Movie info below poster - Improved */}
                  <div className="p-3 bg-white/5">
                    <h3 className="font-bold text-sm text-white mb-2 leading-tight group-hover:text-indigo-200 transition-colors" title={movie.title}>
                      {movie.title.length > 25 ? `${movie.title.substring(0, 25)}...` : movie.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-0.5 bg-indigo-500/20 text-indigo-100 rounded-md text-xs font-medium">
                        {movie.genre}
                      </span>
                      <span className="text-xs font-semibold text-indigo-200">{movie.release_date?.split('-')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {isLoadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-indigo-400"></div>
                <span className="ml-3 text-indigo-100/80">Loading more movies...</span>
              </div>
            )}

            {/* End of list indicator */}
            {displayedMovies >= sortedMovies.length && sortedMovies.length > 24 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm text-indigo-100">
                  <Film className="w-4 h-4 text-indigo-200" />
                  You've reached the end - {sortedMovies.length} movies loaded
                </div>
              </div>
            )}
          </div>
        )}

        {/* Movie Detail Modal */}
        {isModalOpen && selectedMovie && (
          <div 
            className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
              isModalMounted ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeMovieModal}
          >
            <div 
              className={`bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 ease-out ${
                isModalMounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with backdrop */}
              <div className="relative h-56 md:h-64 bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
                {/* Backdrop image with overlay */}
                <div className="absolute inset-0">
                  {selectedMovie.backdrop_path ? (
                    <>
                      <img
                        src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
                        alt={selectedMovie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <Film className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                </div>
                
                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeMovieModal();
                  }}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-slate-800/90 hover:bg-slate-700 rounded-full transition-all cursor-pointer group z-10 border border-white/30"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Content overlay */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full p-4 md:p-6">
                    <div className="flex gap-4 items-end max-w-6xl mx-auto">
                      {/* Poster */}
                      <div className="hidden md:block flex-shrink-0 w-28 lg:w-32 rounded-lg overflow-hidden shadow-2xl border-2 border-white/10">
                        {selectedMovie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                            alt={selectedMovie.title}
                            className="w-full h-auto"
                          />
                        ) : (
                          <div className="aspect-[2/3] bg-gray-700 flex items-center justify-center">
                            <Film className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Title and info */}
                      <div className="flex-1 text-white pb-1">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg leading-tight">{selectedMovie.title}</h2>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-yellow-500 text-black px-2.5 py-1 rounded-lg font-bold shadow-lg text-sm">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/30 text-sm">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="font-medium">
                              {selectedMovie.release_date 
                                ? selectedMovie.release_date.split('-')[0] 
                                : 'Unknown'}
                            </span>
                          </div>
                          <div className="px-2.5 py-1 bg-blue-600 rounded-lg font-semibold shadow-lg text-sm">
                            {selectedMovie.genre || 'Unknown'}
                          </div>
                          {selectedMovie.original_language && (
                            <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/30 text-sm">
                              <Globe className="w-3.5 h-3.5" />
                              <span className="font-medium">{selectedMovie.original_language.toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 md:p-6 max-w-6xl mx-auto text-white">
                {/* Overview */}
                <div className="mb-5">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                    <div className="w-1 h-5 bg-indigo-400 rounded-full"></div>
                    Synopsis
                  </h3>
                  {selectedMovie.overview ? (
                    <p className="text-indigo-100/90 leading-relaxed text-sm line-clamp-3">{selectedMovie.overview}</p>
                  ) : (
                    <p className="text-indigo-200/60 leading-relaxed text-sm italic">No synopsis available for this movie.</p>
                  )}
                </div>

                {/* Stats Grid - Compact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  <div className="relative overflow-hidden bg-white/10 rounded-lg p-3 border border-white/15 hover:border-white/25 transition-all group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-400/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <Star className="w-6 h-6 text-amber-300 mb-1 relative z-10" />
                    <p className="text-2xl font-bold text-white relative z-10">
                      {selectedMovie.vote_average ? selectedMovie.vote_average.toFixed(1) : 'N/A'}
                    </p>
                    <p className="text-xs text-indigo-100/80 relative z-10">Rating</p>
                  </div>

                  <div className="relative overflow-hidden bg-white/10 rounded-lg p-3 border border-white/15 hover:border-white/25 transition-all group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <TrendingUp className="w-6 h-6 text-purple-200 mb-1 relative z-10" />
                    <p className="text-2xl font-bold text-white relative z-10">
                      {selectedMovie.popularity ? selectedMovie.popularity.toFixed(0) : 'N/A'}
                    </p>
                    <p className="text-xs text-indigo-100/80 relative z-10">Popularity</p>
                  </div>

                  <div className="relative overflow-hidden bg-white/10 rounded-lg p-3 border border-white/15 hover:border-white/25 transition-all group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <Calendar className="w-6 h-6 text-emerald-200 mb-1 relative z-10" />
                    <p className="text-xl font-bold text-white relative z-10">
                      {selectedMovie.release_date && selectedMovie.release_date !== 'Invalid Date' 
                        ? format(new Date(selectedMovie.release_date), 'MMM yyyy')
                        : 'Unknown'}
                    </p>
                    <p className="text-xs text-indigo-100/80 relative z-10">Release</p>
                  </div>

                  <div className="relative overflow-hidden bg-white/10 rounded-lg p-3 border border-white/15 hover:border-white/25 transition-all group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-400/20 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <Film className="w-6 h-6 text-indigo-200 mb-1 relative z-10" />
                    <p className="text-lg font-bold text-white relative z-10 truncate">
                      {selectedMovie.genre || 'Unknown'}
                    </p>
                    <p className="text-xs text-indigo-100/80 relative z-10">Genre</p>
                  </div>
                </div>

                {/* Additional Info - Compact */}
                <div className="bg-white/10 rounded-lg p-4 border border-white/15 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs text-indigo-100/80">
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                      <span>Language</span>
                      <span className="font-bold text-white">{selectedMovie.original_language?.toUpperCase() || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                      <span>Votes</span>
                      <span className="font-bold text-white">{selectedMovie.vote_count ? selectedMovie.vote_count.toLocaleString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                      <span>Added</span>
                      <span className="font-bold text-white">
                        {selectedMovie.created_at 
                          ? format(new Date(selectedMovie.created_at), 'MMM d, yy')
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                      <span>Updated</span>
                      <span className="font-bold text-white">
                        {selectedMovie.updated_at 
                          ? format(new Date(selectedMovie.updated_at), 'MMM d, yy')
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button - Compact */}
                <a
                  href={`https://www.themoviedb.org/movie/${selectedMovie.api_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  <Globe className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">View on TMDB</span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </a>

                {/* Trailer Section */}
                {loadingDetails && (
                  <div className="mt-4 bg-slate-800/50 rounded-lg p-6 text-center border border-white/20">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-white/20 border-t-indigo-400"></div>
                    <p className="text-xs text-indigo-100/80 mt-2">Loading trailer & cast...</p>
                  </div>
                )}

                {!loadingDetails && (
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                      Official Trailer
                    </h3>
                    {movieDetails?.trailer ? (
                      <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-white/15">
                        <iframe
                          src={`https://www.youtube.com/embed/${movieDetails.trailer.key}`}
                          title={movieDetails.trailer.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        ></iframe>
                      </div>
                    ) : (
                      <div className="relative aspect-video bg-slate-800/50 rounded-lg overflow-hidden shadow-lg border border-white/20 flex items-center justify-center">
                        <div className="text-center p-6">
                          <Film className="w-12 h-12 text-indigo-300/50 mx-auto mb-3" />
                          <p className="text-indigo-200/80 text-sm font-medium">No trailer available</p>
                          <p className="text-indigo-200/60 text-xs mt-1">Trailer for this movie is not yet available</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Cast & Crew Section */}
                {!loadingDetails && movieDetails?.cast && movieDetails.cast.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                      Cast & Crew
                    </h3>

                    {/* Director */}
                    {movieDetails.director && (
                      <div 
                        onClick={() => openPersonModal(movieDetails.director.id, movieDetails.director.name)}
                        className="mb-3 p-3 bg-gradient-to-r from-purple-900/40 to-purple-800/40 rounded-lg border border-purple-400/40 cursor-pointer hover:border-purple-400/60 hover:from-purple-900/50 hover:to-purple-800/50 transition-all"
                      >
                        <p className="text-xs font-semibold text-purple-300 mb-2">DIRECTOR</p>
                        <div className="flex items-center gap-3">
                          {movieDetails.director.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${movieDetails.director.profile_path}`}
                              alt={movieDetails.director.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/50 shadow-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center border-2 border-purple-400/50">
                              <span className="text-purple-200 font-bold text-lg">
                                {movieDetails.director.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <p className="font-bold text-sm text-white">{movieDetails.director.name}</p>
                        </div>
                      </div>
                    )}

                    {/* Cast Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {movieDetails.cast.slice(0, 8).map((person: any) => (
                        <div 
                          key={person.id} 
                          onClick={() => openPersonModal(person.id, person.name)}
                          className="bg-slate-800/50 rounded-lg p-2 border border-white/20 hover:border-white/40 hover:bg-slate-800/70 transition-all cursor-pointer"
                        >
                          {person.profile_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                              alt={person.name}
                              className="w-full aspect-square object-cover rounded-lg mb-1.5 shadow-md"
                            />
                          ) : (
                            <div className="w-full aspect-square bg-slate-700/50 rounded-lg mb-1.5 flex items-center justify-center border border-white/20">
                              <span className="text-indigo-200 font-bold text-lg">
                                {person.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <p className="font-semibold text-xs text-white truncate" title={person.name}>
                            {person.name}
                          </p>
                          <p className="text-xs text-indigo-200/80 truncate" title={person.character}>
                            {person.character}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Section */}
                {!loadingDetails && movieDetails?.reviews && movieDetails.reviews.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                      User Reviews ({movieDetails.reviews.length})
                    </h3>
                    <div className="space-y-3">
                      {movieDetails.reviews.map((review: any) => (
                        <div key={review.id} className="bg-slate-800/50 rounded-lg p-3 border border-white/20">
                          <div className="flex items-start gap-3 mb-2">
                            {review.author_details.avatar_path ? (
                              <img
                                src={review.author_details.avatar_path.startsWith('/https') 
                                  ? review.author_details.avatar_path.substring(1)
                                  : `https://image.tmdb.org/t/p/w92${review.author_details.avatar_path}`
                                }
                                alt={review.author}
                                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center border-2 border-amber-400/50">
                                <span className="text-amber-200 font-bold">
                                  {review.author.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-sm text-white">{review.author_details.name || review.author}</p>
                                {review.author_details.rating && (
                                  <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-semibold text-amber-200">{review.author_details.rating}/10</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-indigo-200/60">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                          </div>
                          <p className="text-sm text-indigo-100/90 leading-relaxed line-clamp-4">
                            {review.content}
                          </p>
                          <a 
                            href={review.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-2 text-xs text-indigo-300 hover:text-indigo-200 underline"
                          >
                            Read full review →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Movies Section */}
                {!loadingDetails && movieDetails?.similarMovies && movieDetails.similarMovies.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                      Similar Movies
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {movieDetails.similarMovies.map((movie: any) => (
                        <div 
                          key={movie.id}
                          onClick={() => {
                            closeMovieModal();
                            setTimeout(() => {
                              // Find the movie in analytics data or use TMDB data
                              const fullMovie = analytics?.movies?.find((m: any) => m.api_id === movie.id) || {
                                id: movie.id,
                                api_id: movie.id,
                                title: movie.title || 'Unknown',
                                poster_path: movie.poster_path,
                                backdrop_path: null,
                                vote_average: movie.vote_average || 0,
                                vote_count: 0,
                                popularity: movie.popularity || 0,
                                release_date: movie.release_date || null,
                                original_language: 'en',
                                overview: null,
                                genre: movie.genre_ids ? getGenreName(movie.genre_ids) : 'Unknown',
                              };
                              openMovieModal(fullMovie);
                            }, 300);
                          }}
                          className="bg-slate-800/50 rounded-lg overflow-hidden border border-white/20 hover:border-white/40 hover:bg-slate-800/70 transition-all cursor-pointer group"
                        >
                          {movie.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                              alt={movie.title}
                              className="w-full aspect-[2/3] object-cover"
                            />
                          ) : (
                            <div className="w-full aspect-[2/3] bg-slate-700/50 flex items-center justify-center">
                              <Film className="w-6 h-6 text-indigo-200" />
                            </div>
                          )}
                          <div className="p-1.5">
                            <p className="text-xs text-white font-semibold truncate group-hover:text-indigo-200 transition-colors" title={movie.title}>
                              {movie.title}
                            </p>
                            {movie.vote_average > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs text-indigo-200">{movie.vote_average.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Person Detail Modal */}
        {isPersonModalOpen && selectedPerson && (
          <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={closePersonModal}
          >
            <div 
              className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-b from-indigo-900/50 to-transparent p-6 border-b border-white/10">
                <button
                  onClick={closePersonModal}
                  className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-slate-800/90 hover:bg-slate-700 rounded-full transition-all cursor-pointer group border border-white/30"
                >
                  <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {loadingPerson ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-indigo-400"></div>
                    <p className="text-sm text-indigo-100/80 mt-3">Loading person details...</p>
                  </div>
                ) : personDetails ? (
                  <div className="flex gap-6 items-start">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      {personDetails.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${personDetails.profile_path}`}
                          alt={personDetails.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-xl"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-indigo-500/30 flex items-center justify-center border-4 border-white/20">
                          <span className="text-white font-bold text-4xl">
                            {personDetails.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-white">
                      <h2 className="text-3xl font-bold mb-2">{personDetails.name}</h2>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {personDetails.known_for_department && (
                          <div className="px-3 py-1 bg-indigo-500/30 rounded-full text-sm font-medium border border-indigo-400/30">
                            {personDetails.known_for_department}
                          </div>
                        )}
                        {personDetails.birthday && (
                          <div className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full text-sm border border-white/20">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(personDetails.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                      {personDetails.place_of_birth && (
                        <p className="text-sm text-indigo-200/80 mb-2">
                          📍 {personDetails.place_of_birth}
                        </p>
                      )}
                      <p className="text-sm text-indigo-100/80">
                        {personDetails.total_movies} movie credits
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Content */}
              {!loadingPerson && personDetails && (
                <div className="p-6 text-white">
                  {/* Biography */}
                  {personDetails.biography && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <div className="w-1 h-5 bg-indigo-400 rounded-full"></div>
                        Biography
                      </h3>
                      <p className="text-sm text-indigo-100/90 leading-relaxed line-clamp-6">
                        {personDetails.biography}
                      </p>
                    </div>
                  )}

                  {/* Filmography */}
                  {personDetails.movies && personDetails.movies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <div className="w-1 h-5 bg-purple-400 rounded-full"></div>
                        Known For ({personDetails.movies.length} of {personDetails.total_movies})
                      </h3>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {personDetails.movies.map((movie: any) => (
                          <div 
                            key={movie.id}
                            onClick={() => {
                              closePersonModal();
                              setTimeout(() => {
                                const fullMovie = analytics?.movies?.find((m: any) => m.api_id === movie.id) || {
                                  id: movie.id,
                                  api_id: movie.id,
                                  title: movie.title || 'Unknown',
                                  poster_path: movie.poster_path,
                                  backdrop_path: null,
                                  vote_average: movie.vote_average || 0,
                                  vote_count: 0,
                                  popularity: movie.popularity || 0,
                                  release_date: movie.release_date || null,
                                  original_language: 'en',
                                  overview: null,
                                  genre: movie.genre_ids ? getGenreName(movie.genre_ids) : 'Unknown',
                                };
                                openMovieModal(fullMovie);
                              }, 300);
                            }}
                            className="bg-slate-800/50 rounded-lg overflow-hidden border border-white/20 hover:border-white/40 hover:bg-slate-800/70 transition-all cursor-pointer group"
                          >
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full aspect-[2/3] object-cover"
                              />
                            ) : (
                              <div className="w-full aspect-[2/3] bg-slate-700/50 flex items-center justify-center">
                                <Film className="w-6 h-6 text-indigo-200" />
                              </div>
                            )}
                            <div className="p-2">
                              <p className="text-xs text-white font-semibold truncate group-hover:text-indigo-200 transition-colors" title={movie.title}>
                                {movie.title}
                              </p>
                              {movie.character && (
                                <p className="text-xs text-indigo-200/60 truncate" title={movie.character}>
                                  {movie.character}
                                </p>
                              )}
                              {movie.vote_average > 0 && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-indigo-200">{movie.vote_average.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
