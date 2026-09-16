"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Santri {
  id: string;
  nama_lengkap: string;
  nis: string;
}

export default function TabelSantri() {
  const [santriList, setSantriList] = useState<Santri[]>([]);
  const [nama, setNama] = useState("");
  const [nis, setNis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const supabase = createClient();

  // Fungsi untuk mengambil data santri
  const fetchSantri = async () => {
    setIsFetching(true);
    const { data, error } = await supabase
      .from("santri")
      .select("id, nama_lengkap, nis")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSantriList(data);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    fetchSantri();
  }, []);

  // Fungsi untuk menambah santri baru
  const handleTambahSantri = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    
    if (userData.user) {
      const { error } = await supabase.from("santri").insert([
        { 
          nama_lengkap: nama, 
          nis: nis,
          pengurus_id: userData.user.id // Kaitkan dengan ID pengurus yang login
        }
      ]);

      if (!error) {
        setNama("");
        setNis("");
        fetchSantri(); // Refresh tabel
      } else {
        alert("Gagal menambahkan data: " + error.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Form Tambah Santri */}
      <form onSubmit={handleTambahSantri} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <Input 
            label="Nama Lengkap Santri" 
            value={nama} 
            onChange={(e) => setNama(e.target.value)} 
            required 
            placeholder="Masukkan nama..."
          />
        </div>
        <div className="flex-1 w-full">
          <Input 
            label="Nomor Induk (NIS)" 
            value={nis} 
            onChange={(e) => setNis(e.target.value)} 
            required 
            placeholder="Masukkan NIS..."
          />
        </div>
        <Button type="submit" isLoading={isLoading} className="w-full md:w-auto pb-2">
          Tambah Data
        </Button>
      </form>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200 dark:border-pondok-800 text-gray-600 dark:text-gray-300">
              <th className="py-3 px-4 font-semibold">No</th>
              <th className="py-3 px-4 font-semibold">NIS</th>
              <th className="py-3 px-4 font-semibold">Nama Lengkap</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">Memuat data...</td>
              </tr>
            ) : santriList.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">Belum ada data santri.</td>
              </tr>
            ) : (
              santriList.map((santri, index) => (
                <tr key={santri.id} className="border-b border-gray-100 dark:border-pondok-900 hover:bg-gray-50 dark:hover:bg-pondok-950/50">
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{santri.nis}</td>
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200 font-medium">{santri.nama_lengkap}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}