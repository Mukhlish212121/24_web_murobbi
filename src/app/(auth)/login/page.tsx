"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email atau password salah.");
      setIsLoading(false);
    } else {
      // Refresh router untuk memicu middleware agar memandu ke halaman yang benar
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#02180b] p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-[#052e16] rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-pondok-900">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pondok-100 dark:bg-pondok-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {/* Ikon Logo Sementara */}
            <svg className="w-8 h-8 text-pondok-600 dark:text-pondok-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sistem Murobbi</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Email Pengguna"
            type="email"
            placeholder="nama@pondok.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}