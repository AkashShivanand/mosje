"use client";

/**
 * The CCTV readings both sides show: the coverage of the mandated areas and the compliance facts.
 * Read-only by construction — neither component takes a callback — so the officer's view and the
 * NGO's summary render the one `cctvCompliance` reading the same way.
 *
 * DS Audit: Badge ✅ · DescriptionList ✅ · Alert ✅ · Icon ✅ · ListGroup / ListRow ✅ — nothing new.
 */

import * as React from "react";
import { Alert, Badge, DescriptionList, Icon, ListGroup, ListRow } from "@mosje/design-system";
import {
  CCTV_STATUS_LABEL,
  CCTV_STATUS_TONE,
  RETENTION_MIN_DAYS,
  cctvMonthLabel,
  type AreaCoverage,
  type CctvCompliance,
  type CoverageRow,
} from "@/lib/e-anudaan/cctv";
import { formatDate } from "@/lib/e-anudaan/format";
import type { CctvSetup } from "@/lib/e-anudaan/types";

const COVERAGE_WORDS: Record<AreaCoverage, { label: string; tone: "success" | "warning" | "danger"; icon: string }> = {
  covered: { label: "Covered", tone: "success", icon: "check_circle" },
  "not-working": { label: "Camera Not Working", tone: "warning", icon: "warning" },
  uncovered: { label: "Not Covered", tone: "danger", icon: "cancel" },
};

export function CctvStatusBadge({ compliance, size = "sm" }: { compliance: CctvCompliance; size?: "sm" | "lg" }) {
  return (
    <span className="inline-block whitespace-nowrap">
      <Badge status={CCTV_STATUS_TONE[compliance.status]} size={size}>
        {CCTV_STATUS_LABEL[compliance.status]}
      </Badge>
    </span>
  );
}

/** The seven mandated areas, each with whether a working camera covers it. */
export function CoverageList({ coverage }: { coverage: readonly CoverageRow[] }) {
  return (
    <ListGroup divided aria-label="Coverage of the mandated areas" className="grid gap-x-8 md:grid-cols-2">
      {coverage.map((row) => {
        const w = COVERAGE_WORDS[row.status];
        return (
          <ListRow
            key={row.id}
            leading={<Icon name={w.icon} size={20} aria-hidden className="text-ink-muted" />}
            title={row.label}
            description={row.cameras ? `${row.cameras} camera${row.cameras === 1 ? "" : "s"}` : "No camera"}
            trailing={
              <span className="inline-block whitespace-nowrap">
                <Badge status={w.tone} size="sm">
                  {w.label}
                </Badge>
              </span>
            }
          />
        );
      })}
    </ListGroup>
  );
}

/** What stands against the project, or that nothing does. Nothing is rendered before cameras exist. */
export function CctvFlags({ compliance }: { compliance: CctvCompliance }) {
  if (compliance.status === "compliant") {
    return <Alert status="success" title="Meets Every CCTV Requirement" />;
  }
  if (compliance.status !== "action-needed") return null;
  return (
    <Alert status="warning" title={`${compliance.flags.length} Requirement${compliance.flags.length === 1 ? "" : "s"} Not Met`}>
      <ul className="list-disc space-y-1 pl-5 text-body-2">
        {compliance.flags.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </Alert>
  );
}

/** Certificate, retention, storage and the latest uptime declaration, as recorded. */
export function CctvRecordFacts({ setup, compliance }: { setup: CctvSetup; compliance: CctvCompliance }) {
  const d = compliance.latestDeclaration;
  return (
    <DescriptionList
      columns={2}
      items={[
        {
          term: "Installation Certificate",
          value: setup.certificate ? `Uploaded on ${formatDate(setup.certificate.uploadedAt)} · ${setup.certificate.fileName}` : "Not uploaded",
        },
        {
          term: "Footage Retention",
          value:
            setup.retentionDays == null
              ? "Not stated"
              : `${setup.retentionDays} days${compliance.retention === "short" ? ` — below the ${RETENTION_MIN_DAYS}-day minimum` : ""}`,
        },
        {
          term: "Storage",
          value: setup.storage ? `${setup.storage.medium} · ${setup.storage.capacityGb.toLocaleString("en-IN")} GB · ${setup.storage.location}` : "Not stated",
        },
        {
          term: "Latest Uptime Declaration",
          value: d
            ? `${cctvMonthLabel(d.month)} · ${d.uptimePercent}% · declared by ${d.declaredBy} on ${formatDate(d.declaredAt)}`
            : "None filed",
        },
      ]}
    />
  );
}
