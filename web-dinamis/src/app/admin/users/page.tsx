import { query } from "@/lib/db";
import Link from "next/link";
import { deleteUser } from "@/app/actions/users";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export default async function UsersAdminPage() {
  const users = await query<any>(
    "SELECT id_user as id, username as name, nama_lengkap, email, no_telepon, role, created_at FROM users ORDER BY created_at DESC"
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div className="admin-page-title">Manajemen Pengguna</div>
          <div className="admin-page-subtitle">Kelola akun admin, dokter, dan pasien sesuai data pengguna Anda.</div>
        </div>
        <Link href="/admin/users/create" className="admin-btn admin-btn-primary">
          + Tambah Pengguna
        </Link>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Username</th>
              <th>Nama Lengkap</th>
              <th className="admin-col-hide-mobile">Email</th>
              <th className="admin-col-hide-mobile">Telepon</th>
              <th className="admin-col-hide-mobile">Dibuat</th>
              <th>Role</th>
              <th style={{ textAlign: "right", width: "120px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "#c8c2e8" }}>
                  Belum ada pengguna terdaftar.
                </td>
              </tr>
            ) : users.map((item: any) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 500, color: "#c8c2e8" }}>{item.id}</td>
                <td style={{ fontWeight: 600, color: "#f8f8ff" }}>{item.name}</td>
                <td>{item.nama_lengkap}</td>
                <td className="admin-col-hide-mobile" style={{ color: "#c8c2e8", fontSize: "13px" }}>{item.email || "-"}</td>
                <td className="admin-col-hide-mobile" style={{ color: "#c8c2e8", fontSize: "13px" }}>{item.no_telepon || "-"}</td>
                <td className="admin-col-hide-mobile" style={{ color: "#c8c2e8", fontSize: "13px" }}>{new Date(item.created_at).toLocaleString("id-ID", { year: "numeric", month: "short", day: "numeric" })}</td>
                <td>
                  <span className={`admin-badge ${item.role === "admin" ? "admin-badge-blue" : item.role === "dokter" ? "admin-badge-green" : "admin-badge-gray"}`}>
                    {item.role}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <Link href={`/admin/users/${item.id}/edit`} className="admin-btn admin-btn-icon" title="Edit">
                      <EditIcon />
                    </Link>
                    <DeleteButton
                      message="Hapus pengguna ini?"
                      action={async () => {
                        "use server";
                        await deleteUser(item.id);
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
