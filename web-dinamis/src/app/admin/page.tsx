import { query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const dokterCount = await query<any>("SELECT COUNT(*) as total FROM dokter");
  const poliklinikCount = await query<any>("SELECT COUNT(*) as total FROM poliklinik");
  const janjiCount = await query<any>("SELECT COUNT(*) as total FROM janji_temu");
  const unreadKontak = await query<any>("SELECT COUNT(*) as total FROM kontak_pesan WHERE status = 'belum_dibaca'");
  const beritaCount = await query<any>("SELECT COUNT(*) as total FROM berita");
  const usersCount = await query<any>("SELECT COUNT(*) as total FROM users");

  const stats = [
    { name: "Total Poliklinik", value: poliklinikCount[0]?.total ?? 0, href: "/admin/poliklinik", color: "#7c3aed", bg: "#f5f3ff", border: "#ede9fe" },
    { name: "Total Dokter Spesialis", value: dokterCount[0]?.total ?? 0, href: "/admin/dokter", color: "#7c3aed", bg: "#f5f3ff", border: "#ede9fe" },
    { name: "Total Pengguna", value: usersCount[0]?.total ?? 0, href: "/admin/users", color: "#a855f7", bg: "#f3e8ff", border: "#ddd6fe" },
    { name: "Total Berita", value: beritaCount[0]?.total ?? 0, href: "/admin/berita", color: "#c084fc", bg: "#f5f3ff", border: "#ede9fe" },
    { name: "Pendaftaran Janji Temu", value: janjiCount[0]?.total ?? 0, href: "/admin", color: "#9d4edd", bg: "#f5f3ff", border: "#ede9fe" },
    { name: "Pesan Belum Dibaca", value: unreadKontak[0]?.total ?? 0, href: "/admin/kontak", color: "#7c3aed", bg: "#f5f3ff", border: "#ede9fe" },
  ];

  const recentJanji = await query<any>(
    `SELECT jt.id_janji as id, p.nama_pasien, d.nama_dokter, jt.tanggal_janji, jt.status 
     FROM janji_temu jt
     JOIN pasien p ON jt.id_pasien = p.id_pasien
     JOIN dokter d ON jt.id_dokter = d.id_dokter
     ORDER BY jt.created_at DESC LIMIT 5`
  );

  const recentKontak = await query<any>(
    "SELECT id_pesan as id, nama, email, subjek, (status = 'sudah_dibaca') as is_read, created_at FROM kontak_pesan ORDER BY created_at DESC LIMIT 5"
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending": return "admin-badge-gray";
      case "dikonfirmasi": return "admin-badge-blue";
      case "selesai": return "admin-badge-green";
      case "dibatalkan": return "admin-badge-red";
      default: return "admin-badge-gray";
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#f8f8ff", marginBottom: "6px" }}>
          Selamat Datang 👋
        </h2>
        <p style={{ color: "#c8c2e8", fontSize: "14px" }}>
          Berikut adalah ringkasan data operasional RSU Morin Medika Anda.
        </p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {stats.map((s) => (
          <Link key={s.name} href={s.href} className="admin-stat-card" style={{ textDecoration: "none" }}>
            <div>
              <div style={{ fontSize: "13px", color: "#d8b4fe", fontWeight: 500, marginBottom: "8px" }}>{s.name}</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#f8f8ff", lineHeight: 1 }}>{s.value}</div>
            </div>
            <div style={{
              width: "48px", height: "48px", borderRadius: "12px",
              background: s.bg, border: `1px solid ${s.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: s.color, fontSize: "22px", fontWeight: 800,
            }}>
              {String(s.value).padStart(1, "0")}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent content */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Recent Janji Temu / Bookings */}
        <div className="admin-card">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#f8f8ff" }}>Pendaftaran Janji Temu Terbaru</div>
            <div style={{ fontSize: "11px", color: "#c8c2e8" }}>Real-time</div>
          </div>
          <div>
            {recentJanji.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#c8c2e8", fontSize: "14px" }}>Belum ada pendaftaran online.</div>
            ) : recentJanji.map((j: any) => (
              <div key={j.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#f8f8ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {j.nama_pasien}
                  </div>
                  <div style={{ fontSize: "11px", color: "#d8b4fe", marginTop: "2px" }}>
                    Dokter: {j.nama_dokter}
                  </div>
                  <div style={{ fontSize: "11px", color: "#c8c2e8", marginTop: "2px" }}>
                    Rencana: {new Date(j.tanggal_janji).toLocaleDateString("id-ID")}
                  </div>
                </div>
                <span className={`admin-badge ${getStatusBadgeClass(j.status)}`} style={{ marginLeft: "12px", flexShrink: 0 }}>
                  {j.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Kontak */}
        <div className="admin-card">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#f8f8ff" }}>Pesan Hubungi Kami Terbaru</div>
            <Link href="/admin/kontak" className="admin-btn admin-btn-secondary" style={{ padding: "6px 14px", fontSize: "12px" }}>Lihat Semua</Link>
          </div>
          <div>
            {recentKontak.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#c8c2e8", fontSize: "14px" }}>Belum ada pesan.</div>
            ) : recentKontak.map((k: any) => (
              <div key={k.id} style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {!k.is_read && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#a855f7", display: "inline-block", flexShrink: 0 }} />}
                    <div style={{ fontSize: "13px", fontWeight: k.is_read ? 500 : 700, color: "#f8f8ff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.nama}</div>
                  </div>
                  <div style={{ fontSize: "11px", color: "#c8c2e8", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.email}</div>
                </div>
                <div style={{ fontSize: "11px", color: "#c8c2e8", marginLeft: "12px", flexShrink: 0 }}>
                  {new Date(k.created_at).toLocaleDateString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
