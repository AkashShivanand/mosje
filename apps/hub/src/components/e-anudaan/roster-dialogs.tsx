"use client";

/**
 * The roster's three dialogs — Add Beneficiary, Add Employee, and a person's details.
 *
 * DS Audit: Modal ✅ existing · FormField ✅ · Input ✅ · Select ✅ · Textarea ✅ · OtpInput ✅ ·
 * FileList ✅ · DescriptionList ✅ · Button ✅ · Icon ✅ · Alert ✅ · DatePicker ✅ · Card ✅ · FieldMessage ✅ —
 * nothing new. The certificate picker is still a hidden file input behind a Button: `MediaUpload`
 * takes one image, and this field takes several PDFs (see the conformance report).
 *
 * Add Employee follows the review call of 11 Sep 2026 (T181–232):
 *   • the one-time code goes to the EMPLOYEE's mobile — the live dialog said "the NGO's
 *     registered mobile", which is wrong, and the employee is expected to be present;
 *   • the employee's qualification is recorded, with its certificates — at least one, more
 *     allowed, uploaded together rather than one typed slot per certificate;
 *   • no document is asked of a beneficiary.
 */

import * as React from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  DatePicker,
  DescriptionList,
  FieldMessage,
  FileList,
  FormField,
  Icon,
  Input,
  Modal,
  OtpInput,
  Select,
  Textarea,
} from "@mosje/design-system";
import {
  CATEGORIES,
  DESIGNATIONS,
  GENDERS,
  ID_TYPES,
  QUALIFICATIONS,
  type Beneficiary,
  type Employee,
  type QualificationDoc,
} from "@/lib/e-anudaan/roster";
import { formatDate } from "@/lib/e-anudaan/format";
import { useDemoFormFill } from "./use-demo-form-fill";

const MOBILE = /^[6-9]\d{9}$/;
const OTP_VALID_SECONDS = 600;
const RESEND_AFTER_SECONDS = 30;

/* ── Add Beneficiary ──────────────────────────────────────────────────────── */

