"use client";

import { useState } from "react";

interface DokterItem {
  id_dokter: number;
  nama_dokter: string;
  nama_spesialis: string;
  nama_poli: string;
}

export default function BookingSection({ dokterList = [] }: { dokterList?: DokterItem[] }) {
  const [form, setForm] = useState({
    nik: "",
    nama_pasien: "",
    jenis_kelamin: "L",
    tanggal_lahir: "",
    no_telepon: "",
    alamat: "",
    golongan_darah: "O",
    id_dokter: "",
    tanggal_janji: "",
    keluhan: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [resData, setResData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id_dokter) {
      alert("Silakan pilih dokter terlebih dahulu.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal booking");
      
      setStatus("ok");
      setResData(data);
      setForm({
        nik: "",
        nama_pasien: "",
        jenis_kelamin: "L",
        tanggal_lahir: "",
        no_telepon: "",
        alamat: "",
        golongan_darah: "O",
        id_dokter: "",
        tanggal_janji: "",
        keluhan: "",
      });
    } catch (err: any) {
      console.error(err);
      setStatus("error");
    }
  };

  const defaultDoctors = [
    { id_dokter: 1, nama_dokter: "dr. Budi Santoso, Sp.A", nama_spesialis: "Spesialis Anak (Pediatri)", nama_poli: "Poli Anak" },
    { id_dokter: 2, nama_dokter: "dr. Rina Herawati, Sp.PD", nama_spesialis: "Spesialis Penyakit Dalam", nama_poli: "Poli Penyakit Dalam" },
    { id_dokter: 3, nama_dokter: "dr. Anton Wijaya, Sp.JP", nama_spesialis: "Spesialis Jantung", nama_poli: "Poli Jantung" },
  ];

  const doctors = dokterList.length > 0 ? dokterList : defaultDoctors;

  return (
    <section id="booking" className="contact" style={{ background: "rgba(15, 23, 42, 0.3)" }}>
      <h2 className="section-title">
        Pendaftaran <span className="text-gradient">Janji Temu</span>
      </h2>
      <p className="section-subtitle">
        Daftarkan diri Anda secara online untuk melakukan konsultasi tatap muka dengan dokter spesialis kami.
      </p>

      <form className="contact-form" onSubmit={handleSubmit} style={{ maxWidth: "800px" }}>
        {/* NIK & Nama */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nik">NIK (16 Digit KTP)</label>
            <input
              id="nik"
              type="text"
              pattern="\d{16}"
              maxLength={16}
              required
              value={form.nik}
              onChange={(e) => setForm({ ...form, nik: e.target.value.replace(/\D/g, "") })}
              placeholder="Contoh: 327501XXXXXXXXXX"
            />
          </div>
          <div className="form-group">
            <label htmlFor="nama_pasien">Nama Lengkap Pasien</label>
            <input
              id="nama_pasien"
              type="text"
              required
              value={form.nama_pasien}
              onChange={(e) => setForm({ ...form, nama_pasien: e.target.value })}
              placeholder="Nama lengkap sesuai KTP"
            />
          </div>
        </div>

        {/* Jenis Kelamin & Tanggal Lahir */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="jenis_kelamin">Jenis Kelamin</label>
            <select
              id="jenis_kelamin"
              value={form.jenis_kelamin}
              onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "#fff",
                outline: "none"
              }}
            >
              <option value="L" style={{ background: "#050505" }}>Laki-laki</option>
              <option value="P" style={{ background: "#050505" }}>Perempuan</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tanggal_lahir">Tanggal Lahir</label>
            <input
              id="tanggal_lahir"
              type="date"
              required
              value={form.tanggal_lahir}
              onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
            />
          </div>
        </div>

        {/* No Telepon & Golongan Darah */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="no_telepon">No. Telepon / WhatsApp</label>
            <input
              id="no_telepon"
              type="tel"
              required
              value={form.no_telepon}
              onChange={(e) => setForm({ ...form, no_telepon: e.target.value })}
              placeholder="Contoh: 08XXXXXXXXXX"
            />
          </div>
          <div className="form-group">
            <label htmlFor="golongan_darah">Golongan Darah</label>
            <select
              id="golongan_darah"
              value={form.golongan_darah}
              onChange={(e) => setForm({ ...form, golongan_darah: e.target.value })}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "#fff",
                outline: "none"
              }}
            >
              <option value="A" style={{ background: "#050505" }}>A</option>
              <option value="B" style={{ background: "#050505" }}>B</option>
              <option value="AB" style={{ background: "#050505" }}>AB</option>
              <option value="O" style={{ background: "#050505" }}>O</option>
            </select>
          </div>
        </div>

        {/* Alamat */}
        <div className="form-group">
          <label htmlFor="alamat">Alamat Lengkap</label>
          <textarea
            id="alamat"
            rows={3}
            required
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            placeholder="Alamat tempat tinggal saat ini"
          />
        </div>

        {/* Dokter Pilihan & Tanggal Rencana Janji */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="id_dokter">Dokter Spesialis Pilihan</label>
            <select
              id="id_dokter"
              required
              value={form.id_dokter}
              onChange={(e) => setForm({ ...form, id_dokter: e.target.value })}
              style={{
                width: "100%",
                padding: "1rem",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "#fff",
                outline: "none"
              }}
            >
              <option value="" style={{ background: "#050505" }}>-- Pilih Dokter --</option>
              {doctors.map((doc) => (
                <option key={doc.id_dokter} value={doc.id_dokter} style={{ background: "#050505" }}>
                  {doc.nama_dokter} ({doc.nama_poli})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="tanggal_janji">Tanggal Rencana Kunjungan</label>
            <input
              id="tanggal_janji"
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={form.tanggal_janji}
              onChange={(e) => setForm({ ...form, tanggal_janji: e.target.value })}
            />
          </div>
        </div>

        {/* Keluhan */}
        <div className="form-group">
          <label htmlFor="keluhan">Keluhan Medis</label>
          <textarea
            id="keluhan"
            rows={4}
            required
            value={form.keluhan}
            onChange={(e) => setForm({ ...form, keluhan: e.target.value })}
            placeholder="Tuliskan keluhan atau gejala medis yang Anda rasakan..."
          />
        </div>

        <button type="submit" className="cta-button" disabled={status === "sending"} style={{ width: "100%" }}>
          {status === "sending" ? "MEMPROSES PENDAFTARAN..." : "KIRIM PENDAFTARAN JANJI TEMU"}
        </button>

        {status === "ok" && resData && (
          <div className="form-msg form-msg--ok" style={{ textAlign: "left", padding: "1.5rem" }}>
            <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>✅ Pendaftaran Berhasil!</p>
            <p style={{ marginBottom: "0.3rem" }}>Terima kasih <strong>{resData.nama_pasien}</strong>, janji temu Anda telah dijadwalkan.</p>
            <div style={{ background: "rgba(255,255,255,0.05)", padding: "12px", borderRadius: "6px", border: "1px solid rgba(0, 255, 100, 0.3)", marginTop: "10px" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>NOMOR ANTREAN ANDA:</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-blue)" }}>
                #{resData.no_antrian}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "4px" }}>
                Dokter: {resData.nama_dokter} | Tanggal: {new Date(resData.tanggal_janji).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", marginTop: "8px" }}>*Silakan datang 15 menit sebelum jadwal kunjungan Anda dengan membawa KTP/KK.</p>
          </div>
        )}
        {status === "error" && (
          <p className="form-msg form-msg--err">❌ Gagal melakukan pendaftaran. Silakan cek NIK Anda dan pastikan koneksi database aktif.</p>
        )}
      </form>
    </section>
  );
}
