"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buatAkunPengurus, perbaruiUser, hapusUser } from "./actions";

type UserData = { id: string; full_name: string; email: string; role: string };

export default function UserClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [notif, setNotif] = useState({ tipe: "", teks: "", tampil: false });
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

  const tampilkanNotif = (tipe: "sukses" | "error", teks: string) => {
    setNotif({ tipe, teks, tampil: true });
    setTimeout(() => setNotif((prev) => ({ ...prev, tampil: false })), 3000);
  };

  const openEditModal = (user: UserData) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: UserData) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleTambah = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await buatAkunPengurus(new FormData(e.currentTarget));
    
    if (result.error) {
      tampilkanNotif("error", result.error);
    } else {
      setIsAddModalOpen(false);
      tampilkanNotif("sukses", "Akun user berhasil dibuat!");
    }
    setIsLoading(false);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await perbaruiUser(new FormData(e.currentTarget));
    
    if (result.error) {
      tampilkanNotif("error", result.error);
    } else {
      setIsEditModalOpen(false);
      tampilkanNotif("sukses", "Data user berhasil diperbarui!");
    }
    setIsLoading(false);
  };

  const executeDelete = async () => {
    if (!userToDelete) return;
    setIsLoading(true);
    const result = await hapusUser(userToDelete.id);
    
    if (result.error) {
      tampilkanNotif("error", "Gagal menghapus: " + result.error);
    } else {
      tampilkanNotif("sukses", `User ${userToDelete.full_name} berhasil dihapus!`);
    }
    
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl w-full relative">
      
      {/* NOTIFIKASI MELAYANG (TOAST) KONSISTEN */}
      {notif.tampil && (
        <div className={`fixed top-5 right-5 z-100 px-5 py-3 rounded-xl shadow-lg border transition-all duration-300 flex items-center gap-3 ${
          notif.tipe === "sukses" ? "bg-green-50 border-green-200 text-green-700 dark:bg-pondok-950 dark:border-green-800 dark:text-green-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-pondok-950 dark:border-red-900 dark:text-red-400"
        }`}>
          <span className="font-medium text-sm">{notif.teks}</span>
          <button onClick={() => setNotif(prev => ({...prev, tampil: false}))} className="text-xl font-bold opacity-70 hover:opacity-100">&times;</button>
        </div>
      )}

      {/* HEADER & TOMBOL TAMBAH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Akun User</h1>
          <p className="text-sm text-gray-500">Daftar admin dan pengurus pondok pesantren.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          + Tambah Pengurus
        </Button>
      </div>

      {/* TABEL DAFTAR USER */}
      <div className="bg-white dark:bg-pondok-950 rounded-xl shadow-sm border border-gray-100 dark:border-pondok-900 w-full overflow-x-auto">
        <table className="w-full min-w-175 text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#02180b] border-b border-gray-100 dark:border-pondok-900 text-gray-600 dark:text-gray-300">
              <th className="p-4 font-medium">Nama Lengkap</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Hak Akses</th>
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Belum ada data user.</td></tr>
            ) : (
              initialUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 dark:border-pondok-900/50 hover:bg-gray-50 dark:hover:bg-pondok-900/20">
                  <td className="p-4 text-gray-800 dark:text-gray-200">{user.full_name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-pondok-100 text-pondok-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => openDeleteModal(user)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL POP-UP TAMBAH USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Tambah Pengurus Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleTambah} className="p-5 space-y-4">
              <Input name="fullName" label="Nama Lengkap" placeholder="Ust. Fulan" required />
              <Input name="email" label="Email" type="email" placeholder="fulan@pondok.com" required />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hak Akses</label>
                <select name="role" required className="w-full px-4 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pondok-500">
                  <option value="pengurus">Pengurus</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <Input name="password" label="Password" type="password" placeholder="Minimal 6 karakter" required minLength={6} />
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                <Button type="submit" isLoading={isLoading}>Buat Akun</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL POP-UP EDIT USER */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Data User</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4">
              <input type="hidden" name="id" value={selectedUser.id} />
              <Input name="fullName" label="Nama Lengkap" defaultValue={selectedUser.full_name} required />
              <Input name="email" label="Email" type="email" defaultValue={selectedUser.email} required />
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hak Akses</label>
                <select name="role" defaultValue={selectedUser.role} required className="w-full px-4 py-2 bg-white dark:bg-[#02180b] border border-gray-300 dark:border-pondok-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pondok-500">
                  <option value="pengurus">Pengurus</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#02180b] p-3 rounded-lg border border-gray-100 dark:border-pondok-900">
                <Input name="password" label="Ganti Password Baru" type="text" placeholder="Kosongkan jika tidak diganti" minLength={6} />
                <p className="text-xs text-gray-500 mt-1">*Bisa diisi jika user lupa password.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                <Button type="submit" isLoading={isLoading}>Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS USER */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900 text-center">
            <div className="p-6 space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">Konfirmasi Hapus</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hapus akun <span className="font-bold text-gray-900 dark:text-white">"{userToDelete.full_name}"</span> secara permanen?
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-[#02180b] px-6 py-4 flex justify-center gap-3 border-t border-gray-100 dark:border-pondok-900">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
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