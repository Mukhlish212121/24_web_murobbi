"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { tambahSantri, editSantri, hapusSantri, setAsramaSantri } from "./actions";

type Santri = { id: string; nis: string; nama_santri: string; kategori_asrama: string; jenjang: string; kelas: string; asrama_id?: string; nama_asrama?: string };
type Asrama = { id: string; nama_asrama: string };

const KELAS_MAP = {
  RG: { SMA: ["10A", "11A", "12A"], MTs: ["7A", "7B", "8A", "8B", "9A", "9B"] },
  UG: { SMA: ["10B", "11B", "12B"], MTs: ["7C", "7D", "8C", "8D", "9C", "9D"] }
};

export default function SantriClient({ initialSantri, initialAsrama }: { initialSantri: Santri[], initialAsrama: Asrama[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [notif, setNotif] = useState({ tipe: "", teks: "", tampil: false });
  
  // State Filter
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterJenjang, setFilterJenjang] = useState("Semua");
  const [filterKelas, setFilterKelas] = useState("Semua");
  const [filterStatusAsrama, setFilterStatusAsrama] = useState("Semua");
  const [filterAsrama, setFilterAsrama] = useState("Semua"); 

  // State Form & Modals
  const [formKategori, setFormKategori] = useState<"RG" | "UG">("RG");
  const [formJenjang, setFormJenjang] = useState<"SMA" | "MTs">("MTs");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); 
  const [isAssignOpen, setIsAssignOpen] = useState(false); 
  
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [santriToDelete, setSantriToDelete] = useState<{ id: string; nama: string } | null>(null);

  const tampilkanNotif = (tipe: "sukses" | "error", teks: string) => {
    setNotif({ tipe, teks, tampil: true });
    setTimeout(() => setNotif((prev) => ({ ...prev, tampil: false })), 3000);
  };

  const filteredSantri = useMemo(() => {
    return initialSantri.filter(santri => {
      const matchKategori = filterKategori === "Semua" || santri.kategori_asrama === filterKategori;
      const matchJenjang = filterJenjang === "Semua" || santri.jenjang === filterJenjang;
      const matchKelas = filterKelas === "Semua" || santri.kelas === filterKelas;
      const matchStatusAsrama = 
        filterStatusAsrama === "Semua" || 
        (filterStatusAsrama === "Belum" && !santri.asrama_id) || 
        (filterStatusAsrama === "Sudah" && santri.asrama_id);
      const matchAsrama = filterAsrama === "Semua" || santri.asrama_id === filterAsrama;

      return matchKategori && matchJenjang && matchKelas && matchStatusAsrama && matchAsrama;
    });
  }, [initialSantri, filterKategori, filterJenjang, filterKelas, filterStatusAsrama, filterAsrama]);

  const openAddModal = () => { setFormKategori("RG"); setFormJenjang("MTs"); setIsAddOpen(true); };
  const openEditModal = (santri: Santri) => { setFormKategori((santri.kategori_asrama as "RG" | "UG") || "RG"); setFormJenjang((santri.jenjang as "SMA" | "MTs") || "MTs"); setSelectedSantri(santri); setIsEditOpen(true); };
  const openDeleteModal = (id: string, nama: string) => { setSantriToDelete({ id, nama }); setIsDeleteOpen(true); };
  const openAssignModal = (santri: Santri) => { setSelectedSantri(santri); setIsAssignOpen(true); };

  const handleAction = async (actionFn: Function, formData: FormData, successMsg: string, setModalOpen: Function) => {
    setIsLoading(true);
    const result = await actionFn(formData);
    if (result.error) tampilkanNotif("error", result.error);
    else { setModalOpen(false); tampilkanNotif("sukses", successMsg); }
    setIsLoading(false);
  };

  const handleTambah = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleAction(tambahSantri, new FormData(e.currentTarget), "Data berhasil ditambahkan!", setIsAddOpen); };
  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleAction(editSantri, new FormData(e.currentTarget), "Data berhasil diperbarui!", setIsEditOpen); };
  const handleSetAsrama = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleAction(setAsramaSantri, new FormData(e.currentTarget), "Penempatan asrama diperbarui!", setIsAssignOpen); };
  
  const executeDelete = async () => {
    if (!santriToDelete) return;
    setIsLoading(true);
    const result = await hapusSantri(santriToDelete.id);
    if (result.error) tampilkanNotif("error", "Gagal menghapus: " + result.error);
    else { tampilkanNotif("sukses", `Santri ${santriToDelete.nama} berhasil dihapus!`); }
    setIsDeleteOpen(false); setSantriToDelete(null); setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl w-full relative">
      {/* Toast Notifikasi */}
      {notif.tampil && (
        <div className={`fixed top-5 right-5 z-100 px-5 py-3 rounded-xl shadow-lg border transition-all duration-300 flex items-center gap-3 ${
          notif.tipe === "sukses" ? "bg-green-50 border-green-200 text-green-700 dark:bg-pondok-950 dark:border-green-800 dark:text-green-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-pondok-950 dark:border-red-900 dark:text-red-400"
        }`}>
          <span className="font-medium text-sm">{notif.teks}</span>
          <button onClick={() => setNotif(prev => ({...prev, tampil: false}))} className="text-xl font-bold opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Santri</h1>
          <p className="text-sm text-gray-500">Kelola data santri, kelas, dan penempatan asrama.</p>
        </div>
        <Button onClick={openAddModal}>+ Tambah Santri</Button>
      </div>

      {/* Filter Responsif 5 Kolom */}
      {/* Filter Responsif 5 Kolom */}
      <div className="bg-white dark:bg-pondok-950 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="flex flex-wrap md:flex-nowrap items-stretch md:items-center gap-4 w-full">
          
          <div className="flex flex-col gap-1.5 flex-1 min-w-35">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jenis Kelamin</label>
            <select value={filterKategori} onChange={(e) => { setFilterKategori(e.target.value); setFilterKelas("Semua"); }} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-800 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer">
              <option value="Semua">Semua</option>
              <option value="RG">RG (Laki-laki)</option>
              <option value="UG">UG (Perempuan)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-35">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jenjang</label>
            <select value={filterJenjang} onChange={(e) => { setFilterJenjang(e.target.value); setFilterKelas("Semua"); }} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-800 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer">
              <option value="Semua">Semua Jenjang</option>
              <option value="SMA">SMA</option>
              <option value="MTs">MTs</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-30">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kelas</label>
            <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-800 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer disabled:opacity-50" disabled={filterKategori === "Semua" || filterJenjang === "Semua"}>
              <option value="Semua">Semua Kelas</option>
              {filterKategori !== "Semua" && filterJenjang !== "Semua" && KELAS_MAP[filterKategori as "RG"|"UG"][filterJenjang as "SMA"|"MTs"].map(kls => (<option key={kls} value={kls}>{kls}</option>))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-35">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status Asrama</label>
            <select value={filterStatusAsrama} onChange={(e) => { setFilterStatusAsrama(e.target.value); if(e.target.value === "Belum") setFilterAsrama("Semua"); }} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-800 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer">
              <option value="Semua">Semua Status</option>
              <option value="Belum">Belum Masuk Asrama</option>
              <option value="Sudah">Sudah Ada Asrama</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-40">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pilih Asrama</label>
            <select value={filterAsrama} onChange={(e) => { setFilterAsrama(e.target.value); if(e.target.value !== "Semua") setFilterStatusAsrama("Sudah"); }} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#02180b] border border-gray-200 dark:border-pondok-800 rounded-lg text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pondok-500 cursor-pointer disabled:opacity-50" disabled={filterStatusAsrama === "Belum"}>
              <option value="Semua">Semua Asrama</option>
              {initialAsrama.map(asrama => (<option key={asrama.id} value={asrama.id}>{asrama.nama_asrama}</option>))}
            </select>
          </div>
        </div>

        <div className="bg-pondok-50 dark:bg-pondok-900/40 px-5 py-2.5 rounded-lg border border-pondok-100 dark:border-pondok-800 flex items-center justify-center shadow-sm whitespace-nowrap mt-4 lg:mt-0">
          <span className="text-sm font-bold text-pondok-700 dark:text-pondok-300">Total: {filteredSantri.length} Santri</span>
        </div>
      </div>

      {/* Tabel Data Santri */}
      <div className="bg-white dark:bg-pondok-950 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 w-full overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#02180b] border-b border-gray-100 dark:border-pondok-900 text-gray-600 dark:text-gray-400">
              <th className="p-4 font-medium w-16">No</th>
              <th className="p-4 font-medium">NIS</th>
              <th className="p-4 font-medium">Nama Santri</th>
              <th className="p-4 font-medium text-center">Jenis Kelamin</th>
              <th className="p-4 font-medium text-center">Kelas</th>
              <th className="p-4 font-medium">Asrama (Kamar)</th>
              <th className="p-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSantri.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">Tidak ada santri yang sesuai dengan filter.</td></tr>
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
                  
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {santri.nama_asrama ? (
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-sm">{santri.nama_asrama}</span>
                      ) : (
                        <span className="text-red-700 text-xs font-semibold bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800/50 px-2 py-1 rounded-md">Belum Asrama</span>
                      )}
                      <button onClick={() => openAssignModal(santri)} className="flex items-center justify-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider bg-pondok-50 dark:bg-pondok-900/40 text-pondok-700 dark:text-pondok-300 rounded-full border border-pondok-100 dark:border-pondok-800 hover:bg-pondok-100 dark:hover:bg-pondok-800 hover:text-pondok-800 dark:hover:text-white transition-all">
                        {santri.nama_asrama ? "Ubah" : "+ Pilih"}
                      </button>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2">
                      <button onClick={() => openEditModal(santri)} className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">Edit</button>
                      <button onClick={() => openDeleteModal(santri.id, santri.nama_santri)} className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800/30 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Atur Asrama */}
      {isAssignOpen && selectedSantri && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Penempatan Asrama</h3>
              <button onClick={() => setIsAssignOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleSetAsrama} className="p-5 space-y-4">
              <input type="hidden" name="id" value={selectedSantri.id} />
              <div className="bg-gray-50 dark:bg-[#02180b] p-3 rounded-lg border border-gray-100 dark:border-pondok-900 mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">Nama Santri</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedSantri.nama_santri}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Kamar / Asrama</label>
                <select name="asramaId" defaultValue={selectedSantri.asrama_id || ""} className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                  <option value="">-- Kosongkan (Keluarkan dari Asrama) --</option>
                  {initialAsrama.map(asrama => (<option key={asrama.id} value={asrama.id}>{asrama.nama_asrama}</option>))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAssignOpen(false)}>Batal</Button>
                <Button type="submit" isLoading={isLoading}>Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Santri */}
      {isAddOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Tambah Data Santri</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleTambah} className="p-5 space-y-4">
              <Input name="nis" label="Nomor Induk Santri (NIS)" required />
              <Input name="namaSantri" label="Nama Lengkap" required />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
                  <select name="kategoriAsrama" value={formKategori} onChange={(e) => setFormKategori(e.target.value as "RG"|"UG")} className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                    <option value="RG">RG (Laki-laki)</option><option value="UG">UG (Perempuan)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenjang</label>
                  <select name="jenjang" value={formJenjang} onChange={(e) => setFormJenjang(e.target.value as "SMA"|"MTs")} className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                    <option value="SMA">SMA</option><option value="MTs">MTs</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
                <select name="kelas" required className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                  {KELAS_MAP[formKategori][formJenjang].map(kls => (<option key={kls} value={kls}>{kls}</option>))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                <Button type="submit" isLoading={isLoading}>Simpan Data</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Santri */}
      {isEditOpen && selectedSantri && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Data Santri</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4">
              <input type="hidden" name="id" value={selectedSantri.id} />
              <Input name="nis" label="Nomor Induk Santri (NIS)" defaultValue={selectedSantri.nis} required />
              <Input name="namaSantri" label="Nama Lengkap" defaultValue={selectedSantri.nama_santri} required />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
                  <select name="kategoriAsrama" value={formKategori} onChange={(e) => setFormKategori(e.target.value as "RG"|"UG")} className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                    <option value="RG">RG (Laki-laki)</option><option value="UG">UG (Perempuan)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenjang</label>
                  <select name="jenjang" value={formJenjang} onChange={(e) => setFormJenjang(e.target.value as "SMA"|"MTs")} className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                    <option value="SMA">SMA</option><option value="MTs">MTs</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kelas</label>
                <select name="kelas" defaultValue={selectedSantri.kelas} required className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                  {KELAS_MAP[formKategori][formJenjang].map(kls => (<option key={kls} value={kls}>{kls}</option>))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Batal</Button>
                <Button type="submit" isLoading={isLoading}>Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {isDeleteOpen && santriToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900 text-center">
            <div className="p-6 space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Yakin menghapus data <span className="font-bold text-gray-900 dark:text-white">"{santriToDelete.nama}"</span>?</p>
            </div>
            <div className="bg-gray-50 dark:bg-[#02180b] px-6 py-4 flex justify-center gap-3 border-t border-gray-100 dark:border-pondok-900">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
              <button onClick={executeDelete} disabled={isLoading} className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50">
                {isLoading ? "Menghapus..." : "Ya, Hapus Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}