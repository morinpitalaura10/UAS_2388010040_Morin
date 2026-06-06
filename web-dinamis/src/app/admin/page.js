'use client';

import { useState, useEffect } from 'react';
import { Stethoscope, Users, Building2, CalendarCheck, Mail, Activity } from 'lucide-react';

const statusBadge = {
  'pending': 'badge-warning',
  'dikonfirmasi': 'badge-info',
  'selesai': 'badge-success',
  'dibatalkan': 'badge-danger',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  if (!data) {
    return <div className="empty-state"><p>Gagal memuat data dashboard.</p></div>;
  }

  const cards = [
    { label: 'Total Dokter', value: data.totalDokter, icon: Stethoscope, color: '#14b8a6', bg: 'rgba(20,184,166,0.12)' },
    { label: 'Total Pasien', value: data.totalPasien, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Poliklinik', value: data.totalPoli, icon: Building2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Janji Hari Ini', value: data.janjiHariIni, icon: CalendarCheck, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Total Users', value: data.totalUsers, icon: Activity, color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Pesan Baru', value: data.pesanBaru, icon: Mail, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Stats Cards */}
      <div className="dashboard-grid">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="dashboard-card glass-card-static">
              <div className="dashboard-card-icon" style={{ background: card.bg }}>
                <Icon size={22} style={{ color: card.color }} />
              </div>
              <div className="dashboard-card-info">
                <h3 style={{ color: card.color }}>{card.value}</h3>
                <p>{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Appointments */}
      <div className="glass-card-static" style={{ padding: '24px', marginTop: '8px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarCheck size={20} style={{ color: 'var(--accent-primary)' }} />
          Janji Temu Terbaru
        </h3>

        {data.recentJanji && data.recentJanji.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No. Antrian</th>
                  <th>Pasien</th>
                  <th>Dokter</th>
                  <th>Poli</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentJanji.map((j) => (
                  <tr key={j.id_janji}>
                    <td style={{ fontWeight: 600 }}>{j.no_antrian || '-'}</td>
                    <td>{j.nama_pasien}</td>
                    <td>{j.nama_dokter}</td>
                    <td>{j.nama_poli}</td>
                    <td>{new Date(j.tanggal_janji).toLocaleDateString('id-ID')}</td>
                    <td>
                      <span className={`badge ${statusBadge[j.status] || 'badge-neutral'}`}>
                        {j.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '30px' }}>
            <p>Belum ada janji temu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
