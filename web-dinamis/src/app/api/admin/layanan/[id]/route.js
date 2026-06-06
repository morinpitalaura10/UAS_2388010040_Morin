import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM layanan WHERE id = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, icon, deskripsi, urutan } = body;

    if (!nama || !deskripsi) {
      return NextResponse.json({ error: 'Nama layanan dan deskripsi wajib diisi' }, { status: 400 });
    }

    await query(
      'UPDATE layanan SET nama=?, icon=?, deskripsi=?, urutan=? WHERE id=?',
      [nama, icon || 'Activity', deskripsi, urutan || 0, id]
    );

    return NextResponse.json({ message: 'Layanan berhasil diperbarui' });
  } catch (error) {
    console.error('Error updating layanan:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM layanan WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Layanan berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
