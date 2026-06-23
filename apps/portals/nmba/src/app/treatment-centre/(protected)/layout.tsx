import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TCProviders } from "@/components/treatment-centre/tc-providers";
import { TC_SESSION_COOKIE, decodeSession } from "@/lib/treatment-centre/roles";

export default async function TreatmentCentreProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(TC_SESSION_COOKIE)?.value);

  if (!session) {
    redirect("/treatment-centre/login-otp");
  }

  return <TCProviders session={session}>{children}</TCProviders>;
}
