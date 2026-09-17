"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 1. Ambil daftar akun pengguna untuk dijadikan pilihan Pengurus
export async function getDaftarAkun() {
  // Ambil data autentikasi (untuk mendapatkan email)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  if (authError) return { error: authError.message, data: [] };

  // Ambil data profil (untuk mendapatkan nama)
  const { data: profiles } = await supabaseAdmin.from('profiles').select('*');

  const akunList = authData.users.map(user => {
    const profile = profiles?.find(p => p.id === user.id);
    return {
      id: user.id,
      email: user.email || "Tidak ada email",
      full_name: profile?.full_name || "Tanpa Nama"
    };
  });

  return { data: akunList };
}

// 2. Ambil data Asrama beserta data pengurusnya
export async function getDaftarAsrama() {
  const { data: asramaData, error } = await supabaseAdmin
    .from('asrama')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) return { error: error.message, data: [] };

  const { data: akunList } = await getDaftarAkun();

  // Gabungkan data Asrama dengan Nama & Email Pengurus
  const enrichedData = asramaData.map(asrama => {
    const pengurus = akunList?.find(akun => akun.id === asrama.pengurus_id);
    return {
      ...asrama,
      pengurus_nama: pengurus ? pengurus.full_name : "Belum Ditentukan",
      pengurus_email: pengurus ? pengurus.email : "-"
    };
  });

  return { data: enrichedData };
}

export async function tambahAsrama(formData: FormData) {
  const nama_asrama = formData.get("namaAsrama") as string;
  const pengurus_id = formData.get("pengurusId") as string;

  const { error } = await supabaseAdmin.from('asrama').insert({ 
    nama_asrama, 
    pengurus_id: pengurus_id || null 
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/asrama");
  return { success: true };
}

export async function editAsrama(formData: FormData) {
  const id = formData.get("id") as string;
  const nama_asrama = formData.get("namaAsrama") as string;
  const pengurus_id = formData.get("pengurusId") as string;

  const { error } = await supabaseAdmin
    .from('asrama')
    .update({ nama_asrama, pengurus_id: pengurus_id || null })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath("/admin/asrama");
  return { success: true };
}

export async function hapusAsrama(id: string) {
  const { error } = await supabaseAdmin.from('asrama').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath("/admin/asrama");
  return { success: true };
}