"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Field, TextInput, SectionEyebrow, cnField } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import { DEMO_CITIZEN } from "@/lib/tg/store/seed";
import {
  STATES,
  STATE_DISTRICTS,
  EDUCATION_LEVELS,
  CASTE_CATEGORIES,
  INCOME_BANDS,
  ID_PROOF_TYPES,
} from "@/lib/tg/states";
import type { ApplicantDetails, ApplicationType, AppDocument } from "@/lib/tg/store/types";
import { Icon, RadioGroup , Stepper, Select, Card} from "@mosje/design-system";

type Phase = "type" | "method" | "manual" | "form" | "done";

const FORM_STEPS = [
  { label: "Basic Details" },
  { label: "Documents" },
  { label: "Review" },
];

const emptyDocs = {
  idProof: "",
  photo: "",
  signature: "",
  affidavit: "",
};

export default function ApplyPage() {
  const router = useRouter();
  const { createApplication } = useTg();

  const [phase, setPhase] = React.useState<Phase>("type");
  const [type, setType] = React.useState<ApplicationType>("New");
  const [viaDigiLocker, setViaDigiLocker] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [newId, setNewId] = React.useState("");

  // Prefilled with the demo citizen so the created application links back to
  // their dashboard (matched by email).
  const [form, setForm] = React.useState<ApplicantDetails>({
    ...DEMO_CITIZEN,
    guardianName: "",
    address: "",
    pincode: "",
  });
  const [idProofType, setIdProofType] = React.useState<string>(ID_PROOF_TYPES[0]);
  const [docs, setDocs] = React.useState(emptyDocs);
  const [sameAddress, setSameAddress] = React.useState("Yes");

  const set = <K extends keyof ApplicantDetails>(k: K, v: ApplicantDetails[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const districts = STATE_DISTRICTS[form.state] ?? [];

  function submit() {
    const documents: AppDocument[] = [
      { type: `ID Proof (${idProofType})`, filename: docs.idProof || "id-proof.pdf", sizeKb: 128 },
      { type: "Passport Photo", filename: docs.photo || "photo.jpg", sizeKb: 94 },
      { type: "Signature / Thumb Impression", filename: docs.signature || "signature.jpg", sizeKb: 19 },
      { type: "Affidavit (Rule 2020)", filename: docs.affidavit || "affidavit.pdf", sizeKb: 210 },
    ];
    const app = createApplication({ type, applicant: form, viaDigiLocker, documents });
    setNewId(app.id);
    setPhase("done");
  }

  /* ---------------------------------------------------------------- Phase: type */
  if (phase === "type") {
    return (
      <Wrap title="How would you like to proceed?" subtitle="Selecting the correct option helps us verify your details and process your request.">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectCard
            icon="badge"
            active={type === "New"}
            title="New Transgender Certificate & ID"
            desc="Apply here if you are registering for the first time. This covers the Identity Card."
            onClick={() => setType("New")}
          />
          <SelectCard
            icon="refresh"
            active={type === "Revised"}
            title="Revised Certificate (Post-Medical Intervention)"
            desc="Choose this if you already have a Transgender Certificate but need to update your details."
            onClick={() => setType("Revised")}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setPhase("method")}>Continue with Selection <Icon name="arrow_forward" size={16} /></Button>
        </div>
      </Wrap>
    );
  }

  /* -------------------------------------------------------------- Phase: method */
  if (phase === "method") {
    return (
      <Wrap
        title="How would you like to enter your details?"
        subtitle="You can either fetch your verified identity details automatically via DigiLocker, or enter them manually."
        onBack={() => setPhase("type")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectCard
            icon="verified_user"
            active={viaDigiLocker}
            title="Fetch details with DigiLocker"
            desc="Securely retrieve your verified identity details (Name, Date of Birth, Gender) directly."
            onClick={() => setViaDigiLocker(true)}
          />
          <SelectCard
            icon="edit"
            active={!viaDigiLocker}
            title="Enter details manually"
            desc="Fill in your personal and identity details yourself. You will need to upload supporting documents."
            onClick={() => setViaDigiLocker(false)}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setPhase(viaDigiLocker ? "form" : "manual")}>
            Continue <Icon name="arrow_forward" size={16} />
          </Button>
        </div>
      </Wrap>
    );
  }

  /* -------------------------------------------------------------- Phase: manual */
  if (phase === "manual") {
    return (
      <Wrap
        title="Proceed with manual application"
        subtitle="Since we could not automatically fetch your details at this time, you can continue by entering them yourself."
        onBack={() => setPhase("method")}
      >
        <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
          <h3 className="text-title-3 text-ink">How this works</h3>
          <ol className="mt-4 space-y-4">
            <HowStep n={1} title="Enter Details" desc="Fill in your Name, Date of Birth, and Gender exactly as they appear on your ID document." />
            <HowStep n={2} title="Upload Proof" desc="You will need to upload a self-attested copy of your Affidavit and Photo." />
          </ol>
          <p className="mt-4 text-body-3 text-ink-hint">
            Manual applications are processed with the same priority and timeline as digital ones.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setViaDigiLocker(true); setPhase("form"); }}>
            I prefer to try DigiLocker again later
          </Button>
          <Button onClick={() => setPhase("form")}>Continue to Enter Details <Icon name="arrow_forward" size={16} /></Button>
        </div>
      </Wrap>
    );
  }

  /* ---------------------------------------------------------------- Phase: done */
  if (phase === "done") {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-approve-bg text-approve-fg">
          <Icon name="check_circle" size={32} />
        </span>
        <h1 className="mt-5 text-headline-1 text-ink">Application Submitted</h1>
        <p className="mt-2 text-body-2 text-ink-muted">
          Your {type} Certificate application <span className="font-mono font-semibold text-navy">{newId}</span> has been
          submitted and is now under review. You can track its status from your dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => router.push("/portals/tg/citizen/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- Phase: form */
  const docsComplete = Boolean(docs.idProof && docs.photo && docs.signature && docs.affidavit);
  const canNextBasic =
    form.fullLegalName && form.chosenName && form.dob && form.mobile && form.email && form.state && form.district && form.address && form.pincode;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Stepper steps={FORM_STEPS.map((s) => ({ label: s.label }))} current={step} />
      </div>

      {step === 0 && (
        <Card className="space-y-6 p-6">
          <div>
            <h1 className="text-headline-1 text-ink">Basic Identity Details</h1>
            <p className="mt-1 text-body-2 text-ink-muted">
              Please enter your details exactly as they appear on your official ID proof (Aadhaar, etc.).
            </p>
          </div>

          <section>
            <SectionEyebrow>Self-Perceived Identity</SectionEyebrow>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Legal Name" required><TextInput value={form.fullLegalName} onChange={(e) => set("fullLegalName", e.target.value)} placeholder="Name as per ID proof" /></Field>
              <Field label="Changed / Chosen Name" required><TextInput value={form.chosenName} onChange={(e) => set("chosenName", e.target.value)} placeholder="Name you want to be addressed by" /></Field>
              <Field label="Name to Print on Certificate">
                <Select options={["Legal Name", "Chosen Name"].map((value) => ({ value, label: value }))} value={form.nameToPrint === form.fullLegalName ? "Legal Name" : "Chosen Name"} onChange={(e) => set("nameToPrint", e.target.value === "Legal Name" ? form.fullLegalName : form.chosenName)} />
              </Field>
              <Field label="Date of Birth" required><TextInput type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} /></Field>
              <Field label="Gender (At Birth)">
                <Select options={["Male", "Female"].map((value) => ({ value, label: value }))} value={form.genderAtBirth} onChange={(e) => set("genderAtBirth", e.target.value as ApplicantDetails["genderAtBirth"])} />
              </Field>
              <Field label="Gender Requested">
                <Select options={["Transgender", "Male", "Female"].map((value) => ({ value, label: value }))} value={form.genderRequested} onChange={(e) => set("genderRequested", e.target.value as ApplicantDetails["genderRequested"])} />
              </Field>
              <Field label="Parent / Guardian Name" required><TextInput value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} placeholder="Father, Mother, or Guardian's Name" /></Field>
            </div>
          </section>

          <section>
            <SectionEyebrow>Socio-Economic Background</SectionEyebrow>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Educational Qualification"><Select options={[...EDUCATION_LEVELS].map((value) => ({ value, label: value }))} value={form.education} onChange={(e) => set("education", e.target.value)} /></Field>
              <Field label="Caste Category"><Select options={[...CASTE_CATEGORIES].map((value) => ({ value, label: value }))} value={form.caste} onChange={(e) => set("caste", e.target.value)} /></Field>
              <Field label="Annual Income"><Select options={[...INCOME_BANDS].map((value) => ({ value, label: value }))} value={form.annualIncome} onChange={(e) => set("annualIncome", e.target.value)} /></Field>
            </div>
          </section>

          <section>
            <SectionEyebrow>Address & Contact Information</SectionEyebrow>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Mobile Number" required><TextInput inputMode="numeric" maxLength={10} value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="Enter 10-digit number" /></Field>
              <Field label="Email Address" required>
                <TextInput type="email" value={form.email} readOnly aria-readonly="true" className="bg-surface-muted text-ink-muted" />
                <span className="mt-1 block text-body-3 text-ink-hint">Linked to your signed-in account.</span>
              </Field>
              <Field label="State"><Select options={[...STATES].map((value) => ({ value, label: value }))} value={form.state} onChange={(e) => { set("state", e.target.value); set("district", STATE_DISTRICTS[e.target.value]?.[0] ?? ""); }} /></Field>
              <Field label="District"><Select options={[...districts].map((value) => ({ value, label: value }))} value={form.district} onChange={(e) => set("district", e.target.value)} /></Field>
              <Field label="Pincode" required><TextInput inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value)} placeholder="6-digit Pincode" /></Field>
              <Field label="Full Address" required><TextInput value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="House, Street, Locality" /></Field>
            </div>
            <RadioGroup className="mt-4" legend="Is your correspondence address the same as your permanent address?" name="sameAddress" orientation="horizontal" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={sameAddress} onChange={(v) => setSameAddress(v as "Yes" | "No")} />
          </section>

          <div className="flex items-center justify-between border-t border-line pt-5">
            <Button variant="ghost" onClick={() => setPhase("method")}><Icon name="arrow_back" size={16} /> Back</Button>
            <Button onClick={() => setStep(1)} disabled={!canNextBasic}>Save and Continue <Icon name="arrow_forward" size={16} /></Button>
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card className="space-y-6 p-6">
          <div>
            <h1 className="text-headline-1 text-ink">Required Documents</h1>
            <p className="mt-1 text-body-2 text-ink-muted">Upload self-attested copies. PDF/JPG/PNG • Max 2MB each.</p>
          </div>

          <Field label="ID Proof Type" className="max-w-xs">
            <Select options={[...ID_PROOF_TYPES].map((value) => ({ value, label: value }))} value={idProofType} onChange={(e) => setIdProofType(e.target.value)} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <UploadField label="Upload ID Proof" hint="PDF/JPG/PNG • Max 2MB" value={docs.idProof} onFile={(name) => setDocs({ ...docs, idProof: name })} />
            <UploadField label="Passport Photo" hint="JPG/PNG • Max 2MB" value={docs.photo} onFile={(name) => setDocs({ ...docs, photo: name })} />
            <UploadField label="Signature / Thumb Impression" hint="JPG/PNG • Max 2MB" value={docs.signature} onFile={(name) => setDocs({ ...docs, signature: name })} />
            <UploadField label="Affidavit (Rule 2020)" hint="PDF Only • Max 2MB" value={docs.affidavit} onFile={(name) => setDocs({ ...docs, affidavit: name })} />
          </div>

          <div className="flex items-center justify-between border-t border-line pt-5">
            <Button variant="ghost" onClick={() => setStep(0)}><Icon name="arrow_back" size={16} /> Back</Button>
            <Button onClick={() => setStep(2)} disabled={!docsComplete}>Save and Review <Icon name="arrow_forward" size={16} /></Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-6 p-6">
          <div>
            <h1 className="text-headline-1 text-ink">Review & Submit</h1>
            <p className="mt-1 text-body-2 text-ink-muted">Please verify your details before submitting. You cannot edit after submission.</p>
          </div>

          <ReviewGrid rows={[
            ["Application Type", `${type} Certificate`],
            ["Entry Method", viaDigiLocker ? "DigiLocker" : "Manual"],
            ["Full Legal Name", form.fullLegalName],
            ["Chosen Name", form.chosenName],
            ["Name on Certificate", form.nameToPrint || form.chosenName],
            ["Gender (At Birth)", form.genderAtBirth],
            ["Gender Requested", form.genderRequested],
            ["Date of Birth", form.dob],
            ["Guardian", form.guardianName],
            ["Education", form.education],
            ["Caste", form.caste],
            ["Annual Income", form.annualIncome],
            ["Mobile", form.mobile],
            ["Email", form.email],
            ["Address", `${form.address}, ${form.district}, ${form.state} - ${form.pincode}`],
          ]} />

          <div>
            <SectionEyebrow>Documents</SectionEyebrow>
            <ul className="space-y-1.5 text-body-2 text-ink">
              <li className="flex items-center gap-2"><Icon name="task" size={16} className="text-approve-fg" /> {idProofType}: {docs.idProof || "id-proof.pdf"}</li>
              <li className="flex items-center gap-2"><Icon name="task" size={16} className="text-approve-fg" /> Passport Photo: {docs.photo || "photo.jpg"}</li>
              <li className="flex items-center gap-2"><Icon name="task" size={16} className="text-approve-fg" /> Signature: {docs.signature || "signature.jpg"}</li>
              <li className="flex items-center gap-2"><Icon name="task" size={16} className="text-approve-fg" /> Affidavit: {docs.affidavit || "affidavit.pdf"}</li>
            </ul>
          </div>

          <div className="flex items-center justify-between border-t border-line pt-5">
            <Button variant="ghost" onClick={() => setStep(1)}><Icon name="arrow_back" size={16} /> Back</Button>
            <Button onClick={submit}>Submit Application <Icon name="check_circle" size={16} /></Button>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ helpers */
