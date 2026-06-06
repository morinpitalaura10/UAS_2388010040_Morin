import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { query } from '@/lib/db';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const rows = await query('SELECT judul, excerpt FROM berita WHERE slug = ?', [slug]);
  if (rows.length === 0) return { title: 'Berita Tidak Ditemukan' };
  return {
    title: `${rows[0].judul} — RS Sehat Sejahtera`,
    description: rows[0].excerpt,
  };
}

export default async function BeritaDetailPage({ params }) {
  const { slug } = await params;

  let berita;
  try {
    const rows = await query('SELECT * FROM berita WHERE slug = ?', [slug]);
    if (rows.length === 0) notFound();
    berita = rows[0];
  } catch (error) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <article className="berita-detail animate-fade-in-up">
        <Link
          href="/berita"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            color: 'var(--accent-primary-light)',
            marginBottom: '32px',
          }}
        >
          <ArrowLeft size={16} />
          Kembali ke Berita
        </Link>

        <h1>{berita.judul}</h1>

        <div className="berita-detail-meta">
          <Calendar size={14} style={{ display: 'inline', marginRight: '6px' }} />
          {new Date(berita.created_at).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>

        {berita.image && (
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '32px',
            border: '1px solid var(--border-color)',
          }}>
            <img
              src={berita.image}
              alt={berita.judul}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        )}

        <div
          className="berita-detail-content"
          dangerouslySetInnerHTML={{ __html: berita.konten }}
        />
      </article>

      <Footer />
    </>
  );
}
