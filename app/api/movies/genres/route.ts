import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Enable aggressive caching for genres (they rarely change)
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    // Get all distinct genres from movies table
    const { data, error } = await supabase
      .from('movies')
      .select('genre');

    if (error) throw error;

    // Extract unique genres and sort alphabetically
    const uniqueGenres = [...new Set(data?.map(m => m.genre) || [])]
      .filter(g => g) // Remove null/undefined
      .sort((a, b) => a.localeCompare(b));

    const response = NextResponse.json({ genres: uniqueGenres });

    // Add aggressive cache headers for genres
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    return response;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}
