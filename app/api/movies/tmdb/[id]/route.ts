import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: movieId } = await params;

    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie from TMDB');
    }

    const tmdbData = await response.json();
    
    // Map genre_ids to genre names
    const genreNames = tmdbData.genres?.map((g: any) => g.name).join(', ') || 'Unknown';
    
    return NextResponse.json({
      id: tmdbData.id,
      api_id: tmdbData.id,
      title: tmdbData.title,
      genre: genreNames,
      backdrop_path: tmdbData.backdrop_path,
      poster_path: tmdbData.poster_path,
      overview: tmdbData.overview,
      vote_average: tmdbData.vote_average,
      vote_count: tmdbData.vote_count,
      popularity: tmdbData.popularity,
      release_date: tmdbData.release_date,
      original_language: tmdbData.original_language,
      runtime: tmdbData.runtime,
      budget: tmdbData.budget,
      revenue: tmdbData.revenue,
      genres: tmdbData.genres,
    });
  } catch (error) {
    console.error('Error fetching movie from TMDB:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie from TMDB' },
      { status: 500 }
    );
  }
}
