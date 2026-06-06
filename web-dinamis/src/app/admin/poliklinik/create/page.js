'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function PoliklinikCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_poli: '',
    gedung: '',
    lantai: '',
    deskripsi: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.nama_poli) {
      setError('Nama poliklinik wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/poliklinik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan data');
      }

      router.push('/admin/poliklinik');
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
          <h2>Tambah Poliklinik Baru</h2>
          <p className="text-muted">Masukkan rincian poliklinik baru untuk didaftarkan ke sistem.</p>
        </div>
        <Link href="/admin/poliklinik" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Poliklinik *</label>
            <input
              type="text"
              name="nama_poli"
              className="form-input"
              placeholder="Contoh: Poli Mata, Poli Anak"
              value={formData.nama_poli}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gedung</label>
              <input
                type="text"
                name="gedung"
                className="form-input"
                placeholder="Contoh: Gedung A, Gedung Rawat Jalan"
                value={formData.gedung}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lantai</label>
              <input
                type="text"
                name="lantai"
                className="form-input"
                placeholder="Contoh: Lantai 1, Lantai Dasar"
                value={formData.lantai}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi</label>
            <textarea
              name="deskripsi"
              className="form-input"
              placeholder="Jelaskan deskripsi poliklinik..."
              value={formData.deskripsi}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <Link href="/admin/poliklinik" className="btn btn-secondary">
              Batal
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              <span>{loading ? 'Menyimpan...' : 'Simpan Poliklinik'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
