import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#02180b] p-6 text-center relative">
      {/* Tombol Tema di pojok kanan atas */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-24 h-24 bg-pondok-100 dark:bg-pondok-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
        <span className="text-4xl font-bold text-pondok-600 dark:text-pondok-400">M</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
        Sistem Manajemen <span className="text-pondok-600 dark:text-pondok-400">Murobbi</span>
      </h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed">
        Platform pengelolaan data santri terpadu. Memudahkan pengurus dan admin dalam memantau perkembangan dan administrasi pondok secara efisien dan rapi.
      </p>
      
      <Link href="/login">
        {/* Menggunakan komponen Button yang sudah kita buat sebelumnya */}
        <Button className="px-8 py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all">
          Masuk ke Sistem
        </Button>
      </Link>

      <div className="absolute bottom-6 text-sm text-gray-500 dark:text-gray-500">
        © 2026 Web Murobbi
      </div>
    </div>
  );
}