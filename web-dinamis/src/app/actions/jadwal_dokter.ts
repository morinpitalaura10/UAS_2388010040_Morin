"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const validDays = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export async function createJadwalDokter(formData: FormData) {
  const id_dokter = Number(formData.get("id_dokter"));
  const hari = (formData.get("hari") as string) || "Senin";
  const jam_mulai = (formData.get("jam_mulai") as string)?.trim();
  const jam_selesai = (formData.get("jam_selesai") as string)?.trim();

  if (!id_dokter) {
    throw new Error("Pilih dokter terlebih dahulu.");
  }
  if (!validDays.includes(hari)) {
    throw new Error("Hari tidak valid.");
  }
  if (!jam_mulai || !jam_selesai) {
    throw new Error("Jam mulai dan selesai wajib diisi.");
  }

  await query(
    "INSERT INTO jadwal_dokter (id_dokter, hari, jam_mulai, jam_selesai) VALUES (?, ?, ?, ?)",
    [id_dokter, hari, jam_mulai, jam_selesai]
  );

  revalidatePath("/admin/jadwal_dokter");
  redirect("/admin/jadwal_dokter");
}

export async function updateJadwalDokter(id: number, formData: FormData) {
  const id_dokter = Number(formData.get("id_dokter"));
  const hari = (formData.get("hari") as string) || "Senin";
  const jam_mulai = (formData.get("jam_mulai") as string)?.trim();
  const jam_selesai = (formData.get("jam_selesai") as string)?.trim();

  if (!id_dokter) {
    throw new Error("Pilih dokter terlebih dahulu.");
  }
  if (!validDays.includes(hari)) {
    throw new Error("Hari tidak valid.");
  }
  if (!jam_mulai || !jam_selesai) {
    throw new Error("Jam mulai dan selesai wajib diisi.");
  }

  await query(
    "UPDATE jadwal_dokter SET id_dokter = ?, hari = ?, jam_mulai = ?, jam_selesai = ? WHERE id_jadwal = ?",
    [id_dokter, hari, jam_mulai, jam_selesai, id]
  );

  revalidatePath("/admin/jadwal_dokter");
  redirect("/admin/jadwal_dokter");
}

export async function deleteJadwalDokter(id: number) {
  await query("DELETE FROM jadwal_dokter WHERE id_jadwal = ?", [id]);
  revalidatePath("/admin/jadwal_dokter");
}
