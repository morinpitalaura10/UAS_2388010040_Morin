import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { query } from '@/lib/db';
import Link from 'next/link';
import {
  Heart, Stethoscope, CalendarCheck, Users, Building2,
  ArrowRight, Phone, Mail, MapPin, Clock, Shield,
  Baby, HeartPulse, Brain, Pill, Microscope, Activity,
  UserCheck, Send
} from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import ContactForm from '@/components/ContactForm';

const iconMap = {
  'Baby': Baby,
  'HeartPulse': HeartPulse,
  'Brain': Brain,
  'Stethoscope': Stethoscope,
  'Pill': Pill,
  'Microscope': Microscope,
  'Activity': Activity,
  'Shield': Shield,
};

async function getDashboardData() {
  try {
    const [dokters, polis, spesialis, pasiens] = await Promise.all([
      query(`SELECT d.*, s.nama_spesialis, p.nama_poli 
             FROM dokter d 
             LEFT JOIN spesialis s ON d.id_spesialis = s.id_spesialis 
             LEFT JOIN poliklinik p ON d.id_poli = p.id_poli`),
      query('SELECT * FROM poliklinik'),
      query('SELECT * FROM spesialis'),
      query('SELECT COUNT(*) as total FROM pasien'),
    ]);

    let jadwals = [];
    try {
      jadwals = await query(`SELECT jd.*, d.nama_dokter 
                             FROM jadwal_dokter jd 
                             JOIN dokter d ON jd.id_dokter = d.id_dokter`);
    } catch (e) { }

    return { dokters, polis, spesialis, pasiens: pasiens[0]?.total || 0, jadwals };
  } catch (error) {
    console.error('Database error:', error);
    return { dokters: [], polis: [], spesialis: [], pasiens: 0, jadwals: [] };
  }
}

