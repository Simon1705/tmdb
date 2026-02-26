import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE() {
  try {
    // Count total movies before deletion
    const { count: totalCount, error: countError } = await supabase
      .from('movies')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    // Delete all movies
    const { error: deleteError } = await supabase
      .from('movies')
      .delete()
      .neq('id', 0); // This condition will match all rows (id is never 0)

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      deletedCount: totalCount || 0,
      message: `Successfully deleted ${totalCount || 0} movies`,
    });
  } catch (error) {
    console.error('Delete all movies error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete movies',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
