"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";

export default function PengurusSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/pengurus/dashboard", icon: LayoutDashboard },
    { name: "Data Santri", href: "/pengurus/data-santri", icon: Users },
  ];

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col bg-white dark:bg-[#02180b] border-r border-gray-200 dark:border-pondok-900">
      {/* Header Sidebar / Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-pondok-900">
        <div className="w-8 h-8 bg-pondok-600 rounded-lg flex items-center justify-center mr-3">
           <span className="text-white font-bold">M</span>
        </div>
        <h1 className="font-bold text-xl text-gray-900 dark:text-white">Murobbi</h1>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
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

      {/* Footer Sidebar */}
      <div className="p-4 border-t border-gray-200 dark:border-pondok-900 text-xs text-center text-gray-500">
        © 2026 Sistem Murobbi
      </div>
    </aside>
  );
}