function Wrap({ title, subtitle, onBack, children }: { title: string; subtitle: string; onBack?: () => void; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl">
      {onBack && (
        <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-label-1 font-semibold text-ink-muted hover:text-navy">
          <Icon name="arrow_back" size={16} /> Back
        </button>
      )}
      <h1 className="text-headline-1 text-ink">{title}</h1>
      <p className="mt-1 mb-6 text-body-2 text-ink-muted">{subtitle}</p>
      {children}
    </div>
  );
}

function SelectCard({ icon: iconName, title, desc, active, onClick }: { icon: string; title: string; desc: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex flex-col items-start rounded-2xl border-2 p-5 text-left transition ${active ? "border-navy bg-navy/5" : "border-line bg-white hover:border-navy/40"}`}
    >
      <span className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${active ? "bg-navy text-white" : "bg-navy/10 text-navy"}`}>
        <Icon name={iconName} size={20} />
      </span>
      <span className="text-title-2 text-ink">{title}</span>
      <span className="mt-1 text-body-2 text-ink-muted">{desc}</span>
    </button>
  );
}

function HowStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-label-1 font-bold text-white">{n}</span>
      <div>
        <div className="text-body-2 font-semibold text-ink">{title}</div>
        <div className="text-body-2 text-ink-muted">{desc}</div>
      </div>
    </li>
  );
}

function UploadField({ label, hint, value, onFile }: { label: string; hint: string; value: string; onFile: (name: string) => void }) {
  const id = React.useId();
  return (
    <div>
      <span className={cnField}>{label} <span className="text-reject-fg">*</span></span>
      <label htmlFor={id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-navy/30 bg-surface-muted px-4 py-3 text-label-1 hover:border-navy/50">
        {value ? <Icon name="task" size={20} className="text-approve-fg" /> : <Icon name="upload" size={20} className="text-navy" />}
        <span className="min-w-0">
          <span className="block truncate font-medium text-ink">{value || "Click to upload"}</span>
          <span className="block text-body-3 text-ink-hint">{hint}</span>
        </span>
      </label>
      <input
        id={id}
        type="file"
        aria-label={label}
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0]?.name ?? "uploaded-file")}
      />
    </div>
  );
}

function ReviewGrid({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <dt className="text-label-3 uppercase text-ink-hint">{k}</dt>
          <dd className="text-body-2 text-ink">{v || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
