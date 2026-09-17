"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { tambahAsrama, editAsrama, hapusAsrama } from "./actions";

type Akun = { id: string; full_name: string; email: string };
type Asrama = { id: string; nama_asrama: string; pengurus_id: string; pengurus_nama: string; pengurus_email: string };

export default function AsramaClient({ initialAsrama, initialAkun }: { initialAsrama: Asrama[], initialAkun: Akun[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [notif, setNotif] = useState({ tipe: "", teks: "", tampil: false });
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [selectedAsrama, setSelectedAsrama] = useState<Asrama | null>(null);

  const tampilkanNotif = (tipe: "sukses" | "error", teks: string) => {
    setNotif({ tipe, teks, tampil: true });
    setTimeout(() => setNotif((prev) => ({ ...prev, tampil: false })), 3000);
  };

  const openEditModal = (asrama: Asrama) => {
    setSelectedAsrama(asrama);
    setIsEditOpen(true);
  };

  const openDeleteModal = (asrama: Asrama) => {
    setSelectedAsrama(asrama);
    setIsDeleteOpen(true);
  };

  // Tidak perlu memanggil fetchData() lagi karena initialAsrama akan otomatis 
  // diperbarui oleh Next.js berkat revalidatePath di file actions.ts
  const handleTambah = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await tambahAsrama(new FormData(e.currentTarget));
    
    if (result.error) tampilkanNotif("error", result.error);
    else {
      setIsAddOpen(false);
      tampilkanNotif("sukses", "Asrama berhasil ditambahkan!");
    }
    setIsLoading(false);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await editAsrama(new FormData(e.currentTarget));
    
    if (result.error) tampilkanNotif("error", result.error);
    else {
      setIsEditOpen(false);
      tampilkanNotif("sukses", "Data Asrama berhasil diperbarui!");
    }
    setIsLoading(false);
  };

  const executeDelete = async () => {
    if (!selectedAsrama) return;
    setIsLoading(true);
    const result = await hapusAsrama(selectedAsrama.id);
    
    if (result.error) tampilkanNotif("error", "Gagal menghapus: " + result.error);
    else {
      tampilkanNotif("sukses", `Asrama ${selectedAsrama.nama_asrama} dihapus!`);
    }
    setIsDeleteOpen(false);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl w-full relative">
      
      {notif.tampil && (
        <div className={`fixed top-5 right-5 z-100 px-5 py-3 rounded-xl shadow-lg border transition-all duration-300 flex items-center gap-3 ${
          notif.tipe === "sukses" ? "bg-green-50 border-green-200 text-green-700 dark:bg-pondok-950 dark:border-green-800 dark:text-green-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-pondok-950 dark:border-red-900 dark:text-red-400"
        }`}>
          <span className="font-medium text-sm">{notif.teks}</span>
          <button onClick={() => setNotif(prev => ({...prev, tampil: false}))} className="text-xl font-bold opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Asrama</h1>
          <p className="text-sm text-gray-500">Manajemen data asrama dan penempatan pengurus.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>+ Tambah Asrama</Button>
      </div>

      <div className="bg-white dark:bg-pondok-950 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 w-full overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#02180b] border-b border-gray-100 dark:border-pondok-900 text-gray-600 dark:text-gray-300">
              <th className="p-4 font-medium w-16">No</th>
              <th className="p-4 font-medium">Nama Asrama</th>
              <th className="p-4 font-medium">Pengurus</th>
              <th className="p-4 font-medium">Email Akun</th>
              <th className="p-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {initialAsrama.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Belum ada data asrama.</td></tr>
            ) : (
              initialAsrama.map((asrama, index) => (
                <tr key={asrama.id} className="border-b border-gray-50 dark:border-pondok-900/50 hover:bg-gray-50 dark:hover:bg-pondok-900/20">
                  <td className="p-4 text-gray-800 dark:text-gray-200">{index + 1}</td>
                  <td className="p-4 text-gray-800 dark:text-gray-200 font-bold">{asrama.nama_asrama}</td>
                  <td className="p-4 text-gray-800 dark:text-gray-200">{asrama.pengurus_nama}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{asrama.pengurus_email}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(asrama)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => openDeleteModal(asrama)}>Hapus</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL TAMBAH */}
      {isAddOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Tambah Asrama</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleTambah} className="p-5 space-y-4">
              <Input name="namaAsrama" label="Nama Asrama (Kamar)" placeholder="Contoh: Asrama Abu Bakar" required />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Pengurus</label>
                <select name="pengurusId" className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                  <option value="">-- Pilih Pengurus (Opsional) --</option>
                  {initialAkun.map(akun => (
                    <option key={akun.id} value={akun.id}>{akun.full_name} ({akun.email})</option>
                  ))}
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

      {/* MODAL EDIT */}
      {isEditOpen && selectedAsrama && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Asrama</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4">
              <input type="hidden" name="id" value={selectedAsrama.id} />
              <Input name="namaAsrama" label="Nama Asrama" defaultValue={selectedAsrama.nama_asrama} required />
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Pengurus</label>
                <select name="pengurusId" defaultValue={selectedAsrama.pengurus_id || ""} className="w-full px-3 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg focus:ring-2 focus:ring-pondok-500">
                  <option value="">-- Kosongkan Pengurus --</option>
                  {initialAkun.map(akun => (
                    <option key={akun.id} value={akun.id}>{akun.full_name} ({akun.email})</option>
                  ))}
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

      {/* MODAL HAPUS */}
      {isDeleteOpen && selectedAsrama && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900 text-center">
            <div className="p-6 space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hapus <span className="font-bold text-gray-900 dark:text-white">"{selectedAsrama.nama_asrama}"</span>?
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-[#02180b] px-6 py-4 flex justify-center gap-3 border-t border-gray-100 dark:border-pondok-900">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
              <button onClick={executeDelete} disabled={isLoading} className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none disabled:opacity-50">
                {isLoading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}