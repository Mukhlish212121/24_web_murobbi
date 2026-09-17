"use client";

import { useState, useMemo } from "react";

type SantriBinaan = { 
  id: string; 
  nis: string; 
  nama_santri: string; 
  kategori_asrama: string; 
  jenjang: string; 
  kelas: string; 
  nama_asrama: string;
};

const KELAS_MAP = {
  RG: { SMA: ["10A", "11A", "12A"], MTs: ["7A", "7B", "8A", "8B", "9A", "9B"] },
  UG: { SMA: ["10B", "11B", "12B"], MTs: ["7C", "7D", "8C", "8D", "9C", "9D"] }
};

export default function SantriBinaanClient({ initialSantri }: { initialSantri: SantriBinaan[] }) {
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterJenjang, setFilterJenjang] = useState("Semua");
  const [filterKelas, setFilterKelas] = useState("Semua");

  const filteredSantri = useMemo(() => {
    return initialSantri.filter(santri => {
      const matchKategori = filterKategori === "Semua" || santri.kategori_asrama === filterKategori;
      const matchJenjang = filterJenjang === "Semua" || santri.jenjang === filterJenjang;
      const matchKelas = filterKelas === "Semua" || santri.kelas === filterKelas;
      return matchKategori && matchJenjang && matchKelas;
    });
  }, [initialSantri, filterKategori, filterJenjang, filterKelas]);

  // Ekstrak nama asrama (Karena 1 pengurus biasanya memegang 1 asrama)
  const namaAsramaPengurus = initialSantri.length > 0 ? initialSantri[0].nama_asrama : "Asrama Anda";

  return (
    <div className="space-y-6 max-w-7xl w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Santri Binaan</h1>
          <p className="text-sm text-gray-500">
            Daftar santri yang ditempatkan di <span className="font-bold text-pondok-600 dark:text-pondok-400">{namaAsramaPengurus}</span>.
          </p>
        </div>
      </div>

      {/* KOTAK FILTER */}
      <div className="bg-white dark:bg-pondok-950 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
          
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jenis Kelamin</label>
            <select value={filterKategori} onChange={(e) => { setFilterKategori(e.target.value); setFilterKelas("Semua"); }} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-800 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer transition-all">
              <option value="Semua">Semua</option>
              <option value="RG">RG (Laki-laki)</option>
              <option value="UG">UG (Perempuan)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jenjang</label>
            <select value={filterJenjang} onChange={(e) => { setFilterJenjang(e.target.value); setFilterKelas("Semua"); }} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-800 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer transition-all">
              <option value="Semua">Semua Jenjang</option>
              <option value="SMA">SMA</option>
              <option value="MTs">MTs</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kelas</label>
            <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-800 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all" disabled={filterKategori === "Semua" || filterJenjang === "Semua"}>
              <option value="Semua">Semua Kelas</option>
              {filterKategori !== "Semua" && filterJenjang !== "Semua" && KELAS_MAP[filterKategori as "RG"|"UG"][filterJenjang as "SMA"|"MTs"].map(kls => (<option key={kls} value={kls}>{kls}</option>))}
            </select>
          </div>

        </div>

        <div className="bg-pondok-50 dark:bg-pondok-900/40 px-5 py-2.5 rounded-lg border border-pondok-100 dark:border-pondok-800 flex items-center justify-center shadow-sm whitespace-nowrap">
          <span className="text-sm font-bold text-pondok-700 dark:text-pondok-300">Total: {filteredSantri.length} Santri</span>
        </div>
      </div>

      {/* TABEL SANTRI BINAAN (READ ONLY) */}
      <div className="bg-white dark:bg-pondok-950 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 w-full overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#02180b] border-b border-gray-100 dark:border-pondok-900 text-gray-600 dark:text-gray-400">
              <th className="p-4 font-medium w-16">No</th>
              <th className="p-4 font-medium">NIS</th>
              <th className="p-4 font-medium">Nama Santri</th>
              <th className="p-4 font-medium text-center">Jenis Kelamin</th>
              <th className="p-4 font-medium text-center">Kelas</th>
              <th className="p-4 font-medium text-center">Asrama</th>
            </tr>
          </thead>
          <tbody>
            {filteredSantri.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">Belum ada data santri yang ditugaskan ke asrama Anda.</td></tr>
            ) : (
              filteredSantri.map((santri, index) => (
                <tr key={santri.id} className="border-b border-gray-50 dark:border-pondok-900/50 hover:bg-gray-50 dark:hover:bg-pondok-900/20 transition-colors">
                  <td className="p-4 text-gray-800 dark:text-gray-300">{index + 1}</td>
                  <td className="p-4 text-gray-800 dark:text-gray-300 font-mono text-sm">{santri.nis}</td>
                  <td className="p-4 text-gray-900 dark:text-gray-100 font-semibold">{santri.nama_santri}</td>
                  
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md tracking-wider ${santri.kategori_asrama === 'RG' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50' : 'bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border border-pink-100 dark:border-pink-800/50'}`}>
                      {santri.kategori_asrama}
                    </span>
                  </td>
                  
                  <td className="p-4 text-center text-gray-800 dark:text-gray-200 font-bold">{santri.kelas}</td>
                  <td className="p-4 text-center text-gray-800 dark:text-gray-300 text-sm">{santri.nama_asrama}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}