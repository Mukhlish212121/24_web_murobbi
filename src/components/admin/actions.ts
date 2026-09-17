"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function perbaruiProfilSaya(formData: FormData) {
  const id = formData.get("id") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authUpdates: { email?: string; password?: string } = { email };
  
  if (password && password.trim() !== "") {
    authUpdates.password = password;
  }

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdates);
  if (authError) return { error: authError.message };

  const { error: profError } = await supabaseAdmin
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', id);
  
  if (profError) return { error: profError.message };

  revalidatePath("/");
  return { success: true };
}