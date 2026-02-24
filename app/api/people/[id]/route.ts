import { NextRequest, NextResponse } from 'next/server';

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: personId } = await params;

    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key is not configured' },
        { status: 500 }
      );
    }

    // Fetch person details and movie credits in parallel
    const [detailsResponse, creditsResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}&language=en-US`, { next: { revalidate: 86400 } }),
      fetch(`${TMDB_BASE_URL}/person/${personId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`, { next: { revalidate: 86400 } }),
    ]);

    if (!detailsResponse.ok || !creditsResponse.ok) {
      throw new Error('Failed to fetch person details from TMDB');
    }

    const details = await detailsResponse.json();
    const credits = await creditsResponse.json();

    // Sort movies by popularity and get top 12
    const sortedMovies = [...credits.cast]
      .sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 12)
      .map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        character: movie.character,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        genre_ids: movie.genre_ids,
      }));

    return NextResponse.json({
      id: details.id,
      name: details.name,
      biography: details.biography,
      birthday: details.birthday,
      place_of_birth: details.place_of_birth,
      profile_path: details.profile_path,
      known_for_department: details.known_for_department,
      popularity: details.popularity,
      movies: sortedMovies,
      total_movies: credits.cast.length,
    });
  } catch (error) {
    console.error('Error fetching person details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch person details' },
      { status: 500 }
    );
  }
}
