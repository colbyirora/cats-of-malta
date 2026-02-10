import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { cat_id?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { cat_id, action } = body;

  if (!cat_id || !action) {
    return NextResponse.json(
      { error: 'cat_id and action are required' },
      { status: 400 }
    );
  }

  const validActions = ['start_suggesting', 'start_voting', 'complete', 'reset'];
  if (!validActions.includes(action)) {
    return NextResponse.json(
      { error: `Invalid action. Must be one of: ${validActions.join(', ')}` },
      { status: 400 }
    );
  }

  const supabase = createServerClient();

  // Fetch the current cat
  const { data: cat, error: catError } = await supabase
    .from('cats')
    .select('*')
    .eq('id', cat_id)
    .single();

  if (catError || !cat) {
    return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
  }

  switch (action) {
    case 'start_suggesting': {
      // Cat must be approved and have no name
      if (!cat.approved) {
        return NextResponse.json(
          { error: 'Cat must be approved before starting suggestions' },
          { status: 400 }
        );
      }
      if (cat.name) {
        return NextResponse.json(
          { error: 'Cat already has a name' },
          { status: 400 }
        );
      }

      const { data: updated, error: updateError } = await supabase
        .from('cats')
        .update({ voting_status: 'suggesting' })
        .eq('id', cat_id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ cat: updated });
    }

    case 'start_voting': {
      // Must have at least 2 suggestions
      const { count, error: countError } = await supabase
        .from('name_suggestions')
        .select('*', { count: 'exact', head: true })
        .eq('cat_id', cat_id);

      if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 });
      }

      if ((count ?? 0) < 2) {
        return NextResponse.json(
          { error: 'At least 2 name suggestions are required before voting can start' },
          { status: 400 }
        );
      }

      const { data: updated, error: updateError } = await supabase
        .from('cats')
        .update({ voting_status: 'voting' })
        .eq('id', cat_id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ cat: updated });
    }

    case 'complete': {
      // Get the suggestion with the highest vote count
      const { data: topSuggestion, error: suggestionError } = await supabase
        .from('name_suggestions')
        .select('*')
        .eq('cat_id', cat_id)
        .order('vote_count', { ascending: false })
        .limit(1)
        .single();

      if (suggestionError || !topSuggestion) {
        return NextResponse.json(
          { error: 'No suggestions found for this cat' },
          { status: 400 }
        );
      }

      const { data: updated, error: updateError } = await supabase
        .from('cats')
        .update({
          voting_status: 'complete',
          name: topSuggestion.suggested_name,
        })
        .eq('id', cat_id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ cat: updated });
    }

    case 'reset': {
      // Delete all votes for this cat
      const { error: votesDeleteError } = await supabase
        .from('votes')
        .delete()
        .eq('cat_id', cat_id);

      if (votesDeleteError) {
        return NextResponse.json({ error: votesDeleteError.message }, { status: 500 });
      }

      // Delete all suggestions for this cat
      const { error: suggestionsDeleteError } = await supabase
        .from('name_suggestions')
        .delete()
        .eq('cat_id', cat_id);

      if (suggestionsDeleteError) {
        return NextResponse.json({ error: suggestionsDeleteError.message }, { status: 500 });
      }

      // Reset voting status
      const { data: updated, error: updateError } = await supabase
        .from('cats')
        .update({ voting_status: 'none' })
        .eq('id', cat_id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ cat: updated });
    }

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}
