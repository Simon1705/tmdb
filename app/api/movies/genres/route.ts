import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    return NextResponse.json({ genres: uniqueGenres });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}
