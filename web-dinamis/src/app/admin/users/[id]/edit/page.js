'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function UserEdit() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_lengkap: '',
    email: '',
    no_telepon: '',
    role: 'pasien',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/users/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Gagal memuat data user');
        return res.json();
      })
      .then(data => {
        setFormData({
          username: data.username || '',
          password: '', // Kept empty unless they want to change it
          nama_lengkap: data.nama_lengkap || '',
          email: data.email || '',
          no_telepon: data.no_telepon || '',
          role: data.role || 'pasien',
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

    const { username, nama_lengkap } = formData;
    if (!username || !nama_lengkap) {
      setError('Username dan nama lengkap wajib diisi');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal memperbarui user');
      }

      router.push('/admin/users');
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
          <h2>Edit User</h2>
          <p className="text-muted">Perbarui data profil dan hak akses pengguna.</p>
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
                disabled={id === '1'} // Disable changing admin main username to avoid breaks
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password Baru</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Kosongkan jika tidak ingin diubah"
                value={formData.password}
                onChange={handleChange}
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
              disabled={id === '1'} // Disable changing admin main role
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
