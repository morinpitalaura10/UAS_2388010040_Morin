import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Newspaper, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Berita Kesehatan — RS Sehat Sejahtera',
  description: 'Informasi dan berita terbaru seputar kesehatan dari RS Sehat Sejahtera.',
};

export default async function BeritaPage() {
  let beritaList = [];
  try {
    beritaList = await query(
      'SELECT id, judul, slug, excerpt, image, created_at FROM berita WHERE is_published = 1 ORDER BY created_at DESC'
    );
  } catch (error) {
    console.error('Error fetching berita:', error);
  }

  return (
    <>
      <Navbar />

      <section style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '80vh' }}>
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <div className="section-label">Informasi</div>
            <h1 className="section-title">Berita Kesehatan</h1>
            <p className="section-desc">
              Informasi dan artikel terbaru seputar kesehatan untuk Anda dan keluarga.
            </p>
          </div>

          {beritaList.length > 0 ? (
            <div className="berita-grid">
              {beritaList.map((berita, index) => (
                <Link
                  key={berita.id}
                  href={`/berita/${berita.slug}`}
                  className="berita-card glass-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s`, textDecoration: 'none' }}
                >
                  <div className="berita-image">
                    {berita.image ? (
                      <img src={berita.image} alt={berita.judul} />
                    ) : (
                      <Newspaper size={48} style={{ opacity: 0.2 }} />
                    )}
                  </div>
                  <div className="berita-body">
                    <div className="berita-date">
                      <Calendar size={12} style={{ display: 'inline', marginRight: '6px' }} />
                      {new Date(berita.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <h3 className="berita-title">{berita.judul}</h3>
                    <p className="berita-excerpt">{berita.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Newspaper size={56} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Belum Ada Berita</h3>
              <p style={{ fontSize: '0.9rem' }}>Berita akan segera hadir.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
