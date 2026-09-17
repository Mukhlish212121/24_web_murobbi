import { getDaftarSantri, getDaftarAsrama } from "./actions";
import SantriClient from "./SantriClient";

export default async function DataSantriPage() {
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