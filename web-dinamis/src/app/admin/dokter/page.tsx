import { query } from "@/lib/db";
import Link from "next/link";
import { deleteDokter } from "@/app/actions/dokter";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

export default async function DokterAdminPage() {
  const dokter = await query<any>(
    `SELECT d.id_dokter as id, d.nama_dokter as name, u.username AS akun, s.nama_spesialis AS spesialis, p.nama_poli AS poli,
            d.no_telepon, d.email, d.tarif, d.foto
     FROM dokter d
     LEFT JOIN users u ON d.id_user = u.id_user
     LEFT JOIN spesialis s ON d.id_spesialis = s.id_spesialis
     LEFT JOIN poliklinik p ON d.id_poli = p.id_poli
     ORDER BY d.nama_dokter ASC`
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Manajemen Dokter</div>
          <div className="admin-page-subtitle">Kelola profil dokter dan relasi ke spesialisasi serta poliklinik.</div>
        </div>
        <Link href="/admin/dokter/create" className="admin-btn admin-btn-primary">
          + Tambah Dokter
        </Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Nama Dokter</th>
              <th className="admin-col-hide-mobile">Spesialis</th>
              <th className="admin-col-hide-mobile">Poliklinik</th>
              <th className="admin-col-hide-mobile">Telepon</th>
              <th className="admin-col-hide-mobile">Tarif</th>
              <th style={{ textAlign: "right", width: "120px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dokter.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "#c8c2e8" }}>
                  Belum ada data dokter. Klik "Tambah Dokter" untuk mulai.
                </td>
              </tr>
            ) : dokter.map((item: any) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: "#c8c2e8" }}>{item.id}</td>
                <td style={{ fontWeight: 600, color: "#f8f8ff" }}>{item.name}</td>
                <td className="admin-col-hide-mobile">{item.spesialis || "-"}</td>
                <td className="admin-col-hide-mobile">{item.poli || "-"}</td>
                <td className="admin-col-hide-mobile" style={{ color: "#c8c2e8", fontSize: "13px" }}>{item.no_telepon || "-"}</td>
                <td className="admin-col-hide-mobile" style={{ color: "#c8c2e8", fontSize: "13px" }}>Rp {item.tarif?.toLocaleString("id-ID") || "0"}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <Link href={`/admin/dokter/${item.id}/edit`} className="admin-btn admin-btn-icon" title="Edit">
                      <EditIcon />
                    </Link>
                    <DeleteButton
                      message="Hapus data dokter ini?"
                      action={async () => {
                        "use server";
                        await deleteDokter(item.id);
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
