"use client";

/**
 * Project Location Change — move a project to a new address within its district.
 *
 * DS Audit: Card ✅ existing · SectionTitle ✅ · FormField ✅ · Select ✅ · Textarea ✅ · Button ✅ ·
 * Icon ✅ · Alert ✅ · DescriptionList ✅ · FileList ✅ · ListGroup / ListRow ✅ · Badge ✅ ·
 * ErrorSummary ✅ · useToast ✅ — nothing new.
 *
 * Settled in the review call of 11 Sep 2026 (T100–122, T457–468):
 *   • a project moves WITHIN its district — State and District come from the project and are
 *     shown, not asked;
 *   • "Use Current Location" comes first, because it fills most of the address; the address
 *     stays editable, since a looked-up address is often worded oddly;
 *   • latitude and longitude are recorded for the department and never shown — they mean
 *     nothing to the applicant;
 *   • the reason is mandatory; a supporting document is optional.
 *
 * Design-director audit, 16 Sep 2026 (N-19, X-07): a decided request read "Verified … decided
 * 13 Feb 2026". A request is Approved or Not Approved (glossary, `requestStatusLabel`), and the
 * date reads "Decided 13 Feb 2026". The page is fluid like every portal surface; the form keeps
 * a readable width inside its card.
 */

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  ErrorSummary,
  FileList,
  FormField,
  Icon,
  ListGroup,
  ListRow,
  PageHeader,
  SectionTitle,
  Select,
  Textarea,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { projectName, projectsOf } from "@/lib/e-anudaan/applicant";
import { formatDate } from "@/lib/e-anudaan/format";
import { currentAddressOf, requestStatusLabel, requestStatusTone } from "@/lib/e-anudaan/change-requests";
import { addressFromPosition, centreOf, checkLocation, farLine } from "@/lib/e-anudaan/district-centres";
import { useDemoFormFill } from "@/components/e-anudaan/use-demo-form-fill";
import type { LocationChangeRequest } from "@/lib/e-anudaan/types";

const MAX = 500;
type Capture = { state: "idle" } | { state: "locating" } | { state: "captured"; lat: number; lng: number } | { state: "failed"; message: string };

