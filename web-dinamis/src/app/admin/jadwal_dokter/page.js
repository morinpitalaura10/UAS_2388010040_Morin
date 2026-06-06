'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Calendar, Clock } from 'lucide-react';

export default function JadwalDokterList() {
  const [jadwals, setJadwals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJadwals = async () => {
    try {
      const res = await fetch('/api/admin/jadwal_dokter');
      if (!res.ok) throw new Error('Gagal memuat data jadwal dokter');
      const data = await res.json();
      setJadwals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwals();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) return;
    try {
      const res = await fetch(`/api/admin/jadwal_dokter/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus jadwal');
      setJadwals(jadwals.filter(j => j.id_jadwal !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Format "08:00:00" to "08:00"
    return timeString.substring(0, 5);
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Jadwal Praktek Dokter</h2>
          <p className="text-muted">Kelola hari dan jam operasional praktek masing-masing dokter.</p>
        </div>
        <Link href="/admin/jadwal_dokter/create" className="btn btn-primary">
          <Plus size={18} />
          <span>Tambah Jadwal</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '24px' }}>
        {jadwals.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Dokter</th>
                  <th>Hari</th>
                  <th>Jam Praktek</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwals.map((j) => (
                  <tr key={j.id_jadwal}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {j.nama_dokter}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {j.hari}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {formatTime(j.jam_mulai)} - {formatTime(j.jam_selesai)} WIB
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/jadwal_dokter/${j.id_jadwal}/edit`} className="btn btn-secondary btn-sm btn-icon">
                          <Edit2 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(j.id_jadwal)} className="btn btn-danger btn-sm btn-icon">
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
            <Calendar size={48} />
            <p>Belum ada jadwal praktek dokter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