export function AddBeneficiaryDialog({
  open,
  projectId,
  projectName,
  onClose,
  onCreate,
  onDemoOpen,
}: {
  open: boolean;
  projectId: string;
  projectName: string;
  onClose: () => void;
  onCreate: (b: Omit<Beneficiary, "id">) => void;
  /** Opens the dialog for a demo dock fill (lib/e-anudaan/demo-forms/roster.ts). */
  onDemoOpen?: () => void;
}) {
  const blank = { name: "", gender: "", category: "", idType: "", idNumber: "", mobile: "", dob: "", guardian: "", admissionDate: "", remarks: "" };
  const [f, setF] = React.useState(blank);
  const [tried, setTried] = React.useState(false);

  useDemoFormFill("add-beneficiary", (v, preset) => {
    if (!projectId) return;
    setF(Object.fromEntries(Object.keys(blank).map((k) => [k, v[k] ?? ""])) as typeof blank);
    setTried(!preset.valid);
    onDemoOpen?.();
  });

  const errors = {
    name: !f.name.trim() ? "Enter the beneficiary's full name." : undefined,
    gender: !f.gender ? "Select a gender." : undefined,
    idType: !f.idType ? "Select the type of identity document." : undefined,
    idNumber: !f.idNumber.trim() ? "Enter the identity document number." : undefined,
    admissionDate: !f.admissionDate ? "Enter the date of admission." : undefined,
    mobile: f.mobile && !MOBILE.test(f.mobile) ? "Enter a 10-digit mobile number starting with 6, 7, 8 or 9." : undefined,
  };
  const valid = Object.values(errors).every((e) => !e);
  const err = (k: keyof typeof errors) => (tried ? errors[k] : undefined);

  const close = () => {
    setF(blank);
    setTried(false);
    onClose();
  };

  const create = () => {
    setTried(true);
    if (!valid) return;
    onCreate({
      projectId,
      name: f.name.trim(),
      gender: f.gender,
      category: f.category || undefined,
      idType: f.idType,
      idNumber: f.idNumber.trim(),
      mobile: f.mobile || undefined,
      dob: f.dob || undefined,
      guardian: f.guardian.trim() || undefined,
      admissionDate: f.admissionDate,
      remarks: f.remarks.trim() || undefined,
      active: true,
    });
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      /* Escape or a stray click asks before throwing typed details away (UX-06). */
      dirty={Object.values(f).some((v) => v !== "")}
      title="Add Beneficiary"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={close}>Cancel</Button>
          <Button onClick={create}>Add Beneficiary</Button>
        </div>
      }
    >
      <p className="mb-4 text-body-2 text-ink-muted">Project: {projectName}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" id="ben-name" required error={err("name")}>
          {(c) => <Input {...c} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="off" />}
        </FormField>
        <FormField label="Gender" id="ben-gender" required error={err("gender")}>
          {(c) => (
            <Select {...c} value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}>
              <option value="">Select</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          )}
        </FormField>
        <FormField label="Identity Document" id="ben-idtype" required error={err("idType")}>
          {(c) => (
            <Select {...c} value={f.idType} onChange={(e) => setF({ ...f, idType: e.target.value })}>
              <option value="">Select</option>
              {ID_TYPES.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          )}
        </FormField>
        <FormField label="Document Number" id="ben-idnum" required error={err("idNumber")}>
          {(c) => <Input {...c} value={f.idNumber} onChange={(e) => setF({ ...f, idNumber: e.target.value })} autoComplete="off" />}
        </FormField>
        <DatePicker label="Date of Admission" id="ben-admission" required error={err("admissionDate")} value={f.admissionDate} onChange={(iso) => setF({ ...f, admissionDate: iso })} />
        <FormField label="Category" id="ben-category" optional>
          {(c) => (
            <Select {...c} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
              <option value="">Select</option>
              {CATEGORIES.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          )}
        </FormField>
        <DatePicker label="Date of Birth" id="ben-dob" value={f.dob} onChange={(iso) => setF({ ...f, dob: iso })} />
        <FormField label="Mobile Number" id="ben-mobile" optional error={err("mobile")}>
          {(c) => (
            <Input {...c} type="tel" inputMode="numeric" value={f.mobile} onChange={(e) => setF({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
          )}
        </FormField>
        <div className="sm:col-span-2">
          <FormField label="Parent / Guardian" id="ben-guardian" optional>
            {(c) => <Input {...c} value={f.guardian} onChange={(e) => setF({ ...f, guardian: e.target.value })} />}
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Remarks" id="ben-remarks" optional characterCount={{ value: f.remarks, maxLength: 255 }}>
            {(c) => <Textarea {...c} rows={2} maxLength={255} value={f.remarks} onChange={(e) => setF({ ...f, remarks: e.target.value })} />}
          </FormField>
        </div>
      </div>
    </Modal>
  );
}

/* ── Add Employee ─────────────────────────────────────────────────────────── */

type OtpStage = "idle" | "sent" | "verified";

export function AddEmployeeDialog({
  open,
  projectId,
  projectName,
  onClose,
  onCreate,
  onDemoOpen,
}: {
  open: boolean;
  projectId: string;
  projectName: string;
  onClose: () => void;
  onCreate: (e: Omit<Employee, "id">) => void;
  /** Opens the dialog for a demo dock fill (lib/e-anudaan/demo-forms/roster.ts). */
  onDemoOpen?: () => void;
}) {
  const blank = { name: "", designation: "", category: "", joiningDate: "", qualification: "", mobile: "" };
  const [f, setF] = React.useState(blank);
  const [docs, setDocs] = React.useState<QualificationDoc[]>([]);
  const [otp, setOtp] = React.useState("");
  const [stage, setStage] = React.useState<OtpStage>("idle");
  const [sentAt, setSentAt] = React.useState<number | null>(null);
  const [nowTick, setNowTick] = React.useState(0);
  const [tried, setTried] = React.useState(false);
  const fileInput = React.useRef<HTMLInputElement>(null);

  // A one-second tick only while a code is outstanding, for the resend and expiry countdowns.
  React.useEffect(() => {
    if (stage !== "sent") return;
    const t = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [stage]);

  const elapsed = sentAt && nowTick ? Math.floor((nowTick - sentAt) / 1000) : 0;
  const resendIn = Math.max(0, RESEND_AFTER_SECONDS - elapsed);
  const expired = stage === "sent" && elapsed >= OTP_VALID_SECONDS;

  const errors = {
    name: !f.name.trim() ? "Enter the employee's full name." : undefined,
    designation: !f.designation ? "Select a designation." : undefined,
    joiningDate: !f.joiningDate ? "Enter the date of joining." : undefined,
    qualification: !f.qualification ? "Select the highest qualification." : undefined,
    docs: docs.length === 0 ? "Upload at least one qualification certificate." : undefined,
    mobile: !MOBILE.test(f.mobile) ? "Enter the employee's 10-digit mobile number." : stage !== "verified" ? "Verify the employee's mobile number." : undefined,
  };
  const valid = Object.values(errors).every((e) => !e);
  const err = (k: keyof typeof errors) => (tried ? errors[k] : undefined);

  // The one-time code is the employee's to read out, so a fill arrives with the number verified or
  // with no code sent yet — never with a code typed for them.
  useDemoFormFill("add-employee", (v, preset) => {
    if (!projectId) return;
    setF(Object.fromEntries(Object.keys(blank).map((k) => [k, v[k] ?? ""])) as typeof blank);
    setDocs((v.certificates ?? "").split(",").filter(Boolean).map((fileName, i) => ({ fileName, sizeKb: 340 + i * 95 })));
    setOtp("");
    setSentAt(null);
    setStage(v.mobileStage === "verified" ? "verified" : "idle");
    setTried(!preset.valid);
    onDemoOpen?.();
  });

  const close = () => {
    setF(blank);
    setDocs([]);
    setOtp("");
    setStage("idle");
    setSentAt(null);
    setTried(false);
    onClose();
  };

  const sendOtp = () => {
    if (!MOBILE.test(f.mobile)) {
      setTried(true);
      return;
    }
    setOtp("");
    setStage("sent");
    const t = Date.now();
    setSentAt(t);
    setNowTick(t);
  };

  const create = () => {
    setTried(true);
    if (!valid) return;
    onCreate({
      projectId,
      name: f.name.trim(),
      designation: f.designation,
      category: f.category || undefined,
      joiningDate: f.joiningDate,
      qualification: f.qualification,
      qualificationDocs: docs,
      mobile: f.mobile,
      mobileVerifiedAt: new Date().toISOString(),
      active: true,
    });
    close();
  };

  const masked = f.mobile ? `+91 XXXXXX${f.mobile.slice(-4)}` : "";

  return (
    <Modal
      open={open}
      onClose={close}
      /* Includes a code in progress: losing a sent OTP means sending another to the employee. */
      dirty={Object.values(f).some((v) => v !== "") || docs.length > 0 || otp !== "" || stage !== "idle"}
      title="Add Employee"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button appearance="outlined" onClick={close}>Cancel</Button>
          <Button onClick={create}>Add Employee</Button>
        </div>
      }
    >
      <p className="mb-4 text-body-2 text-ink-muted">Project: {projectName}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" id="emp-name" required error={err("name")}>
          {(c) => <Input {...c} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="off" />}
        </FormField>
        <FormField label="Designation" id="emp-designation" required error={err("designation")}>
          {(c) => (
            <Select {...c} value={f.designation} onChange={(e) => setF({ ...f, designation: e.target.value })}>
              <option value="">Select</option>
              {DESIGNATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          )}
        </FormField>
        <DatePicker label="Date of Joining" id="emp-joining" required error={err("joiningDate")} value={f.joiningDate} onChange={(iso) => setF({ ...f, joiningDate: iso })} />
        <FormField label="Category" id="emp-category" optional>
          {(c) => (
            <Select {...c} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}>
              <option value="">Select</option>
              {CATEGORIES.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
          )}
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Highest Qualification" id="emp-qualification" required error={err("qualification")}>
            {(c) => (
              <Select {...c} value={f.qualification} onChange={(e) => setF({ ...f, qualification: e.target.value })}>
                <option value="">Select</option>
                {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
              </Select>
            )}
          </FormField>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <FormField
            label="Qualification Certificates"
            id="emp-docs"
            required
            hint="PDF, JPG or PNG, up to 2 MB each. Select several files at once if needed."
            error={err("docs")}
          >
            {(c) => (
              <div>
                <input
                  ref={fileInput}
                  id={c.id}
                  aria-describedby={c["aria-describedby"]}
                  type="file"
                  multiple
                  accept="application/pdf,image/jpeg,image/png"
                  className="sr-only"
                  onChange={(e) => {
                    const picked = Array.from(e.target.files ?? []).map((file) => ({
                      fileName: file.name,
                      sizeKb: Math.max(1, Math.round(file.size / 1024)),
                    }));
                    setDocs((d) => [...d, ...picked]);
                    e.target.value = "";
                  }}
                />
                <Button appearance="outlined" size="sm" onClick={() => fileInput.current?.click()}>
                  <Icon name="upload" size={16} aria-hidden /> {docs.length ? "Add More Files" : "Choose Files"}
                </Button>
              </div>
            )}
          </FormField>
          {docs.length > 0 && (
            <FileList
              label="Certificates selected"
              files={docs.map((d, i) => ({ id: `${i}`, name: d.fileName, size: d.sizeKb * 1024, kind: "Qualification certificate", state: "ready" }))}
              onRemove={(id) => setDocs((d) => d.filter((_, i) => String(i) !== id))}
            />
          )}
        </div>

        <div className="space-y-3 sm:col-span-2">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[14rem] flex-1">
              <FormField
                label="Employee's Mobile Number"
                id="emp-mobile"
                required
                hint="A one-time code is sent to this number. The employee should be with you to read it out."
                error={stage === "idle" ? err("mobile") : undefined}
                success={stage === "verified" ? "Mobile number verified." : undefined}
              >
                {(c) => (
                  <Input
                    {...c}
                    type="tel"
                    inputMode="numeric"
                    value={f.mobile}
                    readOnly={stage === "verified"}
                    onChange={(e) => {
                      setF({ ...f, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) });
                      setStage("idle");
                    }}
                  />
                )}
              </FormField>
            </div>
            {stage === "idle" && (
              <Button appearance="outlined" onClick={sendOtp}>
                Send Code
              </Button>
            )}
            {stage === "verified" && (
              <Button appearance="text" onClick={() => { setStage("idle"); setOtp(""); }}>
                Change Number
              </Button>
            )}
          </div>

          {stage === "sent" && (
            <Card variant="outlined" role="group" aria-labelledby="emp-otp-label">
              <CardBody className="space-y-3">
                <p id="emp-otp-label" className="text-body-2 text-ink">
                  Enter the 6-digit code sent to the employee&apos;s mobile {masked}.
                </p>
                <OtpInput
                  label="One-time code"
                  value={otp}
                  onValueChange={setOtp}
                  length={6}
                  invalid={expired}
                  onComplete={() => undefined}
                />
                {expired && <Alert status="error">The code has expired. Send a new code.</Alert>}
                {/* Announced once at each change, not every second of the countdown (WCAG 4.1.3). */}
                <span className="sr-only" role="status" aria-live="polite">
                  {expired ? "The code has expired. Send a new code." : resendIn === 0 ? "You can now send a new code." : ""}
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" disabled={otp.length !== 6 || expired} onClick={() => setStage("verified")}>
                    Verify
                  </Button>
                  <Button appearance="text" size="sm" disabled={resendIn > 0} onClick={sendOtp}>
                    {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend Code"}
                  </Button>
                  <span className="text-body-3 text-ink-muted">Code valid for 10 minutes.</span>
                </div>
              </CardBody>
            </Card>
          )}
          {tried && stage === "sent" && <FieldMessage status="error">Verify the employee&apos;s mobile number.</FieldMessage>}
        </div>
      </div>
    </Modal>
  );
}

/* ── Details ──────────────────────────────────────────────────────────────── */

export function PersonDetailsDialog({
  person,
  onClose,
}: {
  person: { kind: "beneficiary"; data: Beneficiary } | { kind: "employee"; data: Employee } | null;
  onClose: () => void;
}) {
  if (!person) return null;
  const d = person.data;
  const date = (v?: string) => (v ? formatDate(v) : "");
  return (
    <Modal open onClose={onClose} title={d.name} size="md">
      {person.kind === "beneficiary" ? (
        <DescriptionList
          columns={2}
          items={[
            { term: "Status", value: person.data.active ? "Active" : "Deactivated" },
            { term: "Gender", value: person.data.gender },
            { term: "Category", value: person.data.category },
            { term: "Date of Admission", value: date(person.data.admissionDate) },
            { term: "Identity Document", value: person.data.idType },
            { term: "Document Number", value: person.data.idNumber },
            { term: "Date of Birth", value: date(person.data.dob) },
            { term: "Mobile Number", value: person.data.mobile },
            { term: "Parent / Guardian", value: person.data.guardian },
            { term: "Remarks", value: person.data.remarks },
          ]}
        />
      ) : (
        <div className="space-y-4">
          <DescriptionList
            columns={2}
            items={[
              { term: "Status", value: person.data.active ? "Active" : "Deactivated" },
              { term: "Designation", value: person.data.designation },
              { term: "Category", value: person.data.category },
              { term: "Date of Joining", value: date(person.data.joiningDate) },
              { term: "Highest Qualification", value: person.data.qualification },
              {
                term: "Mobile Number",
                value: person.data.mobile
                  ? `+91 XXXXXX${person.data.mobile.slice(-4)}${person.data.mobileVerifiedAt ? " · verified" : ""}`
                  : "",
              },
            ]}
          />
          {person.data.qualificationDocs?.length ? (
            <FileList
              label="Qualification certificates"
              files={person.data.qualificationDocs.map((q, i) => ({ id: `${i}`, name: q.fileName, size: q.sizeKb * 1024, kind: "Qualification certificate", state: "ready" }))}
            />
          ) : null}
        </div>
      )}
    </Modal>
  );
}
