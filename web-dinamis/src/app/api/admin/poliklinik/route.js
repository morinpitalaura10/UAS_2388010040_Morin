import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const polis = await query('SELECT * FROM poliklinik ORDER BY id_poli DESC');
    return NextResponse.json(polis);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama_poli, deskripsi, gedung, lantai } = body;
    if (!nama_poli) return NextResponse.json({ error: 'Nama poli wajib diisi' }, { status: 400 });

    const result = await query(
      'INSERT INTO poliklinik (nama_poli, deskripsi, gedung, lantai) VALUES (?, ?, ?, ?)',
      [nama_poli, deskripsi || null, gedung || null, lantai || null]
    );
    return NextResponse.json({ message: 'Poliklinik berhasil ditambahkan', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
