import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Fetch approved cats that are in an active voting/suggesting state
  const { data: cats, error: catsError } = await supabase
    .from('cats')
    .select('*')
    .eq('approved', true)
    .in('voting_status', ['suggesting', 'voting'])
    .order('created_at', { ascending: false });

  if (catsError) {
    return NextResponse.json({ error: catsError.message }, { status: 500 });
  }

  if (!cats || cats.length === 0) {
    return NextResponse.json({ cats: [] });
  }

  // Fetch suggestions for all these cats
  const catIds = cats.map((cat) => cat.id);
  const { data: suggestions, error: suggestionsError } = await supabase
    .from('name_suggestions')
    .select('*')
    .in('cat_id', catIds)
    .order('vote_count', { ascending: false });

  if (suggestionsError) {
    return NextResponse.json({ error: suggestionsError.message }, { status: 500 });
  }

  // Group suggestions by cat_id
  const suggestionsByCat: Record<string, typeof suggestions> = {};
  for (const suggestion of suggestions ?? []) {
    if (!suggestionsByCat[suggestion.cat_id]) {
      suggestionsByCat[suggestion.cat_id] = [];
    }
    suggestionsByCat[suggestion.cat_id].push(suggestion);
  }

  // Attach suggestions to each cat
  const catsWithSuggestions = cats.map((cat) => ({
    ...cat,
    suggestions: suggestionsByCat[cat.id] ?? [],
  }));

  return NextResponse.json({ cats: catsWithSuggestions });
}
