"use client";

/**
 * Online Inspection Meeting — the NGO end of the officer-side "Online Inspection — BharatVC".
 *
 * DS Audit: Alert ✅ existing · Badge ✅ · Button ✅ · Card ✅ · DescriptionList ✅ · Icon ✅ —
 * nothing new.
 *
 * Maintainer note, kept off the screen: on the live portal this route renders ONLY an <h1>
 * (user INVENTORY §13), so the applicant half of the BharatVC inspection is not built upstream.
 * This page follows the officer side's behaviour: the IFD schedules a session, and the applicant
 * joins it from here.
 *
 * Design-director audit, 16 Sep 2026 (N-18, X-07): the page had no back link while every other
 * detail page did, and sat in a centred column narrower than the application it belongs to.
 */

import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  Icon,
  Link,
  PageHeader,
  SectionTitle,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { formatDateTime } from "@/lib/e-anudaan/format";
import { routeOnClick } from "@/components/e-anudaan/ngo-shell";
import { ownApplication, signedInNgoId } from "@/lib/e-anudaan/roles";
import { NgoApplicationNotFound } from "@/components/e-anudaan/ngo-application-not-found";

export default function InspectionMeetingPage() {
  const params = useParams<{ appId: string }>();
  const router = useRouter();
  const { state, findApp } = useEAnudaan();
  // Another organisation's file reads exactly as a missing one (security audit S05).
  const app = ownApplication(findApp(decodeURIComponent(params.appId)), signedInNgoId(state));
  const inspection = state.inspections.find((i) => i.applicationId === app?.id);

  if (!app) return <NgoApplicationNotFound />;

  return (
    <div className="space-y-5">
      <Button appearance="text" size="sm" onClick={() => router.push(`/portals/e-anudaan/ngo/my-applications/${encodeURIComponent(app.id)}`)}>
        <Icon name="arrow_back" size={16} aria-hidden /> Back to the Application
      </Button>
      <PageHeader
        size="compact"
        eyebrow={
          <span className="tabular-nums">
            Application <span className="whitespace-nowrap">{app.id}</span>
          </span>
        }
        title="Online Inspection Meeting"
        meta={app.projectLabel}
      />

      {!inspection ? (
        <Alert status="info" title="No Inspection Scheduled">
          No online inspection has been scheduled for this application. You will be notified when the inspecting
          officer schedules one.
        </Alert>
      ) : (
        <Card variant="outlined">
          <CardBody className="space-y-4">
            <SectionTitle title="Inspection Details">
              <Badge status={inspection.status === "Reviewed" ? "success" : "info"}>{inspection.status}</Badge>
            </SectionTitle>
            <DescriptionList
              columns={2}
              items={[
                { term: "Visit Type", value: inspection.visitType },
                { term: "Scheduled For", value: inspection.scheduledFor ? formatDateTime(inspection.scheduledFor) : "Not scheduled" },
              ]}
            />
            <p className="max-w-measure text-body-2 text-ink-muted">
              Complete the{" "}
              <Link href="/portals/e-anudaan/ngo/cctv" onClick={routeOnClick(router, "/portals/e-anudaan/ngo/cctv")}>
                CCTV setup
              </Link>{" "}
              for this project before the session, so the inspecting officer can view the premises.
            </p>
            <Button disabled={inspection.visitType !== "Online" || !inspection.scheduledFor}>
              <Icon name="videocam" size={16} aria-hidden /> Join BharatVC Session
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
