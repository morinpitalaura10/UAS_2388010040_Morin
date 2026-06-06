import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Simple slugify function
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export async function GET() {
  try {
    const berita = await query('SELECT * FROM berita ORDER BY created_at DESC');
    return NextResponse.json(berita);
  } catch (error) {
    console.error('Error fetching berita:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { judul, excerpt, konten, image, is_published } = body;

    if (!judul || !konten) {
      return NextResponse.json({ error: 'Judul dan konten wajib diisi' }, { status: 400 });
    }

    let baseSlug = slugify(judul);
    let slug = baseSlug;
    
    // Check if slug exists, if so append unique count
    let count = 1;
    while (true) {
      const existing = await query('SELECT id FROM berita WHERE slug = ?', [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const result = await query(
      'INSERT INTO berita (judul, slug, excerpt, konten, image, is_published) VALUES (?, ?, ?, ?, ?, ?)',
      [judul, slug, excerpt || '', konten, image || null, is_published ? 1 : 0]
    );

    return NextResponse.json({ message: 'Berita berhasil ditambahkan', id: result.insertId, slug }, { status: 201 });
  } catch (error) {
    console.error('Error creating berita:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
