"use client";

/**
 * Deficiencies — every correction the Ministry has asked for, across every application.
 *
 * DS Audit: PendingActions (portal component over Card · ListGroup · ListRow) ✅ · Card ✅ ·
 * SectionTitle ✅ · ListGroup / ListRow ✅ · Badge ✅ — nothing new.
 *
 * The earlier page had one "Submit response" button per deficiency that answered it with a
 * fixed sentence and no correction at all. Each row now opens the application in its
 * correction mode, where the documents are replaced and the answers fixed (review call, T55–79).
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Badge, Card, CardBody, Link, ListGroup, ListRow, PageHeader, SectionTitle } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { openDeficiencies } from "@/lib/e-anudaan/applicant";
import { formatDate } from "@/lib/e-anudaan/format";
import { PendingActions } from "@/components/e-anudaan/pending-actions";
import { routeOnClick } from "@/components/e-anudaan/ngo-shell";


export default function DeficienciesPage() {
  const router = useRouter();
  const { state } = useEAnudaan();
  const ngo = state.ngos[0];
  const open = React.useMemo(() => (ngo ? openDeficiencies(state, ngo.id) : []), [state, ngo]);

  const submitted = React.useMemo(
    () =>
      state.applications
        .filter((a) => a.ngoId === ngo?.id)
        .flatMap((app) => app.deficiencies.filter((d) => d.respondedAt).map((d) => ({ app, d })))
        .sort((a, b) => Date.parse(b.d.respondedAt!) - Date.parse(a.d.respondedAt!)),
    [state, ngo],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deficiencies"
        meta="Corrections the Ministry has asked for on your applications. Open one to correct it."
      />

      <PendingActions items={open} limit={null} title="Open Deficiencies" allItems />

      {submitted.length > 0 && (
        <Card variant="outlined">
          <CardBody className="space-y-3">
            <SectionTitle title="Corrections Submitted" count={submitted.length} />
            <ListGroup aria-label="Corrections submitted">
              {submitted.map(({ app, d }) => (
                <ListRow
                  key={d.id}
                  eyebrow={<span className="break-all tabular-nums">{app.institutionId} · {app.id}</span>}
                  title={app.projectLabel.split(" · ")[0]}
                  description={
                    <>
                      {/* What was asked and what the applicant answered, item by item — live's
                          "Your response · <date>" (parity inventory §4). */}
                      {d.items?.length ? (
                        <ol className="m-0 list-decimal space-y-0.5 pl-5">
                          {d.items.map((it) => (
                            <li key={it.id}>
                              <span className="font-semibold text-ink">{it.label}:</span> {it.remark}
                              {it.response ? <span className="block text-ink">Your response: {it.response}</span> : null}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <span className="block">{d.message ?? d.detail}</span>
                      )}
                      {d.response && <span className="mt-1 block text-ink">Your note: {d.response}</span>}
                      <span className="mt-1 block text-ink-muted">Submitted {formatDate(d.respondedAt!)}</span>
                    </>
                  }
                  trailing={
                    <span className="flex items-center gap-3">
                      <Badge status="info" size="sm">Under Examination</Badge>
                      <Link
                        variant="standalone"
                        size="sm"
                        href={`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(app.id)}`}
                        onClick={routeOnClick(router, `/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(app.id)}`)}
                        aria-label={`View application ${app.id}`}
                      >
                        View
                      </Link>
                    </span>
                  }
                />
              ))}
            </ListGroup>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
