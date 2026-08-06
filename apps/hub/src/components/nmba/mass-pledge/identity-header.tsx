"use client";

// DS Audit: FormField ✅ · Select ✅ · Input ✅ — all @mosje/design-system.
// Nothing here is hand-rolled; this file only decides WHICH DS controls appear.

import { FormField, Input, Select } from "@mosje/design-system";
import { LINE_MINISTRIES } from "@/lib/nmba/mass-pledge/masters";
import type { ReporterKind } from "@/lib/nmba/mass-pledge/types";
import type { PortalSession } from "@/lib/nmba/committee/types";

export interface IdentityValue {
  coordinatingMinistry: string;
}

interface IdentityHeaderProps {
  reporterKind: ReporterKind;
  session: PortalSession;
  value: IdentityValue;
  onChange: (next: IdentityValue) => void;
  errors: Partial<Record<keyof IdentityValue, string>>;
  disabled?: boolean;
}

/** Label for each organisation form's identity field. */
const ENTITY_LABEL: Record<Exclude<ReporterKind, "ADMIN_TIER">, string> = {
  LINE_MINISTRY: "Line Ministry / Department",
  SPIRITUAL_ORG: "Spiritual Organisation",
  HEI: "Higher Education Institution",
  GIA: "Grant-in-Aid Organisation",
};

/** A read-only field showing a value resolved from the login, not typed. */
function ResolvedField({ label, value }: { label: string; value: string }) {
  return (
    <FormField label={label} hint="Resolved from your login">
      {(control) => <Input {...control} value={value} readOnly disabled />}
    </FormField>
  );
}

/**
 * The only part of the Mass Pledge form that differs between the five
 * documented forms. Everything below it — counts, photos, officer, declaration
 * — is identical, which is why there is one form component, not five.
 *
 * Returns bare `FormField`s, never a wrapping grid: the parent `FormSection`
 * already lays its children out on a field grid, so adding one here would
 * squeeze every field into a single column of it.
 */
export function IdentityHeader({
  reporterKind,
  session,
  value,
  onChange,
  errors,
  disabled = false,
}: IdentityHeaderProps) {
  // Form 1 — State / UT / District / Block.
  if (reporterKind === "ADMIN_TIER") {
    return (
      <>
        <FormField
          label="Coordinating Line Ministry / Department"
          id="mp-ministry"
          required
          error={errors.coordinatingMinistry}
          hint="Recorded for attribution only. It does not create a figure on that ministry's own total."
        >
          {(control) => (
            <Select
              {...control}
              value={value.coordinatingMinistry}
              disabled={disabled}
              placeholder="Select the coordinating ministry"
              options={LINE_MINISTRIES.map((m) => ({ label: m, value: m }))}
              onChange={(e) => onChange({ coordinatingMinistry: e.target.value })}
            />
          )}
        </FormField>

        {session.state && <ResolvedField label="State / UT" value={session.state} />}
        {session.district && <ResolvedField label="District" value={session.district} />}
        {session.block && <ResolvedField label="Block" value={session.block} />}
      </>
    );
  }

  // Forms 2, 3, 4 and 5 — the reporting organisation.
  //
  // The requirement draws these as a free dropdown, which assumed no login.
  // Assumption A9 put every form behind a pre-provisioned account, and a free
  // dropdown on top of a login is exploitable: a Ministry of Education account
  // could file under "Ministry of Defence", and one credential could publish
  // any number of self-declared figures attributed to organisations that never
  // signed in. So identity is resolved from the login, exactly as it already is
  // for Form 1's State/District/Block and Form 5's GIA name.
  return <ResolvedField label={ENTITY_LABEL[reporterKind]} value={session.entityName ?? ""} />;
}
