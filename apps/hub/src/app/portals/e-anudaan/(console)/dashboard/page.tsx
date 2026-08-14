"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

/** Bare /dashboard sends each role to its own landing screen. */
export default function EAnudaanDashboardIndex() {
  const router = useRouter();
  const { state, hydrated } = useEAnudaan();

  React.useEffect(() => {
    if (!hydrated) return;
    const role = state.session && state.session !== "ngo" ? ROLES[state.session] : null;
    router.replace(role ? role.home : "/portals/e-anudaan/login");
  }, [hydrated, state.session, router]);

  return null;
}
