import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PortalSessionProvider } from "@/lib/nmba/committee/session-context";
import { CommitteeStoreProvider } from "@/lib/nmba/committee/store";
import { PORTAL_SESSION_COOKIE, decodeSession } from "@/lib/nmba/committee/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(PORTAL_SESSION_COOKIE)?.value);

  if (!session) {
    redirect("/portals/nmba/admin/login");
  }

  return (
    <PortalSessionProvider session={session}>
      <CommitteeStoreProvider>{children}</CommitteeStoreProvider>
    </PortalSessionProvider>
  );
}
