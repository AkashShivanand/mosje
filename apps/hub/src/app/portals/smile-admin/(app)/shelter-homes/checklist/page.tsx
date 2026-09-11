"use client";

import { useMemo, useState } from "react";
import {
  AUDITED_SHELTERS,
  AUDIT_FINDINGS,
  auditGroups,
} from "@/lib/smile-admin/approvals";
import { Badge, Button, ChecklistScreen, Icon } from "@mosje/design-system";

const QUARTERS = ["Q2 2026-27 (Jul – Sep)", "Q1 2026-27 (Apr – Jun)", "Q4 2025-26 (Jan – Mar)"];
const SELECT = "h-10 rounded-md border border-stroke-300 bg-white px-md text-body-2 text-ink shadow-xs";

/**
 * `ChecklistScreen`, per docs/design-system/screen-templates.md §2 — "a required
 * set of artefacts, each with its own state" is exactly a quarterly audit file.
 *
 * The live dev portal serves no `/shelter-homes/checklist`, so this is built
 * from the sentence its placeholder carried — "Quarterly audit checklists for
 * compliance and quality assurance" — with the requirements drawn from what a
 * shelter audit actually has to evidence, rather than from a capture.
 */
export default function ShelterAuditChecklistPage() {
  const [shelterId, setShelterId] = useState(AUDITED_SHELTERS[0]!.id);
  const [quarter, setQuarter] = useState(QUARTERS[0]!);

  const shelter = AUDITED_SHELTERS.find((s) => s.id === shelterId)!;
  const groups = useMemo(() => auditGroups(shelterId), [shelterId]);

  const all = groups.flatMap((g) => g.items);
  const required = all.filter((i) => i.required !== false);
  const done = required.filter((i) => i.state === "attached").length;
  const blocking = all.filter((i) => i.state === "rejected").length;

  return (
    <ChecklistScreen
      breadcrumb={[
        { label: "Beneficiaries" },
        { label: "Swashraya (Shelter Homes)", href: "/portals/smile-admin/shelter-homes" },
        { label: "Audit Checklist" },
      ]}
      eyebrow="Beneficiaries"
      title="Shelter Audit Checklist"
      meta={`${shelter.name} · ${shelter.district}, ${shelter.state} · ${quarter}`}
      notices={
        <div className="flex flex-wrap items-center gap-md rounded-lg border border-stroke-200 bg-white px-lg py-md shadow-xs">
          <label className="flex items-center gap-xs text-label-2 text-ink-muted">
            Shelter
            <select aria-label="Shelter home" value={shelterId} onChange={(e) => setShelterId(e.target.value)} className={SELECT}>
              {AUDITED_SHELTERS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-xs text-label-2 text-ink-muted">
            Quarter
            <select aria-label="Quarter" value={quarter} onChange={(e) => setQuarter(e.target.value)} className={SELECT}>
              {QUARTERS.map((q) => (
                <option key={q}>{q}</option>
              ))}
            </select>
          </label>
          {/* The COUNT is the template's — it prints "5 of 10 required documents
              accepted" under this strip, and repeating it here said the same
              thing twice. What the template cannot know is that a rejection
              blocks the submission, so that is all this adds. */}
          {blocking > 0 ? (
            <Badge status="danger" dot className="ml-auto">
              {blocking} rejected — the audit cannot be closed
            </Badge>
          ) : null}
        </div>
      }
      groups={groups.map((g) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        items: g.items.map((i) => ({
          id: i.id,
          label: i.label,
          description: i.description,
          required: i.required,
          state: i.state,
          fileName: i.state === "attached" || i.state === "review" ? i.fileName : undefined,
          findings: AUDIT_FINDINGS[i.state],
          actions:
            i.state === "missing" ? (
              <Button size="sm" appearance="outlined">
                <Icon name="upload" size={16} /> Attach
              </Button>
            ) : (
              <div className="flex gap-xs">
                <Button size="sm" appearance="text">
                  View
                </Button>
                <Button size="sm" appearance="text">
                  Replace
                </Button>
              </div>
            ),
        })),
      }))}
      footer={
        <div className="flex flex-wrap items-center gap-sm">
          <Button disabled={blocking > 0 || done < required.length}>Submit audit</Button>
          <span className="text-label-2 text-ink-muted">
            {blocking > 0
              ? "Replace the rejected documents before submitting."
              : done < required.length
                ? `${required.length - done} required item(s) still to attach.`
                : "Every required item is attached."}
          </span>
        </div>
      }
      count={all.length}
      copy={{
        idleTitle: "Choose a Shelter to Open Its Checklist",
        loadingLabel: "Loading the audit checklist",
        errorTitle: "This Checklist Could Not Be Loaded",
        errorDescription: "The audit file did not load. Please try again.",
        retryLabel: "Try again",
        emptyTitle: "No Audit Required This Quarter",
        emptyDescription: "This shelter has no audit requirement for the selected quarter.",
        filteredTitle: "No Requirement Matches",
        clearFiltersLabel: "Clear filters",
      }}
    />
  );
}
