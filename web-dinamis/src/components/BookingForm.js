'use client';

import { useState } from 'react';
import { CalendarCheck, Send, CheckCircle, Loader } from 'lucide-react';

export default function BookingForm({ dokters = [], polis = [] }) {
  const [form, setForm] = useState({
    nama_pasien: '',
    no_telepon: '',
    id_dokter: '',
    id_poli: '',
    tanggal_janji: '',
    keluhan: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Auto-select poli when doctor is selected
    if (name === 'id_dokter' && value) {
      const selectedDokter = dokters.find(d => d.id_dokter === parseInt(value));
      if (selectedDokter) {
        setForm(prev => ({ ...prev, id_dokter: value, id_poli: String(selectedDokter.id_poli) }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setForm({ nama_pasien: '', no_telepon: '', id_dokter: '', id_poli: '', tanggal_janji: '', keluhan: '' });
      } else {
        setError(data.error || 'Terjadi kesalahan, silakan coba lagi.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="booking-form-card glass-card-static" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <CheckCircle size={56} style={{ color: 'var(--color-success)', marginBottom: '20px' }} />
        <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>Booking Berhasil!</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Janji temu Anda telah berhasil dibuat. Silakan tunggu konfirmasi dari pihak rumah sakit.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => setSuccess(false)}
        >
          Buat Booking Lagi
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form-card glass-card-static">
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nama Lengkap *</label>
          <input
            type="text"
            name="nama_pasien"
            value={form.nama_pasien}
            onChange={handleChange}
            className="form-input"
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">No. Telepon *</label>
          <input
            type="tel"
            name="no_telepon"
            value={form.no_telepon}
            onChange={handleChange}
            className="form-input"
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Dokter *</label>
          <select
            name="id_dokter"
            value={form.id_dokter}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">-- Pilih Dokter --</option>
            {dokters.map(d => (
              <option key={d.id_dokter} value={d.id_dokter}>
                {d.nama_dokter}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Poliklinik *</label>
          <select
            name="id_poli"
            value={form.id_poli}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">-- Pilih Poliklinik --</option>
            {polis.map(p => (
              <option key={p.id_poli} value={p.id_poli}>
                {p.nama_poli}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tanggal Janji *</label>
        <input
          type="date"
          name="tanggal_janji"
          value={form.tanggal_janji}
          onChange={handleChange}
          className="form-input"
          min={new Date().toISOString().split('T')[0]}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Keluhan</label>
        <textarea
          name="keluhan"
          value={form.keluhan}
          onChange={handleChange}
          className="form-input"
          placeholder="Jelaskan keluhan Anda (opsional)"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader size={18} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
            Memproses...
          </>
        ) : (
          <>
            <CalendarCheck size={18} />
            Buat Janji Temu
          </>
        )}
      </button>
    </form>
  );
}
