import { query } from "@/lib/db";
import Link from "next/link";
import { deletePoliklinik } from "@/app/actions/poliklinik";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

export default async function PoliklinikAdminPage() {
  const poliklinik = await query<any>("SELECT id_poli as id, nama_poli as name, deskripsi, gedung, lantai FROM poliklinik ORDER BY nama_poli ASC");

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Manajemen Poliklinik</div>
          <div className="admin-page-subtitle">Kelola unit pelayanan rumah sakit dan lokasi gedung.</div>
        </div>
        <Link href="/admin/poliklinik/create" className="admin-btn admin-btn-primary">
          + Tambah Poliklinik
        </Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Nama Poliklinik</th>
              <th className="admin-col-hide-mobile">Gedung</th>
              <th className="admin-col-hide-mobile">Lantai</th>
              <th className="admin-col-hide-mobile">Deskripsi</th>
              <th style={{ textAlign: "right", width: "120px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {poliklinik.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "48px", color: "#c8c2e8" }}>
                  Belum ada poliklinik. Klik "Tambah Poliklinik" untuk membuat.
                </td>
              </tr>
            ) : poliklinik.map((item: any) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: "#c8c2e8" }}>{item.id}</td>
                <td style={{ fontWeight: 600, color: "#f8f8ff" }}>{item.name}</td>
                <td className="admin-col-hide-mobile">{item.gedung || "-"}</td>
                <td className="admin-col-hide-mobile">{item.lantai || "-"}</td>
                <td className="admin-col-hide-mobile" style={{ color: "#c8c2e8", fontSize: "13px" }}>{item.deskripsi || "-"}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <Link href={`/admin/poliklinik/${item.id}/edit`} className="admin-btn admin-btn-icon" title="Edit">
                      <EditIcon />
                    </Link>
                    <DeleteButton
                      message="Hapus poliklinik ini?"
                      action={async () => {
                        "use server";
                        await deletePoliklinik(item.id);
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
