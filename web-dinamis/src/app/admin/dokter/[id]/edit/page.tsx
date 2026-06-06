import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateDokter } from "@/app/actions/dokter";

export const dynamic = "force-dynamic";

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

export default async function EditDokterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows, doctorUsers, spesialis, poliklinik] = await Promise.all([
    query<any>("SELECT * FROM dokter WHERE id_dokter = ? LIMIT 1", [id]),
    query<any>("SELECT id_user, username FROM users WHERE role = 'dokter' ORDER BY username ASC"),
    query<any>("SELECT id_spesialis as id, nama_spesialis as name FROM spesialis ORDER BY nama_spesialis ASC"),
    query<any>("SELECT id_poli as id, nama_poli as name FROM poliklinik ORDER BY nama_poli ASC"),
  ]);

  if (!rows || rows.length === 0) {
    notFound();
  }

  const dokter = rows[0];

  return (
    <div style={{ maxWidth: "860px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/dokter" className="admin-btn admin-btn-icon"><BackIcon /></Link>
          <div>
            <div className="admin-page-title">Edit Dokter</div>
            <div className="admin-page-subtitle">ID #{id} — Perbarui data dokter.</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={async (formData: FormData) => {
          "use server";
          await updateDokter(Number(id), formData);
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Nama Dokter <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="nama_dokter" required type="text" className="admin-form-input" defaultValue={dokter.nama_dokter} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Akun Pengguna</label>
              <select name="id_user" className="admin-form-input" style={{ cursor: "pointer" }} defaultValue={dokter.id_user || ""}>
                <option value="">Tidak terhubung</option>
                {doctorUsers.map((user: any) => (
                  <option key={user.id_user} value={user.id_user}>{user.username}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Spesialis</label>
              <select name="id_spesialis" className="admin-form-input" style={{ cursor: "pointer" }} defaultValue={dokter.id_spesialis || ""}>
                <option value="">Pilih spesialis</option>
                {spesialis.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Poliklinik</label>
              <select name="id_poli" className="admin-form-input" style={{ cursor: "pointer" }} defaultValue={dokter.id_poli || ""}>
                <option value="">Pilih poliklinik</option>
                {poliklinik.map((item: any) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Telepon</label>
              <input name="no_telepon" type="tel" className="admin-form-input" defaultValue={dokter.no_telepon || ""} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>
              <input name="email" type="email" className="admin-form-input" defaultValue={dokter.email || ""} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Tarif</label>
              <input name="tarif" type="number" step="0.01" className="admin-form-input" defaultValue={dokter.tarif || 0} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Foto (URL)</label>
              <input name="foto" type="url" className="admin-form-input" defaultValue={dokter.foto || ""} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Link href="/admin/dokter" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary"><SaveIcon /> Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
