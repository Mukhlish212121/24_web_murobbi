import { getDaftarSantri, getDaftarAsrama } from "./actions";
import SantriClient from "./SantriClient";

export default async function DataSantriPage() {
  // Server Component langsung menarik data (Tanpa loading state)
  const [resSantri, resAsrama] = await Promise.all([
    getDaftarSantri(), 
    getDaftarAsrama()
  ]);

  return (
    <SantriClient 
      initialSantri={resSantri.data || []} 
      initialAsrama={resAsrama.data || []} 
    />
  );
}