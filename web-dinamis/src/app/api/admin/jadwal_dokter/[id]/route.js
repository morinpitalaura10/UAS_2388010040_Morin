import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM jadwal_dokter WHERE id_jadwal = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { id_dokter, hari, jam_mulai, jam_selesai } = await request.json();
    await query(
      'UPDATE jadwal_dokter SET id_dokter=?, hari=?, jam_mulai=?, jam_selesai=? WHERE id_jadwal=?',
      [id_dokter, hari, jam_mulai, jam_selesai, id]
    );
    return NextResponse.json({ message: 'Jadwal berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM jadwal_dokter WHERE id_jadwal = ?', [id]);
    return NextResponse.json({ message: 'Jadwal berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
