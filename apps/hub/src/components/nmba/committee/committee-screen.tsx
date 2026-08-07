"use client";

// Role-aware screen for one committee tier (State / District / Block), inside the
// existing portal sidebar flow.
//
//   Owner's single-record tier (State officer → State, District officer → District)
//     → the committee shows inline (summary + minutes), or an onboarding empty
//       state with a Register CTA when none exists yet.
//   Multi-record / Admin tiers
//     → a scoped list; a right-side sheet registers a new committee, and opening
//       a row reveals its detail + minutes.

import * as React from "react";
import { Button, EmptyState, Icon, SideSheet } from "@mosje/design-system";

const REGISTER_FORM_ID = "napddr-register-form";
import { useToast } from "@/components/nmba/toast";
import { CommitteeForm, type DistrictMode } from "./committee-form";
import { CommitteeList } from "./committee-list";
import { MinutesSection } from "./minutes-section";
import { RecordSummary } from "./record-summary";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import { useCommitteeStore } from "@/lib/nmba/committee/store";
import {
  canAddAtTier,
  canManage,
  ownSingleRecord,
  tiersForRole,
  visibleRecords,
} from "@/lib/nmba/committee/scope";
import { tierLabel } from "@/lib/nmba/committee/session";
import { STATE_DISTRICTS } from "@/lib/nmba/states";
import type { CommitteeTier } from "@/lib/nmba/committee/types";

function ScopeChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brandwash px-2.5 py-0.5 text-xs font-semibold text-navy">
      {label}
    </span>
  );
}

const SHORT_TIER: Record<CommitteeTier, string> = {
  STATE: "State",
  DISTRICT: "District",
  BLOCK: "Block",
};

export function CommitteeTierScreen({ tier }: { tier: CommitteeTier }) {
  const session = usePortalSession();
  const { records, addCommittee, addMinute } = useCommitteeStore();
  const { toast } = useToast();
  const [addOpen, setAddOpen] = React.useState(false);
  const [detailId, setDetailId] = React.useState<string | null>(null);

  const heading = tierLabel(tier);

  // Guard: this tier isn't part of the signed-in role's flow.
  if (!tiersForRole(session.role).includes(tier)) {
    return (
      <div>
        <h1 className="text-xl font-bold text-ink">{heading}</h1>
        <div className="mt-6">
          <EmptyState
            title="Not available for your role"
            description="This committee level is managed above your jurisdiction."
          />
        </div>
      </div>
    );
  }

  const inScope = visibleRecords(records, session, tier);
  const single = ownSingleRecord(records, session, tier);
  const isSingleTier =
    (session.role === "STATE" && tier === "STATE") ||
    (session.role === "DISTRICT" && tier === "DISTRICT");
  const canAdd = canAddAtTier(session, tier) && !(isSingleTier && single);

  const districtMode: DistrictMode =
    tier === "STATE" ? "none" : session.role === "DISTRICT" ? "auto" : "select";
  const allDistricts = session.state ? STATE_DISTRICTS[session.state] ?? [] : [];
  const takenDistrictCommittees = new Set(
    records.filter((r) => r.tier === "DISTRICT" && r.state === session.state).map((r) => r.district),
  );
  const districtOptions =
    tier === "DISTRICT" ? allDistricts.filter((d) => !takenDistrictCommittees.has(d)) : allDistricts;

  const scopeLabel =
    session.role === "ADMIN"
      ? "All India"
      : session.role === "STATE"
        ? session.state ?? ""
        : `${session.district}, ${session.state}`;

  const hideColumns =
    session.role === "STATE" ? ["state"] : session.role === "DISTRICT" ? ["state", "district"] : [];

  const description = isSingleTier
    ? "Your committee notification and its meeting minutes."
    : session.role === "ADMIN"
      ? `All ${SHORT_TIER[tier].toLowerCase()}-level committees across States/UTs (read-only).`
      : canAddAtTier(session, tier)
        ? "Register and manage committee notifications in your jurisdiction."
        : "Committee notifications in your jurisdiction (read-only).";

  const detail = detailId ? records.find((r) => r.id === detailId) ?? null : null;

  const emptyLabel =
    session.role === "ADMIN"
      ? "No committee notifications on record yet."
      : `No ${SHORT_TIER[tier].toLowerCase()}-level committees in ${scopeLabel} yet.`;

  const header = (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-ink">{heading}</h1>
          <ScopeChip label={scopeLabel} />
        </div>
        <p className="mt-1 text-sm text-ink-muted">{description}</p>
      </div>
      {canAdd && !isSingleTier && (
        <Button iconLeft={<Icon name="add" size={16} />} onClick={() => setAddOpen(true)}>
          Register committee
        </Button>
      )}
    </div>
  );

  const registerSheet = (
    <SideSheet
      open={addOpen}
      onClose={() => setAddOpen(false)}
      title={`Register — ${heading}`}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button appearance="text" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form={REGISTER_FORM_ID} iconLeft={<Icon name="save" size={16} />}>
            Save Committee Notification
          </Button>
        </div>
      }
    >
      <CommitteeForm
        tier={tier}
        state={session.state ?? ""}
        createdBy={session.accountId}
        districtMode={districtMode}
        district={session.district}
        districtOptions={districtOptions}
        formId={REGISTER_FORM_ID}
        onSubmit={(input) => {
          addCommittee(input);
          setAddOpen(false);
          toast("Committee notification saved.", "success");
        }}
      />
    </SideSheet>
  );

  // Owner's single-record tier → inline view.
  if (isSingleTier) {
    return (
      <div>
        {header}
        {single ? (
          <>
            <div className="rounded-xl border border-line bg-white p-5">
              <RecordSummary record={single} />
            </div>
            <MinutesSection record={single} onAdd={addMinute} canManage={canManage(single, session)} />
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-white py-10">
            <EmptyState
              icon={<Icon name="assignment" size={32} className="text-navy" />}
              title={`No ${SHORT_TIER[tier]} committee registered yet`}
              description="Register your committee notification to begin. You can add meeting minutes once it is on record."
              action={
                <Button iconLeft={<Icon name="add" size={16} />} onClick={() => setAddOpen(true)}>
                  Register {SHORT_TIER[tier]} committee
                </Button>
              }
            />
          </div>
        )}
        {registerSheet}
      </div>
    );
  }

  // Multi-record / Admin → scoped list.
  return (
    <div>
      {header}
      <CommitteeList
        records={inScope}
        hideColumns={hideColumns}
        caption={heading}
        emptyLabel={emptyLabel}
        onOpen={(r) => setDetailId(r.id)}
      />
      {registerSheet}

      <SideSheet
        open={detail !== null}
        onClose={() => setDetailId(null)}
        title={detail ? tierLabel(detail.tier) : ""}
        size="lg"
      >
        {detail && (
          <>
            <RecordSummary record={detail} />
            <MinutesSection
              record={detail}
              onAdd={addMinute}
              canManage={canManage(detail, session)}
            />
          </>
        )}
      </SideSheet>
    </div>
  );
}
