"use client";

/**
 * What a sanctioned file asks of the applicant next, on its application page: the utilisation
 * certificate, and the online inspection where one is scheduled.
 *
 * DS Audit: Card ✅ existing · SectionTitle ✅ · ListGroup / ListRow ✅ · Badge ✅ · Link ✅ ·
 * Icon ✅ — nothing new.
 *
 * The page of a sanctioned file had no link but Back, while the Utilisation Certificate and the
 * Online Inspection Meeting screens existed and nothing reached them (parity inventory §3, §12, §13).
 */

import { useRouter } from "next/navigation";
import { Badge, Card, CardBody, Icon, Link, ListGroup, ListRow, SectionTitle } from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDate, formatDateTime } from "@/lib/e-anudaan/format";
import { ucDue } from "@/lib/e-anudaan/registers";
import type { GrantApplication } from "@/lib/e-anudaan/types";
import { routeOnClick } from "./ngo-shell";

const BASE = "/portals/e-anudaan/ngo/my-applications";

export function SanctionedFilePanel({ app }: { app: GrantApplication }) {
  const router = useRouter();
  const { state } = useEAnudaan();
  if (!app.sanction) return null;

  const id = encodeURIComponent(app.id);
  const ucHref = `${BASE}/${id}/uc`;
  const meetingHref = `${BASE}/${id}/inspection/meeting`;
  const due = ucDue(state, app.ngoId).some((a) => a.id === app.id);
  const inspection = state.inspections.find((i) => i.applicationId === app.id);

  return (
    <Card variant="outlined">
      <CardBody className="space-y-3">
        {/* The order number is in the page header already; it is not repeated here. */}
        <SectionTitle title="Sanctioned Grant" />
        <ListGroup aria-label="What this sanction asks of you">
          <ListRow
            leading={<Icon name="receipt_long" size={24} className="text-ink-muted" />}
            title="Utilisation Certificate"
            description={
              app.utilisation
                ? `Filed on ${formatDate(app.utilisation.filedAt)}.`
                : due
                  ? "Due. File it, signed by a Chartered Accountant, before the next instalment is released."
                  : "File it, signed by a Chartered Accountant, once the grant has been spent."
            }
            trailing={
              <span className="flex items-center gap-3">
                {app.utilisation ? (
                  <Badge status="success" size="sm">Filed</Badge>
                ) : due ? (
                  <Badge status="warning" size="sm">Due</Badge>
                ) : null}
                <Link variant="standalone" size="sm" href={ucHref} onClick={routeOnClick(router, ucHref)} className="whitespace-nowrap">
                  {app.utilisation ? "View" : "Open"}
                </Link>
              </span>
            }
          />
          {inspection && (
            <ListRow
              leading={<Icon name={inspection.visitType === "Online" ? "videocam" : "travel_explore"} size={24} className="text-ink-muted" />}
              title={`${inspection.visitType} Inspection`}
              description={inspection.scheduledFor ? `Scheduled for ${formatDateTime(inspection.scheduledFor)}.` : "Not yet scheduled by the inspecting officer."}
              trailing={
                inspection.visitType === "Online" ? (
                  <Link variant="standalone" size="sm" href={meetingHref} onClick={routeOnClick(router, meetingHref)} className="whitespace-nowrap">
                    Open
                  </Link>
                ) : undefined
              }
            />
          )}
        </ListGroup>
      </CardBody>
    </Card>
  );
}
