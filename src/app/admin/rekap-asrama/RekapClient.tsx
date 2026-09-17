"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";

type RekapData = {
  santri_id: string;
  nis: string;
  nama_santri: string;
  jenjang: string;
  kelas: string;
  kategori_asrama: string;
  asrama_id: string;
  nama_asrama: string;
  pengurus_id: string;
  pengurus_nama: string;
};

export default function RekapClient({ initialData }: { initialData: RekapData[] }) {
  const [filterAsrama, setFilterAsrama] = useState("Semua");
  
  // Ambil daftar nama asrama yang unik untuk menu dropdown filter
  const asramaOptions = useMemo(() => {
    const list = initialData.map(item => item.nama_asrama);
    return Array.from(new Set(list)).sort();
  }, [initialData]);

  const filteredData = useMemo(() => {
    if (filterAsrama === "Semua") return initialData;
    return initialData.filter(item => item.nama_asrama === filterAsrama);
  }, [initialData, filterAsrama]);

  return (
    <div className="space-y-6 max-w-7xl w-full">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rekap Penempatan Asrama</h1>
          <p className="text-sm text-gray-500">Referensi daftar santri yang sudah dialokasikan ke dalam kamar beserta pengurusnya.</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>🖨️ Cetak Laporan</Button>
      </div>

      <div className="bg-white dark:bg-pondok-950 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
        <div className="flex flex-col gap-1.5 w-full sm:w-64">
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filter Berdasarkan Asrama</label>
          <select value={filterAsrama} onChange={(e) => setFilterAsrama(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer">
            <option value="Semua">Tampilkan Semua Asrama</option>
            {asramaOptions.map(asrama => (
              <option key={asrama} value={asrama}>{asrama}</option>
            ))}
          </select>
        </div>
        
        <div className="bg-pondok-50 dark:bg-pondok-900/40 px-5 py-2.5 rounded-lg border border-pondok-100 dark:border-pondok-800 flex items-center justify-center shadow-sm">
          <span className="text-sm font-bold text-pondok-700 dark:text-pondok-300">Total: {filteredData.length} Santri</span>
        </div>
      </div>

      <div className="bg-white dark:bg-pondok-950 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 w-full overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#02180b] border-b border-gray-100 dark:border-pondok-900 text-gray-600 dark:text-gray-300">
              <th className="p-4 font-medium w-16">No</th>
              <th className="p-4 font-medium">Asrama (Kamar)</th>
              <th className="p-4 font-medium">Nama Pengurus</th>
              <th className="p-4 font-medium">NIS</th>
              <th className="p-4 font-medium">Nama Santri</th>
              <th className="p-4 font-medium">Kelas</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">Belum ada santri yang masuk asrama ini.</td></tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.santri_id} className="border-b border-gray-50 dark:border-pondok-900/50 hover:bg-gray-50 dark:hover:bg-pondok-900/20">
                  <td className="p-4 text-gray-800 dark:text-gray-200">{index + 1}</td>
                  <td className="p-4 text-gray-900 dark:text-white font-bold bg-gray-50/50 dark:bg-[#02180b]/50">{item.nama_asrama}</td>
                  <td className="p-4 text-pondok-700 dark:text-pondok-400 font-medium">{item.pengurus_nama}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400 font-mono text-sm">{item.nis}</td>
                  <td className="p-4 text-gray-800 dark:text-gray-200 font-medium">{item.nama_santri}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{item.kelas}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}