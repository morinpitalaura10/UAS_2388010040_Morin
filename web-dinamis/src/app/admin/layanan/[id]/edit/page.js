'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const ICON_OPTIONS = ['Activity', 'Heart', 'Stethoscope', 'Brain', 'Eye', 'Shield', 'BriefcaseMedical', 'ShieldAlert', 'Thermometer'];

export default function LayananEdit() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    nama: '',
    icon: 'Activity',
    deskripsi: '',
    urutan: '0',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/layanan/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat layanan');
        return res.json();
      })
      .then(data => {
        setFormData({
          nama: data.nama || '',
          icon: data.icon || 'Activity',
          deskripsi: data.deskripsi || '',
          urutan: data.urutan?.toString() || '0',
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

    const { nama, deskripsi } = formData;
    if (!nama || !deskripsi) {
      setError('Nama layanan dan deskripsi wajib diisi');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/layanan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          urutan: parseInt(formData.urutan) || 0,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal memperbarui layanan');
      }

      router.push('/admin/layanan');
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
          <h2>Edit Layanan</h2>
          <p className="text-muted">Perbarui rincian layanan atau fasilitas rumah sakit.</p>
        </div>
        <Link href="/admin/layanan" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Layanan *</label>
            <input
              type="text"
              name="nama"
              className="form-input"
              placeholder="Contoh: Unit Gawat Darurat (UGD)"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Icon Layanan *</label>
              <select
                name="icon"
                className="form-input"
                value={formData.icon}
                onChange={handleChange}
                required
              >
                {ICON_OPTIONS.map(i => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Urutan Tampilan</label>
              <input
                type="number"
                name="urutan"
                className="form-input"
                placeholder="Contoh: 0, 1, 2"
                value={formData.urutan}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Layanan *</label>
            <textarea
              name="deskripsi"
              className="form-input"
              placeholder="Jelaskan secara ringkas mengenai layanan ini..."
              value={formData.deskripsi}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <Link href="/admin/layanan" className="btn btn-secondary">
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
