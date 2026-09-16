"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
// 1. Path import diperbaiki agar menunjuk ke folder kelola-user
import { getDaftarUser } from "../kelola-user/actions"; 

export default function RingkasanAkunPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDaftarUser();
        if (res.users) {
          setTotalUsers(res.users.length);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ringkasan Sistem</h1>
        <p className="text-gray-500 text-sm mt-1">Informasi jumlah pengguna yang terdaftar di sistem Murobbi.</p>
      </div>

      {/* Kartu Statistik Tunggal */}
      {/* 2. Class warna diperbarui mengikuti saran Tailwind */}
      <div className="bg-white dark:bg-pondok-950 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 flex items-center gap-5 max-w-sm">
        <div className="p-4 bg-pondok-50 dark:bg-pondok-900/30 text-pondok-600 dark:text-pondok-400 rounded-xl">
          <Users size={32} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Akun Terdaftar</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoading ? "..." : totalUsers}
          </h3>
        </div>
      </div>

    </div>
  );
}