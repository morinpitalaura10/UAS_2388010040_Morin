import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const berita = await query('SELECT * FROM berita WHERE slug = ?', [slug]);

    if (berita.length === 0) {
      return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(berita[0]);
  } catch (error) {
    console.error('Berita detail error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
