import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePoliklinik } from "@/app/actions/poliklinik";

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

export default async function EditPoliklinikPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<any>("SELECT * FROM poliklinik WHERE id_poli = ? LIMIT 1", [id]);
  if (!rows || rows.length === 0) notFound();
  const poli = rows[0];

  return (
    <div style={{ maxWidth: "700px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/poliklinik" className="admin-btn admin-btn-icon"><BackIcon /></Link>
          <div>
            <div className="admin-page-title">Edit Poliklinik</div>
            <div className="admin-page-subtitle">ID #{id} — Perbarui informasi poliklinik.</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={async (formData: FormData) => {
          "use server";
          await updatePoliklinik(Number(id), formData);
        }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Nama Poliklinik <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="nama_poli" required type="text" className="admin-form-input" defaultValue={poli.nama_poli} />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Gedung</label>
            <input name="gedung" type="text" className="admin-form-input" defaultValue={poli.gedung || ""} />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Lantai</label>
            <input name="lantai" type="text" className="admin-form-input" defaultValue={poli.lantai || ""} />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Deskripsi</label>
            <textarea name="deskripsi" className="admin-form-textarea" style={{ minHeight: "120px" }} defaultValue={poli.deskripsi || ""} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Link href="/admin/poliklinik" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary"><SaveIcon /> Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
