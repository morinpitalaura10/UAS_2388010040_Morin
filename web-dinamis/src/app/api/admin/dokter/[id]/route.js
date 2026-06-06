import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT * FROM dokter WHERE id_dokter = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama_dokter, id_spesialis, id_poli, no_telepon, email, tarif } = body;

    await query(
      'UPDATE dokter SET nama_dokter=?, id_spesialis=?, id_poli=?, no_telepon=?, email=?, tarif=? WHERE id_dokter=?',
      [nama_dokter, id_spesialis || null, id_poli || null, no_telepon || null, email || null, tarif || 0, id]
    );
    return NextResponse.json({ message: 'Dokter berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query('DELETE FROM dokter WHERE id_dokter = ?', [id]);
    return NextResponse.json({ message: 'Dokter berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
