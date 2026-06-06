'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Users, Shield, UserCheck, Heart } from 'lucide-react';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Gagal memuat data users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (id === 1) {
      alert('Admin utama tidak dapat dihapus.');
      return;
    }
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus user');
      setUsers(users.filter(u => u.id_user !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Shield size={12} /> Admin</span>;
      case 'dokter':
        return <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><UserCheck size={12} /> Dokter</span>;
      default:
        return <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Heart size={12} /> Pasien</span>;
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Daftar Users</h2>
          <p className="text-muted">Kelola akun pengguna dan hak akses sistem (Admin, Dokter, Pasien).</p>
        </div>
        <Link href="/admin/users/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Tambah User</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '24px' }}>
        {users.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Lengkap</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>No. Telepon</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id_user}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {u.nama_lengkap}
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem', color: 'var(--accent-primary-light)' }}>
                        {u.username}
                      </code>
                    </td>
                    <td>{u.email || '-'}</td>
                    <td>{u.no_telepon || '-'}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/users/${u.id_user}/edit`} className="btn btn-secondary btn-sm btn-icon">
                          <Edit2 size={14} />
                        </Link>
                        {u.id_user !== 1 ? (
                          <button onClick={() => handleDelete(u.id_user)} className="btn btn-danger btn-sm btn-icon">
                            <Trash2 size={14} />
                          </button>
                        ) : (
                          <button className="btn btn-danger btn-sm btn-icon" disabled style={{ opacity: 0.3, cursor: 'not-allowed' }}>
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Users size={48} />
            <p>Belum ada data user.</p>
          </div>
        )}
      </div>
    </div>
  );
}
