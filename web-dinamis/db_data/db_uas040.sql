-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: db_uas040
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `berita`
--

DROP TABLE IF EXISTS `berita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `berita` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text NOT NULL,
  `konten` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `berita`
--

LOCK TABLES `berita` WRITE;
/*!40000 ALTER TABLE `berita` DISABLE KEYS */;
/*!40000 ALTER TABLE `berita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dokter`
--

DROP TABLE IF EXISTS `dokter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dokter` (
  `id_dokter` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `nama_dokter` varchar(100) NOT NULL,
  `id_spesialis` int(11) DEFAULT NULL,
  `id_poli` int(11) DEFAULT NULL,
  `no_telepon` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `tarif` decimal(10,2) NOT NULL DEFAULT 0.00,
  `foto` varchar(255) DEFAULT 'default_dokter.png',
  PRIMARY KEY (`id_dokter`),
  KEY `id_user` (`id_user`),
  KEY `id_spesialis` (`id_spesialis`),
  KEY `id_poli` (`id_poli`),
  CONSTRAINT `dokter_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL,
  CONSTRAINT `dokter_ibfk_2` FOREIGN KEY (`id_spesialis`) REFERENCES `spesialis` (`id_spesialis`) ON DELETE SET NULL,
  CONSTRAINT `dokter_ibfk_3` FOREIGN KEY (`id_poli`) REFERENCES `poliklinik` (`id_poli`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dokter`
--

LOCK TABLES `dokter` WRITE;
/*!40000 ALTER TABLE `dokter` DISABLE KEYS */;
INSERT INTO `dokter` VALUES (1,2,'dr. Budi Santoso, Sp.A',1,1,'08234567890','budi.santoso@rumahsakit.com',150000.00,'budi_santoso.png'),(2,NULL,'dr. Rina Herawati, Sp.PD',2,2,'08567890123','rina.herawati@rumahsakit.com',175000.00,'rina_herawati.png'),(3,NULL,'dr. Anton Wijaya, Sp.JP',3,3,'08765432109','anton.wijaya@rumahsakit.com',200000.00,'anton_wijaya.png');
/*!40000 ALTER TABLE `dokter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jadwal_dokter`
--

DROP TABLE IF EXISTS `jadwal_dokter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jadwal_dokter` (
  `id_jadwal` int(11) NOT NULL AUTO_INCREMENT,
  `id_dokter` int(11) NOT NULL,
  `hari` enum('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  PRIMARY KEY (`id_jadwal`),
  KEY `id_dokter` (`id_dokter`),
  CONSTRAINT `jadwal_dokter_ibfk_1` FOREIGN KEY (`id_dokter`) REFERENCES `dokter` (`id_dokter`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jadwal_dokter`
--

LOCK TABLES `jadwal_dokter` WRITE;
/*!40000 ALTER TABLE `jadwal_dokter` DISABLE KEYS */;
INSERT INTO `jadwal_dokter` VALUES (1,1,'Senin','08:00:00','12:00:00'),(2,1,'Rabu','08:00:00','12:00:00'),(3,2,'Selasa','09:00:00','13:00:00'),(4,2,'Kamis','09:00:00','13:00:00'),(5,3,'Jumat','13:00:00','17:00:00');
/*!40000 ALTER TABLE `jadwal_dokter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `janji_temu`
--

DROP TABLE IF EXISTS `janji_temu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `janji_temu` (
  `id_janji` int(11) NOT NULL AUTO_INCREMENT,
  `no_antrian` int(11) DEFAULT NULL,
  `id_pasien` int(11) NOT NULL,
  `id_dokter` int(11) NOT NULL,
  `id_poli` int(11) NOT NULL,
  `tanggal_janji` date NOT NULL,
  `keluhan` text DEFAULT NULL,
  `status` enum('pending','dikonfirmasi','selesai','dibatalkan') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_janji`),
  KEY `id_pasien` (`id_pasien`),
  KEY `id_dokter` (`id_dokter`),
  KEY `id_poli` (`id_poli`),
  CONSTRAINT `janji_temu_ibfk_1` FOREIGN KEY (`id_pasien`) REFERENCES `pasien` (`id_pasien`) ON DELETE CASCADE,
  CONSTRAINT `janji_temu_ibfk_2` FOREIGN KEY (`id_dokter`) REFERENCES `dokter` (`id_dokter`) ON DELETE CASCADE,
  CONSTRAINT `janji_temu_ibfk_3` FOREIGN KEY (`id_poli`) REFERENCES `poliklinik` (`id_poli`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `janji_temu`
--

LOCK TABLES `janji_temu` WRITE;
/*!40000 ALTER TABLE `janji_temu` DISABLE KEYS */;
INSERT INTO `janji_temu` VALUES (1,1,1,1,1,'2026-06-08','Anak mengalami demam tinggi selama 2 hari','pending','2026-06-05 11:36:57'),(2,2,2,2,2,'2026-06-09','Nyeri perut sebelah kanan bagian bawah','dikonfirmasi','2026-06-05 11:36:57');
/*!40000 ALTER TABLE `janji_temu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kontak_pesan`
--

DROP TABLE IF EXISTS `kontak_pesan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `kontak_pesan` (
  `id_pesan` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subjek` varchar(150) DEFAULT NULL,
  `pesan` text NOT NULL,
  `status` enum('belum_dibaca','sudah_dibaca') DEFAULT 'belum_dibaca',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pesan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kontak_pesan`
--

LOCK TABLES `kontak_pesan` WRITE;
/*!40000 ALTER TABLE `kontak_pesan` DISABLE KEYS */;
/*!40000 ALTER TABLE `kontak_pesan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `layanan`
--

DROP TABLE IF EXISTS `layanan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `layanan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `icon` varchar(100) DEFAULT 'code',
  `deskripsi` text NOT NULL,
  `urutan` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `layanan`
--

LOCK TABLES `layanan` WRITE;
/*!40000 ALTER TABLE `layanan` DISABLE KEYS */;
/*!40000 ALTER TABLE `layanan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `obat`
--

DROP TABLE IF EXISTS `obat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `obat` (
  `id_obat` int(11) NOT NULL AUTO_INCREMENT,
  `nama_obat` varchar(100) NOT NULL,
  `jenis_obat` varchar(50) DEFAULT NULL,
  `dosis` varchar(50) DEFAULT NULL,
  `stok` int(11) NOT NULL DEFAULT 0,
  `harga` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id_obat`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `obat`
--

LOCK TABLES `obat` WRITE;
/*!40000 ALTER TABLE `obat` DISABLE KEYS */;
INSERT INTO `obat` VALUES (1,'Paracetamol Sirup','Analgis & Antipiretik','120mg/5ml',50,15000.00),(2,'Amoxicillin 500mg','Antibiotik','500mg',100,8000.00),(3,'Amlodipine 5mg','Antihipertensi','5mg',80,5000.00);
/*!40000 ALTER TABLE `obat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pasien`
--

DROP TABLE IF EXISTS `pasien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pasien` (
  `id_pasien` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) DEFAULT NULL,
  `nama_pasien` varchar(100) NOT NULL,
  `nik` varchar(16) DEFAULT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `no_telepon` varchar(15) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `golongan_darah` enum('A','B','AB','O') DEFAULT NULL,
  PRIMARY KEY (`id_pasien`),
  UNIQUE KEY `nik` (`nik`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `pasien_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pasien`
--

LOCK TABLES `pasien` WRITE;
/*!40000 ALTER TABLE `pasien` DISABLE KEYS */;
INSERT INTO `pasien` VALUES (1,3,'Laura Fitriani','3275012345670001','P','2005-05-10','08987654321','Jl. Merdeka No. 45, Cirebon','O'),(2,NULL,'Ahmad Junaedi','3275029876540002','L','1990-08-12','08129876543','Jl. Pemuda No. 12, Cirebon','A');
/*!40000 ALTER TABLE `pasien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poliklinik`
--

DROP TABLE IF EXISTS `poliklinik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `poliklinik` (
  `id_poli` int(11) NOT NULL AUTO_INCREMENT,
  `nama_poli` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `gedung` varchar(50) DEFAULT NULL,
  `lantai` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_poli`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poliklinik`
--

LOCK TABLES `poliklinik` WRITE;
/*!40000 ALTER TABLE `poliklinik` DISABLE KEYS */;
INSERT INTO `poliklinik` VALUES (1,'Poli Anak','Poliklinik khusus kesehatan anak dan imunisasi.','Gedung A','Lantai 1'),(2,'Poli Penyakit Dalam','Poliklinik untuk konsultasi penyakit organ dalam.','Gedung B','Lantai 2'),(3,'Poli Jantung','Poliklinik diagnosis dan terapi penyakit jantung.','Gedung A','Lantai 2');
/*!40000 ALTER TABLE `poliklinik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rekam_medis`
--

DROP TABLE IF EXISTS `rekam_medis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rekam_medis` (
  `id_rekam` int(11) NOT NULL AUTO_INCREMENT,
  `id_pasien` int(11) NOT NULL,
  `id_dokter` int(11) NOT NULL,
  `tanggal_periksa` date NOT NULL,
  `keluhan` text DEFAULT NULL,
  `diagnosa` text NOT NULL,
  `tindakan` text DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  PRIMARY KEY (`id_rekam`),
  KEY `id_pasien` (`id_pasien`),
  KEY `id_dokter` (`id_dokter`),
  CONSTRAINT `rekam_medis_ibfk_1` FOREIGN KEY (`id_pasien`) REFERENCES `pasien` (`id_pasien`) ON DELETE CASCADE,
  CONSTRAINT `rekam_medis_ibfk_2` FOREIGN KEY (`id_dokter`) REFERENCES `dokter` (`id_dokter`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rekam_medis`
--

LOCK TABLES `rekam_medis` WRITE;
/*!40000 ALTER TABLE `rekam_medis` DISABLE KEYS */;
/*!40000 ALTER TABLE `rekam_medis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resep_obat`
--

DROP TABLE IF EXISTS `resep_obat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resep_obat` (
  `id_resep` int(11) NOT NULL AUTO_INCREMENT,
  `id_rekam` int(11) NOT NULL,
  `id_obat` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL DEFAULT 1,
  `aturan_pakai` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_resep`),
  KEY `id_rekam` (`id_rekam`),
  KEY `id_obat` (`id_obat`),
  CONSTRAINT `resep_obat_ibfk_1` FOREIGN KEY (`id_rekam`) REFERENCES `rekam_medis` (`id_rekam`) ON DELETE CASCADE,
  CONSTRAINT `resep_obat_ibfk_2` FOREIGN KEY (`id_obat`) REFERENCES `obat` (`id_obat`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resep_obat`
--

LOCK TABLES `resep_obat` WRITE;
/*!40000 ALTER TABLE `resep_obat` DISABLE KEYS */;
/*!40000 ALTER TABLE `resep_obat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spesialis`
--

DROP TABLE IF EXISTS `spesialis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spesialis` (
  `id_spesialis` int(11) NOT NULL AUTO_INCREMENT,
  `nama_spesialis` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  PRIMARY KEY (`id_spesialis`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spesialis`
--

LOCK TABLES `spesialis` WRITE;
/*!40000 ALTER TABLE `spesialis` DISABLE KEYS */;
INSERT INTO `spesialis` VALUES (1,'Spesialis Anak (Pediatri)','Menangani kesehatan fisik, mental, dan sosial anak sejak lahir hingga usia 18 tahun.'),(2,'Spesialis Penyakit Dalam (Internis)','Mencegah, mendiagnosis, dan merawat penyakit organ dalam pada pasien dewasa.'),(3,'Spesialis Jantung & Pembuluh Darah','Menangani penyakit yang berkaitan dengan jantung dan pembuluh darah kardiovaskular.');
/*!40000 ALTER TABLE `spesialis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `no_telepon` varchar(15) DEFAULT NULL,
  `role` enum('admin','dokter','pasien') NOT NULL DEFAULT 'pasien',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2b$10$1itlIybCBo/bwHIMjGrREOSFt7q5vyNG3ftnJhrAlAcDx8baIZ/gu','Administrator Utama','admin@rumahsakit.com','08123456789','admin','2026-06-05 11:36:57'),(2,'dr_budi','49ef4027ab5dc8fe8282367d2644ff37','dr. Budi Santoso, Sp.A','budi.santoso@rumahsakit.com','08234567890','dokter','2026-06-05 11:36:57'),(3,'pasien_laura','3503b0c51f33f01c905b6324fa93f773','Laura Fitriani','laura@gmail.com','08987654321','pasien','2026-06-05 11:36:57'),(4,'morin','$2b$10$ems1DcPJQa1F4cs2.U5UvOrlrnUkw71vYd8m.nPB2rQJ5VrKARscC','morin','pitaaa100505@gmail.com','0123456789','admin','2026-06-06 00:03:01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-06 18:23:28
