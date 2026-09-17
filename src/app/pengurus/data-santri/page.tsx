import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SantriBinaanClient from "./SantriBinaanClient"; 

export default async function DataSantriBinaanPage() {
  const cookieStore = await cookies();

  // 1. Klien untuk mengecek Sesi User (Auth)
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabaseAuth.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Klien Admin (Service Role) untuk bypass RLS dan mengakses View
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. Tarik data langsung dari VIEW SQL
  const { data: santriBinaan, error } = await supabaseAdmin
    .from("view_rekap_asrama")
    .select("*")
    .eq("pengurus_id", user.id) // Filter khusus asrama yang dipegang pengurus ini
    .order("nama_santri", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data dari view_rekap_asrama:", error.message);
  }

  // 4. Sesuaikan format data dengan yang dibutuhkan oleh Client Component
  const formattedData = (santriBinaan || []).map((item: any) => ({
    id: item.santri_id, // Perhatikan: di view namanya santri_id
    nis: item.nis,
    nama_santri: item.nama_santri,
    kategori_asrama: item.kategori_asrama,
    jenjang: item.jenjang,
    kelas: item.kelas,
    nama_asrama: item.nama_asrama,
  }));

  return (
    <SantriBinaanClient initialSantri={formattedData} />
  );
}