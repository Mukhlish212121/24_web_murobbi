import { getDaftarAsrama, getDaftarAkun } from "./actions";
import AsramaClient from "./AsramaClient";

export default async function AsramaPage() {
  // Mengambil data secara paralel dan instan dari server
  const [resAsrama, resAkun] = await Promise.all([
    getDaftarAsrama(),
    getDaftarAkun()
  ]);

  return (
    <AsramaClient 
      initialAsrama={resAsrama.data || []} 
      initialAkun={resAkun.data || []} 
    />
  );
}