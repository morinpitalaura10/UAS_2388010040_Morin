import { createPoliklinik } from "@/app/actions/poliklinik";
import Link from "next/link";

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

export default function CreatePoliklinikPage() {
  return (
    <div style={{ maxWidth: "700px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/poliklinik" className="admin-btn admin-btn-icon"><BackIcon /></Link>
          <div>
            <div className="admin-page-title">Tambah Poliklinik</div>
            <div className="admin-page-subtitle">Tambahkan unit pelayanan baru ke rumah sakit Anda.</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={createPoliklinik}>
          <div className="admin-form-group">
            <label className="admin-form-label">Nama Poliklinik <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="nama_poli" required type="text" className="admin-form-input" placeholder="Poli Anak" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Gedung</label>
            <input name="gedung" type="text" className="admin-form-input" placeholder="Gedung A" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Lantai</label>
            <input name="lantai" type="text" className="admin-form-input" placeholder="Lantai 1" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Deskripsi</label>
            <textarea name="deskripsi" className="admin-form-textarea" style={{ minHeight: "120px" }} placeholder="Deskripsikan fungsi dan layanan poliklinik ini." />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Link href="/admin/poliklinik" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary"><SaveIcon /> Simpan Poliklinik</button>
          </div>
        </form>
      </div>
    </div>
  );
}
