"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getRekapAsrama() {
  // Langsung panggil View SQL yang baru saja kita buat
  const { data, error } = await supabaseAdmin
    .from('view_rekap_asrama')
    .select('*')
    .order('nama_asrama', { ascending: true })
    .order('nama_santri', { ascending: true });
    
  if (error) return { error: error.message, data: [] };
  return { data };
}