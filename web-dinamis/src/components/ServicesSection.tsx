"use client";

interface PoliklinikItem {
  title: string;
  desc: string;
  gedung?: string;
  lantai?: string;
  icon?: string;
}

export default function ServicesSection({ data }: { data?: PoliklinikItem[] }) {
  const poliList = data && data.length > 0 ? data : [
    { title: "Poli Anak", desc: "Poliklinik khusus kesehatan anak, tumbuh kembang, dan imunisasi.", gedung: "Gedung A", lantai: "Lantai 1", icon: "👶" },
    { title: "Poli Penyakit Dalam", desc: "Poliklinik untuk pemeriksaan, diagnosis, dan terapi penyakit organ dalam dewasa.", gedung: "Gedung B", lantai: "Lantai 2", icon: "🩺" },
    { title: "Poli Jantung", desc: "Poliklinik spesialis diagnosis, pencegahan, dan terapi penyakit jantung.", gedung: "Gedung A", lantai: "Lantai 2", icon: "❤️" },
  ];

  const getPoliIcon = (nama: string) => {
    const nameLower = nama.toLowerCase();
    if (nameLower.includes("anak")) return "👶";
    if (nameLower.includes("jantung")) return "❤️";
    if (nameLower.includes("dalam")) return "🩺";
    if (nameLower.includes("gigi")) return "🦷";
    if (nameLower.includes("mata")) return "👁️";
    if (nameLower.includes("kandungan") || nameLower.includes("obgyn")) return "🤰";
    return "🏥";
  };

  return (
    <section id="poliklinik" className="services">
      <h2 className="section-title">
        Poliklinik <span className="text-gradient">Unggulan</span>
      </h2>
      <p className="section-subtitle">
        Layanan poliklinik rawat jalan kami didukung oleh dokter spesialis berpengalaman dan peralatan medis berkualitas.
      </p>
      <div className="services-grid">
        {poliList.map((p, i) => (
          <div className="card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="card-icon">{p.icon || getPoliIcon(p.title)}</span>
            <h3>{p.title}</h3>
            <p style={{ marginBottom: "1rem" }}>{p.desc}</p>
            {p.gedung && (
              <div style={{ marginTop: "auto", fontSize: "0.85rem", color: "var(--accent-blue)", borderTop: "1px solid var(--glass-border)", paddingTop: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                <span>📍 {p.gedung}</span>
                <span>🏢 {p.lantai}</span>
              </div>
            )}
            <div className="card-shine" />
          </div>
        ))}
      </div>
    </section>
  );
}
