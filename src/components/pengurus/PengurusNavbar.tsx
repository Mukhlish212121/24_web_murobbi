"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";

export default function PengurusNavbar() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#052e16] border-b border-gray-200 dark:border-pondok-900 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Kiri: Logo Pondok */}
        <div className="flex items-center gap-2 text-pondok-600 dark:text-pondok-400 font-bold text-xl md:hidden">
          {/* Tampil di mobile jika sidebar tersembunyi */}
          Murobbi
        </div>
        <div className="hidden md:block">
           {/* Spacer untuk desktop jika perlu */}
        </div>

        {/* Kanan: Profil & Logout */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="flex items-center gap-3 border-l border-gray-200 dark:border-pondok-800 pl-4">
            <div className="w-9 h-9 rounded-full bg-pondok-100 dark:bg-pondok-800 flex items-center justify-center text-pondok-600 dark:text-pondok-300">
              <User size={20} />
            </div>
            
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-3"
            >
              <LogOut size={18} className="mr-2" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}