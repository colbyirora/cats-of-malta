import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase';
import type { Cat } from '@/lib/types';

export async function GET() {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('cats')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cats: data });
}

export async function POST(request: NextRequest) {
  const isAdmin = await requireAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Partial<Cat>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const requiredFields = ['primary_photo', 'location_lat', 'location_lng', 'location_name', 'color'] as const;
  const missingFields = requiredFields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }

  const newCat = {
    name: body.name ?? null,
    photos: body.photos ?? [],
    primary_photo: body.primary_photo!,
    location_lat: body.location_lat!,
    location_lng: body.location_lng!,
    location_name: body.location_name!,
    breed: body.breed ?? null,
    color: body.color!,
    age: body.age ?? null,
    is_stray: body.is_stray ?? true,
    background_story: body.background_story ?? null,
    voting_status: body.voting_status ?? 'none',
    voting_round_id: body.voting_round_id ?? null,
    approved: body.approved ?? false,
  };

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('cats')
    .insert(newCat)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ cat: data }, { status: 201 });
}
