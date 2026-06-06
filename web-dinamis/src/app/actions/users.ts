"use server";

import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();
  const nama_lengkap = (formData.get("nama_lengkap") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const no_telepon = (formData.get("no_telepon") as string)?.trim() || null;
  const role = (formData.get("role") as string) || "pasien";
  const validRoles = ["admin", "dokter", "pasien"];
  const userRole = validRoles.includes(role) ? role : "pasien";

  if (!username) {
    throw new Error("Username wajib diisi.");
  }
  if (!password) {
    throw new Error("Password wajib diisi.");
  }
  if (!nama_lengkap) {
    throw new Error("Nama lengkap wajib diisi.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await query(
    "INSERT INTO users (username, password, nama_lengkap, email, no_telepon, role) VALUES (?, ?, ?, ?, ?, ?)",
    [username, hashedPassword, nama_lengkap, email, no_telepon, userRole]
  );

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUser(id: number, formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();
  const nama_lengkap = (formData.get("nama_lengkap") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const no_telepon = (formData.get("no_telepon") as string)?.trim() || null;
  const role = (formData.get("role") as string) || "pasien";
  const validRoles = ["admin", "dokter", "pasien"];
  const userRole = validRoles.includes(role) ? role : "pasien";

  if (!username) {
    throw new Error("Username wajib diisi.");
  }
  if (!nama_lengkap) {
    throw new Error("Nama lengkap wajib diisi.");
  }

  let passwordQuery = "";
  const params: any[] = [username, nama_lengkap, email, no_telepon, userRole];

  if (password && password.trim().length > 0) {
    const hashedPassword = await bcrypt.hash(password, 10);
    passwordQuery = ", password = ?";
    params.push(hashedPassword);
  }

  params.push(id);

  await query(
    `UPDATE users SET username = ?, nama_lengkap = ?, email = ?, no_telepon = ?, role = ?${passwordQuery} WHERE id_user = ?`,
    params
  );

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(id: number) {
  await query("DELETE FROM users WHERE id_user = ?", [id]);
  revalidatePath("/admin/users");
}
