"use client";

/**
 * Pending Actions — every correction the Ministry is waiting on, across every application.
 *
 * DS Audit: Card ✅ existing · SectionTitle ✅ · ListGroup / ListRow ✅ · Badge ✅ · Button ✅ ·
 * Icon ✅ · EmptyState ✅ — nothing new.
 *
 * Replaces a single warning banner that named ONE application. The review call of 11 Sep 2026
 * (T43–54) set the shape: an NGO runs several projects, any of them may carry several
 * deficiencies, so the dashboard shows a small, prominent list — two or three rows — with
 * "View All" behind it, and each row opens straight into correcting that file.
 *
 * Rows are ordered by corrections still outstanding, then by how long the applicant has been
 * waiting, so the three the dashboard shows are the three that matter (`openDeficiencies`).
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, CardBody, EmptyState, Icon, ListGroup, ListRow, SectionTitle } from "@mosje/design-system";
import { daysOpen, requestedAt, type OpenDeficiency } from "@/lib/e-anudaan/applicant";
import { formatDate } from "@/lib/e-anudaan/format";

const BASE = "/portals/e-anudaan/ngo/my-applications";

export function resolveHref(appId: string): string {
  return `${BASE}/${encodeURIComponent(appId)}?focus=deficiency`;
}

export function PendingActions({
  items,
  limit = 3,
  title = "Pending Actions",
  now,
}: {
  items: OpenDeficiency[];
  /** How many rows to show before "View All". `null` shows every row. */
  limit?: number | null;
  title?: string;
  /** Reference time for "n days", injectable for tests. */
  now?: number;
}) {
  const router = useRouter();
  const shown = limit ? items.slice(0, limit) : items;
  const outstanding = items.reduce((n, d) => n + d.items.length - d.corrected, 0);
  const headingId = React.useId();

  return (
    <Card variant="outlined" aria-labelledby={headingId}>
      <CardBody className="space-y-3">
        <SectionTitle
          headingId={headingId}
          title={title}
          description={
            items.length === 0
              ? undefined
              : `${outstanding} correction${outstanding === 1 ? "" : "s"} to make on ${items.length} application${items.length === 1 ? "" : "s"}`
          }
        >
          {limit && items.length > limit ? (
            <Button appearance="text" size="sm" onClick={() => router.push(`${BASE}/deficiencies`)}>
              View All {items.length} Applications <Icon name="arrow_forward" size={16} aria-hidden />
            </Button>
          ) : null}
        </SectionTitle>

        {items.length === 0 ? (
          <EmptyState
            title="No corrections are waiting on you."
            description="The Ministry has not asked for any correction on your applications."
          />
        ) : (
          <ListGroup aria-label="Applications awaiting your correction">
            {shown.map(({ app, deficiency, items: defItems, corrected }) => {
              const days = daysOpen(app, deficiency, now);
              const left = defItems.length - corrected;
              const first = defItems.find((i) => !i.correctedAt) ?? defItems[0];
              const project = app.projectLabel.split(" · ")[0];
              return (
                <ListRow
                  key={deficiency.id}
                  leading={<Icon name="report" size={24} className="text-[var(--sa-text-status-warning-bolder)]" />}
                  eyebrow={
                    <span className="break-all font-mono">
                      {app.id} · Project {app.institutionId}
                    </span>
                  }
                  title={
                    <span className="flex flex-wrap items-center gap-2">
                      <span>
                        {project} · FY {app.financialYear}
                      </span>
                      <Badge status="warning" size="sm">
                        {left} of {defItems.length} to correct
                      </Badge>
                    </span>
                  }
                  description={
                    <>
                      {first ? (
                        <span className="block">
                          <span className="font-semibold text-ink">{first.label}:</span> {first.remark}
                          {defItems.length > 1 ? ` · and ${defItems.length - 1} more` : ""}
                        </span>
                      ) : (
                        <span className="block">{deficiency.detail}</span>
                      )}
                      <span className="mt-0.5 block text-ink-muted">
                        Requested {formatDate(requestedAt(app, deficiency))} · {days === 0 ? "today" : `${days} day${days === 1 ? "" : "s"} ago`}
                      </span>
                    </>
                  }
                  trailing={
                    <Button
                      size="sm"
                      nowrap
                      onClick={() => router.push(resolveHref(app.id))}
                      aria-label={`Resolve ${left} correction${left === 1 ? "" : "s"} on ${project}, application ${app.id}`}
                    >
                      Resolve
                    </Button>
                  }
                />
              );
            })}
          </ListGroup>
        )}
      </CardBody>
    </Card>
  );
}
