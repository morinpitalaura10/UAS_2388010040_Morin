import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama_pasien, no_telepon, id_dokter, id_poli, tanggal_janji, keluhan } = body;

    if (!nama_pasien || !no_telepon || !id_dokter || !id_poli || !tanggal_janji) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi (nama, telepon, dokter, poli, tanggal).' },
        { status: 400 }
      );
    }

    // Check if pasien exists by phone, else create
    let pasien = await query('SELECT * FROM pasien WHERE no_telepon = ?', [no_telepon]);
    let id_pasien;

    if (pasien.length > 0) {
      id_pasien = pasien[0].id_pasien;
    } else {
      const result = await query(
        'INSERT INTO pasien (nama_pasien, no_telepon, jenis_kelamin, tanggal_lahir) VALUES (?, ?, ?, ?)',
        [nama_pasien, no_telepon, 'L', '2000-01-01']
      );
      id_pasien = result.insertId;
    }

    // Count existing appointments on this date for queue number
    const existing = await query(
      'SELECT COUNT(*) as count FROM janji_temu WHERE tanggal_janji = ? AND id_poli = ?',
      [tanggal_janji, id_poli]
    );
    const no_antrian = (existing[0]?.count || 0) + 1;

    // Create appointment
    await query(
      `INSERT INTO janji_temu (no_antrian, id_pasien, id_dokter, id_poli, tanggal_janji, keluhan, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [no_antrian, id_pasien, id_dokter, id_poli, tanggal_janji, keluhan || null]
    );

    return NextResponse.json({
      message: 'Janji temu berhasil dibuat!',
      no_antrian,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
