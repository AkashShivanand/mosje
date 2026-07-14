"use client";

// Exposes the authenticated portal session (role + scope) to client components.
// Hydrated by the admin protected layout, which reads the cookie server-side.

import * as React from "react";
import type { PortalSession } from "./types";

const PortalSessionContext = React.createContext<PortalSession | null>(null);

export function PortalSessionProvider({
  session,
  children,
}: {
  session: PortalSession;
  children: React.ReactNode;
}) {
  return <PortalSessionContext.Provider value={session}>{children}</PortalSessionContext.Provider>;
}

export function usePortalSession(): PortalSession {
  const ctx = React.useContext(PortalSessionContext);
  if (!ctx) throw new Error("usePortalSession must be used within a PortalSessionProvider");
  return ctx;
}
