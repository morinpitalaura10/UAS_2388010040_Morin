"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPoliklinik(formData: FormData) {
  const nama_poli = (formData.get("nama_poli") as string)?.trim();
  const deskripsi = (formData.get("deskripsi") as string)?.trim() || null;
  const gedung = (formData.get("gedung") as string)?.trim() || null;
  const lantai = (formData.get("lantai") as string)?.trim() || null;

  if (!nama_poli) {
    throw new Error("Nama poliklinik wajib diisi.");
  }

  await query(
    "INSERT INTO poliklinik (nama_poli, deskripsi, gedung, lantai) VALUES (?, ?, ?, ?)",
    [nama_poli, deskripsi, gedung, lantai]
  );

  revalidatePath("/admin/poliklinik");
  redirect("/admin/poliklinik");
}

export async function updatePoliklinik(id: number, formData: FormData) {
  const nama_poli = (formData.get("nama_poli") as string)?.trim();
  const deskripsi = (formData.get("deskripsi") as string)?.trim() || null;
  const gedung = (formData.get("gedung") as string)?.trim() || null;
  const lantai = (formData.get("lantai") as string)?.trim() || null;

  if (!nama_poli) {
    throw new Error("Nama poliklinik wajib diisi.");
  }

  await query(
    "UPDATE poliklinik SET nama_poli = ?, deskripsi = ?, gedung = ?, lantai = ? WHERE id_poli = ?",
    [nama_poli, deskripsi, gedung, lantai, id]
  );

  revalidatePath("/admin/poliklinik");
  redirect("/admin/poliklinik");
}

export async function deletePoliklinik(id: number) {
  await query("DELETE FROM poliklinik WHERE id_poli = ?", [id]);
  revalidatePath("/admin/poliklinik");
}
