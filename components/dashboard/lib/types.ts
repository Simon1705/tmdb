// Types for Dashboard Components

export type DateMode = 'synced' | 'release';

export type QuickPreset = 'today' | 'this-month' | 'last-30' | 'last-3' | 'last-6' | 'last-year' | 'custom';

export type SortBy = 'rating' | 'popularity' | 'title' | 'date';

export interface AppliedFilters {
  startDate: string;
  endDate: string;
  dateMode: DateMode;
}

export interface Movie {
  id: string;
  api_id: number;
  title: string;
  vote_average: number;
  popularity: number;
  release_date: string;
  poster_path?: string;
  overview?: string;
  genre_ids?: number[];
}

export interface Analytics {
  genreDistribution: Record<string, number>;
  moviesPerDate: Record<string, number>;
  ratingDistribution: Record<string, { count: number; avgPopularity: number }>;
  genrePerformance: GenrePerformance[];
  movies: Movie[];
  summary: {
    totalMovies: number;
    mostPopularGenre: string;
    totalGenres: number;
    averageRating?: number;
  };
}

export interface GenreDistribution {
  name: string;
  value: number;
  total?: number;
}

export interface RatingDistribution {
  range: string;
  count: number;
}

export interface GenrePerformance {
  genre: string;
  averageRating: number;
  movieCount: number;
  confidence: number;
}

export interface RatingPopularityData {
  rating: string;
  count: number;
  avgPopularity: number;
}

export interface MovieDetails {
  cast?: Array<{
    id: number;
    name: string;
    character: string;
    profile_path?: string;
  }>;
  crew?: Array<{
    id: number;
    name: string;
    job: string;
    profile_path?: string;
  }>;
  director?: {
    id: number;
    name: string;
    profile_path?: string;
  } | null;
  trailer?: {
    key: string;
    name: string;
    site: string;
    type: string;
  } | null;
  similarMovies?: Array<{
    id: number;
    title: string;
    poster_path?: string;
    vote_average?: number;
    release_date?: string;
    popularity?: number;
    genre_ids?: number[];
  }>;
  reviews?: Array<{
    id: string;
    author: string;
    author_details: {
      name?: string;
      username?: string;
      avatar_path?: string;
      rating?: number;
    };
    content: string;
    created_at: string;
    url: string;
  }>;
  watchProviders?: Record<string, any>;
}

export interface PersonDetails {
  name: string;
  profile_path?: string;
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
  known_for_department?: string;
  movies?: Array<{
    id: number;
    title: string;
    character?: string;
    poster_path?: string;
    vote_average?: number;
    release_date?: string;
  }>;
  movie_credits?: {
    cast?: Array<{
      id: number;
      title: string;
      character: string;
      poster_path?: string;
      release_date?: string;
      vote_average?: number;
    }>;
  };
}
