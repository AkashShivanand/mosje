"use client";

/**
 * CCTV Setup — the NGO end of the e-inspection feature.
 *
 * DS Audit: PageHeader ✅ existing · Card ✅ · SectionTitle ✅ · DataTable ✅ · Badge ✅ · Button ✅ ·
 * Modal ✅ · FormField ✅ · Input ✅ · Select ✅ · Alert ✅ · EmptyState ✅ · Icon ✅ · useToast ✅ —
 * nothing new.
 *
 * The 1–8 camera range, both optional contact fields and the failure message are from the live
 * screen (walkthrough 2026-08-22, where the dev backend returned the error state).
 *
 * CCTV is set up per PROJECT: an inspecting officer views one centre's feed (screen QA, 13 Sep 2026).
 *
 * Design-director audit, 16 Sep 2026 (N-13, X-07): the page was one "Select the project…" dropdown
 * in a card, so an NGO with thirty projects could not see which were done, and every visit started
 * from nothing. It is now the list of projects with where each stands, and the form opens for the
 * project chosen. The setup is a record in the store (schema 11), so an inspecting officer sees what
 * the NGO registered; it was briefly kept in this browser while that record was being built.
 *
 * Three states, not two: a project with no record, a project whose recorder has not reached the
 * portal, and a project sending a live feed an officer can open (`liveFeed`).
 *
 * The complete module (e-Anudaan parity brief §D item 2, 17 Sep 2026): a configured project opens
 * at `?project=<Project ID>` — coverage of the mandated areas, the camera register with its privacy
 * exclusions, the installation certificate, footage retention and storage, and the monthly uptime
 * declarations (`components/e-anudaan/cctv-module.tsx`). The list states each project's compliance
 * from the same `cctvCompliance` reading the officer's view uses.
 *
 * DS Audit (module): Breadcrumb ✅ · DescriptionList ✅ added to the imports above — nothing new.
 */

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardBody,
  DescriptionList,
  EmptyState,
  FormField,
  Icon,
  Input,
  ListGroup,
  ListRow,
  Modal,
  Pagination,
  PageHeader,
  SectionTitle,
  Select,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { projectName, projectsOf } from "@/lib/e-anudaan/applicant";
import { formatDate } from "@/lib/e-anudaan/format";
import { cctvActivationCode } from "@/lib/e-anudaan/store/seed";
import type { CctvSetup, Institution } from "@/lib/e-anudaan/types";
import { cctvCompliance, certificateFileProblem } from "@/lib/e-anudaan/cctv";
import { CctvModule, type CctvDemoFill } from "@/components/e-anudaan/cctv-module";
import { useDemoFormFill } from "@/components/e-anudaan/use-demo-form-fill";
import type { DemoFormPreset } from "@/lib/e-anudaan/demo-forms";
import { certificateFileOf } from "@/lib/e-anudaan/demo-forms/cctv";
import { CctvStatusBadge } from "@/components/e-anudaan/cctv-parts";

/** Projects to a page. A fixed page keeps the card the same height whatever the register holds. */
const PAGE_SIZE = 10;

export default function CctvSetupPage() {
  return (
    <React.Suspense fallback={null}>
      <CctvSetupScreen />
    </React.Suspense>
  );
}

const CCTV_BASE = "/portals/e-anudaan/ngo/cctv";

