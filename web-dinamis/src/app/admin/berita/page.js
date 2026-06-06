'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Newspaper, Eye, EyeOff, Calendar } from 'lucide-react';

export default function BeritaList() {
  const [beritas, setBeritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBeritas = async () => {
    try {
      const res = await fetch('/api/admin/berita');
      if (!res.ok) throw new Error('Gagal memuat berita');
      const data = await res.json();
      setBeritas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeritas();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      const res = await fetch(`/api/admin/berita/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus berita');
      setBeritas(beritas.filter(b => b.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const getPublishedBadge = (status) => {
    return status ? (
      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <Eye size={12} /> Terbit
      </span>
    ) : (
      <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <EyeOff size={12} /> Draf
      </span>
    );
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Berita & Artikel</h2>
          <p className="text-muted">Kelola berita, pengumuman, dan artikel edukasi kesehatan rumah sakit.</p>
        </div>
        <Link href="/admin/berita/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Buat Berita</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '24px' }}>
        {beritas.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Gambar</th>
                  <th>Judul Berita</th>
                  <th>Ringkasan (Excerpt)</th>
                  <th>Tanggal Buat</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {beritas.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{
                        width: '60px',
                        height: '40px',
                        borderRadius: '4px',
                        background: 'var(--bg-tertiary)',
                        backgroundImage: b.image ? `url(${b.image})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifycontent: 'center'
                      }}>
                        {!b.image && <Newspaper size={16} className="text-muted" />}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.judul}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        slug: {b.slug}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                        {b.excerpt || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {new Date(b.created_at).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td>{getPublishedBadge(b.is_published)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/berita/${b.id}/edit`} className="btn btn-secondary btn-sm btn-icon">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(b.id)} className="btn btn-danger btn-sm btn-icon">
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
            <Newspaper size={48} />
            <p>Belum ada data berita.</p>
          </div>
        )}
      </div>
    </div>
  );
}
