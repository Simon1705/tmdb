import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Movie {
  id: string;
  api_id: number;
  title: string;
  release_date: string;
  genre: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number | null;
  vote_count: number | null;
  popularity: number | null;
  original_language: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  synced_at: string;
  records_fetched: number;
  records_created: number;
  records_updated: number;
  status: 'success' | 'partial' | 'failed';
  error_message: string | null;
}