function CctvSetupScreen() {
  const { state, findCctv, saveCctv } = useEAnudaan();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const openProjectId = params.get("project");
  const ngo = state.ngos[0];
  const projects = ngo ? projectsOf(state, ngo.id) : [];
  const [open, setOpen] = React.useState<Institution | null>(null);
  const [page, setPage] = React.useState(1);
  const openModule = (projectId: string) => router.push(`${pathname}?project=${encodeURIComponent(projectId)}`);
  /** A demo dock fill for one of the module's forms, handed to the module (demo-forms/cctv.ts). */
  const [demo, setDemo] = React.useState<CctvDemoFill | null>(null);
  // The module's forms belong to a configured project: from the list, a fill opens the first one.
  const fillModule = (formId: string) => (values: Readonly<Record<string, string>>, preset: DemoFormPreset) => {
    const here = openProjectId !== null && findCctv(openProjectId) ? openProjectId : projects.find((p) => findCctv(p.id))?.id;
    if (!here) return;
    if (here !== openProjectId) openModule(here);
    const setup = findCctv(here);
    const file = formId === "cctv-certificate" ? certificateFileOf(values) : null;
    if (setup && file && !certificateFileProblem(file)) {
      saveCctv({ ...setup, certificate: { fileName: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)), uploadedAt: new Date().toISOString() } });
      toast("Installation certificate uploaded.", "success");
    }
    setDemo((d) => ({ n: (d?.n ?? 0) + 1, formId, values, valid: !!preset.valid }));
    // The certificate and the retention form sit on the page, not in a dialog: bring them into view.
    const target = formId === "cctv-certificate" ? "cctv-certificate-storage" : formId === "cctv-records" ? "cctv-retention" : null;
    if (target) window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ block: formId === "cctv-records" ? "center" : "start" }), 400);
  };
  useDemoFormFill("cctv-camera", fillModule("cctv-camera"));
  useDemoFormFill("cctv-certificate", fillModule("cctv-certificate"));
  useDemoFormFill("cctv-records", fillModule("cctv-records"));
  useDemoFormFill("cctv-uptime", fillModule("cctv-uptime"));

  const setupOf = (projectId: string) => findCctv(projectId);
  const live = projects.filter((p) => setupOf(p.id)?.liveFeed).length;
  const waiting = projects.filter((p) => {
    const setup = setupOf(p.id);
    return !!setup && !setup.liveFeed;
  }).length;
  /* What the page is FOR comes first: projects with nothing recorded, then a recorder that has not
     reached the portal, then the ones already sending a feed an officer can open. */
  const rank = (p: Institution) => {
    const setup = setupOf(p.id);
    return !setup ? 0 : setup.liveFeed ? 2 : 1;
  };
  const rows = [...projects].sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const shown = rows.slice((Math.min(page, totalPages) - 1) * PAGE_SIZE, Math.min(page, totalPages) * PAGE_SIZE);
  const needAction = projects.filter((p) => cctvCompliance(setupOf(p.id)).status === "action-needed").length;

  if (openProjectId !== null) {
    const project = projects.find((p) => p.id === openProjectId);
    const setup = project ? setupOf(project.id) : undefined;
    return (
      <div className="space-y-5">
        <Breadcrumb linkAs={Link} items={[{ label: "CCTV Setup", href: CCTV_BASE }, { label: project ? projectName(project) : "Project" }]} />
        {!project ? (
          <Alert status="warning" title="Project Not Found">
            No project of your organisation has the Project ID {openProjectId}.
          </Alert>
        ) : (
          <>
            <PageHeader
              size="compact"
              title={projectName(project)}
              meta={`${project.id} · ${project.nature}`}
              actions={
                <Button appearance="outlined" nowrap onClick={() => setOpen(project)}>
                  {setup ? "View Recorder Setup" : "Set Up"}
                </Button>
              }
            />
            {!setup ? (
              <Card variant="outlined">
                <CardBody>
                  <EmptyState
                    icon={<Icon name="videocam_off" size={32} aria-hidden />}
                    title="CCTV Not Set Up"
                    description="Set up the recorder at this project first. The camera register, certificate and uptime declarations follow."
                    action={<Button onClick={() => setOpen(project)}>Set Up CCTV</Button>}
                  />
                </CardBody>
              </Card>
            ) : (
              <>
                <Card variant="outlined">
                  <CardBody>
                    <DescriptionList
                      columns={3}
                      items={[
                        { term: "Live Feed", value: setup.liveFeed ? "On" : "Recorder not connected" },
                        { term: "Activation Code", value: <span className="tabular-nums">{setup.activationCode}</span> },
                        { term: "Registered On", value: formatDate(setup.savedAt) },
                      ]}
                    />
                  </CardBody>
                </Card>
                <CctvModule setup={setup} onSave={saveCctv} demo={demo} />
              </>
            )}
          </>
        )}
        {open && <SetupDialog key={open.id} project={open} saved={setupOf(open.id)} onSave={saveCctv} onClose={() => setOpen(null)} />}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        size="compact"
        title="CCTV Setup"
        meta="Configure the CCTV at a project so inspecting officers can view a live feed during an e-inspection. This is done once for each project."
      />

      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle
            title="Projects"
            description={
              projects.length
                ? `${live} of ${projects.length} project${projects.length === 1 ? "" : "s"} sending a live feed${waiting ? ` · ${waiting} waiting for the recorder` : ""}${needAction ? ` · ${needAction} with CCTV requirements not met` : ""}`
                : undefined
            }
          />
          {projects.length === 0 ? (
            <EmptyState
              icon={<Icon name="videocam_off" size={32} aria-hidden />}
              title="No Projects to Set Up"
              description="Your organisation has no projects on record."
            />
          ) : (
            <>
              <ListGroup divided aria-label="CCTV setup for each project">
                {shown.map((p) => {
                  const setup = setupOf(p.id);
                  return (
                    <ListRow
                      key={p.id}
                      leading={<Icon name={setup?.liveFeed ? "videocam" : "videocam_off"} size={24} className="text-ink-muted" />}
                      title={projectName(p)}
                      description={
                        <span className="block tabular-nums">
                          {p.id}
                          {setup ? ` · ${setup.cameras} camera${setup.cameras === 1 ? "" : "s"} · registered ${formatDate(setup.savedAt)}` : ""}
                        </span>
                      }
                      trailing={
                        <span className="flex flex-wrap items-center justify-end gap-3">
                          <span className="inline-block whitespace-nowrap">
                            <Badge status={setup?.liveFeed ? "success" : "warning"} size="sm">
                              {!setup ? "Not Configured" : setup.liveFeed ? "Live Feed On" : "Recorder Not Connected"}
                            </Badge>
                          </span>
                          {setup && <CctvStatusBadge compliance={cctvCompliance(setup)} />}
                          <Button
                            appearance="outlined"
                            size="sm"
                            nowrap
                            onClick={() => (setup ? openModule(p.id) : setOpen(p))}
                            aria-label={`${setup ? "Open the CCTV records of" : "Set up CCTV at"} ${projectName(p)}`}
                          >
                            {setup ? "Open" : "Set Up"}
                          </Button>
                        </span>
                      }
                    />
                  );
                })}
              </ListGroup>
              {totalPages > 1 && (
                <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} onPageChange={setPage} label="Projects" />
              )}
            </>
          )}
        </CardBody>
      </Card>

      {open && (
        <SetupDialog
          key={open.id}
          project={open}
          saved={setupOf(open.id)}
          onSave={saveCctv}
          onClose={() => setOpen(null)}
          onOpenModule={() => {
            const id = open.id;
            setOpen(null);
            openModule(id);
          }}
        />
      )}
    </div>
  );
}

