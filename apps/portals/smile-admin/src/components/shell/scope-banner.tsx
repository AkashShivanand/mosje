"use client";

import { MapPin, ShieldCheck } from "lucide-react";
import { useApp } from "@/store/app-context";
import { ROLE_LABELS, ROLE_SCOPES } from "@/lib/roles";

export function ScopeBanner() {
  const { account } = useApp();
  if (!account) return null;
  const scopeText =
    account.role === "district_nodal_officer"
      ? `${account.stateName} / ${account.districtName}`
      : account.role === "state_nodal_officer"
      ? account.stateName ?? "All India"
      : "All India";

  // Hide the access-level descriptor when it duplicates the scope text
  // (e.g. super_admin: both say "All India").
  const accessLevel = ROLE_SCOPES[account.role] ?? "";
  const showAccessLevel = accessLevel.toLowerCase() !== scopeText.toLowerCase();

  return (
    <div className="flex flex-wrap items-center gap-md rounded-md border border-primary-100 bg-primary-50/50 px-md py-sm text-label-2">
      <span
        className="inline-flex items-center gap-xs rounded-full bg-primary px-sm py-0.5 font-semibold uppercase tracking-[0.06em] text-white shadow-xs"
        aria-label={`Signed in as ${ROLE_LABELS[account.role]}`}
      >
        <ShieldCheck aria-hidden className="h-3 w-3" />
        {ROLE_LABELS[account.role]}
      </span>
      <span className="inline-flex items-center gap-xs">
        <MapPin aria-hidden className="h-3.5 w-3.5 text-primary" />
        <span className="text-foreground-muted">Scope</span>
        <span className="font-semibold text-foreground">{scopeText}</span>
      </span>
      {showAccessLevel ? (
        <span className="ml-auto hidden items-center gap-xs text-foreground-hint sm:inline-flex">
          <span className="text-foreground-muted">Access</span>
          <span className="font-medium text-foreground">{accessLevel}</span>
        </span>
      ) : null}
    </div>
  );
}
