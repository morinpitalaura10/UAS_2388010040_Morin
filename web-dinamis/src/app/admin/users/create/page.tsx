import Link from "next/link";
import { createUser } from "@/app/actions/users";

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const SaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export default function CreateUserPage() {
  return (
    <div style={{ maxWidth: "800px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/users" className="admin-btn admin-btn-icon">
            <BackIcon />
          </Link>
          <div>
            <div className="admin-page-title">Tambah Pengguna Baru</div>
            <div className="admin-page-subtitle">Tambahkan akun admin, dokter, atau pasien ke database Anda.</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={createUser}>
          <div className="admin-form-group">
            <label className="admin-form-label">Username <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="username" required type="text" className="admin-form-input" placeholder="admin" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Password <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="password" required type="password" className="admin-form-input" placeholder="Masukkan password" />
            <div style={{ fontSize: "12px", color: "#c8c2e8", marginTop: "4px" }}>Password akan disimpan dalam bentuk hash yang aman.</div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Nama Lengkap <span style={{ color: "#ef4444" }}>*</span></label>
            <input name="nama_lengkap" required type="text" className="admin-form-input" placeholder="Administrator Utama" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Email</label>
            <input name="email" type="email" className="admin-form-input" placeholder="admin@example.com" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">No. Telepon</label>
            <input name="no_telepon" type="tel" className="admin-form-input" placeholder="081234567890" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Role</label>
            <select name="role" className="admin-form-input" defaultValue="pasien">
              <option value="admin">admin</option>
              <option value="dokter">dokter</option>
              <option value="pasien">pasien</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Link href="/admin/users" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary">
              <SaveIcon /> Simpan Pengguna
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
