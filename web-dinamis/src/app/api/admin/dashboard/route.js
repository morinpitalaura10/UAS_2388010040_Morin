import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const [
      totalDokter,
      totalPasien,
      totalPoli,
      totalUsers,
      janjiHariIni,
      pesanBaru,
      recentJanji,
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM dokter'),
      query('SELECT COUNT(*) as count FROM pasien'),
      query('SELECT COUNT(*) as count FROM poliklinik'),
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT COUNT(*) as count FROM janji_temu WHERE tanggal_janji = CURDATE()'),
      query("SELECT COUNT(*) as count FROM kontak_pesan WHERE status = 'belum_dibaca'"),
      query(`SELECT jt.*, p.nama_pasien, d.nama_dokter, pk.nama_poli 
             FROM janji_temu jt
             JOIN pasien p ON jt.id_pasien = p.id_pasien
             JOIN dokter d ON jt.id_dokter = d.id_dokter
             JOIN poliklinik pk ON jt.id_poli = pk.id_poli
             ORDER BY jt.created_at DESC LIMIT 5`),
    ]);

    return NextResponse.json({
      totalDokter: totalDokter[0].count,
      totalPasien: totalPasien[0].count,
      totalPoli: totalPoli[0].count,
      totalUsers: totalUsers[0].count,
      janjiHariIni: janjiHariIni[0].count,
      pesanBaru: pesanBaru[0].count,
      recentJanji,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}
