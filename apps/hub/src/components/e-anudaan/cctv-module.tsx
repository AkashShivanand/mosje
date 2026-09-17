"use client";

/**
 * One project's CCTV module on the NGO side: coverage of the mandated areas, the camera register,
 * the installation certificate with footage retention and storage, and the monthly uptime
 * declarations (e-Anudaan parity brief §D item 2).
 *
 * DS Audit: SectionTitle ✅ · Card ✅ · Alert ✅ · Badge ✅ · Button ✅ · DataTable ✅ · DatePicker ✅ ·
 * DescriptionList ✅ · DocumentRow ✅ · EmptyState ✅ · ErrorSummary ✅ · FormField ✅ · Input ✅ ·
 * Select ✅ · RadioGroup ✅ · Checkbox ✅ · Modal ✅ · Icon ✅ · useToast ✅ — nothing new.
 *
 * Every form keeps its fields in ONE values object (`CameraFormValues`, `RecordsFormValues`,
 * `UptimeFormValues`), so a demo preset can fill a form by handing it an object. Validation is
 * `lib/e-anudaan/cctv.ts`, where it is tested; the form only shows what it returns.
 */

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Checkbox,
  DataTable,
  DatePicker,
  DescriptionList,
  DocumentRow,
  EmptyState,
  ErrorSummary,
  FormField,
  Icon,
  Input,
  Modal,
  RadioGroup,
  SectionTitle,
  Select,
  useToast,
  type DataTableColumn,
  type ErrorSummaryItem,
} from "@mosje/design-system";
import {
  CCTV_AREAS,
  DECLARATION_DUE_DAY,
  EMPTY_CAMERA,
  EMPTY_UPTIME,
  RETENTION_MIN_DAYS,
  STORAGE_MEDIA,
  areaLabel,
  cameraToValues,
  cctvCompliance,
  cctvMonthLabel,
  declarableMonths,
  recordsToValues,
  validateCamera,
  validateRecords,
  validateUptime,
  withDeclaration,
  type CameraFormValues,
  type RecordsFormValues,
  type UptimeErrors,
  type UptimeFormValues,
} from "@/lib/e-anudaan/cctv";
import { formatDate } from "@/lib/e-anudaan/format";
import type { CctvCamera, CctvSetup, CctvUptimeDeclaration } from "@/lib/e-anudaan/types";
import { CctvFlags, CctvStatusBadge, CoverageList } from "./cctv-parts";

const PRIVACY_NOTE =
  "Cameras must not be installed in toilets, bathrooms, dormitory sleeping areas or medical examination rooms.";
const CERTIFICATE_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const CERTIFICATE_MAX_KB = 5 * 1024;
const DECLARATIONS_PER_PAGE = 6;

export function CctvModule({ setup, onSave }: { setup: CctvSetup; onSave: (next: CctvSetup) => void }) {
  const compliance = cctvCompliance(setup);
  return (
    <div className="space-y-5">
      <Card variant="outlined">
        <CardBody className="space-y-4">
          <SectionTitle
            title="Coverage of Mandated Areas"
            description={`${compliance.covered} of ${compliance.coverage.length} areas covered by a working camera`}
          >
            <CctvStatusBadge compliance={compliance} size="lg" />
          </SectionTitle>
          <CctvFlags compliance={compliance} />
          <CoverageList coverage={compliance.coverage} />
        </CardBody>
      </Card>

      <CameraRegister setup={setup} onSave={onSave} />
      <CertificateAndStorage setup={setup} onSave={onSave} />
      <UptimeDeclarations setup={setup} onSave={onSave} overdueMonth={compliance.declarationOverdue ? compliance.dueMonth : null} />
    </div>
  );
}

/* ── camera register ─────────────────────────────────────────────────────── */

type CameraRow = CctvCamera & Record<string, unknown>;

