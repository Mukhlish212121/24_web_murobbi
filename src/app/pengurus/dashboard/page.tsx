import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Users, User, ArrowRight } from 'lucide-react'

export default async function DashboardPengurus() {
  const cookieStore = await cookies()
  
  // 1. Klien Auth untuk mengecek sesi
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()
  
  // 2. Klien Admin untuk fetching data dengan aman (Bypass RLS)
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Ambil profil user
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id)
    .single()

  // 3. Ambil data asrama yang dipegang pengurus ini
  const { data: asrama } = await supabaseAdmin
    .from('asrama')
    .select('id, nama_asrama')
    .eq('pengurus_id', user?.id)
    .single()

  // 4. Hitung statistik santri jika asrama ditemukan
  let totalSantri = 0
  let totalRG = 0
  let totalUG = 0

  if (asrama) {
    const { data: santri } = await supabaseAdmin
      .from('santri')
      .select('kategori_asrama')
      .eq('asrama_id', asrama.id)

    if (santri) {
      totalSantri = santri.length
      totalRG = santri.filter(s => s.kategori_asrama === 'RG').length
      totalUG = santri.filter(s => s.kategori_asrama === 'UG').length
    }
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Sambutan */}
      <div className="bg-white dark:bg-pondok-950 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-pondok-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Ahlan wa Sahlan, {profile?.full_name || 'Murobbi'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl text-sm md:text-base">
            {asrama 
              ? `Anda saat ini ditugaskan sebagai pengurus di ${asrama.nama_asrama}. Berikut adalah ringkasan data santri binaan Anda.` 
              : 'Anda belum ditugaskan ke asrama mana pun. Silakan hubungi Administrator.'}
          </p>
        </div>
        
        {/* Dekorasi Background */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 opacity-10 dark:opacity-5 pointer-events-none">
          <Users size={200} />
        </div>
      </div>

      {/* Kartu Statistik */}
      {asrama && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Santri */}
          <div className="bg-white dark:bg-[#02180b] p-6 rounded-xl border border-gray-100 dark:border-pondok-900 shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Total Binaan</p>
                <h3 className="text-4xl font-black text-pondok-600 dark:text-pondok-400 mt-2">{totalSantri}</h3>
              </div>
              <div className="w-12 h-12 bg-pondok-50 dark:bg-pondok-900/40 text-pondok-600 dark:text-pondok-400 rounded-full flex items-center justify-center">
                <Users size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Keseluruhan santri di kamar Anda.</p>
          </div>

          {/* Santri RG */}
          <div className="bg-white dark:bg-[#02180b] p-6 rounded-xl border border-gray-100 dark:border-pondok-900 shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Santri Putra (RG)</p>
                <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2">{totalRG}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Santri berjenis kelamin Laki-laki.</p>
          </div>

          {/* Santri UG */}
          <div className="bg-white dark:bg-[#02180b] p-6 rounded-xl border border-gray-100 dark:border-pondok-900 shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider">Santri Putri (UG)</p>
                <h3 className="text-4xl font-black text-pink-600 dark:text-pink-400 mt-2">{totalUG}</h3>
              </div>
              <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Santri berjenis kelamin Perempuan.</p>
          </div>
          
        </div>
      )}

      {/* Jalan Pintas */}
      {asrama && (
        <div className="bg-white dark:bg-pondok-950 p-6 rounded-xl border border-gray-100 dark:border-pondok-900 shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Lihat Detail Santri</h4>
            <p className="text-sm text-gray-500 mt-1">Akses daftar lengkap nama dan kelas santri binaan Anda.</p>
          </div>
          <Link href="/pengurus/data-santri" className="flex items-center gap-2 px-4 py-2 bg-pondok-50 dark:bg-pondok-900/40 text-pondok-700 dark:text-pondok-300 font-semibold rounded-lg hover:bg-pondok-100 dark:hover:bg-pondok-800 transition-colors">
            Lihat Data <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}