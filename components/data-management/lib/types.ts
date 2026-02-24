// Types for Data Management

export interface Movie {
  id: string;
  api_id: number;
  title: string;
  release_date: string;
  genre: string;
  overview?: string;
  vote_average: number;
  poster_path?: string;
  backdrop_path?: string;
  popularity?: number;
  vote_count?: number;
  original_language?: string;
  created_at?: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  poster_path?: string;
  vote_average?: number;
}

export interface Toast {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

export type SortBy = 'title' | 'release_date' | 'genre' | 'vote_average' | 'updated_at';
export type SortOrder = 'asc' | 'desc';
