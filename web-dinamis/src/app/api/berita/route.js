import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const berita = await query(
      'SELECT id, judul, slug, excerpt, image, created_at FROM berita WHERE is_published = 1 ORDER BY created_at DESC'
    );
    return NextResponse.json(berita);
  } catch (error) {
    console.error('Berita error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
