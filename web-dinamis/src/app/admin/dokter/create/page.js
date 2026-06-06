'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function DokterCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_dokter: '',
    id_spesialis: '',
    id_poli: '',
    no_telepon: '',
    email: '',
    tarif: '',
  });

  const [spesialis, setSpesialis] = useState([]);
  const [poliklinik, setPoliklinik] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch specialties and poliklinik for dropdown options
    Promise.all([
      fetch('/api/admin/spesialis').then(res => res.json()),
      fetch('/api/admin/poliklinik').then(res => res.json()),
    ])
      .then(([spesData, poliData]) => {
        setSpesialis(spesData);
        setPoliklinik(poliData);
      })
      .catch(err => {
        console.error('Failed to load form options:', err);
        setError('Gagal memuat opsi pilihan spesialis/poliklinik');
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

    if (!formData.nama_dokter) {
      setError('Nama Dokter wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/dokter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id_spesialis: formData.id_spesialis ? parseInt(formData.id_spesialis) : null,
          id_poli: formData.id_poli ? parseInt(formData.id_poli) : null,
          tarif: formData.tarif ? parseFloat(formData.tarif) : 0,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan data');
      }

      router.push('/admin/dokter');
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
          <h2>Tambah Dokter Baru</h2>
          <p className="text-muted">Masukkan rincian dokter baru untuk didaftarkan ke sistem.</p>
        </div>
        <Link href="/admin/dokter" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Dokter *</label>
            <input
              type="text"
              name="nama_dokter"
              className="form-input"
              placeholder="Contoh: dr. John Doe, Sp.A"
              value={formData.nama_dokter}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Spesialisasi</label>
              <select
                name="id_spesialis"
                className="form-input"
                value={formData.id_spesialis}
                onChange={handleChange}
              >
                <option value="">-- Pilih Spesialis --</option>
                {spesialis.map(s => (
                  <option key={s.id_spesialis} value={s.id_spesialis}>
                    {s.nama_spesialis}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Poliklinik</label>
              <select
                name="id_poli"
                className="form-input"
                value={formData.id_poli}
                onChange={handleChange}
              >
                <option value="">-- Pilih Poliklinik --</option>
                {poliklinik.map(p => (
                  <option key={p.id_poli} value={p.id_poli}>
                    {p.nama_poli}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">No. Telepon</label>
              <input
                type="text"
                name="no_telepon"
                className="form-input"
                placeholder="Contoh: 08123456789"
                value={formData.no_telepon}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Contoh: dokter@rumahsakit.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tarif Konsultasi (Rp)</label>
            <input
              type="number"
              name="tarif"
              className="form-input"
              placeholder="Contoh: 150000"
              value={formData.tarif}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <Link href="/admin/dokter" className="btn btn-secondary">
              Batal
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              <span>{loading ? 'Menyimpan...' : 'Simpan Dokter'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
