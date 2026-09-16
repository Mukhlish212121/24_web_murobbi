import PengurusNavbar from "@/components/pengurus/PengurusNavbar";
import PengurusSidebar from "@/components/pengurus/PengurusSidebar";

export default function PengurusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#020617]">
      <PengurusSidebar />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <PengurusNavbar />
        
        <main className="w-full grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}