import './globals.css';

export const metadata = {
  title: 'RS Morich 2388010040 — Sistem Informasi Rumah Sakit',
  description: 'Sistem Informasi Rumah Sakit RS Morich 2388010040. Layanan kesehatan terpercaya dengan dokter spesialis berpengalaman.',
  keywords: 'rumah sakit, dokter, kesehatan, booking, janji temu, poliklinik',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-grid">
        {children}
      </body>
    </html>
  );
}