function CameraRegister({ setup, onSave }: { setup: CctvSetup; onSave: (next: CctvSetup) => void }) {
  const { toast } = useToast();
  const cameras = setup.cameraRegister ?? [];
  const [editing, setEditing] = React.useState<CctvCamera | "new" | null>(null);
  const [removing, setRemoving] = React.useState<CctvCamera | null>(null);

  const saveRegister = (next: CctvCamera[]) =>
    onSave({ ...setup, cameraRegister: next, cameras: next.length || setup.cameras });

  const columns: DataTableColumn<CameraRow>[] = [
    { key: "location", header: "Location" },
    { key: "area", header: "Coverage Area", render: (c) => areaLabel(c.area) },
    { key: "placement", header: "Type" },
    { key: "recording", header: "Recording" },
    { key: "nightVision", header: "Night Vision", render: (c) => (c.nightVision ? "Yes" : "No") },
    { key: "installedOn", header: "Installed On", render: (c) => formatDate(c.installedOn) },
    {
      key: "working",
      header: "Status",
      render: (c) => (
        <span className="inline-block whitespace-nowrap">
          <Badge status={c.working ? "success" : "warning"} size="sm">
            {c.working ? "Working" : "Not Working"}
          </Badge>
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      noExport: true,
      render: (c) => (
        <span className="flex gap-1">
          <Button size="sm" appearance="text" nowrap onClick={() => setEditing(c)} aria-label={`Edit the camera at ${c.location}`}>
            Edit
          </Button>
          <Button size="sm" appearance="text" nowrap onClick={() => setRemoving(c)} aria-label={`Remove the camera at ${c.location}`}>
            Remove
          </Button>
        </span>
      ),
    },
  ];

  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle title="Camera Register" count={cameras.length} description={PRIVACY_NOTE}>
          <Button size="sm" nowrap iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={() => setEditing("new")}>
            Register Camera
          </Button>
        </SectionTitle>
        {cameras.length === 0 ? (
          <EmptyState
            icon={<Icon name="videocam_off" size={32} aria-hidden />}
            title="No Cameras Registered"
            description="Register each camera installed at the project against the area it covers."
          />
        ) : (
          <DataTable<CameraRow>
            caption="Cameras registered at this project"
            columns={columns}
            data={cameras as CameraRow[]}
            total={cameras.length}
            pageSizes={[10]}
            showPageSizes={false}
          />
        )}

        {editing && (
          <CameraDialog
            key={editing === "new" ? "new" : editing.id}
            initial={editing === "new" ? EMPTY_CAMERA : cameraToValues(editing)}
            title={editing === "new" ? "Register Camera" : "Edit Camera"}
            onCancel={() => setEditing(null)}
            onSubmit={(values) => {
              const id = editing === "new" ? `cam-${setup.projectId}-${Date.now().toString(36)}` : editing.id;
              const res = validateCamera(values, id);
              if (!res.ok) return res.errors;
              saveRegister(editing === "new" ? [...cameras, res.value] : cameras.map((c) => (c.id === id ? res.value : c)));
              toast(editing === "new" ? `Camera at ${res.value.location} registered.` : `Camera at ${res.value.location} updated.`, "success");
              setEditing(null);
              return null;
            }}
          />
        )}

        <Modal
          open={!!removing}
          onClose={() => setRemoving(null)}
          title="Remove This Camera?"
          footer={
            <div className="flex justify-end gap-2">
              <Button appearance="outlined" onClick={() => setRemoving(null)}>
                Keep Camera
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (removing) {
                    saveRegister(cameras.filter((c) => c.id !== removing.id));
                    toast(`Camera at ${removing.location} removed from the register.`, "success");
                  }
                  setRemoving(null);
                }}
              >
                Remove
              </Button>
            </div>
          }
        >
          <p className="text-body-2 text-ink">
            {removing ? `${removing.location} (${areaLabel(removing.area)}) will no longer count towards the coverage of that area.` : ""}
          </p>
        </Modal>
      </CardBody>
    </Card>
  );
}

