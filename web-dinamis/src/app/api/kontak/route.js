import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, email, subjek, pesan } = body;

    if (!nama || !email || !pesan) {
      return NextResponse.json(
        { error: 'Nama, email, dan pesan wajib diisi.' },
        { status: 400 }
      );
    }

    await query(
      'INSERT INTO kontak_pesan (nama, email, subjek, pesan) VALUES (?, ?, ?, ?)',
      [nama, email, subjek || null, pesan]
    );

    return NextResponse.json({ message: 'Pesan berhasil dikirim!' });
  } catch (error) {
    console.error('Contact error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
