import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE = "/portals/nmba";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("nmba_admin_session");

  if (!session?.value) {
    redirect(`${BASE}/admin/login`);
  }

  return <>{children}</>;
}
