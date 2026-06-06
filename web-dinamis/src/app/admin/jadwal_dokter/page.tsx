import { query } from "@/lib/db";
import Link from "next/link";
import { deleteJadwalDokter } from "@/app/actions/jadwal_dokter";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);

export default async function JadwalDokterAdminPage() {
  const jadwal = await query<any>(
    `SELECT j.id_jadwal as id, d.nama_dokter as name, j.hari, j.jam_mulai, j.jam_selesai
     FROM jadwal_dokter j
     JOIN dokter d ON j.id_dokter = d.id_dokter
     ORDER BY FIELD(j.hari,'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'), j.jam_mulai ASC`
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Jadwal Dokter</div>
          <div className="admin-page-subtitle">Atur jam praktik dokter sesuai data yang tersimpan.</div>
        </div>
        <Link href="/admin/jadwal_dokter/create" className="admin-btn admin-btn-primary">
          + Tambah Jadwal
        </Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Dokter</th>
              <th className="admin-col-hide-mobile">Hari</th>
              <th className="admin-col-hide-mobile">Jam Mulai</th>
              <th className="admin-col-hide-mobile">Jam Selesai</th>
              <th style={{ textAlign: "right", width: "120px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "48px", color: "#c8c2e8" }}>
                  Tidak ada jadwal dokter. Tambahkan jadwal baru untuk dokter Anda.
                </td>
              </tr>
            ) : jadwal.map((item: any) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: "#c8c2e8" }}>{item.id}</td>
                <td style={{ fontWeight: 600, color: "#f8f8ff" }}>{item.name}</td>
                <td className="admin-col-hide-mobile">{item.hari}</td>
                <td className="admin-col-hide-mobile">{item.jam_mulai}</td>
                <td className="admin-col-hide-mobile">{item.jam_selesai}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <Link href={`/admin/jadwal_dokter/${item.id}/edit`} className="admin-btn admin-btn-icon" title="Edit">
                      <EditIcon />
                    </Link>
                    <DeleteButton
                      message="Hapus jadwal dokter ini?"
                      action={async () => {
                        "use server";
                        await deleteJadwalDokter(item.id);
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
