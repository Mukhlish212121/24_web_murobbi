"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// FUNGSI BARU: Mengambil daftar asrama untuk pilihan dropdown
export async function getDaftarAsrama() {
  const { data, error } = await supabaseAdmin.from('asrama').select('id, nama_asrama').order('nama_asrama', { ascending: true });
  if (error) return { error: error.message, data: [] };
  return { data };
}

export async function getDaftarSantri() {
  const { data: santriData, error: santriError } = await supabaseAdmin
    .from('santri')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (santriError) return { error: santriError.message, data: [] };

  // Ambil data asrama untuk mencocokkan nama asrama dengan asrama_id santri
  const { data: asramaData } = await getDaftarAsrama();

  const enrichedData = santriData.map(santri => {
    const asrama = asramaData?.find(a => a.id === santri.asrama_id);
    return {
      ...santri,
      nama_asrama: asrama ? asrama.nama_asrama : null
    };
  });

  return { data: enrichedData };
}

export async function tambahSantri(formData: FormData) {
  const nis = formData.get("nis") as string;
  const nama_santri = formData.get("namaSantri") as string;
  const kategori_asrama = formData.get("kategoriAsrama") as string;
  const jenjang = formData.get("jenjang") as string;
  const kelas = formData.get("kelas") as string;

  const { error } = await supabaseAdmin.from('santri').insert({
    nis, nama_santri, kategori_asrama, jenjang, kelas
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

// FUNGSI BARU: Untuk memasukkan/memindahkan santri ke asrama
export async function setAsramaSantri(formData: FormData) {
  const id = formData.get("id") as string;
  const asrama_id = formData.get("asramaId") as string;

  const { error } = await supabaseAdmin
    .from('santri')
    .update({ asrama_id: asrama_id || null }) // Jika kosong, set jadi null (keluar asrama)
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath("/admin/data-santri");
  return { success: true };
}