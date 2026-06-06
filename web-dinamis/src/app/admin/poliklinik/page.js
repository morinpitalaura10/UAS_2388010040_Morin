'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';

export default function PoliklinikList() {
  const [poliklinik, setPoliklinik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPoliklinik = async () => {
    try {
      const res = await fetch('/api/admin/poliklinik');
      if (!res.ok) throw new Error('Gagal memuat data poliklinik');
      const data = await res.json();
      setPoliklinik(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoliklinik();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus poliklinik ini?')) return;
    try {
      const res = await fetch(`/api/admin/poliklinik/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus poliklinik');
      setPoliklinik(poliklinik.filter(p => p.id_poli !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Poliklinik</h2>
          <p className="text-muted">Kelola data gedung, lokasi lantai, dan deskripsi poliklinik.</p>
        </div>
        <Link href="/admin/poliklinik/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Tambah Poliklinik</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '24px' }}>
        {poliklinik.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Poliklinik</th>
                  <th>Gedung</th>
                  <th>Lantai</th>
                  <th>Deskripsi</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {poliklinik.map((p) => (
                  <tr key={p.id_poli}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={16} className="text-accent" />
                        {p.nama_poli}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{p.gedung || '-'}</span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{p.lantai || '-'}</span>
                    </td>
                    <td>
                      <div style={{ maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                        {p.deskripsi || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/poliklinik/${p.id_poli}/edit`} className="btn btn-secondary btn-sm btn-icon">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(p.id_poli)} className="btn btn-danger btn-sm btn-icon">
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
            <Building2 size={48} />
            <p>Belum ada data poliklinik.</p>
          </div>
        )}
      </div>
    </div>
  );
}
