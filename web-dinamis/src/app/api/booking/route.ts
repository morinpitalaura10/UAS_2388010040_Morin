import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nik,
      nama_pasien,
      jenis_kelamin,
      tanggal_lahir,
      no_telepon,
      alamat,
      golongan_darah,
      id_dokter,
      tanggal_janji,
      keluhan,
    } = body;

    // Validasi input
    if (!nik || !nama_pasien || !id_dokter || !tanggal_janji) {
      return NextResponse.json(
        { status: "error", message: "NIK, nama pasien, dokter, dan tanggal janji wajib diisi." },
        { status: 400 }
      );
    }

    // 1. Cek apakah pasien dengan NIK tersebut sudah terdaftar
    const existingPasien = await query<any>(
      "SELECT id_pasien FROM pasien WHERE nik = ?",
      [nik]
    );

    let idPasien: number;

    if (existingPasien.length > 0) {
      idPasien = existingPasien[0].id_pasien;
    } else {
      // Jika belum terdaftar, buat data pasien baru
      const insertPasienResult: any = await query(
        `INSERT INTO pasien (nama_pasien, nik, jenis_kelamin, tanggal_lahir, no_telepon, alamat, golongan_darah) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nama_pasien, nik, jenis_kelamin, tanggal_lahir, no_telepon, alamat, golongan_darah]
      );
      // Dapatkan id pasien yang baru dimasukkan
      const selectNewPasien = await query<any>(
        "SELECT id_pasien FROM pasien WHERE nik = ?",
        [nik]
      );
      idPasien = selectNewPasien[0].id_pasien;
    }

    // 2. Ambil data dokter & poliklinik asal dokter
    const dokterInfo = await query<any>(
      "SELECT nama_dokter, id_poli FROM dokter WHERE id_dokter = ?",
      [id_dokter]
    );

    if (dokterInfo.length === 0) {
      return NextResponse.json(
        { status: "error", message: "Dokter tidak ditemukan." },
        { status: 404 }
      );
    }

    const { nama_dokter, id_poli } = dokterInfo[0];

    // 3. Generate nomor antrean untuk tanggal dan dokter tersebut
    const maxQueue = await query<any>(
      "SELECT COALESCE(MAX(no_antrian), 0) + 1 as next_queue FROM janji_temu WHERE id_dokter = ? AND tanggal_janji = ?",
      [id_dokter, tanggal_janji]
    );
    const noAntrian = maxQueue[0].next_queue;

    // 4. Masukkan janji temu ke tabel janji_temu
    await query(
      `INSERT INTO janji_temu (no_antrian, id_pasien, id_dokter, id_poli, tanggal_janji, keluhan, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [noAntrian, idPasien, id_dokter, id_poli, tanggal_janji, keluhan]
    );

    return NextResponse.json({
      status: "ok",
      message: "Janji temu berhasil dibuat",
      no_antrian: noAntrian,
      nama_pasien,
      nama_dokter,
      tanggal_janji,
    });
  } catch (error: any) {
    console.error("API /booking error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
