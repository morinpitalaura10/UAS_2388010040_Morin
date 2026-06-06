'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const HARI_OPTIONS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

export default function JadwalDokterEdit() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    id_dokter: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
  });

  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    // Fetch schedule info and dropdown list of doctors
    Promise.all([
      fetch(`/api/admin/jadwal_dokter/${id}`).then(res => {
        if (!res.ok) throw new Error('Gagal memuat data jadwal');
        return res.json();
      }),
      fetch('/api/admin/dokter').then(res => res.json()),
    ])
      .then(([jadwalData, dokterData]) => {
        // Time format coming from backend might be "08:00:00" -> convert to "08:00" for input[type="time"]
        const formatTimeForInput = (t) => t ? t.substring(0, 5) : '';

        setFormData({
          id_dokter: jadwalData.id_dokter || '',
          hari: jadwalData.hari || '',
          jam_mulai: formatTimeForInput(jadwalData.jam_mulai),
          jam_selesai: formatTimeForInput(jadwalData.jam_selesai),
        });
        setDokters(dokterData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { id_dokter, hari, jam_mulai, jam_selesai } = formData;
    if (!id_dokter || !hari || !jam_mulai || !jam_selesai) {
      setError('Semua kolom wajib diisi');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/jadwal_dokter/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_dokter: parseInt(id_dokter),
          hari,
          jam_mulai: jam_mulai.length === 5 ? jam_mulai + ':00' : jam_mulai, // Ensure HH:MM:SS
          jam_selesai: jam_selesai.length === 5 ? jam_selesai + ':00' : jam_selesai,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal memperbarui data');
      }

      router.push('/admin/jadwal_dokter');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h2>Edit Jadwal Dokter</h2>
          <p className="text-muted">Perbarui hari dan jam praktek dokter pada sistem.</p>
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={18} />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
