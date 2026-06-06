'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function BeritaCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    judul: '',
    excerpt: '',
    konten: '',
    image: '',
    is_published: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.judul || !formData.konten) {
      setError('Judul dan Konten berita wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/berita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan berita');
      }

      router.push('/admin/berita');
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
          <h2>Buat Berita Baru</h2>
          <p className="text-muted">Tulis artikel atau berita baru untuk dipublikasikan.</p>
        </div>
        <Link href="/admin/berita" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Judul Berita *</label>
            <input
              type="text"
              name="judul"
              className="form-input"
              placeholder="Masukkan judul berita..."
              value={formData.judul}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL / Path Gambar Fitur</label>
            <input
              type="text"
              name="image"
              className="form-input"
              placeholder="Contoh: /images/berita-baru.jpg atau URL gambar"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ringkasan Singkat (Excerpt)</label>
            <textarea
              name="excerpt"
              className="form-input"
              placeholder="Ringkasan singkat yang muncul di halaman daftar berita..."
              style={{ minHeight: '80px' }}
              value={formData.excerpt}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Konten Utama Berita *</label>
            <textarea
              name="konten"
              className="form-input"
              placeholder="Tulis seluruh isi berita di sini..."
              style={{ minHeight: '250px' }}
              value={formData.konten}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
            <input
              type="checkbox"
              name="is_published"
              id="is_published"
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              checked={formData.is_published}
              onChange={handleChange}
            />
            <label htmlFor="is_published" style={{ fontWeight: 500, cursor: 'pointer', userSelect: 'none' }}>
              Publikasikan Langsung (Terbit)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '30px', justifyContent: 'flex-end' }}>
            <Link href="/admin/berita" className="btn btn-secondary">
              Batal
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              <span>{loading ? 'Menyimpan...' : 'Simpan Berita'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
