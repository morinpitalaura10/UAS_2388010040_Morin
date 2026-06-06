"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteKontak(id: number) {
  await query("DELETE FROM kontak_pesan WHERE id_pesan = ?", [id]);
  revalidatePath("/admin/kontak");
  revalidatePath("/admin");
}

export async function markAsRead(id: number) {
  await query("UPDATE kontak_pesan SET status = 'sudah_dibaca' WHERE id_pesan = ?", [id]);
  revalidatePath("/admin/kontak");
  revalidatePath("/admin");
}
