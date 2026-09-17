"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Menggunakan Service Role Key agar Admin memiliki hak penuh (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getDaftarUser() {
  // 1. Ambil data autentikasi (untuk mendapatkan email)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  if (authError) return { error: authError.message, users: [] };

  // 2. Ambil data profil (untuk mendapatkan nama dan role)
  const { data: profiles, error: profilesError } = await supabaseAdmin.from('profiles').select('*');
  
  // Gabungkan data Auth dengan Data Profile
  const akunList = authData.users.map(user => {
    const profile = profiles?.find(p => p.id === user.id);
    return {
      id: user.id,
      email: user.email || "Tidak ada email",
      // Ambil dari profile, jika kosong ambil dari metadata auth
      full_name: profile?.full_name || user.user_metadata?.full_name || "Tanpa Nama",
      role: profile?.role || user.user_metadata?.role || "pengurus"
    };
  });

  return { users: akunList };
}

export async function buatAkunPengurus(formData: FormData) {
  const full_name = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  // 1. Buat user di sistem Autentikasi Supabase
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Langsung aktifkan email
    user_metadata: { full_name, role }
  });

  if (error) return { error: error.message };

  // 2. Jika Anda tidak menggunakan Trigger SQL di Supabase, kita masukkan ke tabel profiles secara manual:
  if (data.user) {
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: data.user.id,
      full_name,
      role
    });
    
    if (profileError) console.error("Gagal menyimpan ke profil:", profileError.message);
  }

  // Refresh tabel UI
  revalidatePath("/admin/kelola-user");
  return { success: true };
}

export async function perbaruiUser(formData: FormData) {
  const id = formData.get("id") as string;
  const full_name = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  // Siapkan data update untuk Auth
  const updateData: any = {
    email,
    user_metadata: { full_name, role }
  };
  
  // Jika password diisi (tidak kosong), ikut perbarui password
  if (password && password.trim().length >= 6) {
    updateData.password = password;
  }

  // 1. Perbarui di sistem Autentikasi
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, updateData);
  if (authError) return { error: authError.message };

  // 2. Perbarui juga di tabel profiles
  const { error: profileError } = await supabaseAdmin.from('profiles').update({
    full_name,
    role
  }).eq('id', id);

  if (profileError) return { error: profileError.message };

  revalidatePath("/admin/kelola-user");
  return { success: true };
}

export async function hapusUser(id: string) {
  // Hapus dari Supabase Auth
  // (Jika di tabel `profiles` Anda sudah di-set ON DELETE CASCADE, 
  // maka data di tabel profil akan otomatis ikut terhapus secara bersih).
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) return { error: error.message };
  
  revalidatePath("/admin/kelola-user");
  return { success: true };
}