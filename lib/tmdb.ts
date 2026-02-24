const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  genre_ids: number[];
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  original_language: string;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

// Genre mapping (TMDB genre IDs to names)
export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export async function fetchPopularMovies(page: number = 1): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movies from TMDB');
  }
  
  const data = await response.json();
  return data.results;
}

export async function fetchTopRatedMovies(page: number = 1): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch top rated movies from TMDB');
  }
  
  const data = await response.json();
  return data.results;
}

export async function fetchNowPlayingMovies(page: number = 1): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch now playing movies from TMDB');
  }
  
  const data = await response.json();
  return data.results;
}

export async function fetchUpcomingMovies(page: number = 1): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch upcoming movies from TMDB');
  }
  
  const data = await response.json();
  return data.results;
}

export async function fetchMoviesByDateRange(
  startDate: string,
  endDate: string,
  page: number = 1
): Promise<TMDBMovie[]> {
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&sort_by=popularity.desc&language=en-US`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch movies from TMDB');
  }
  
  const data = await response.json();
  return data.results;
}

export function getGenreName(genreIds: number[]): string {
  if (!genreIds || genreIds.length === 0) return 'Unknown';
  return GENRE_MAP[genreIds[0]] || 'Unknown';
}

export function getPosterUrl(posterPath: string | null, size: string = 'w500'): string {
  if (!posterPath) return '/placeholder-movie.png';
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
