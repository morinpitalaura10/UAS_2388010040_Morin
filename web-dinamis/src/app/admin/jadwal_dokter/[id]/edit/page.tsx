import { query } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateJadwalDokter } from "@/app/actions/jadwal_dokter";

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

export default async function EditJadwalDokterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows, dokter] = await Promise.all([
    query<any>("SELECT * FROM jadwal_dokter WHERE id_jadwal = ? LIMIT 1", [id]),
    query<any>("SELECT id_dokter as id, nama_dokter FROM dokter ORDER BY nama_dokter ASC"),
  ]);
  if (!rows || rows.length === 0) notFound();
  const jadwal = rows[0];

  return (
    <div style={{ maxWidth: "700px" }}>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/admin/jadwal_dokter" className="admin-btn admin-btn-icon"><BackIcon /></Link>
          <div>
            <div className="admin-page-title">Edit Jadwal Dokter</div>
            <div className="admin-page-subtitle">ID #{id} — Perbarui waktu praktik.</div>
          </div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: "32px" }}>
        <form action={async (formData: FormData) => {
          "use server";
          await updateJadwalDokter(Number(id), formData);
        }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Dokter <span style={{ color: "#ef4444" }}>*</span></label>
            <select name="id_dokter" required className="admin-form-input" style={{ cursor: "pointer" }} defaultValue={jadwal.id_dokter}>
              <option value="">Pilih dokter</option>
              {dokter.map((item: any) => (
                <option key={item.id} value={item.id}>{item.nama_dokter}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Hari <span style={{ color: "#ef4444" }}>*</span></label>
              <select name="hari" required className="admin-form-input" style={{ cursor: "pointer" }} defaultValue={jadwal.hari}>
                <option value="Senin">Senin</option>
                <option value="Selasa">Selasa</option>
                <option value="Rabu">Rabu</option>
                <option value="Kamis">Kamis</option>
                <option value="Jumat">Jumat</option>
                <option value="Sabtu">Sabtu</option>
                <option value="Minggu">Minggu</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Jam Mulai <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="jam_mulai" required type="time" className="admin-form-input" defaultValue={jadwal.jam_mulai} />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Jam Selesai <span style={{ color: "#ef4444" }}>*</span></label>
              <input name="jam_selesai" required type="time" className="admin-form-input" defaultValue={jadwal.jam_selesai} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Link href="/admin/jadwal_dokter" className="admin-btn admin-btn-secondary">Batal</Link>
            <button type="submit" className="admin-btn admin-btn-primary"><SaveIcon /> Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
