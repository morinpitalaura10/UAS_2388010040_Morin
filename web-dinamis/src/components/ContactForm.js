'use client';

import { useState } from 'react';
import { Send, CheckCircle, Loader } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ nama: '', email: '', subjek: '', pesan: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setForm({ nama: '', email: '', subjek: '', pesan: '' });
      } else {
        setError(data.error || 'Gagal mengirim pesan.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card-static" style={{ padding: '48px 32px', textAlign: 'center' }}>
        <CheckCircle size={48} style={{ color: 'var(--color-success)', marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Pesan Terkirim!</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Terima kasih, kami akan segera merespons pesan Anda.
        </p>
        <button className="btn btn-secondary" onClick={() => setSuccess(false)}>
          Kirim Pesan Lagi
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card-static" style={{ padding: '32px' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Kirim Pesan</h3>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label className="form-label">Nama *</label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          className="form-input"
          placeholder="Nama lengkap Anda"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Email *</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="form-input"
          placeholder="email@contoh.com"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label">Subjek</label>
        <input
          type="text"
          name="subjek"
          value={form.subjek}
          onChange={handleChange}
          className="form-input"
          placeholder="Subjek pesan"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Pesan *</label>
        <textarea
          name="pesan"
          value={form.pesan}
          onChange={handleChange}
          className="form-input"
          placeholder="Tulis pesan Anda..."
          rows={4}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Mengirim...
          </>
        ) : (
          <>
            <Send size={16} />
            Kirim Pesan
          </>
        )}
      </button>
    </form>
  );
}
