"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/store/smile-admin/app-context";

export default function RootRedirect() {
  const router = useRouter();
  const { account } = useApp();
  useEffect(() => {
    router.replace(account ? "/portals/smile-admin/dashboard" : "/portals/smile-admin/login");
  }, [account, router]);
  return (
    <div className="grid min-h-dvh place-items-center bg-surface-muted">
      <div className="text-body-2 text-ink-muted">Loading SMILE Admin…</div>
    </div>
  );
}
