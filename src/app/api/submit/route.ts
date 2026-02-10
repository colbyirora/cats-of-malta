import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { Resend } from 'resend';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('photo') as File | null;
  const location_name = formData.get('location_name') as string;
  const color = formData.get('color') as string;
  const breed = formData.get('breed') as string | null;
  const age = formData.get('age') as string | null;
  const is_stray = formData.get('is_stray') === 'true';
  const background_story = formData.get('background_story') as string | null;
  const location_lat = parseFloat(formData.get('location_lat') as string) || 35.9;
  const location_lng = parseFloat(formData.get('location_lng') as string) || 14.5;

  if (!file || !location_name || !color) {
    return NextResponse.json(
      { error: 'Photo, location, and color are required' },
      { status: 400 }
    );
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are allowed' }, { status: 400 });
  }

  // Validate file size (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 });
  }

  // Save file to public/uploads
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const bytes = new Uint8Array(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), bytes);

  const photoUrl = `/uploads/${filename}`;

  // Insert into Supabase with approved: false
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('cats')
    .insert({
      name: null,
      photos: [photoUrl],
      primary_photo: photoUrl,
      location_lat,
      location_lng,
      location_name,
      breed: breed || null,
      color,
      age: age || null,
      is_stray,
      background_story: background_story || null,
      voting_status: 'none',
      approved: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send email notification
  if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Cats of Malta <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Cat Submission — ${location_name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px;">
          <h2 style="color: #C41E3A;">New Cat Submitted!</h2>
          <p>A new cat sighting has been submitted and is waiting for your review.</p>
          <table style="border-collapse: collapse; width: 100%; margin: 16px 0;">
            <tr><td style="padding: 8px; color: #888; width: 120px;">Location</td><td style="padding: 8px; font-weight: bold;">${location_name}</td></tr>
            <tr><td style="padding: 8px; color: #888;">Color</td><td style="padding: 8px;">${color}</td></tr>
            ${breed ? `<tr><td style="padding: 8px; color: #888;">Breed</td><td style="padding: 8px;">${breed}</td></tr>` : ''}
            ${age ? `<tr><td style="padding: 8px; color: #888;">Age</td><td style="padding: 8px;">${age}</td></tr>` : ''}
            <tr><td style="padding: 8px; color: #888;">Stray</td><td style="padding: 8px;">${is_stray ? 'Yes' : 'No'}</td></tr>
            ${background_story ? `<tr><td style="padding: 8px; color: #888;">Story</td><td style="padding: 8px;">${background_story}</td></tr>` : ''}
          </table>
          <p style="margin-top: 16px;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin"
               style="background: #C41E3A; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; display: inline-block;">
              Review in Admin Dashboard
            </a>
          </p>
        </div>
      `,
    }).catch(() => {
      // Don't fail the submission if email fails
    });
  }

  return NextResponse.json({ success: true, cat: data }, { status: 201 });
}
