import TabelSantri from "@/components/pengurus/TabelSantri";

export default function DataSantriPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manajemen Data Santri
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Tambah dan pantau daftar santri yang berada di bawah bimbingan Anda.
        </p>
      </div>

      <div className="bg-white dark:bg-[#052e16] rounded-xl border border-gray-100 dark:border-pondok-900 shadow-sm p-6">
        <TabelSantri />
      </div>
    </div>
  );
}