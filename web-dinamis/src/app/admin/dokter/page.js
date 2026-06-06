'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, User, Phone, Mail, DollarSign } from 'lucide-react';

export default function DokterList() {
  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDokters = async () => {
    try {
      const res = await fetch('/api/admin/dokter');
      if (!res.ok) throw new Error('Gagal memuat data dokter');
      const data = await res.json();
      setDokters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDokters();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus dokter ini?')) return;
    try {
      const res = await fetch(`/api/admin/dokter/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus dokter');
      setDokters(dokters.filter(d => d.id_dokter !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Daftar Dokter</h2>
          <p className="text-muted">Kelola data dokter, spesialisasi, dan tarif praktek.</p>
        </div>
        <Link href="/admin/dokter/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Tambah Dokter</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '24px' }}>
        {dokters.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nama Dokter</th>
                  <th>Spesialis</th>
                  <th>Poliklinik</th>
                  <th>Kontak</th>
                  <th>Tarif</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dokters.map((d) => (
                  <tr key={d.id_dokter}>
                    <td>
                      <div className="admin-avatar" style={{ fontSize: '0.8rem' }}>
                        {d.nama_dokter.substring(0, 2).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{d.nama_dokter}</div>
                    </td>
                    <td>
                      <span className="badge badge-info">{d.nama_spesialis || 'Umum'}</span>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{d.nama_poli || '-'}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {d.no_telepon && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {d.no_telepon}</span>}
                        {d.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {d.email}</span>}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--accent-primary-light)' }}>
                        Rp {parseFloat(d.tarif).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/dokter/${d.id_dokter}/edit`} className="btn btn-secondary btn-sm btn-icon">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(d.id_dokter)} className="btn btn-danger btn-sm btn-icon">
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
            <User size={48} />
            <p>Belum ada data dokter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
