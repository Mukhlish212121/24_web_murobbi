"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const getSupabaseAdmin = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

// 1. Fungsi Buat Akun (Ditambahkan penerimaan role)
export async function buatAkunPengurus(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; // Menangkap role dari form

  const supabaseAdmin = getSupabaseAdmin();

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: role }
  });

  if (authError) return { error: authError.message };

  if (authData.user) {
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      full_name: fullName,
      role: role // Menyimpan role pilihan ke tabel profiles
    });

    if (profileError) {
      return { error: "Akun login terbuat, tapi gagal menyimpan profil: " + profileError.message };
    }
  }
  
  revalidatePath("/admin/kelola-user");
  return { success: true };
}

// 2. Fungsi Ambil Daftar User (Tetap sama)
export async function getDaftarUser() {
  const supabaseAdmin = getSupabaseAdmin();
  
  const { data: profiles, error: profError } = await supabaseAdmin.from('profiles').select('*');
  if (profError) return { error: profError.message, users: [] };

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
  if (authError) return { error: authError.message, users: [] };

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

// 3. Fungsi Perbarui User (Ditambahkan pembaruan role)
export async function perbaruiUser(formData: FormData) {
  const supabaseAdmin = getSupabaseAdmin();
  const id = formData.get("id") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string; // Menangkap role dari form edit

  const authUpdates: { email: string; password?: string } = { email };
  
  if (password && password.trim() !== "") {
    authUpdates.password = password;
  }

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdates);
  if (authError) return { error: authError.message };

  // Update Profiles (Nama & Role)
  const { error: profError } = await supabaseAdmin
    .from('profiles')
    .update({ full_name: fullName, role: role }) // Role baru ikut diperbarui
    .eq('id', id);
  
  if (profError) return { error: profError.message };

  revalidatePath("/admin/kelola-user");
  return { success: true };
}