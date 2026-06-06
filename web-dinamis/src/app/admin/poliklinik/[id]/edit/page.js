'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function PoliklinikEdit() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    nama_poli: '',
    gedung: '',
    lantai: '',
    deskripsi: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/poliklinik/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat data poliklinik');
        return res.json();
      })
      .then(data => {
        setFormData({
          nama_poli: data.nama_poli || '',
          gedung: data.gedung || '',
          lantai: data.lantai || '',
          deskripsi: data.deskripsi || '',
        });
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

    if (!formData.nama_poli) {
      setError('Nama poliklinik wajib diisi');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/poliklinik/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal memperbarui data');
      }

      router.push('/admin/poliklinik');
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
          <h2>Edit Poliklinik</h2>
          <p className="text-muted">Perbarui rincian poliklinik pada sistem.</p>
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
