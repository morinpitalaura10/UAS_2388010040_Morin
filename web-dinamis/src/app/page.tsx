import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import VisionSection from "@/components/VisionSection";
import DokterSection from "@/components/DokterSection";
import BookingSection from "@/components/BookingSection";
import ContactSection from "@/components/ContactSection";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Ambil data Poliklinik
  let poliklinikList = [];
  try {
    poliklinikList = await query<any>(
      "SELECT nama_poli as title, deskripsi as `desc`, gedung, lantai FROM poliklinik"
    );
  } catch (error) {
    console.error("Gagal memuat poliklinik dari DB, menggunakan fallback:", error);
  }

  // 2. Ambil data Dokter beserta Spesialisasi, Poliklinik, dan Jadwal Prakteknya
  let dokterList = [];
  try {
    dokterList = await query<any>(
      `SELECT d.id_dokter, d.nama_dokter, s.nama_spesialis, p.nama_poli, d.tarif, d.foto,
              GROUP_CONCAT(CONCAT(j.hari, ' (', TIME_FORMAT(j.jam_mulai, '%H:%i'), '-', TIME_FORMAT(j.jam_selesai, '%H:%i'), ')') ORDER BY FIELD(j.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') SEPARATOR ', ') as jadwal
       FROM dokter d
       LEFT JOIN spesialis s ON d.id_spesialis = s.id_spesialis
       LEFT JOIN poliklinik p ON d.id_poli = p.id_poli
       LEFT JOIN jadwal_dokter j ON d.id_dokter = j.id_dokter
       GROUP BY d.id_dokter`
    );
  } catch (error) {
    console.error("Gagal memuat dokter dari DB, menggunakan fallback:", error);
  }

  const bookingDoctors = dokterList.map((doc: any) => ({
    id_dokter: doc.id_dokter,
    nama_dokter: doc.nama_dokter,
    nama_spesialis: doc.nama_spesialis || "",
    nama_poli: doc.nama_poli || "",
  }));

  return (
    <>
      <HeroSection />
      <ServicesSection data={poliklinikList} />
      <VisionSection />
      <DokterSection data={dokterList} />
      <BookingSection dokterList={bookingDoctors} />
      <ContactSection />
    </>
  );
}