export default async function HomePage() {
  const { dokters, polis, spesialis, pasiens, jadwals } = await getDashboardData();

  const poliIcons = ['Baby', 'HeartPulse', 'Brain', 'Stethoscope', 'Activity', 'Shield'];

  return (
    <>
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="hero" id="beranda">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-text animate-fade-in-up">
            <h1>
              Kesehatan Anda,<br />
              <span>Prioritas Kami</span>
            </h1>
            <p>
              RS Morich menyediakan layanan kesehatan terpadu dengan
              dokter spesialis berpengalaman dan fasilitas medis modern untuk
              kesehatan optimal Anda dan keluarga.
            </p>
            <div className="hero-buttons">
              <Link href="#booking" className="btn btn-primary btn-lg">
                <CalendarCheck size={18} />
                Buat Janji Temu
              </Link>
              <Link href="#dokter" className="btn btn-secondary btn-lg">
                Lihat Dokter
                <ArrowRight size={18} />
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-number">{dokters.length}+</div>
                <div className="hero-stat-label">Dokter Spesialis</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">{polis.length}</div>
                <div className="hero-stat-label">Poliklinik</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-number">{pasiens}+</div>
                <div className="hero-stat-label">Pasien Terlayani</div>
              </div>
            </div>
          </div>

          <div className="hero-visual animate-fade-in-up delay-2">
            <div className="hero-card-stack">
              <div className="hero-floating-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Stethoscope size={24} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Konsultasi Online</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dokter tersedia</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {polis.slice(0, 3).map((p, i) => (
                    <span key={i} className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      {p.nama_poli}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hero-floating-card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CalendarCheck size={18} style={{ color: 'var(--accent-primary-light)' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Janji Temu</span>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  24/7
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Booking Tersedia</div>
              </div>

              <div className="hero-floating-card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Shield size={18} style={{ color: '#10b981' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Terpercaya</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Akreditasi Penuh</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POLIKLINIK SECTION ===== */}
      <section className="section" id="layanan">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <div className="section-label">Layanan Kami</div>
            <h2 className="section-title">Poliklinik Unggulan</h2>
            <p className="section-desc">
              Kami menyediakan berbagai layanan poliklinik dengan dokter spesialis
              yang berpengalaman di bidangnya.
            </p>
          </div>

          <div className="services-grid">
            {polis.map((poli, index) => {
              const IconComp = iconMap[poliIcons[index % poliIcons.length]] || Stethoscope;
              return (
                <div
                  key={poli.id_poli}
                  className="service-card glass-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="service-icon">
                    <IconComp size={24} />
                  </div>
                  <h3>{poli.nama_poli}</h3>
                  <p>{poli.deskripsi || 'Layanan kesehatan terpercaya untuk Anda dan keluarga.'}</p>
                  <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} />
                    {poli.gedung && poli.lantai ? `${poli.gedung}, ${poli.lantai}` : 'Lokasi tersedia'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== DOKTER SECTION ===== */}
      <section className="section-alt" id="dokter">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <div className="section-label">Tim Medis</div>
            <h2 className="section-title">Dokter Spesialis Kami</h2>
            <p className="section-desc">
              Tim dokter profesional kami siap memberikan pelayanan terbaik
              untuk kesehatan Anda.
            </p>
          </div>

          <div className="doctors-grid">
            {dokters.map((dokter, index) => {
              const jadwalDokter = jadwals.filter(j => j.id_dokter === dokter.id_dokter);
              return (
                <div
                  key={dokter.id_dokter}
                  className="doctor-card glass-card animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="doctor-image">
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, rgba(20,184,166,0.15), rgba(16,185,129,0.1))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <UserCheck size={64} style={{ color: 'var(--accent-primary)', opacity: 0.5 }} />
                    </div>
                  </div>
                  <div className="doctor-info">
                    <div className="doctor-name">{dokter.nama_dokter}</div>
                    <div className="doctor-specialty">
                      {dokter.nama_spesialis || 'Dokter Umum'}
                    </div>
                    <div className="doctor-meta">
                      <Building2 size={14} />
                      {dokter.nama_poli || '-'}
                    </div>
                    {jadwalDokter.length > 0 && (
                      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {jadwalDokter.map((j, jIdx) => (
                          <span key={jIdx} className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                            {j.hari} {String(j.jam_mulai).substring(0, 5)}-{String(j.jam_selesai).substring(0, 5)}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--accent-primary-light)', fontWeight: 600 }}>
                      Rp {Number(dokter.tarif).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BOOKING SECTION ===== */}
      <section className="section bg-radial-glow" id="booking">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <div className="section-label">Buat Janji</div>
            <h2 className="section-title">Booking Janji Temu</h2>
            <p className="section-desc">
              Reservasi janji temu dengan dokter spesialis pilihan Anda
              secara online, cepat dan mudah.
            </p>
          </div>

          <BookingForm dokters={JSON.parse(JSON.stringify(dokters))} polis={JSON.parse(JSON.stringify(polis))} />
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card animate-fade-in-up">
            <h2>Butuh Bantuan Medis Segera?</h2>
            <p>
              Tim medis kami siap melayani Anda 24 jam. Hubungi kami sekarang
              untuk konsultasi atau informasi layanan.
            </p>
            <a href="tel:02311234567" className="cta-btn">
              <Phone size={18} />
              Hubungi (0231) 123-4567
            </a>
          </div>
        </div>
      </section>

      {/* ===== KONTAK SECTION ===== */}
      <section className="section-alt" id="kontak">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <div className="section-label">Kontak</div>
            <h2 className="section-title">Hubungi Kami</h2>
            <p className="section-desc">
              Ada pertanyaan atau saran? Jangan ragu untuk menghubungi kami.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Contact Info */}
            <div className="animate-fade-in-up delay-1">
              <div className="glass-card-static" style={{ padding: '32px', height: '100%' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Informasi Kontak</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <MapPin size={20} style={{ color: 'var(--accent-primary-light)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Alamat</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Jl. Kesehatan No. 1, Cirebon, Jawa Barat 45131</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Phone size={20} style={{ color: 'var(--accent-primary-light)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Telepon</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>(0231) 123-4567</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Mail size={20} style={{ color: 'var(--accent-primary-light)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Email</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>info@rs-morich.co.id</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(20,184,166,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={20} style={{ color: 'var(--accent-primary-light)' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>Jam Operasional</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Senin - Jumat: 08:00 - 20:00</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sabtu: 08:00 - 14:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up delay-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
