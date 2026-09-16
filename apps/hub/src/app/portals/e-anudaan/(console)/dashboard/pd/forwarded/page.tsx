"use client";

import * as React from "react";
import { ROLES, reviewKeyOf } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { forwardedFor } from "@/lib/e-anudaan/selectors";
import { ApplicationList } from "@/components/e-anudaan/application-list";

/**
 * Forwarded Applications — each row now opens the file, and its status says where it sits (inventory §19).
 *
 * `?fy=` scopes it to one year: the dashboard's "Forwarded by You" figure is counted in the year the
 * dashboard is set to, and opens this list in that same year (audit O-03). The heading says so.
 *
 * The year is the STARTING value of the register's own Financial Year filter, not a fixed scope:
 * the reader arriving from the tile could neither widen it nor clear it without editing the
 * address. The list holds every forwarded file and narrows itself, and its standfirst names
 * whichever year the filter is on (B5 hand-over, 16 Sep 2026).
 */
export default function PdForwardedPage({ searchParams }: { searchParams: Promise<{ fy?: string }> }) {
  const fy = React.use(searchParams).fy ?? "";
  const { state } = useEAnudaan();
  const role = state.session ? ROLES[state.session] : null;
  const rows = role ? forwardedFor(state, role.id) : [];
  return (
    <ApplicationList
      variant="forwarded"
      title="Forwarded Applications"
      description={(year) => `Applications ${year ? `of FY ${year} ` : ""}you have forwarded to the next level, and where each is now.`}
      financialYearFilter
      initialFinancialYear={fy}
      rows={rows}
      forwardedBy={role?.id}
      reviewBase={role ? `/portals/e-anudaan/dashboard/sm2/${reviewKeyOf(role)}/review` : undefined}
    />
  );
}
