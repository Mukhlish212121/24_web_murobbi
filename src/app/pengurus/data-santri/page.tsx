import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SantriBinaanClient from "./SantriBinaanClient"; 

export default async function DataSantriBinaanPage() {
  const cookieStore = await cookies();

  // 1. Klien untuk Auth (Mengecek siapa yang login)
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

  // 2. Klien Admin (Service Role) untuk bypass RLS saat fetching data
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. Cari Asrama yang dikelola oleh Murobbi (user) ini
  const { data: dataAsrama } = await supabaseAdmin
    .from("asrama")
    .select("id, nama_asrama")
    .eq("pengurus_id", user.id)
    .single();

  // Jika pengurus belum ditugaskan ke asrama mana pun, kembalikan tabel kosong
  if (!dataAsrama) {
    return <SantriBinaanClient initialSantri={[]} />;
  }

  // 4. Ambil semua santri yang berada di asrama tersebut dari tabel 'santri'
  const { data: santriBinaan, error } = await supabaseAdmin
    .from("santri")
    .select("*")
    .eq("asrama_id", dataAsrama.id)
    .order("nama_santri", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data santri binaan:", error.message);
  }

  // 5. Sesuaikan format data dengan yang dibutuhkan oleh Client Component
  const formattedData = (santriBinaan || []).map((santri) => ({
    id: santri.id,
    nis: santri.nis,
    nama_santri: santri.nama_santri,
    kategori_asrama: santri.kategori_asrama,
    jenjang: santri.jenjang,
    kelas: santri.kelas,
    nama_asrama: dataAsrama.nama_asrama, // Langsung tempelkan nama asrama dari query pertama
  }));

  return (
    <SantriBinaanClient initialSantri={formattedData} />
  );
}