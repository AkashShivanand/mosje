"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-context";
import { UnifiedDashboard } from "@/components/dashboard/unified-app";

// basePath ("/portals/pm-ajay") is applied automatically by Next.js to <Link>,
// <Image> and the router — keep in-app paths basePath-relative (empty prefix).
// Prepending the basePath manually doubles it (…/pm-ajay/portals/pm-ajay/…).
const BASE = "";

export default function Page() {
  const router = useRouter();
  const { account } = useAuth();

  useEffect(() => {
    if (!account) router.replace(`${BASE}/login`);
  }, [account, router]);

  if (!account) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F4F9", fontFamily: "var(--font-sans)" }}>
        <span style={{ color: "#8fa0b4", fontSize: 14 }}>Redirecting to sign-in…</span>
      </div>
    );
  }

  return <UnifiedDashboard />;
}
