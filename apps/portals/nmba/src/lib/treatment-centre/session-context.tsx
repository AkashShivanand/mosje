"use client";

// Exposes the authenticated Treatment-Centre session (role, center) to client
// components. Hydrated by the protected layout, which reads the cookie server-side.

import * as React from "react";
import type { TCSession } from "./types";

const TCSessionContext = React.createContext<TCSession | null>(null);

export function TCSessionProvider({
  session,
  children,
}: {
  session: TCSession;
  children: React.ReactNode;
}) {
  return <TCSessionContext.Provider value={session}>{children}</TCSessionContext.Provider>;
}

export function useTCSession(): TCSession {
  const ctx = React.useContext(TCSessionContext);
  if (!ctx) throw new Error("useTCSession must be used within a TCSessionProvider");
  return ctx;
}
