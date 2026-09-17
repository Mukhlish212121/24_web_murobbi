"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LogOut, User, Menu, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
// import { perbaruiProfilSaya } from "./actions"; // Pastikan path ini benar untuk aksi update profil pengurus

interface PengurusNavbarProps {
  onMenuClick?: () => void;
}

export default function PengurusNavbar({ onMenuClick }: PengurusNavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [userData, setUserData] = useState({ id: "", full_name: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [pesan, setPesan] = useState({ tipe: "", teks: "" });
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        setUserData({
          id: user.id,
          email: user.email || "",
          full_name: profile?.full_name || "Pengurus",
        });
      }
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPesan({ tipe: "", teks: "" });

    // TODO: Implementasi logika update profil untuk pengurus
    // const result = await perbaruiProfilSaya(new FormData(e.currentTarget));
    
    // Simulasi respons (Ganti dengan logika sebenarnya)
    setTimeout(() => {
        setPesan({ tipe: "sukses", teks: "Profil berhasil diperbarui!" });
        setTimeout(() => {
          setIsModalOpen(false);
          setPesan({ tipe: "", teks: "" });
          // window.location.reload(); 
        }, 1500);
        setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-pondok-600 dark:bg-pondok-950 shadow-md border-b border-pondok-700 dark:border-pondok-900">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          
          {/* Kiri: Logo & Nama Pondok */}
          <div className="flex items-center gap-3 text-white font-bold text-xl">
            {onMenuClick && (
              <button onClick={onMenuClick} className="md:hidden p-1 mr-1 hover:bg-pondok-700 rounded-md transition-colors">
                <Menu size={24} />
              </button>
            )}
            
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm overflow-hidden p-1">
              <img 
                src="/logo-lembang.jpg" 
                alt="Logo Lembang" 
                className="w-full h-full object-contain"
              />
            </div>

            <span className="hidden sm:inline">Portal Murobbi</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-white">
              <ThemeToggle />
            </div>
            
            <div className="relative border-l border-pondok-500 pl-2 md:pl-4" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-pondok-700 dark:hover:bg-pondok-800 p-1 md:pr-3 rounded-full md:rounded-lg transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-pondok-500 flex items-center justify-center text-white shadow-inner">
                  <User size={18} />
                </div>
                <span className="hidden md:block text-sm font-medium text-white truncate max-w-30">
                  {userData.full_name || "Memuat..."}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#02180b] rounded-xl shadow-lg border border-gray-100 dark:border-pondok-900 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-pondok-900">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{userData.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={() => { setIsModalOpen(true); setIsDropdownOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-pondok-50 dark:hover:bg-pondok-900/50 rounded-lg transition-colors"
                    >
                      <Settings size={16} /> Pengaturan Profil
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Profil Saya</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-5 space-y-4">
              <input type="hidden" name="id" value={userData.id} />
              <Input name="fullName" label="Nama Lengkap" defaultValue={userData.full_name} required />
              <Input name="email" label="Email" type="email" defaultValue={userData.email} required />
              
              <div className="bg-gray-50 dark:bg-[#02180b] p-3 rounded-lg border border-gray-100 dark:border-pondok-900 mt-2">
                <Input name="password" label="Ganti Password" type="password" placeholder="Kosongkan jika tidak ingin ganti" minLength={6} />
              </div>

              {pesan.teks && (
                <div className={`p-3 rounded-lg text-sm border ${pesan.tipe === "error" ? "bg-red-50 text-red-600 border-red-200" : "bg-pondok-50 text-pondok-700 border-pondok-200"}`}>
                  {pesan.teks}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit" isLoading={isLoading}>Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}