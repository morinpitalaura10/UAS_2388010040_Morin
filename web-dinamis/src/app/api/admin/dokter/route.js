import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const dokters = await query(`
      SELECT d.*, s.nama_spesialis, p.nama_poli 
      FROM dokter d 
      LEFT JOIN spesialis s ON d.id_spesialis = s.id_spesialis 
      LEFT JOIN poliklinik p ON d.id_poli = p.id_poli
      ORDER BY d.id_dokter DESC
    `);
    return NextResponse.json(dokters);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama_dokter, id_spesialis, id_poli, no_telepon, email, tarif } = body;
    if (!nama_dokter) return NextResponse.json({ error: 'Nama dokter wajib diisi' }, { status: 400 });

    const result = await query(
      'INSERT INTO dokter (nama_dokter, id_spesialis, id_poli, no_telepon, email, tarif) VALUES (?, ?, ?, ?, ?, ?)',
      [nama_dokter, id_spesialis || null, id_poli || null, no_telepon || null, email || null, tarif || 0]
    );
    return NextResponse.json({ message: 'Dokter berhasil ditambahkan', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
