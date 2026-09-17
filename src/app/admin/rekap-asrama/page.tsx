import { getRekapAsrama } from "./actions";
import RekapClient from "./RekapClient";

export default async function RekapAsramaPage() {
  const res = await getRekapAsrama();

  return (
    <RekapClient initialData={res.data || []} />
  );
}