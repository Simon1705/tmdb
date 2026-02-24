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

    // Fetch all data in parallel
    const [creditsResponse, videosResponse, similarResponse, reviewsResponse, watchProvidersResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`, { next: { revalidate: 86400 } }),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`, { next: { revalidate: 86400 } }),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`, { next: { revalidate: 86400 } }),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}&language=en-US&page=1`, { next: { revalidate: 86400 } }),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`, { next: { revalidate: 86400 } }),
    ]);

    if (!creditsResponse.ok || !videosResponse.ok) {
      throw new Error('Failed to fetch movie details from TMDB');
    }

    const credits = await creditsResponse.json();
    const videos = await videosResponse.json();
    const similar = similarResponse.ok ? await similarResponse.json() : { results: [] };
    const reviews = reviewsResponse.ok ? await reviewsResponse.json() : { results: [] };
    const watchProviders = watchProvidersResponse.ok ? await watchProvidersResponse.json() : { results: {} };

    // Get top 10 cast members
    const cast = credits.cast.slice(0, 10).map((person: any) => ({
      id: person.id,
      name: person.name,
      character: person.character,
      profile_path: person.profile_path,
    }));

    // Get director and top crew
    const director = credits.crew.find((person: any) => person.job === 'Director');
    const crew = credits.crew
      .filter((person: any) => ['Director', 'Producer', 'Writer', 'Screenplay'].includes(person.job))
      .slice(0, 5)
      .map((person: any) => ({
        id: person.id,
        name: person.name,
        job: person.job,
        profile_path: person.profile_path,
      }));

    // Get official trailer or first video
    const trailer = videos.results.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube' && video.official
    ) || videos.results.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.results[0];

    // Get similar movies (top 6)
    const similarMovies = similar.results.slice(0, 6).map((movie: any) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      popularity: movie.popularity,
      genre_ids: movie.genre_ids,
      overview: movie.overview,
    }));

    // Get reviews (top 3)
    const movieReviews = reviews.results.slice(0, 3).map((review: any) => ({
      id: review.id,
      author: review.author,
      author_details: {
        name: review.author_details.name,
        username: review.author_details.username,
        avatar_path: review.author_details.avatar_path,
        rating: review.author_details.rating,
      },
      content: review.content,
      created_at: review.created_at,
      url: review.url,
    }));

    // Get watch providers (focus on US, ID, and a few other regions)
    const providers = watchProviders.results;
    const watchProviderData: any = {};
    
    // Priority regions
    const regions = ['US', 'ID', 'GB', 'CA', 'AU'];
    regions.forEach(region => {
      if (providers[region]) {
        watchProviderData[region] = {
          link: providers[region].link,
          flatrate: providers[region].flatrate?.slice(0, 5).map((p: any) => ({
            provider_id: p.provider_id,
            provider_name: p.provider_name,
            logo_path: p.logo_path,
          })) || [],
          rent: providers[region].rent?.slice(0, 3).map((p: any) => ({
            provider_id: p.provider_id,
            provider_name: p.provider_name,
            logo_path: p.logo_path,
          })) || [],
          buy: providers[region].buy?.slice(0, 3).map((p: any) => ({
            provider_id: p.provider_id,
            provider_name: p.provider_name,
            logo_path: p.logo_path,
          })) || [],
        };
      }
    });

    return NextResponse.json({
      cast,
      crew,
      director: director ? {
        id: director.id,
        name: director.name,
        profile_path: director.profile_path,
      } : null,
      trailer: trailer ? {
        key: trailer.key,
        name: trailer.name,
        site: trailer.site,
        type: trailer.type,
      } : null,
      similarMovies,
      reviews: movieReviews,
      watchProviders: watchProviderData,
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
}
