"use client";

import * as React from "react";
import { TCSessionProvider } from "@/lib/treatment-centre/session-context";
import { TCStoreProvider } from "@/lib/treatment-centre/store";
import { TreatmentCentreShell } from "./tc-shell";
import type { TCSession } from "@/lib/treatment-centre/types";

export function TCProviders({
  session,
  children,
}: {
  session: TCSession;
  children: React.ReactNode;
}) {
  return (
    <TCSessionProvider session={session}>
      <TCStoreProvider>
        <TreatmentCentreShell>{children}</TreatmentCentreShell>
      </TCStoreProvider>
    </TCSessionProvider>
  );
}
