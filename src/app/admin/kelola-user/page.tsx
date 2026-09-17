import { getDaftarUser } from "./actions";
import UserClient from "./UserClient";

export default async function KelolaUserPage() {
  // Mengambil data user secara instan dari server
  const res = await getDaftarUser();

  return (
    <UserClient initialUsers={res.users || []} />
  );
}