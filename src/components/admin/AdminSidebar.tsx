"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserCog, X, Users, Building, ClipboardList } from "lucide-react";

// Menambahkan properti agar Sidebar tahu kapan harus buka/tutup
interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Kelola Asrama", href: "/admin/asrama", icon: Building },
    { name: "Data Santri", href: "/admin/data-santri", icon: Users },
    { name: "Rekap Asrama", href: "/admin/rekap-asrama", icon: ClipboardList },
    { name: "Kelola User", href: "/admin/kelola-user", icon: UserCog },
  ];

  return (
    <>
      {/* Latar Belakang Gelap (Overlay) saat sidebar terbuka di HP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Area Sidebar Utama dengan Animasi Geser */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#02180b] border-r border-gray-200 dark:border-pondok-900 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:relative md:translate-x-0 md:shrink-0`}
      >
        {/* Header Sidebar Khusus Layar HP */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-100 dark:border-pondok-900">
          <span className="font-bold text-gray-800 dark:text-white">Menu Navigasi</span>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose()} // Tutup sidebar setelah menu diklik
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-pondok-50 dark:bg-pondok-900 text-pondok-700 dark:text-pondok-300 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-pondok-900 text-xs text-center text-gray-500">
          Versi 1.0.0
        </div>
      </aside>
    </>
  );
}