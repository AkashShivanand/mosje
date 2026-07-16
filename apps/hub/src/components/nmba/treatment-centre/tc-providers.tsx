"use client";

import * as React from "react";
import { TCSessionProvider } from "@/lib/nmba/treatment-centre/session-context";
import { TCStoreProvider } from "@/lib/nmba/treatment-centre/store";
import { TreatmentCentreShell } from "./tc-shell";
import type { TCSession } from "@/lib/nmba/treatment-centre/types";

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
