import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const jadwals = await query(`
      SELECT jd.*, d.nama_dokter 
      FROM jadwal_dokter jd
      JOIN dokter d ON jd.id_dokter = d.id_dokter
      ORDER BY FIELD(jd.hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'), jd.jam_mulai
    `);
    return NextResponse.json(jadwals);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { id_dokter, hari, jam_mulai, jam_selesai } = await request.json();
    if (!id_dokter || !hari || !jam_mulai || !jam_selesai) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }
    const result = await query(
      'INSERT INTO jadwal_dokter (id_dokter, hari, jam_mulai, jam_selesai) VALUES (?, ?, ?, ?)',
      [id_dokter, hari, jam_mulai, jam_selesai]
    );
    return NextResponse.json({ message: 'Jadwal berhasil ditambahkan', id: result.insertId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
