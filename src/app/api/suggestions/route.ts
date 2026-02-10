import { NextRequest, NextResponse } from 'next/server';
import { supabase, createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cat_id = searchParams.get('cat_id');

  if (!cat_id) {
    return NextResponse.json({ error: 'cat_id query parameter is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('name_suggestions')
    .select('*')
    .eq('cat_id', cat_id)
    .order('vote_count', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ suggestions: data });
}

export async function POST(request: NextRequest) {
  let body: { cat_id?: string; suggested_name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { cat_id, suggested_name } = body;

  if (!cat_id || !suggested_name) {
    return NextResponse.json(
      { error: 'cat_id and suggested_name are required' },
      { status: 400 }
    );
  }

  // Trim and validate the suggested name
  const trimmedName = suggested_name.trim();

  if (trimmedName.length < 1 || trimmedName.length > 30) {
    return NextResponse.json(
      { error: 'Suggested name must be between 1 and 30 characters' },
      { status: 400 }
    );
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
    return NextResponse.json(
      { error: 'Suggested name can only contain letters, spaces, hyphens, and apostrophes' },
      { status: 400 }
    );
  }

  const serverClient = createServerClient();

  // Validate that the cat exists and is in 'suggesting' status
  const { data: cat, error: catError } = await serverClient
    .from('cats')
    .select('id, voting_status')
    .eq('id', cat_id)
    .single();

  if (catError || !cat) {
    return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
  }

  if (cat.voting_status !== 'suggesting') {
    return NextResponse.json(
      { error: 'This cat is not currently accepting name suggestions' },
      { status: 400 }
    );
  }

  // Insert the suggestion
  const { data: suggestion, error: insertError } = await serverClient
    .from('name_suggestions')
    .insert({ cat_id, suggested_name: trimmedName })
    .select()
    .single();

  if (insertError) {
    // Unique constraint violation — duplicate suggestion
    if (insertError.code === '23505') {
      return NextResponse.json(
        { error: 'This name has already been suggested for this cat' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ suggestion }, { status: 201 });
}
