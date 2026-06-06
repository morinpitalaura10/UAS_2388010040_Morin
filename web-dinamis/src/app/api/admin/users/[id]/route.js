import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const rows = await query('SELECT id_user, username, nama_lengkap, email, no_telepon, role, created_at FROM users WHERE id_user = ?', [id]);
    if (rows.length === 0) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { username, password, nama_lengkap, email, no_telepon, role } = body;

    if (!username || !nama_lengkap) {
      return NextResponse.json({ error: 'Username dan nama lengkap wajib diisi' }, { status: 400 });
    }

    // Check username conflict
    const conflict = await query('SELECT id_user FROM users WHERE username = ? AND id_user != ?', [username, id]);
    if (conflict.length > 0) {
      return NextResponse.json({ error: 'Username sudah digunakan oleh user lain' }, { status: 400 });
    }

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      await query(
        'UPDATE users SET username=?, password=?, nama_lengkap=?, email=?, no_telepon=?, role=? WHERE id_user=?',
        [username, hashedPassword, nama_lengkap, email || null, no_telepon || null, role || 'pasien', id]
      );
    } else {
      await query(
        'UPDATE users SET username=?, nama_lengkap=?, email=?, no_telepon=?, role=? WHERE id_user=?',
        [username, nama_lengkap, email || null, no_telepon || null, role || 'pasien', id]
      );
    }

    return NextResponse.json({ message: 'User berhasil diperbarui' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    // Don't allow deleting admin with id 1 to avoid locking out
    if (id === '1') {
      return NextResponse.json({ error: 'Admin utama tidak dapat dihapus' }, { status: 400 });
    }
    await query('DELETE FROM users WHERE id_user = ?', [id]);
    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
