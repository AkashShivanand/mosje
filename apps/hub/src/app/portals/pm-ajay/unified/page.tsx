"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/pm-ajay/auth-context";
import { UnifiedDashboard } from "@/components/pm-ajay/dashboard/unified-app";

// basePath ("/portals/pm-ajay") is applied automatically by Next.js to <Link>,
// <Image> and the router — keep in-app paths basePath-relative (empty prefix).
// Prepending the basePath manually doubles it (…/pm-ajay/portals/pm-ajay/…).
const BASE = "/portals/pm-ajay";

export default function Page() {
  const router = useRouter();
  const { account } = useAuth();

  useEffect(() => {
    if (!account) router.replace(`${BASE}/login`);
  }, [account, router]);

  if (!account) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ds-surface-muted)", fontFamily: "var(--font-sans)" }}>
        <span style={{ color: "var(--ds-ink-hint)", fontSize: 14 }}>Redirecting to sign-in…</span>
      </div>
    );
  }

  return <UnifiedDashboard />;
}
