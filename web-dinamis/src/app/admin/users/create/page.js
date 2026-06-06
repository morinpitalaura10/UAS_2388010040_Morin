'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function UserCreate() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_lengkap: '',
    email: '',
    no_telepon: '',
    role: 'pasien',
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

    const { username, password, nama_lengkap } = formData;
    if (!username || !password || !nama_lengkap) {
      setError('Username, password, dan nama lengkap wajib diisi');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan user');
      }

      router.push('/admin/users');
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
          <h2>Tambah User Baru</h2>
          <p className="text-muted">Masukkan rincian pengguna baru untuk didaftarkan ke sistem.</p>
        </div>
        <Link href="/admin/users" className="btn btn-secondary">
          <ArrowLeft size={18} />
          <span>Kembali</span>
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="glass-card-static" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Contoh: john_doe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Masukkan password..."
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Lengkap *</label>
            <input
              type="text"
              name="nama_lengkap"
              className="form-input"
              placeholder="Contoh: John Doe"
              value={formData.nama_lengkap}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Contoh: john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

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
          </div>

          <div className="form-group">
            <label className="form-label">Role Akses *</label>
            <select
              name="role"
              className="form-input"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="pasien">Pasien (Akses Publik)</option>
              <option value="dokter">Dokter</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <Link href="/admin/users" className="btn btn-secondary">
              Batal
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              <span>{loading ? 'Menyimpan...' : 'Simpan User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
