'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, Check, Eye, Calendar, User } from 'lucide-react';

export default function KontakList() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/kontak');
      if (!res.ok) throw new Error('Gagal memuat pesan kontak');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/admin/kontak/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sudah_dibaca' }),
      });
      if (!res.ok) throw new Error('Gagal memperbarui status pesan');
      
      // Update state
      setMessages(messages.map(m => m.id_pesan === id ? { ...m, status: 'sudah_dibaca' } : m));
      if (selectedMessage && selectedMessage.id_pesan === id) {
        setSelectedMessage({ ...selectedMessage, status: 'sudah_dibaca' });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;
    try {
      const res = await fetch(`/api/admin/kontak/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gagal menghapus pesan');
      setMessages(messages.filter(m => m.id_pesan !== id));
      if (selectedMessage && selectedMessage.id_pesan === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Pesan Kontak Pengunjung</h2>
          <p className="text-muted">Baca dan kelola pesan atau pertanyaan masuk dari pengunjung web rumah sakit.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '1.2fr 1fr' : '1fr', gap: '24px', transition: 'all 0.3s' }}>
        {/* Messages List */}
        <div className="glass-card-static" style={{ padding: '24px' }}>
          {messages.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Pengirim</th>
                    <th>Subjek</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr
                      key={m.id_pesan}
                      style={{
                        cursor: 'pointer',
                        background: selectedMessage?.id_pesan === m.id_pesan ? 'rgba(20, 184, 166, 0.08)' : '',
                        fontWeight: m.status === 'belum_dibaca' ? '600' : 'normal'
                      }}
                      onClick={() => setSelectedMessage(m)}
                    >
                      <td>
                        <div style={{ color: m.status === 'belum_dibaca' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{m.nama}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.email}</div>
                      </td>
                      <td>
                        <div style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: m.status === 'belum_dibaca' ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}>
                          {m.subjek || '(Tanpa Subjek)'}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>
                          {new Date(m.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td>
                        {m.status === 'belum_dibaca' ? (
                          <span className="badge badge-warning">Baru</span>
                        ) : (
                          <span className="badge badge-neutral">Dibaca</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                          {m.status === 'belum_dibaca' && (
                            <button
                              onClick={() => handleMarkAsRead(m.id_pesan)}
                              className="btn btn-secondary btn-sm btn-icon"
                              title="Tandai Sudah Dibaca"
                            >
                              <Check size={14} style={{ color: 'var(--color-success)' }} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(m.id_pesan)} className="btn btn-danger btn-sm btn-icon" title="Hapus">
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
              <Mail size={48} />
              <p>Tidak ada pesan masuk.</p>
            </div>
          )}
        </div>

        {/* Message Detail Panel */}
        {selectedMessage && (
          <div className="glass-card-static" style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: 'fit-content', animation: 'fadeIn 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{selectedMessage.subjek || '(Tanpa Subjek)'}</h3>
                <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  ID Pesan: #{selectedMessage.id_pesan}
                </span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedMessage(null)}>Tutup</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="admin-avatar" style={{ width: '40px', height: '40px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-info)' }}>
                  <User size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{selectedMessage.nama}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedMessage.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Calendar size={14} />
                <span>Diterima pada: {new Date(selectedMessage.created_at).toLocaleString('id-ID')}</span>
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '20px',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line',
                marginTop: '10px',
                minHeight: '150px'
              }}>
                {selectedMessage.pesan}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                {selectedMessage.status === 'belum_dibaca' && (
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage.id_pesan)}
                    className="btn btn-secondary"
                    style={{ color: 'var(--color-success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                  >
                    <Check size={16} />
                    <span>Tandai Dibaca</span>
                  </button>
                )}
                <button onClick={() => handleDelete(selectedMessage.id_pesan)} className="btn btn-danger">
                  <Trash2 size={16} />
                  <span>Hapus Pesan</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
