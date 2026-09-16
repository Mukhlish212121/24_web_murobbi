"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LogOut, User, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

// Menambahkan properti agar Navbar bisa menerima perintah dari Layout
interface AdminNavbarProps {
  onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="z-30 w-full bg-pondok-600 dark:bg-pondok-950 shadow-md border-b border-pondok-700 dark:border-pondok-900">
      {/* Memperbaiki typo pxdark sebelumnya menjadi px-4 md:px-6 */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        
        {/* Kiri: Logo & Nama Pondok */}
        <div className="flex items-center gap-3 text-white font-bold text-xl">
          {/* Tombol Hamburger (Hanya muncul di HP) */}
          <button 
            onClick={onMenuClick} 
            className="md:hidden p-1 mr-1 hover:bg-pondok-700 rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="w-9 h-9 bg-white text-pondok-600 rounded-lg flex items-center justify-center shadow-sm">
            M
          </div>
          <span className="hidden sm:inline">Admin Murobbi</span>
        </div>

        {/* Kanan: Profil & Logout */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-white">
            <ThemeToggle />
          </div>
          
          <div className="flex items-center gap-2 md:gap-3 border-l border-pondok-500 pl-2 md:pl-4">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-pondok-500 flex items-center justify-center text-white shadow-inner">
              <User size={18} />
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white hover:bg-pondok-700 hover:text-white dark:hover:bg-pondok-800 px-2 md:px-3"
            >
              <LogOut size={18} className="md:mr-2" />
              <span className="hidden md:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}