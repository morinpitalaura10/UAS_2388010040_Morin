import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await query('SELECT id_user, username, nama_lengkap, email, no_telepon, role, created_at FROM users ORDER BY id_user DESC');
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, nama_lengkap, email, no_telepon, role } = body;

    if (!username || !password || !nama_lengkap) {
      return NextResponse.json({ error: 'Username, password, dan nama lengkap wajib diisi' }, { status: 400 });
    }

    // Check if username already exists
    const existing = await query('SELECT id_user FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (username, password, nama_lengkap, email, no_telepon, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, hashedPassword, nama_lengkap, email || null, no_telepon || null, role || 'pasien']
    );

    return NextResponse.json({ message: 'User berhasil ditambahkan', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}
