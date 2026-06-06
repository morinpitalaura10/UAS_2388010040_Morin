"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDokter(formData: FormData) {
  const id_user = Number(formData.get("id_user")) || null;
  const nama_dokter = (formData.get("nama_dokter") as string)?.trim();
  const id_spesialis = Number(formData.get("id_spesialis")) || null;
  const id_poli = Number(formData.get("id_poli")) || null;
  const no_telepon = (formData.get("no_telepon") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const tarif = parseFloat((formData.get("tarif") as string) || "0") || 0;
  const foto = (formData.get("foto") as string)?.trim() || null;

  if (!nama_dokter) {
    throw new Error("Nama dokter wajib diisi.");
  }

  await query(
    "INSERT INTO dokter (id_user, nama_dokter, id_spesialis, id_poli, no_telepon, email, tarif, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id_user, nama_dokter, id_spesialis, id_poli, no_telepon, email, tarif, foto]
  );

  revalidatePath("/admin/dokter");
  redirect("/admin/dokter");
}

export async function updateDokter(id: number, formData: FormData) {
  const id_user = Number(formData.get("id_user")) || null;
  const nama_dokter = (formData.get("nama_dokter") as string)?.trim();
  const id_spesialis = Number(formData.get("id_spesialis")) || null;
  const id_poli = Number(formData.get("id_poli")) || null;
  const no_telepon = (formData.get("no_telepon") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const tarif = parseFloat((formData.get("tarif") as string) || "0") || 0;
  const foto = (formData.get("foto") as string)?.trim() || null;

  if (!nama_dokter) {
    throw new Error("Nama dokter wajib diisi.");
  }

  await query(
    "UPDATE dokter SET id_user = ?, nama_dokter = ?, id_spesialis = ?, id_poli = ?, no_telepon = ?, email = ?, tarif = ?, foto = ? WHERE id_dokter = ?",
    [id_user, nama_dokter, id_spesialis, id_poli, no_telepon, email, tarif, foto, id]
  );

  revalidatePath("/admin/dokter");
  redirect("/admin/dokter");
}

export async function deleteDokter(id: number) {
  await query("DELETE FROM dokter WHERE id_dokter = ?", [id]);
  revalidatePath("/admin/dokter");
}
