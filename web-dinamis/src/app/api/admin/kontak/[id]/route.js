import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM kontak_pesan WHERE id_pesan = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Pesan tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body; // 'belum_dibaca' or 'sudah_dibaca'

    if (!status) {
      return NextResponse.json({ error: 'Status wajib diisi' }, { status: 400 });
    }

    await query(
      'UPDATE kontak_pesan SET status=? WHERE id_pesan=?',
      [status, id]
    );

    return NextResponse.json({ message: 'Status pesan berhasil diperbarui' });
  } catch (error) {
    console.error('Error updating message status:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM kontak_pesan WHERE id_pesan = ?', [id]);
    return NextResponse.json({ message: 'Pesan berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
