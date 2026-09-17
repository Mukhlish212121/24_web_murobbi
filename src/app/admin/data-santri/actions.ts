"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getDaftarSantri() {
  const { data, error } = await supabaseAdmin
    .from('santri')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) return { error: error.message, data: [] };
  return { data };
}

export async function tambahSantri(formData: FormData) {
  const nis = formData.get("nis") as string;
  const nama_santri = formData.get("namaSantri") as string;
  const kategori_asrama = formData.get("kategoriAsrama") as string;
  const jenjang = formData.get("jenjang") as string;
  const kelas = formData.get("kelas") as string;

  const { error } = await supabaseAdmin.from('santri').insert({
    nis,
    nama_santri,
    kategori_asrama,
    jenjang,
    kelas
  });

  if (error) {
    if (error.code === '23505') return { error: "NIS sudah terdaftar!" };
    return { error: error.message };
  }

  revalidatePath("/admin/data-santri");
  return { success: true };
}

export async function editSantri(formData: FormData) {
  const id = formData.get("id") as string;
  const nis = formData.get("nis") as string;
  const nama_santri = formData.get("namaSantri") as string;
  const kategori_asrama = formData.get("kategoriAsrama") as string;
  const jenjang = formData.get("jenjang") as string;
  const kelas = formData.get("kelas") as string;

  const { error } = await supabaseAdmin
    .from('santri')
    .update({ nis, nama_santri, kategori_asrama, jenjang, kelas })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath("/admin/data-santri");
  return { success: true };
}

export async function hapusSantri(id: string) {
  const { error } = await supabaseAdmin.from('santri').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath("/admin/data-santri");
  return { success: true };
}