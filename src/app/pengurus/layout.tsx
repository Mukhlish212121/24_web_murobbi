"use client";

import { useState } from "react";
import PengurusNavbar from "@/components/pengurus/PengurusNavbar";
import PengurusSidebar from "@/components/pengurus/PengurusSidebar";

export default function PengurusLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#02180b]">
      
      {/* NAVBAR: Berada di posisi teratas, full-width, tidak terhalang Sidebar */}
      <PengurusNavbar onMenuClick={() => setIsSidebarOpen(true)} />

      {/* KONTAINER BAWAH: Membagi area sisa untuk Sidebar dan Konten */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR: Akan menyesuaikan tinggi sisa di bawah Navbar */}
        <PengurusSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* KONTEN UTAMA */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
          {children}
        </main>
        
      </div>
      
    </div>
  );
}