import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const layanans = await query('SELECT * FROM layanan ORDER BY urutan ASC, id DESC');
    return NextResponse.json(layanans);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, icon, deskripsi, urutan } = body;

    if (!nama || !deskripsi) {
      return NextResponse.json({ error: 'Nama layanan dan deskripsi wajib diisi' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO layanan (nama, icon, deskripsi, urutan) VALUES (?, ?, ?, ?)',
      [nama, icon || 'Activity', deskripsi, urutan || 0]
    );

    return NextResponse.json({ message: 'Layanan berhasil ditambahkan', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error creating layanan:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