function SetupDialog({
  project,
  saved,
  onSave,
  onClose,
  onOpenModule,
}: {
  project: Institution;
  saved?: CctvSetup;
  onSave: (setup: CctvSetup) => void;
  onClose: () => void;
  /** Offered once a setup exists and the dialog was opened from the list. */
  onOpenModule?: () => void;
}) {
  const { toast } = useToast();
  const [cameras, setCameras] = React.useState(saved ? String(saved.cameras) : "");
  const [contact, setContact] = React.useState(saved?.contactName ?? "");
  const [mobile, setMobile] = React.useState(saved?.contactMobile ?? "");
  const [failed, setFailed] = React.useState(false);
  const [editing, setEditing] = React.useState(!saved);

  const submit = (e: React.MouseEvent) => {
    if (!cameras) return;
    // The live dev backend fails this call; the demo exposes both branches so the error state
    // is reachable — hold Alt while clicking to see it.
    if (e.altKey) {
      setFailed(true);
      return;
    }
    setFailed(false);
    // Once a camera register is kept, the register counts the cameras, not this field.
    const n = saved?.cameraRegister?.length ? saved.cameraRegister.length : Number(cameras);
    onSave({
      // Everything recorded since — register, certificate, retention, declarations — is kept.
      ...saved,
      projectId: project.id,
      cameras: n,
      // Registering the recorder is what opens the feed to the inspecting officer.
      liveFeed: true,
      activationCode: cctvActivationCode(project.id, n),
      ...(contact.trim() ? { contactName: contact.trim() } : {}),
      ...(mobile.trim() ? { contactMobile: mobile.trim() } : {}),
      savedAt: new Date().toISOString(),
    });
    setEditing(false);
    toast(`CCTV configuration saved for ${project.id}.`, "success");
  };

  return (
    <Modal
      open
      onClose={onClose}
      // The default width broke "Save and Get Activation Code" across two lines beside "Cancel".
      size="md"
      title={`CCTV Setup — ${projectName(project)}`}
      footer={
        <div className="flex justify-end gap-2">
          {editing ? (
            <>
              <Button appearance="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={!cameras} onClick={submit}>
                <Icon name="videocam" size={16} aria-hidden /> Save and Get Activation Code
              </Button>
            </>
          ) : (
            <>
              <Button appearance="outlined" onClick={() => setEditing(true)}>
                {saved && !saved.liveFeed ? "Register Again" : "Change Setup"}
              </Button>
              {onOpenModule ? <Button onClick={onOpenModule}>Open CCTV Records</Button> : <Button onClick={onClose}>Done</Button>}
            </>
          )}
        </div>
      }
    >
      {editing ? (
        <div className="space-y-4">
          {saved?.cameraRegister?.length ? (
            <p className="text-body-2 text-ink">
              {saved.cameraRegister.length} camera{saved.cameraRegister.length === 1 ? "" : "s"}, as counted in the camera register.
            </p>
          ) : (
            <FormField label="Number of Cameras" id="cameras" required>
              {(control) => (
                <Select {...control} value={cameras} onChange={(e) => setCameras(e.target.value)}>
                  <option value="">Select…</option>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>
                      {n} camera{n === 1 ? "" : "s"}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          )}
          <FormField label="Contact Person" id="cctv-contact" optional>
            {(control) => (
              <Input {...control} value={contact} placeholder="Name of the person managing the CCTV computer" onChange={(e) => setContact(e.target.value)} />
            )}
          </FormField>
          <FormField label="Contact Mobile" id="cctv-mobile" optional>
            {(control) => <Input {...control} type="tel" value={mobile} placeholder="+91-XXXXXXXXXX" onChange={(e) => setMobile(e.target.value)} />}
          </FormField>
          {failed && <Alert status="error">Could not start CCTV setup. Please check your connection and try again.</Alert>}
        </div>
      ) : saved ? (
        <Alert status={saved.liveFeed ? "success" : "warning"} title={saved.liveFeed ? "Live Feed On" : "Recorder Not Connected"}>
          <p className="text-body-2">
            {saved.liveFeed
              ? `The recorder at ${projectName(project)} is registered with this activation code.`
              : `Enter this activation code in the recorder software on the CCTV computer at ${projectName(project)}.`}
          </p>
          <p className="mt-2 text-title-1 font-bold tabular-nums tracking-digits text-ink">{saved.activationCode}</p>
          <p className="mt-1 text-body-3 text-ink-muted">
            {saved.cameras} camera{saved.cameras === 1 ? "" : "s"} registered on {formatDate(saved.savedAt)}
            {saved.contactName ? ` · contact ${saved.contactName}` : ""}
            {saved.contactMobile ? ` · ${saved.contactMobile}` : ""}
          </p>
        </Alert>
      ) : null}
    </Modal>
  );
}
