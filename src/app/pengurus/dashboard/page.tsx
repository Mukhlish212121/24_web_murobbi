import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function DashboardPengurus() {
  // Tambahkan 'await' di depan cookies()
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
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

  // Ambil data user yang sedang login
  const { data: { user } } = await supabase.auth.getUser()
  
  // Ambil profil user
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user?.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Selamat datang, {profile?.full_name || 'Pengurus'}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Ini adalah panel kontrol utama Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Statistik Dummy */}
        <div className="bg-white dark:bg-pondok-950 p-6 rounded-xl border border-gray-100 dark:border-pondok-900 shadow-sm">
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Santri Binaan</h3>
          <p className="text-3xl font-bold text-pondok-600 dark:text-pondok-400 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}