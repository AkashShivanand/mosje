"use client";

import { useApp } from "@/store/smile-admin/app-context";
import { ROLE_LABELS, ROLE_SCOPES } from "@/lib/smile-admin/roles";
import { Icon } from "@mosje/design-system";

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
        <Icon name="verified_user" size={12} aria-hidden />
        {ROLE_LABELS[account.role]}
      </span>
      <span className="inline-flex items-center gap-xs">
        <Icon name="location_on" size={14} aria-hidden className="text-primary" />
        <span className="text-ink-muted">Scope</span>
        <span className="font-semibold text-ink">{scopeText}</span>
      </span>
      {showAccessLevel ? (
        <span className="ml-auto hidden items-center gap-xs text-ink-hint sm:inline-flex">
          <span className="text-ink-muted">Access</span>
          <span className="font-medium text-ink">{accessLevel}</span>
        </span>
      ) : null}
    </div>
  );
}
