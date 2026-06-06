import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="logo">RSU Morin Medika</Link>
          <p className="footer-tagline">Pelayanan Medis Profesional & Terpercaya</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Menu</h4>
            <Link href="/#hero">Beranda</Link>
            <Link href="/#poliklinik">Poliklinik</Link>
            <Link href="/#dokter">Dokter Kami</Link>
            <Link href="/#booking">Booking Janji</Link>
            <Link href="/#vision">Visi</Link>
          </div>
          <div className="footer-col">
            <h4>Poliklinik</h4>
            <span>Poli Anak</span>
            <span>Poli Penyakit Dalam</span>
            <span>Poli Jantung</span>
            <span>Layanan IGD 24 Jam</span>
          </div>
          <div className="footer-col">
            <h4>Kontak</h4>
            <span>info@rsumorinmedika.co.id</span>
            <span>0881-2045-140</span>
            <span>Cirebon, Indonesia</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 RSU Morin Medika. Semua hak dilindungi undang-undang.</p>
        <p className="footer-credit" style={{ color: "var(--text-dim)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          Project by Morin Pita Laura (2388010040) - Informatika 6B
        </p>
      </div>
    </footer>
  );
}