function CameraDialog({
  initial,
  title,
  onCancel,
  onSubmit,
}: {
  initial: CameraFormValues;
  title: string;
  onCancel: () => void;
  /** Returns the errors to show, or null when the camera was saved. */
  onSubmit: (values: CameraFormValues) => Partial<Record<keyof CameraFormValues, string>> | null;
}) {
  const [values, setValues] = React.useState<CameraFormValues>(initial);
  const [errors, setErrors] = React.useState<Partial<Record<keyof CameraFormValues, string>>>({});
  const set = <K extends keyof CameraFormValues>(k: K, v: CameraFormValues[K]) => setValues((prev) => ({ ...prev, [k]: v }));
  const today = new Date().toISOString().slice(0, 10);
  const ids: Record<keyof CameraFormValues, string> = {
    location: "cam-location",
    area: "cam-area",
    placement: "cam-placement",
    recording: "cam-recording",
    nightVision: "cam-night",
    installedOn: "cam-installed",
    working: "cam-working",
  };
  const summary: ErrorSummaryItem[] = (Object.keys(errors) as (keyof CameraFormValues)[])
    .filter((k) => errors[k])
    .map((k) => ({ fieldId: ids[k], message: errors[k] }));

  return (
    <Modal
      open
      onClose={onCancel}
      size="md"
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => setErrors(onSubmit(values) ?? {})}>Save Camera</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {summary.length > 0 && <ErrorSummary errors={summary} headingLevel={3} />}
        <FormField label="Location" id={ids.location} required error={errors.location} hint={PRIVACY_NOTE}>
          {(c) => <Input {...c} value={values.location} placeholder="For example, main gate facing the entrance" onChange={(e) => set("location", e.target.value)} />}
        </FormField>
        <FormField label="Coverage Area" id={ids.area} required error={errors.area}>
          {(c) => (
            <Select {...c} value={values.area} onChange={(e) => set("area", e.target.value as CameraFormValues["area"])}>
              <option value="">Select…</option>
              {CCTV_AREAS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <RadioGroup
            id={ids.placement}
            legend="Type"
            name="cam-placement"
            required
            orientation="horizontal"
            value={values.placement || undefined}
            onChange={(v) => set("placement", v as CameraFormValues["placement"])}
            options={[{ value: "Indoor", label: "Indoor" }, { value: "Outdoor", label: "Outdoor" }]}
            error={errors.placement}
          />
          <RadioGroup
            id={ids.nightVision}
            legend="Night Vision"
            name="cam-night"
            required
            orientation="horizontal"
            value={values.nightVision || undefined}
            onChange={(v) => set("nightVision", v as CameraFormValues["nightVision"])}
            options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}
            error={errors.nightVision}
          />
          <RadioGroup
            id={ids.recording}
            legend="Recording"
            name="cam-recording"
            required
            orientation="horizontal"
            value={values.recording || undefined}
            onChange={(v) => set("recording", v as CameraFormValues["recording"])}
            options={[{ value: "Continuous", label: "Continuous" }, { value: "Motion-Activated", label: "Motion-Activated" }]}
            error={errors.recording}
          />
          <RadioGroup
            id={ids.working}
            legend="Working Status"
            name="cam-working"
            required
            orientation="horizontal"
            value={values.working || undefined}
            onChange={(v) => set("working", v as CameraFormValues["working"])}
            options={[{ value: "Working", label: "Working" }, { value: "Not Working", label: "Not Working" }]}
            error={errors.working}
          />
        </div>
        <DatePicker id={ids.installedOn} label="Installed On" required value={values.installedOn} max={today} onChange={(v) => set("installedOn", v)} error={errors.installedOn} />
      </div>
    </Modal>
  );
}

/* ── certificate, retention, storage ─────────────────────────────────────── */

function CertificateAndStorage({ setup, onSave }: { setup: CctvSetup; onSave: (next: CctvSetup) => void }) {
  const { toast } = useToast();
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const stated = setup.retentionDays != null && !!setup.storage;
  const [editing, setEditing] = React.useState(!stated);
  const [values, setValues] = React.useState<RecordsFormValues>(() => recordsToValues(setup));
  const [errors, setErrors] = React.useState<Partial<Record<keyof RecordsFormValues, string>>>({});
  const set = <K extends keyof RecordsFormValues>(k: K, v: RecordsFormValues[K]) => setValues((prev) => ({ ...prev, [k]: v }));
  const cert = setup.certificate;

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!CERTIFICATE_TYPES.includes(file.type)) {
      setFileError(`${file.name} is not a PDF, JPG or PNG file. Choose the certificate in one of those formats.`);
      return;
    }
    if (file.size / 1024 > CERTIFICATE_MAX_KB) {
      setFileError(`${file.name} is larger than 5 MB. Choose a smaller copy of the certificate.`);
      return;
    }
    setFileError(null);
    onSave({ ...setup, certificate: { fileName: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)), uploadedAt: new Date().toISOString() } });
    toast("Installation certificate uploaded.", "success");
  };

  const save = () => {
    const res = validateRecords(values);
    if (!res.ok) {
      setErrors(res.errors);
      return;
    }
    setErrors({});
    onSave({ ...setup, ...res.value });
    setEditing(false);
    toast("Footage retention and storage saved.", "success");
  };

  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle title="Installation Certificate and Footage Storage" />
        <DocumentRow
          linkAs={Link}
          title="CCTV Installation Certificate"
          titleAs="h3"
          layout="columns"
          hint="Issued by the installer. PDF, JPG or PNG, up to 5 MB."
          state={fileError ? "failed" : cert ? "verified" : "missing"}
          statusLabel={fileError ? "Not Uploaded" : cert ? "Uploaded" : "Not Uploaded"}
          file={cert ? { name: cert.fileName, size: `${cert.sizeKb.toLocaleString("en-IN")} KB`, date: formatDate(cert.uploadedAt) } : undefined}
          reason={fileError ?? undefined}
          action={
            <Button
              size="sm"
              appearance={cert ? "text" : "outlined"}
              nowrap
              iconLeft={<Icon name="upload" size={16} aria-hidden />}
              onClick={() => fileInput.current?.click()}
            >
              {cert ? "Replace" : "Upload Certificate"}
            </Button>
          }
          as="div"
        />
        <input
          ref={fileInput}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        <div className="space-y-3">
          <SectionTitle as={3} title="Retention and Storage" description={`Recorded footage must be kept for at least ${RETENTION_MIN_DAYS} days.`}>
            {!editing && (
              <Button size="sm" appearance="outlined" nowrap onClick={() => { setValues(recordsToValues(setup)); setEditing(true); }}>
                Change
              </Button>
            )}
          </SectionTitle>
          {editing ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Footage Retention (Days)" id="cctv-retention" required error={errors.retentionDays} hint={`At least ${RETENTION_MIN_DAYS} days`}>
                  {(c) => <Input {...c} inputMode="numeric" value={values.retentionDays} onChange={(e) => set("retentionDays", e.target.value)} />}
                </FormField>
                <FormField label="Recorded On" id="cctv-medium" required error={errors.storageMedium}>
                  {(c) => (
                    <Select {...c} value={values.storageMedium} onChange={(e) => set("storageMedium", e.target.value as RecordsFormValues["storageMedium"])}>
                      <option value="">Select…</option>
                      {STORAGE_MEDIA.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </Select>
                  )}
                </FormField>
                <FormField label="Storage Capacity (GB)" id="cctv-capacity" required error={errors.capacityGb}>
                  {(c) => <Input {...c} inputMode="decimal" value={values.capacityGb} onChange={(e) => set("capacityGb", e.target.value)} />}
                </FormField>
                <FormField label="Where the Recorder Is Kept" id="cctv-storage-location" required error={errors.storageLocation}>
                  {(c) => <Input {...c} value={values.storageLocation} placeholder="For example, office, locked cabinet" onChange={(e) => set("storageLocation", e.target.value)} />}
                </FormField>
              </div>
              <div className="flex gap-2">
                <Button onClick={save}>Save Retention and Storage</Button>
                {stated && (
                  <Button appearance="outlined" onClick={() => { setErrors({}); setEditing(false); }}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <DescriptionList
              columns={2}
              items={[
                { term: "Footage Retention", value: `${setup.retentionDays} days` },
                { term: "Recorded On", value: setup.storage?.medium },
                { term: "Storage Capacity", value: setup.storage ? `${setup.storage.capacityGb.toLocaleString("en-IN")} GB` : undefined },
                { term: "Where the Recorder Is Kept", value: setup.storage?.location },
              ]}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}

/* ── monthly uptime declarations ─────────────────────────────────────────── */

type DeclarationRow = CctvUptimeDeclaration & Record<string, unknown>;

function UptimeDeclarations({
  setup,
  onSave,
  overdueMonth,
}: {
  setup: CctvSetup;
  onSave: (next: CctvSetup) => void;
  overdueMonth: string | null;
}) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState<UptimeFormValues | null>(null);
  const list = setup.uptime ?? [];
  const cameras = setup.cameraRegister?.length ?? 0;

  const columns: DataTableColumn<DeclarationRow>[] = [
    { key: "month", header: "Month", render: (d) => cctvMonthLabel(d.month) },
    { key: "uptimePercent", header: "Uptime", className: "text-right tabular-nums", render: (d) => `${d.uptimePercent}%` },
    {
      key: "outages",
      header: "Outages",
      render: (d) =>
        d.outages.length === 0 ? (
          "None"
        ) : (
          <ul className="space-y-1">
            {d.outages.map((o, i) => (
              <li key={i}>
                {formatDate(o.from)}
                {o.to !== o.from ? ` – ${formatDate(o.to)}` : ""}: {o.reason}
              </li>
            ))}
          </ul>
        ),
    },
    { key: "declaredBy", header: "Declared By", render: (d) => `${d.declaredBy}, ${d.designation}` },
    { key: "declaredAt", header: "Declared On", render: (d) => formatDate(d.declaredAt) },
  ];

  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle
          title="Monthly Uptime Declarations"
          description={`Declare each month's uptime by the ${DECLARATION_DUE_DAY}th of the following month.`}
        >
          {cameras > 0 && (
            <Button size="sm" nowrap iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={() => setOpen({ ...EMPTY_UPTIME, month: overdueMonth ?? "" })}>
              Declare Uptime
            </Button>
          )}
        </SectionTitle>
        {overdueMonth && (
          <Alert
            status="warning"
            title={`Declaration for ${cctvMonthLabel(overdueMonth)} Is Overdue`}
            action={
              <Button appearance="outlined" size="sm" onClick={() => setOpen({ ...EMPTY_UPTIME, month: overdueMonth })}>
                Declare {cctvMonthLabel(overdueMonth)}
              </Button>
            }
          />
        )}
        {list.length === 0 ? (
          <EmptyState
            icon={<Icon name="event_note" size={32} aria-hidden />}
            title="No Declarations Filed"
            description={cameras > 0 ? "File a declaration for each month once it has ended." : "Register the cameras at this project before declaring their uptime."}
          />
        ) : (
          <DataTable<DeclarationRow>
            caption="Monthly uptime declarations, most recent first"
            columns={columns}
            data={list as DeclarationRow[]}
            total={list.length}
            pageSizes={[DECLARATIONS_PER_PAGE]}
            showPageSizes={false}
          />
        )}
        {open && (
          <UptimeDialog
            initial={open}
            declared={new Set(list.map((d) => d.month))}
            onCancel={() => setOpen(null)}
            onSubmit={(values) => {
              const res = validateUptime(values);
              if (!res.ok) return res.errors;
              onSave({ ...setup, uptime: withDeclaration(list, { ...res.value, declaredAt: new Date().toISOString() }) });
              toast(`Uptime declaration for ${cctvMonthLabel(res.value.month)} filed.`, "success");
              setOpen(null);
              return null;
            }}
          />
        )}
      </CardBody>
    </Card>
  );
}

function UptimeDialog({
  initial,
  declared,
  onCancel,
  onSubmit,
}: {
  initial: UptimeFormValues;
  declared: ReadonlySet<string>;
  onCancel: () => void;
  onSubmit: (values: UptimeFormValues) => UptimeErrors | null;
}) {
  const [values, setValues] = React.useState<UptimeFormValues>(initial);
  const [errors, setErrors] = React.useState<UptimeErrors>({});
  const set = <K extends keyof UptimeFormValues>(k: K, v: UptimeFormValues[K]) => setValues((prev) => ({ ...prev, [k]: v }));
  const setOutage = (i: number, k: "from" | "to" | "reason", v: string) =>
    setValues((prev) => ({ ...prev, outages: prev.outages.map((o, j) => (j === i ? { ...o, [k]: v } : o)) }));
  const months = declarableMonths(new Date());
  const monthStart = values.month ? `${values.month}-01` : undefined;
  const monthEnd = values.month
    ? (() => {
        const [y, m] = values.month.split("-").map(Number) as [number, number];
        return `${values.month}-${String(new Date(y, m, 0).getDate()).padStart(2, "0")}`;
      })()
    : undefined;

  const summary: ErrorSummaryItem[] = [
    ...(["month", "uptimePercent"] as const).filter((k) => errors[k]).map((k) => ({ fieldId: `uptime-${k}`, message: errors[k] })),
    ...Object.entries(errors.outageErrors ?? {}).flatMap(([i, oe]) =>
      (["from", "to", "reason"] as const).filter((k) => oe[k]).map((k) => ({ fieldId: `outage-${i}-${k}`, message: `Outage ${Number(i) + 1}: ${oe[k]}` })),
    ),
    ...(["declaredBy", "designation", "confirmed"] as const).filter((k) => errors[k]).map((k) => ({ fieldId: `uptime-${k}`, message: errors[k] })),
  ];

  return (
    <Modal
      open
      onClose={onCancel}
      size="lg"
      title="Declare Monthly Uptime"
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => setErrors(onSubmit(values) ?? {})}>File Declaration</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {summary.length > 0 && <ErrorSummary errors={summary} headingLevel={3} />}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Month" id="uptime-month" required error={errors.month}>
            {(c) => (
              <Select {...c} value={values.month} onChange={(e) => set("month", e.target.value)}>
                <option value="">Select…</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {cctvMonthLabel(m)}
                    {declared.has(m) ? " (declared; this replaces it)" : ""}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <FormField label="Uptime (%)" id="uptime-uptimePercent" required error={errors.uptimePercent} hint="Share of the month all cameras were recording">
            {(c) => <Input {...c} inputMode="decimal" value={values.uptimePercent} onChange={(e) => set("uptimePercent", e.target.value)} />}
          </FormField>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-body-1 font-semibold text-ink">Outages</legend>
          {values.outages.length === 0 ? (
            <p className="text-body-2 text-ink-muted">No outage recorded. Add one for any period a camera was not recording.</p>
          ) : (
            values.outages.map((o, i) => {
              const oe = errors.outageErrors?.[i] ?? {};
              return (
                <div key={i} className="grid items-start gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
                  <DatePicker id={`outage-${i}-from`} label={`Outage ${i + 1} From`} required value={o.from} min={monthStart} max={monthEnd} onChange={(v) => setOutage(i, "from", v)} error={oe.from} />
                  <DatePicker id={`outage-${i}-to`} label="To" required value={o.to} min={o.from || monthStart} max={monthEnd} onChange={(v) => setOutage(i, "to", v)} error={oe.to} />
                  <FormField label="Reason" id={`outage-${i}-reason`} required error={oe.reason}>
                    {(c) => <Input {...c} value={o.reason} onChange={(e) => setOutage(i, "reason", e.target.value)} />}
                  </FormField>
                  <Button
                    className="md:mt-7"
                    size="sm"
                    appearance="text"
                    onClick={() => set("outages", values.outages.filter((_, j) => j !== i))}
                    aria-label={`Remove outage ${i + 1}`}
                  >
                    Remove
                  </Button>
                </div>
              );
            })
          )}
          <Button size="sm" appearance="outlined" iconLeft={<Icon name="add" size={16} aria-hidden />} onClick={() => set("outages", [...values.outages, { from: "", to: "", reason: "" }])}>
            Add Outage
          </Button>
        </fieldset>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Declared By" id="uptime-declaredBy" required error={errors.declaredBy} hint="The person authorised to declare for the project">
            {(c) => <Input {...c} value={values.declaredBy} onChange={(e) => set("declaredBy", e.target.value)} />}
          </FormField>
          <FormField label="Designation" id="uptime-designation" required error={errors.designation}>
            {(c) => <Input {...c} value={values.designation} onChange={(e) => set("designation", e.target.value)} />}
          </FormField>
        </div>
        <Checkbox
          id="uptime-confirmed"
          checked={values.confirmed}
          onCheckedChange={(on) => set("confirmed", on)}
          label="I declare that the uptime and outages stated above are correct to the best of my knowledge."
          error={errors.confirmed}
          required
        />
      </div>
    </Modal>
  );
}
