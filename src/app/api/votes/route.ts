import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  let body: { suggestion_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { suggestion_id } = body;

  if (!suggestion_id) {
    return NextResponse.json({ error: 'suggestion_id is required' }, { status: 400 });
  }

  // Get voter IP and hash it
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  const voterIpHash = crypto.createHash('sha256').update(ip).digest('hex');

  const serverClient = createServerClient();

  // Look up the suggestion to get the cat_id
  const { data: suggestion, error: suggestionError } = await serverClient
    .from('name_suggestions')
    .select('id, cat_id')
    .eq('id', suggestion_id)
    .single();

  if (suggestionError || !suggestion) {
    return NextResponse.json({ error: 'Suggestion not found' }, { status: 404 });
  }

  // Validate the cat is in 'voting' status
  const { data: cat, error: catError } = await serverClient
    .from('cats')
    .select('id, voting_status')
    .eq('id', suggestion.cat_id)
    .single();

  if (catError || !cat) {
    return NextResponse.json({ error: 'Cat not found' }, { status: 404 });
  }

  if (cat.voting_status !== 'voting') {
    return NextResponse.json(
      { error: 'Voting is not currently open for this cat' },
      { status: 400 }
    );
  }

  // Insert the vote
  const { error: insertError } = await serverClient
    .from('votes')
    .insert({
      suggestion_id,
      cat_id: suggestion.cat_id,
      voter_ip: voterIpHash,
    });

  if (insertError) {
    // Unique constraint violation — already voted
    if (insertError.code === '23505') {
      return NextResponse.json(
        { error: 'You have already voted for this cat' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
