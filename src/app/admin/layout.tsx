import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Untuk efisiensi, saya gabungkan kerangka Navbar/Sidebar Admin di sini.
  // Nantinya bisa Anda pecah ke dalam components/admin/ seperti milik pengurus.
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#020617]">
      {/* Sidebar Sederhana Admin */}
      <aside className="w-64 h-screen hidden md:flex flex-col bg-gray-900 text-white">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <h1 className="font-bold text-xl">Admin Murobbi</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-3 rounded-lg bg-gray-800 font-medium">
            Dashboard
          </Link>
          <Link href="/admin/kelola-user" className="block px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300">
            Kelola User
          </Link>
        </nav>
      </aside>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar Admin */}
        <header className="h-16 bg-white dark:bg-[#052e16] border-b border-gray-200 dark:border-pondok-900 flex items-center justify-between px-6">
          <div className="font-semibold text-gray-800 dark:text-white md:hidden">Admin Panel</div>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            {/* Tombol Logout Admin (Fungsinya sama dengan pengurus) */}
            <Link href="/login" className="text-red-500 text-sm font-medium">Keluar</Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}