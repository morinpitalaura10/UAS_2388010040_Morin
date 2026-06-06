'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Layers, Activity } from 'lucide-react';

export default function LayananList() {
  const [layanans, setLayanans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLayanans = async () => {
    try {
      const res = await fetch('/api/admin/layanan');
      if (!res.ok) throw new Error('Gagal memuat layanan');
      const data = await res.json();
      setLayanans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayanans();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;
    try {
      const res = await fetch(`/api/admin/layanan/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus layanan');
      setLayanans(layanans.filter(l => l.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Layanan Rumah Sakit</h2>
          <p className="text-muted">Kelola daftar layanan medis dan fasilitas utama yang ditampilkan di beranda publik.</p>
        </div>
        <Link href="/admin/layanan/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Tambah Layanan</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '24px' }}>
        {layanans.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Urutan</th>
                  <th style={{ width: '80px' }}>Icon</th>
                  <th>Nama Layanan</th>
                  <th>Deskripsi</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {layanans.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: 'bold' }}>
                        {l.urutan}
                      </span>
                    </td>
                    <td>
                      <div className="admin-avatar" style={{ background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-primary-light)' }}>
                        <Activity size={16} />
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {l.nama}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        icon-class: {l.icon || 'Activity'}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '450px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {l.deskripsi}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/layanan/${l.id}/edit`} className="btn btn-secondary btn-sm btn-icon">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(l.id)} className="btn btn-danger btn-sm btn-icon">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Layers size={48} />
            <p>Belum ada data layanan rumah sakit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
