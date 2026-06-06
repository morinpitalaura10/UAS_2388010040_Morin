import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;
let initialTablesEnsured = false;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "admserver",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

async function ensureInitialTables(): Promise<void> {
  if (initialTablesEnsured) return;
  const db = getPool();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS berita (
      id int(11) NOT NULL AUTO_INCREMENT,
      judul varchar(255) NOT NULL,
      slug varchar(255) NOT NULL,
      excerpt text NOT NULL,
      konten text NOT NULL,
      image varchar(255) DEFAULT NULL,
      is_published tinyint(1) NOT NULL DEFAULT 0,
      created_at timestamp NOT NULL DEFAULT current_timestamp(),
      PRIMARY KEY (id),
      UNIQUE KEY slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS layanan (
      id int(11) NOT NULL AUTO_INCREMENT,
      nama varchar(255) NOT NULL,
      icon varchar(100) DEFAULT 'code',
      deskripsi text NOT NULL,
      urutan int(11) NOT NULL DEFAULT 0,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `);

  initialTablesEnsured = true;
}

export async function query<T = unknown>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  await ensureInitialTables();
  const db = getPool();
  const [rows] = await db.execute(sql, params);
  return rows as T[];
}
