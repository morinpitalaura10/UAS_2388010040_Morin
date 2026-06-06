import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import SiteLayout from "@/components/SiteLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "600", "800"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "RSU Morin Medika | Pelayanan Medis Profesional & Terpercaya",
  description: "Selamat datang di Rumah Sakit Umum Morin Medika. Kami berkomitmen untuk memberikan pelayanan kesehatan berkualitas terbaik dan terpercaya bagi Anda dan keluarga.",
  keywords: ["rumah sakit", "rs morin medika", "pelayanan medis", "dokter spesialis", "janji temu", "cirebon"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
