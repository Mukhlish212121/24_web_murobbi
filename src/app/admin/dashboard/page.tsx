"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function KelolaUserPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Kelola Akun Pengurus</h1>
      <p className="text-gray-500 mb-6">Buat akun untuk pengurus pondok baru di sini.</p>

      <div className="bg-white dark:pondok-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-pondok-900">
        <form className="space-y-4">
          <Input label="Nama Lengkap" placeholder="Ust. Fulan" required />
          <Input label="Email Pengurus" type="email" placeholder="fulan@pondok.com" required />
          <Input label="Password Sementara" type="text" placeholder="Minimal 6 karakter" required />
          
          <div className="pt-2">
            <Button type="button">Buat Akun Pengurus</Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 border-t border-gray-100 dark:border-pondok-800 pt-4">
            * Catatan Developer: Untuk mengaktifkan fungsi ini secara penuh, Anda perlu menghubungkan form ini ke fungsi <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">supabase.auth.admin.createUser</code> menggunakan Next.js Server Actions dan SUPABASE_SERVICE_ROLE_KEY di .env Anda.
          </p>
        </form>
      </div>
    </div>
  );
}