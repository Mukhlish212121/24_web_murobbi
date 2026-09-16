"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { buatAkunPengurus, getDaftarUser, perbaruiUser } from "./actions";

type UserData = { id: string; full_name: string; email: string; role: string };

export default function KelolaUserPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [pesan, setPesan] = useState({ tipe: "", teks: "" });
  
  // State untuk Daftar User
  const [users, setUsers] = useState<UserData[]>([]);
  
  // State untuk Modal Tambah & Edit
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);

  // Ambil data user saat halaman dimuat
  const fetchUsers = async () => {
    const res = await getDaftarUser();
    if (res.users) setUsers(res.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler Tambah User
  const handleTambah = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPesan({ tipe: "", teks: "" });

    const result = await buatAkunPengurus(new FormData(e.currentTarget));
    if (result.error) {
      setPesan({ tipe: "error", teks: result.error });
    } else {
      setPesan({ tipe: "sukses", teks: "User berhasil dibuat!" });
      (e.target as HTMLFormElement).reset();
      fetchUsers(); // Refresh tabel
      
      // Tutup modal setelah 1.5 detik jika sukses
      setTimeout(() => {
        setIsAddModalOpen(false);
        setPesan({ tipe: "", teks: "" });
      }, 1500);
    }
    setIsLoading(false);
  };

  // Handler Buka Modal Edit
  const openEditModal = (user: UserData) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handler Simpan Edit
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditLoading(true);
    
    const result = await perbaruiUser(new FormData(e.currentTarget));
    if (result.error) {
      alert("Gagal: " + result.error);
    } else {
      setIsEditModalOpen(false);
      fetchUsers(); // Refresh tabel setelah edit
    }
    setIsEditLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl w-full">
      
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

      {/* TABEL DAFTAR USER (RESPONSIF UNTUK HP) */}
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
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 dark:border-pondok-900/50 hover:bg-gray-50 dark:hover:bg-pondok-900/20">
                <td className="p-4 text-gray-800 dark:text-gray-200">{user.full_name}</td>
                <td className="p-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-pondok-100 text-pondok-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
                    Edit Data
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL POP-UP TAMBAH USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Tambah Pengurus Baru</h3>
              <button onClick={() => { setIsAddModalOpen(false); setPesan({tipe: "", teks: ""}); }} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleTambah} className="p-5 space-y-4">
              <Input name="fullName" label="Nama Lengkap" placeholder="Ust. Fulan" required />
              <Input name="email" label="Email" type="email" placeholder="fulan@pondok.com" required />
              <Input name="password" label="Password" type="password" placeholder="Minimal 6 karakter" required minLength={6} />
              
              {pesan.teks && (
                <div className={`p-3 rounded-lg text-sm border ${pesan.tipe === "error" ? "bg-red-50 text-red-600 border-red-200" : "bg-pondok-50 text-pondok-700 border-pondok-200"}`}>
                  {pesan.teks}
                </div>
              )}

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-pondok-950 w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-pondok-900">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-pondok-900">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Edit Data User</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={handleEdit} className="p-5 space-y-4">
              <input type="hidden" name="id" value={selectedUser.id} />
              <Input name="fullName" label="Nama Lengkap" defaultValue={selectedUser.full_name} required />
              <Input name="email" label="Email" type="email" defaultValue={selectedUser.email} required />
              
              <div className="bg-gray-50 dark:bg-[#02180b] p-3 rounded-lg border border-gray-100 dark:border-pondok-900">
                <Input name="password" label="Ganti Password Baru" type="text" placeholder="Kosongkan jika tidak ingin ganti password" minLength={6} />
                <p className="text-xs text-gray-500 mt-1">*Bisa diisi jika user lupa password.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                <Button type="submit" isLoading={isEditLoading}>Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}