import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM poliklinik WHERE id_poli = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { nama_poli, deskripsi, gedung, lantai } = await request.json();
    await query(
      'UPDATE poliklinik SET nama_poli=?, deskripsi=?, gedung=?, lantai=? WHERE id_poli=?',
      [nama_poli, deskripsi || null, gedung || null, lantai || null, id]
    );
    return NextResponse.json({ message: 'Poliklinik berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM poliklinik WHERE id_poli = ?', [id]);
    return NextResponse.json({ message: 'Poliklinik berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
