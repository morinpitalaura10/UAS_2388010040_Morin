import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const messages = await query('SELECT * FROM kontak_pesan ORDER BY status ASC, created_at DESC');
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
