import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    if (!TMDB_API_KEY) {
      console.error('TMDB_API_KEY is not configured');
      return NextResponse.json(
        { error: 'TMDB API key is not configured' },
        { status: 500 }
      );
    }

    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;
    
    console.log('Fetching from TMDB:', url.replace(TMDB_API_KEY, 'API_KEY_HIDDEN'));

    const response = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TMDB API Error:', response.status, errorText);
      throw new Error(`TMDB API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      results: data.results.slice(0, 10), // Limit to 10 results
      total_results: data.total_results,
    });
  } catch (error) {
    console.error('Error searching TMDB:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search movies' },
      { status: 500 }
    );
  }
}
