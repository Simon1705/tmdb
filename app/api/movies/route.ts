import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Enable caching for this route
export const revalidate = 60; // Revalidate every 60 seconds

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const genreParam = searchParams.get('genre');
    const sortBy = searchParams.get('sortBy') || 'updated_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('Genre filter param:', genreParam);

    // First, get all movies without pagination to apply genre filter
    let query = supabase.from('movies').select('*', { count: 'exact' });

    // Search filter
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    // Genre filter - support multiple genres
    if (genreParam) {
      const genres = genreParam.split(',').map(g => g.trim()).filter(g => g);
      console.log('Parsed genres:', genres);
      if (genres.length > 0) {
        // Build OR conditions for multiple genres
        if (genres.length === 1) {
          query = query.eq('genre', genres[0]);
        } else {
          // For multiple genres, use or filter
          const orFilter = genres.map(g => `genre.eq.${g}`).join(',');
          query = query.or(orFilter);
        }
      }
    }

    // Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Filtered movies count:', count);

    const response = NextResponse.json({ 
      movies: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

    // Add cache headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return response;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('movies')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ movie: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}
