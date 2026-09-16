"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Fungsi pembantu untuk memanggil Supabase dengan hak akses Admin
const getSupabaseAdmin = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

// 1. Fungsi Buat Akun (Yang sudah ada sebelumnya)
// 1. Fungsi Buat Akun (Diperbarui agar sinkron dengan tabel profiles)
export async function buatAkunPengurus(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabaseAdmin = getSupabaseAdmin();

  // Langkah A: Buat user di sistem Autentikasi (auth.users)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'pengurus' }
  });

  if (authError) return { error: authError.message };

  // Langkah B: Masukkan data profil ke tabel (public.profiles) secara manual
  if (authData.user) {
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      full_name: fullName,
      role: 'pengurus'
    });

    if (profileError) {
      // Jika gagal simpan profil, kembalikan pesan error
      return { error: "Akun login terbuat, tapi gagal menyimpan ke tabel profil: " + profileError.message };
    }
  }
  
  revalidatePath("/admin/kelola-user");
  return { success: true };
}

// 2. Fungsi Ambil Daftar User
export async function getDaftarUser() {
  const supabaseAdmin = getSupabaseAdmin();
  
  // Ambil profil
  const { data: profiles, error: profError } = await supabaseAdmin.from('profiles').select('*');
  if (profError) return { error: profError.message, users: [] };

  // Ambil auth (untuk mendapatkan email)
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  if (authError) return { error: authError.message, users: [] };

  // Gabungkan data
  const users = profiles.map(profile => {
    const authUser = authData.users.find(u => u.id === profile.id);
    return {
      id: profile.id,
      full_name: profile.full_name,
      role: profile.role,
      email: authUser?.email || '',
    };
  });

  return { users };
}

// 3. Fungsi Perbarui User
export async function perbaruiUser(formData: FormData) {
  const supabaseAdmin = getSupabaseAdmin();
  const id = formData.get("id") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Siapkan data pembaruan autentikasi
  const authUpdates: { email: string; password?: string } = { email };
  
  // Jika password diisi, berarti ingin diganti. Jika kosong, abaikan.
  if (password && password.trim() !== "") {
    authUpdates.password = password;
  }

  // Update Auth (Email & Password)
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdates);
  if (authError) return { error: authError.message };

  // Update Profiles (Nama)
  const { error: profError } = await supabaseAdmin
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', id);
  
  if (profError) return { error: profError.message };

  revalidatePath("/admin/kelola-user");
  return { success: true };
}