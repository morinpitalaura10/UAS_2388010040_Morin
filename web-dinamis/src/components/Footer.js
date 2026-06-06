import Link from 'next/link';
import { Heart, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>
              <Heart size={20} style={{ color: 'var(--accent-primary)' }} />
              RS Sehat Sejahtera
            </h3>
            <p>
              Rumah sakit terpercaya yang berkomitmen memberikan pelayanan kesehatan
              terbaik dengan dokter spesialis berpengalaman dan fasilitas modern.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <MapPin size={14} /> Jl. Kesehatan No. 1, Cirebon
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Phone size={14} /> (0231) 123-4567
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Mail size={14} /> info@rs-sehatsejahtera.co.id
              </span>
            </div>
          </div>

          <div className="footer-col">
            <h4>Layanan</h4>
            <ul>
              <li><Link href="/#layanan">Poliklinik</Link></li>
              <li><Link href="/#dokter">Dokter Kami</Link></li>
              <li><Link href="/#booking">Janji Temu</Link></li>
              <li><Link href="/berita">Berita Kesehatan</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Informasi</h4>
            <ul>
              <li><Link href="/#tentang">Tentang Kami</Link></li>
              <li><Link href="/#kontak">Hubungi Kami</Link></li>
              <li><Link href="/login">Portal Login</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Jam Operasional</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Senin - Jumat: 08:00 - 20:00</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sabtu: 08:00 - 14:00</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Minggu: Tutup</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} RS Sehat Sejahtera. All rights reserved. Dibuat oleh Morin.</p>
        </div>
      </div>
    </footer>
  );
}
