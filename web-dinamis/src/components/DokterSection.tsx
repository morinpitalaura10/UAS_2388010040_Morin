"use client";

interface DokterItem {
  id_dokter: number;
  nama_dokter: string;
  nama_spesialis: string;
  nama_poli: string;
  tarif: number;
  foto: string;
  jadwal?: string;
}

export default function DokterSection({ data }: { data?: DokterItem[] }) {
  const dokterList = data && data.length > 0 ? data : [
    { id_dokter: 1, nama_dokter: "dr. Budi Santoso, Sp.A", nama_spesialis: "Spesialis Anak (Pediatri)", nama_poli: "Poli Anak", tarif: 150000, foto: "default_dokter.png", jadwal: "Senin (08:00-12:00), Rabu (08:00-12:00)" },
    { id_dokter: 2, nama_dokter: "dr. Rina Herawati, Sp.PD", nama_spesialis: "Spesialis Penyakit Dalam", nama_poli: "Poli Penyakit Dalam", tarif: 175000, foto: "default_dokter.png", jadwal: "Selasa (09:00-13:00), Kamis (09:00-13:00)" },
    { id_dokter: 3, nama_dokter: "dr. Anton Wijaya, Sp.JP", nama_spesialis: "Spesialis Jantung", nama_poli: "Poli Jantung", tarif: 200000, foto: "default_dokter.png", jadwal: "Jumat (13:00-17:00)" },
  ];

  return (
    <section id="dokter" className="berita-section">
      <h2 className="section-title">
        Dokter <span className="text-gradient">Spesialis Kami</span>
      </h2>
      <p className="section-subtitle">
        Temui tim dokter ahli medis kami yang berdedikasi tinggi memberikan pelayanan terbaik bagi kesehatan Anda.
      </p>

      <div className="berita-grid">
        {dokterList.map((doc, i) => (
          <div
            key={doc.id_dokter}
            className="card berita-card"
            style={{ animationDelay: `${i * 0.1}s`, cursor: "default" }}
          >
            {/* Foto Dokter Placeholder/Avatar */}
            <div className="berita-card__img" style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.02)", height: "220px", borderBottom: "1px solid var(--glass-border)" }}>
              <div style={{ fontSize: "5rem" }}>👨‍⚕️</div>
            </div>
            <div className="berita-card__body">
              <span className="berita-card__date" style={{ fontSize: "0.85rem", color: "var(--accent-blue)" }}>
                {doc.nama_spesialis}
              </span>
              <h3 style={{ fontSize: "1.35rem", margin: "0.5rem 0 0.2rem 0", fontWeight: 700 }}>
                {doc.nama_dokter}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", marginBottom: "0.8rem" }}>
                🏥 {doc.nama_poli}
              </p>

              {doc.jadwal ? (
                <div style={{ marginTop: "auto" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: 600, marginBottom: "2px" }}>
                    📅 JADWAL PRAKTEK:
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#fff", background: "rgba(255,255,255,0.05)", padding: "6px 10px", borderRadius: "6px", border: "1px solid var(--glass-border)", marginBottom: "1rem" }}>
                    {doc.jadwal}
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: "auto", marginBottom: "1rem" }} />
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "0.8rem", fontSize: "0.9rem" }}>
                <span style={{ color: "var(--text-dim)" }}>Biaya Konsultasi</span>
                <strong style={{ color: "var(--accent-blue)", fontSize: "1rem" }}>
                  Rp {Number(doc.tarif).toLocaleString("id-ID")}
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
