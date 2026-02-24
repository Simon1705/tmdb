import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(request: NextRequest) {
  try {
    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    // Fetch movie details from TMDB
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie details from TMDB');
    }

    const movie = await response.json();

    // Check if movie already exists
    const { data: existingMovie } = await supabase
      .from('movies')
      .select('id')
      .eq('api_id', movie.id)
      .single();

    if (existingMovie) {
      return NextResponse.json(
        { error: 'Movie already exists in database', exists: true },
        { status: 409 }
      );
    }

    // Get primary genre
    const primaryGenre = movie.genres && movie.genres.length > 0 
      ? movie.genres[0].name 
      : 'Unknown';

    // Insert movie into database
    const { data: newMovie, error: insertError } = await supabase
      .from('movies')
      .insert({
        api_id: movie.id,
        title: movie.title,
        release_date: movie.release_date || '1900-01-01',
        genre: primaryGenre,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity,
        original_language: movie.original_language,
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      movie: newMovie,
      message: 'Movie added successfully',
    });
  } catch (error) {
    console.error('Error adding movie:', error);
    return NextResponse.json(
      { error: 'Failed to add movie' },
      { status: 500 }
    );
  }
}