export default function ProjectLocationChangePage() {
  const { state, raiseChangeRequest } = useEAnudaan();
  const { toast } = useToast();
  const ngo = state.ngos[0];
  const projects = ngo ? projectsOf(state, ngo.id) : [];

  const [projectId, setProjectId] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [doc, setDoc] = React.useState<{ name: string; size: number } | null>(null);
  const [capture, setCapture] = React.useState<Capture>({ state: "idle" });
  const [tried, setTried] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);

  const project = projects.find((p) => p.id === projectId);
  const requests = state.changeRequests.filter((r): r is LocationChangeRequest => r.kind === "location");
  const pendingForProject = requests.find((r) => r.projectId === projectId && r.status === "Pending");
  // The same expression the PMU's desk reads, so both show one address after a verified move.
  const currentAddress = project ? currentAddressOf(state, project.id) : "";
  const positionCheck = project && capture.state === "captured" ? checkLocation(project, { latitude: capture.lat, longitude: capture.lng }) : null;

  const errors = [
    !projectId && { id: "project", text: "Select the project that is moving." },
    !address.trim() && { id: "new-location", text: "Enter the new address of the project." },
    !reason.trim() && { id: "reason", text: "Give the reason for the change." },
  ].filter(Boolean) as { id: string; text: string }[];
  const errorFor = (id: string) => (tried ? errors.find((e) => e.id === id)?.text : undefined);

  const useCurrentLocation = () => {
    if (!project) return;
    if (!("geolocation" in navigator)) {
      setCapture({ state: "failed", message: "This browser cannot share your location. Enter the address below." });
      return;
    }
    setCapture({ state: "locating" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCapture({ state: "captured", lat: pos.coords.latitude, lng: pos.coords.longitude });
        // No map service is called. A bundled lookup of each district's headquarters names the
        // locality, district, State and PIN when the position is inside the project's district
        // (`addressFromPosition`); the building and street stay the applicant's to add. Outside
        // the district nothing is filled, and the page says where the position is (verify bug 8).
        const line = addressFromPosition(project, pos.coords.latitude, pos.coords.longitude);
        if (line) setAddress((a) => (a.trim() ? a : line));
      },
      (err) =>
        setCapture({
          state: "failed",
          message:
            err.code === err.PERMISSION_DENIED
              ? "Location access was not allowed. Enter the address below."
              : "Your location could not be found. Enter the address below.",
        }),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const reset = () => {
    setAddress("");
    setReason("");
    setDoc(null);
    setCapture({ state: "idle" });
    setTried(false);
  };

  // The demo dock's Fill tab (lib/e-anudaan/demo-forms/project-location-change.ts). A rule preset
  // shows the form's errors as Submit would, and submits nothing.
  useDemoFormFill("project-location-change", (v, preset) => {
    const pendingIds = new Set(requests.filter((r) => r.status === "Pending").map((r) => r.projectId));
    const chosen = v.project === "pending"
      ? projects.find((p) => pendingIds.has(p.id))
      : v.project === "free" ? projects.find((p) => !pendingIds.has(p.id)) : undefined;
    setProjectId(chosen?.id ?? "");
    setAddress((v.address ?? "").replace("{district}", chosen?.district ?? "").replace("{state}", chosen?.state ?? ""));
    setReason(v.reason ?? "");
    setDoc(v.document ? { name: v.document, size: 184_000 } : null);
    const centre = chosen ? centreOf(chosen.state, chosen.district) : undefined;
    if (v.position === "within" && centre) setCapture({ state: "captured", lat: centre.lat, lng: centre.lng });
    // Far from any district this estate lists a project in: the Andaman Sea off Port Blair.
    else if (v.position === "far") setCapture({ state: "captured", lat: 11.62, lng: 92.73 });
    else setCapture({ state: "idle" });
    setTried(!preset.valid);
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (errors.length || pendingForProject) return;
    raiseChangeRequest({
      kind: "location",
      projectId,
      address: address.trim(),
      reason: reason.trim(),
      documentName: doc?.name,
      ...(capture.state === "captured" ? { latitude: capture.lat, longitude: capture.lng } : {}),
    } as Omit<LocationChangeRequest, "id" | "submittedAt" | "status">);
    toast("Location change request submitted. You will be notified when the Ministry decides.", "success");
    reset();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        size="compact"
        title="Project Location Change"
        meta="Ask the Ministry to record a new address for a project. A project can move within its district only."
      />

      <Card variant="outlined">
        <CardBody>
          <form onSubmit={submit} noValidate className="max-w-[var(--sa-container-md)] space-y-6">
            {tried && errors.length > 0 && <ErrorSummary errors={errors.map((er) => ({ fieldId: er.id, message: er.text }))} />}

            <FormField label="Project" id="project" required error={errorFor("project")}>
              {(c) => (
                <Select
                  {...c}
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);
                    reset();
                  }}
                >
                  <option value="">Select a project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {projectName(p)}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>

            {project && (
              <>
                <DescriptionList
                  columns={3}
                  items={[
                    { term: "State", value: project.state },
                    { term: "District", value: project.district },
                    { term: "Current Address", value: currentAddress },
                  ]}
                />

                {pendingForProject ? (
                  <Alert status="info" title="A Request for This Project Is Already Under Examination">
                    Submitted on {formatDate(pendingForProject.submittedAt)} for {pendingForProject.address}. A new request can be
                    made once the Ministry has decided on it.
                  </Alert>
                ) : (
                  <>
                    <section aria-labelledby="new-location-heading" className="space-y-4">
                      <SectionTitle as={2} headingId="new-location-heading" title="New Location" description="Stand at the new premises and use your current location, then check the address." />
                      <div className="flex flex-wrap items-center gap-3">
                        <Button type="button" appearance="outlined" onClick={useCurrentLocation} loading={capture.state === "locating"}>
                          <Icon name="my_location" size={16} aria-hidden />
                          {capture.state === "captured" ? "Capture Again" : "Use Current Location"}
                        </Button>
                        <span role="status" className="text-body-2 text-ink-muted">
                          {capture.state === "locating" && "Finding your location…"}
                          {capture.state === "captured" && positionCheck?.kind !== "far" && (
                            <span className="inline-flex items-center gap-1 text-ink">
                              <Icon name="check_circle" size={16} aria-hidden className="text-[var(--sa-text-status-success-base)]" /> Location recorded. Add the building and street to the address below.
                            </span>
                          )}
                        </span>
                      </div>
                      {capture.state === "failed" && <Alert status="warning">{capture.message}</Alert>}
                      {positionCheck?.kind === "far" && (
                        <Alert status="warning" title="You Are Not in This Project's District">
                          {farLine(positionCheck)} Stand at the new premises and capture again. The Ministry is shown this position with your request.
                        </Alert>
                      )}

                      <FormField
                        label="New Address"
                        id="new-location"
                        required
                        hint={`Building, street and locality, within ${project.district}, ${project.state}.`}
                        error={errorFor("new-location")}
                        characterCount={{ value: address, maxLength: MAX }}
                      >
                        {(c) => <Textarea {...c} rows={3} maxLength={MAX} value={address} onChange={(e) => setAddress(e.target.value)} />}
                      </FormField>
                    </section>

                    <FormField
                      label="Reason for the Change"
                      id="reason"
                      required
                      error={errorFor("reason")}
                      characterCount={{ value: reason, maxLength: MAX }}
                    >
                      {(c) => <Textarea {...c} rows={3} maxLength={MAX} value={reason} onChange={(e) => setReason(e.target.value)} />}
                    </FormField>

                    <FormField label="Supporting Document" id="support-doc" optional hint="For example a lease or ownership deed. PDF, JPG or PNG, up to 2 MB.">
                      {(c) => (
                        <div className="space-y-2">
                          <input
                            ref={fileInput}
                            id={c.id}
                            aria-describedby={c["aria-describedby"]}
                            type="file"
                            accept="application/pdf,image/jpeg,image/png"
                            className="sr-only"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setDoc({ name: f.name, size: f.size });
                              e.target.value = "";
                            }}
                          />
                          {doc ? (
                            <FileList label="Supporting document" files={[{ id: "doc", name: doc.name, size: doc.size, state: "ready" }]} onRemove={() => setDoc(null)} />
                          ) : (
                            <Button type="button" appearance="outlined" size="sm" onClick={() => fileInput.current?.click()}>
                              <Icon name="upload" size={16} aria-hidden /> Choose File
                            </Button>
                          )}
                        </div>
                      )}
                    </FormField>

                    <Button type="submit">Submit Request</Button>
                  </>
                )}
              </>
            )}
          </form>
        </CardBody>
      </Card>

      <Card variant="outlined">
        <CardBody className="space-y-3">
          <SectionTitle title="Your Requests" count={requests.length} />
          {requests.length === 0 ? (
            <p className="text-body-2 text-ink-muted">You have not asked for a location change.</p>
          ) : (
            <ListGroup aria-label="Location change requests">
              {requests.map((r) => {
                const p = projects.find((x) => x.id === r.projectId);
                return (
                  <ListRow
                    key={r.id}
                    eyebrow={<span className="tabular-nums">{r.projectId}</span>}
                    title={p ? projectName(p) : r.projectId}
                    description={
                      <>
                        <span className="block">New address: {r.address}</span>
                        <span className="block text-ink-muted">
                          Submitted {formatDate(r.submittedAt)}
                          {r.decidedAt ? ` · Decided ${formatDate(r.decidedAt)}` : ""}
                          {r.documentName ? ` · Document: ${r.documentName}` : ""}
                        </span>
                        {r.decisionRemarks && <span className="block">Ministry&apos;s remarks: {r.decisionRemarks}</span>}
                      </>
                    }
                    trailing={
                      <Badge status={requestStatusTone(r)} size="sm">
                        {requestStatusLabel(r)}
                      </Badge>
                    }
                  />
                );
              })}
            </ListGroup>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
