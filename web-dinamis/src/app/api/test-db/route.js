import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const results = {};

  // Check env vars
  results.env = {
    DB_HOST: process.env.DB_HOST || '(not set, default: localhost)',
    DB_USER: process.env.DB_USER || '(not set, default: root)',
    DB_NAME: process.env.DB_NAME || '(not set, default: db_uas040)',
    DB_PORT: process.env.DB_PORT || '(not set, default: 3306)',
    DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : '(not set, default: empty)',
  };

  // Test connection
  try {
    const rows = await query('SELECT 1 as test');
    results.connection = 'OK';
  } catch (error) {
    results.connection = `FAILED: ${error.message}`;
    return NextResponse.json(results);
  }

  // Test tables
  try {
    const tables = await query("SHOW TABLES");
    results.tables = tables.map(t => Object.values(t)[0]);
  } catch (error) {
    results.tables = `FAILED: ${error.message}`;
  }

  // Test users
  try {
    const users = await query('SELECT id_user, username, role FROM users');
    results.users = users;
  } catch (error) {
    results.users = `FAILED: ${error.message}`;
  }

  return NextResponse.json(results);
}
