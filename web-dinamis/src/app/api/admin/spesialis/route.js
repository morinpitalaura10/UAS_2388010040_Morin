import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const specialties = await query('SELECT * FROM spesialis ORDER BY nama_spesialis ASC');
    return NextResponse.json(specialties);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
