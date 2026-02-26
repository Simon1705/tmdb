import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchNowPlayingMovies, 
  fetchUpcomingMovies,
  getGenreName 
} from '@/lib/tmdb';

export async function POST(request: Request) {
  try {
    // Get pages parameter from request body
    const body = await request.json();
    const PAGES_PER_CATEGORY = body.pages || 3; // Default 3 if not provided

    let recordsFetched = 0;
    let recordsCreated = 0;
    let recordsUpdated = 0;

    // Get existing movie api_ids to check for duplicates
    const { data: existingMovies } = await supabase
      .from('movies')
      .select('api_id');
    
    const existingApiIds = new Set(existingMovies?.map(m => m.api_id) || []);

    // Fetch from different categories to get variety
    const fetchFunctions = [
      { fn: fetchPopularMovies, name: 'Popular' },
      { fn: fetchTopRatedMovies, name: 'Top Rated' },
      { fn: fetchNowPlayingMovies, name: 'Now Playing' },
      { fn: fetchUpcomingMovies, name: 'Upcoming' },
    ];

    // Fetch multiple pages from each category
    // 4 categories × pages × 20 movies = ~(pages * 80) movies per sync

    for (const { fn, name } of fetchFunctions) {
      try {
        // Fetch multiple pages from each category
        for (let page = 1; page <= PAGES_PER_CATEGORY; page++) {
          const movies = await fn(page);
          recordsFetched += movies.length;

          for (const movie of movies) {
            // Skip movies without release date
            if (!movie.release_date) continue;

            const movieData = {
              api_id: movie.id,
              title: movie.title,
              release_date: movie.release_date,
              genre: getGenreName(movie.genre_ids),
              overview: movie.overview,
              poster_path: movie.poster_path,
              backdrop_path: movie.backdrop_path,
              vote_average: movie.vote_average,
              vote_count: movie.vote_count,
              popularity: movie.popularity,
              original_language: movie.original_language,
            };

            const isExisting = existingApiIds.has(movie.id);

            // Upsert: insert or update if api_id exists
            const { error } = await supabase
              .from('movies')
              .upsert(movieData, { onConflict: 'api_id' });

            if (error) {
              console.error(`Error upserting movie from ${name} page ${page}:`, error);
              continue;
            }

            // Track if it's new or updated
            if (isExisting) {
              recordsUpdated++;
            } else {
              recordsCreated++;
              // Add to set so we don't count it twice if it appears in multiple categories
              existingApiIds.add(movie.id);
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching ${name} movies:`, error);
        // Continue with other categories even if one fails
      }
    }

    // Log sync activity
    await supabase.from('sync_logs').insert({
      records_fetched: recordsFetched,
      records_created: recordsCreated,
      records_updated: recordsUpdated,
      status: 'success',
    });

    return NextResponse.json({
      success: true,
      recordsFetched,
      recordsCreated,
      recordsUpdated,
      message: 'Sync completed successfully',
    });
  } catch (error) {
    console.error('Sync error:', error);

    // Log failed sync
    await supabase.from('sync_logs').insert({
      records_fetched: 0,
      records_created: 0,
      records_updated: 0,
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { success: false, error: 'Sync failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get last sync log
    const { data, error } = await supabase
      .from('sync_logs')
      .select('*')
      .order('synced_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json({
      lastSync: data || null,
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync status' },
      { status: 500 }
    );
  }
}
