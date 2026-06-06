import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM berita WHERE id = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { judul, excerpt, konten, image, is_published } = body;

    if (!judul || !konten) {
      return NextResponse.json({ error: 'Judul dan konten wajib diisi' }, { status: 400 });
    }

    // Get current title to see if it changed
    const current = await query('SELECT judul, slug FROM berita WHERE id = ?', [id]);
    if (current.length === 0) {
      return NextResponse.json({ error: 'Berita tidak ditemukan' }, { status: 404 });
    }

    let slug = current[0].slug;
    if (current[0].judul !== judul) {
      let baseSlug = slugify(judul);
      slug = baseSlug;
      let count = 1;
      while (true) {
        const existing = await query('SELECT id FROM berita WHERE slug = ? AND id != ?', [slug, id]);
        if (existing.length === 0) break;
        slug = `${baseSlug}-${count}`;
        count++;
      }
    }

    await query(
      'UPDATE berita SET judul=?, slug=?, excerpt=?, konten=?, image=?, is_published=? WHERE id=?',
      [judul, slug, excerpt || '', konten, image || null, is_published ? 1 : 0, id]
    );

    return NextResponse.json({ message: 'Berita berhasil diperbarui', slug });
  } catch (error) {
    console.error('Error updating berita:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM berita WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Berita berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
