import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Buat response awal yang akan diteruskan
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Inisialisasi Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Dapatkan data sesi user saat ini
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl.clone()

  // 4. LOGIKA REDIRECT PENGAMANAN
  
  // A. Jika belum login dan mencoba masuk ke area dalam -> Lempar ke login
  if (!user && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/pengurus'))) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // B. Jika SUDAH login
  if (user) {
    // Ambil role dari tabel profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role

    console.log("STATUS ROLE SAAT INI:", role, " | EMAIL USER:", user.email);

    // Mencegah Pengurus masuk ke Admin
    if (role === 'pengurus' && url.pathname.startsWith('/admin')) {
      url.pathname = '/pengurus/dashboard'
      return NextResponse.redirect(url)
    }

    // Mencegah Admin masuk ke Pengurus (Opsional, tapi penting agar konsisten)
    if (role === 'admin' && url.pathname.startsWith('/pengurus')) {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Jika user mengakses halaman utama ('/') atau halaman '/login' padahal sudah login
    if (url.pathname === '/' || url.pathname === '/login') {
       // Arahkan sesuai jabatannya
      url.pathname = role === 'admin' ? '/admin/dashboard' : '/pengurus/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // 5. Kembalikan response normal jika tidak ada pelanggaran rute
  return response
}

// Konfigurasi ini memastikan middleware TIDAK berjalan di file statis atau gambar
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ],
}