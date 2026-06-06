'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function JadwalDokterCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id_dokter: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
  });

  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dokter')
      .then(res => res.json())
      .then(data => setDokters(data))
      .catch(err => {
        console.error('Failed to load doctors:', err);
        setError('Gagal memuat daftar dokter');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { id_dokter, hari, jam_mulai, jam_selesai } = formData;
    if (!id_dokter || !hari || !jam_mulai || !jam_selesai) {
      setError('Semua kolom wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/jadwal_dokter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_dokter: parseInt(id_dokter),
          hari,
          jam_mulai: jam_mulai + ':00', // Format to HH:MM:SS
          jam_selesai: jam_selesai + ':00',
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan jadwal');
      }

      router.push('/admin/jadwal_dokter');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Tambah Jadwal Baru</h2>
          <p className="text-muted">Masukkan hari dan jam praktek untuk dokter yang dipilih.</p>
        </div>
        <Link href="/admin/jadwal_dokter" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Dokter *</label>
            <select
              name="id_dokter"
              className="form-input"
              value={formData.id_dokter}
              onChange={handleChange}
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
            <label className="form-label">Hari *</label>
            <select
              name="hari"
              className="form-input"
              value={formData.hari}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Hari --</option>
              {HARI_OPTIONS.map(h => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jam Mulai Praktek *</label>
              <input
                type="time"
                name="jam_mulai"
                className="form-input"
                value={formData.jam_mulai}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jam Selesai Praktek *</label>
              <input
                type="time"
                name="jam_selesai"
                className="form-input"
                value={formData.jam_selesai}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <Link href="/admin/jadwal_dokter" className="btn btn-secondary">
              Batal
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              <span>{loading ? 'Menyimpan...' : 'Simpan Jadwal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
