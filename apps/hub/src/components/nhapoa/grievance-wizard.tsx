"use client";

import * as React from "react";
import Link from "next/link";
import { Button, Field, TextInput } from "@/components/nhapoa/ui";
import { DeclarationCheckbox, RadioGroup , Textarea, Stepper, Select, Card} from "@mosje/design-system";
import { GRIEVANCE_TYPES, SUBMISSION_ROLES } from "@/lib/nhapoa/citizen-data";
import { STATES, DISTRICTS } from "@/lib/nhapoa/store/seed";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import type { CaseType, CaseSource, ComplainantRole } from "@/lib/nhapoa/store/types";
import { Icon } from "@mosje/design-system";

const STEPS = ["Grievance Registration", "Informer Details", "Victim Details", "Grievance Details", "Review & Submit"];
/** Material Symbols name per submission role. */
const ROLE_ICON = { Informer: "visibility", Victim: "person", NGO: "group" } as const;

interface WizardData {
  type: string;
  hasFir: "Yes" | "No" | "";
  firNumber: string;
  role: string;
  idMobile: string;
  otpVerified: boolean;
  infName: string;
  infMobile: string;
  infState: string;
  infDistrict: string;
  infAddress: string;
  vicName: string;
  vicMobile: string;
  vicDob: string;
  category: string;
  incState: string;
  incDistrict: string;
  incLocation: string;
  incDate: string;
  description: string;
  documents: string[];
  declared: boolean;
}

const EMPTY: WizardData = {
  type: "", hasFir: "", firNumber: "", role: "", idMobile: "", otpVerified: false,
  infName: "", infMobile: "", infState: "", infDistrict: "", infAddress: "",
  vicName: "", vicMobile: "", vicDob: "",
  category: "", incState: "", incDistrict: "", incLocation: "", incDate: "", description: "", documents: [], declared: false,
};

function districtsFor(state: string): string[] {
  return DISTRICTS[state] ?? ["District 1", "District 2", "District 3"];
}

/**
 * The wizard is the whole page for a citizen, so its step title is the page <h1>.
 * The call-centre page wraps it under its own "Register Grievance" <h1>, so there the
 * step title is an <h2> at the section role — one h1 per page, no skipped level.
 */
function stepHeading(source: CaseSource): { Tag: "h1" | "h2"; className: string } {
  return source === "call-center"
    ? { Tag: "h2", className: "text-headline-3 text-ink" }
    : { Tag: "h1", className: "text-headline-1 text-ink" };
}

export function GrievanceWizard({
  source = "citizen",
  homeHref = "/portals/nhapoa",
  trackHref = "/portals/nhapoa/track-status",
}: {
  source?: CaseSource;
  homeHref?: string;
  trackHref?: string;
}) {
  const { createGrievance, state } = useNhapoa();
  const categoryOptions = state.categories.filter((c) => c.active).map((c) => c.name);
  const [step, setStep] = React.useState(0);
  const [d, setD] = React.useState<WizardData>(EMPTY);
  const [otpSent, setOtpSent] = React.useState(false);
  const [refNo, setRefNo] = React.useState<string | null>(null);
  const set = <K extends keyof WizardData>(k: K, v: WizardData[K]) => setD((s) => ({ ...s, [k]: v }));

  const canNext = (): boolean => {
    if (step === 0) return !!d.type && !!d.hasFir && !!d.role && d.otpVerified;
    if (step === 1) return !!d.infName && /^\d{10}$/.test(d.infMobile) && !!d.infState;
    if (step === 2) return d.role !== "Victim" ? true : !!d.vicName && /^\d{10}$/.test(d.vicMobile);
    if (step === 3) return !!d.category && !!d.incState && !!d.incDate && !!d.description;
    return d.declared;
  };

  function submit() {
    const c = createGrievance({
      type: (d.type === "Charge Sheet" ? "Charge-Sheet" : d.type) as CaseType,
      category: d.category,
      state: d.incState,
      district: d.incDistrict || districtsFor(d.incState)[0] || "District 1",
      source,
      complainantRole: d.role as ComplainantRole,
      complainant: { name: d.infName, mobile: d.infMobile, state: d.infState, district: d.infDistrict },
      victim: d.vicName ? { name: d.vicName, mobile: d.vicMobile } : undefined,
      details: d.description,
      hasFir: d.hasFir === "Yes",
      firNumber: d.firNumber || undefined,
    });
    setRefNo(c.refNo);
  }

  const { Tag: H, className: hClass } = stepHeading(source);

  if (refNo) {
    return (
      <Card className="mx-auto max-w-xl p-10 text-center">
        <Icon name="check_circle" size={56} className="mx-auto text-approve" />
        <H className={`mt-4 ${hClass}`}>Grievance submitted</H>
        <p className="mt-2 text-body-2 text-ink-muted">The grievance has been registered. Save the reference ID to track its progress.</p>
        <p className="mt-5 rounded-lg bg-surface-muted px-4 py-3 font-mono text-title-1 text-navy">{refNo}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={trackHref} className="rounded-lg bg-navy px-5 py-2.5 text-label-1 font-semibold text-white hover:bg-navy-800">Track Status</Link>
          <Link href={homeHref} className="rounded-lg border border-navy/30 px-5 py-2.5 text-label-1 font-semibold text-navy hover:bg-navy/5">Back to Home</Link>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-8"><Stepper steps={STEPS.map((label) => ({ label }))} current={step} /></div>

      <Card className="p-6 sm:p-8">
        {step === 0 && (
          <div className="space-y-7">
            <div>
              <H className={hClass}>Grievance Registration</H>
              <p className="mt-1 text-body-2 text-ink-muted">Select grievance type, FIR details, and your submission role to proceed.</p>
            </div>
            <RadioGroup legend="Grievance Related To" required name="type" orientation="horizontal" options={GRIEVANCE_TYPES.map((t) => ({ value: t, label: t }))} value={d.type || undefined} onChange={(v) => set("type", v)} />
            <RadioGroup legend="Do you have a registered FIR?" required name="hasFir" orientation="horizontal" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={d.hasFir || undefined} onChange={(v) => set("hasFir", v as "Yes" | "No")} />
            {d.hasFir === "Yes" && (
              <Field label="FIR Number">
                <TextInput value={d.firNumber} onChange={(e) => set("firNumber", e.target.value)} placeholder="e.g. PS/2026/145" />
              </Field>
            )}
            <div role="group" aria-label="Registration of Grievance By">
              <p className="mb-3 text-label-3 uppercase text-ink-hint">Registration of Grievance By</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {SUBMISSION_ROLES.map((r) => {
                  const iconName = ROLE_ICON[r.id as keyof typeof ROLE_ICON];
                  const active = d.role === r.id;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      aria-pressed={active}
                      onClick={() => set("role", r.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${active ? "border-navy bg-brandwash" : "border-line hover:border-navy/30"}`}
                    >
                      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-navy text-white" : "bg-navy/10 text-navy"}`}><Icon name={iconName} size={20} /></span>
                      <p className="mt-3 text-title-3 text-ink">{r.label}</p>
                      <p className="mt-1 text-body-3 text-ink-muted">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-3 text-label-3 uppercase text-ink-hint">Identity Verification</p>
              <Field label="Mobile No." required>
                <div className="flex gap-2">
                  <TextInput inputMode="numeric" maxLength={10} value={d.idMobile} onChange={(e) => set("idMobile", e.target.value.replace(/\D/g, ""))} placeholder="Enter 10-digit Mobile Number" />
                  {!d.otpVerified ? (
                    <Button type="button" variant="outline" onClick={() => setOtpSent(true)} disabled={!/^\d{10}$/.test(d.idMobile)}>
                      {otpSent ? "Verify" : "Send OTP"}
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-approve-bg px-3 text-label-1 font-semibold text-approve-fg"><Icon name="check_circle" size={16} /> Verified</span>
                  )}
                </div>
              </Field>
              {otpSent && !d.otpVerified && (
                <div className="mt-3 flex items-end gap-2">
                  <Field label="Enter OTP" className="w-40"><TextInput inputMode="numeric" maxLength={6} placeholder="6-digit OTP" onChange={(e) => { if (e.target.value.replace(/\D/g, "").length === 6) set("otpVerified", true); }} /></Field>
                  <span className="pb-3 text-body-3 text-ink-hint">OTP sent to your registered mobile (demo: any 6 digits).</span>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <StepForm source={source} title="Informer Details" desc="Details of the person filing this grievance.">
            <Field label="Full Name" required><TextInput value={d.infName} onChange={(e) => set("infName", e.target.value)} placeholder="Enter full name" /></Field>
            <Field label="Mobile" required><TextInput inputMode="numeric" maxLength={10} value={d.infMobile} onChange={(e) => set("infMobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" /></Field>
            <Field label="State" required><Select options={[...STATES].map((value) => ({ value, label: value }))} placeholder="Select State" value={d.infState} onChange={(e) => { set("infState", e.target.value); set("infDistrict", ""); }} /></Field>
            <Field label="District"><Select options={[...districtsFor(d.infState)].map((value) => ({ value, label: value }))} placeholder="Select District" value={d.infDistrict} onChange={(e) => set("infDistrict", e.target.value)} /></Field>
            <Field label="Address" className="sm:col-span-2"><Textarea rows={2} value={d.infAddress} onChange={(e) => set("infAddress", e.target.value)} placeholder="Street, landmark, locality" /></Field>
          </StepForm>
        )}

        {step === 2 && (
          <StepForm source={source} title="Victim Details" desc={d.role === "Informer" ? "Details of the affected person (optional if same as informer)." : "Details of the affected person."}>
            <Field label="Full Name" required={d.role === "Victim"}><TextInput value={d.vicName} onChange={(e) => set("vicName", e.target.value)} placeholder="Enter full name" /></Field>
            <Field label="Mobile"><TextInput inputMode="numeric" maxLength={10} value={d.vicMobile} onChange={(e) => set("vicMobile", e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" /></Field>
            <Field label="Date of Birth"><TextInput type="date" value={d.vicDob} onChange={(e) => set("vicDob", e.target.value)} /></Field>
          </StepForm>
        )}

        {step === 3 && (
          <StepForm source={source} title="Grievance Details" desc="Describe the incident and its category.">
            <Field label="Category (nature of atrocity)" required className="sm:col-span-2"><Select options={[...categoryOptions].map((value) => ({ value, label: value }))} placeholder="Select category" value={d.category} onChange={(e) => set("category", e.target.value)} /></Field>
            <Field label="State" required><Select options={[...STATES].map((value) => ({ value, label: value }))} placeholder="Select State" value={d.incState} onChange={(e) => { set("incState", e.target.value); set("incDistrict", ""); }} /></Field>
            <Field label="District"><Select options={[...districtsFor(d.incState)].map((value) => ({ value, label: value }))} placeholder="Select District" value={d.incDistrict} onChange={(e) => set("incDistrict", e.target.value)} /></Field>
            <Field label="Incident Location"><TextInput value={d.incLocation} onChange={(e) => set("incLocation", e.target.value)} placeholder="Village / street / landmark" /></Field>
            <Field label="Incident Date" required><TextInput type="date" value={d.incDate} onChange={(e) => set("incDate", e.target.value)} /></Field>
            <Field label="Description" required className="sm:col-span-2"><Textarea rows={4} value={d.description} onChange={(e) => set("description", e.target.value)} placeholder="Describe what happened in your own words" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-1.5 text-label-1 text-ink">Supporting Documents</p>
              <button type="button" onClick={() => set("documents", [...d.documents, `evidence-${d.documents.length + 1}.pdf`])} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-navy/30 bg-white px-4 py-6 text-label-1 font-semibold text-navy hover:bg-navy/5">
                <Icon name="cloud_upload" size={20} /> Add a document (max 5 MB · PDF/JPG/PNG)
              </button>
              {d.documents.map((f) => <p key={f} className="mt-2 rounded bg-surface-muted px-3 py-1.5 text-body-3 text-ink-muted">{f}</p>)}
            </div>
          </StepForm>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <H className={hClass}>Review Your Submission</H>
              <p className="mt-1 text-body-2 text-ink-muted">Please review all details carefully. You will not be able to edit after submission.</p>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-await-bg/60 px-4 py-3 text-body-2 text-await-fg">
              <Icon name="verified_user" size={16} className="mt-0.5 shrink-0" />
              Once submitted, the details of your grievance cannot be modified. Please verify everything is accurate before proceeding.
            </div>
            <ReviewBlock title="Informer Details" rows={[["Full Name", d.infName], ["Mobile", d.infMobile && `+91 ${d.infMobile}`], ["Location", [d.infDistrict, d.infState].filter(Boolean).join(", ")]]} />
            {d.vicName && <ReviewBlock title="Victim Details" rows={[["Full Name", d.vicName], ["Mobile", d.vicMobile && `+91 ${d.vicMobile}`], ["Date of Birth", d.vicDob]]} />}
            <ReviewBlock title="Grievance Details" rows={[["Type", d.type], ["Category", d.category], ["Location", [d.incLocation, d.incDistrict, d.incState].filter(Boolean).join(", ")], ["Incident Date", d.incDate], ["Description", d.description]]} />
            {d.documents.length > 0 && (
              <div>
                <p className="mb-2 text-label-3 uppercase text-ink-hint">Uploaded Documents ({d.documents.length})</p>
                {d.documents.map((f) => <p key={f} className="rounded border border-line px-3 py-2 text-body-2 text-ink">{f}</p>)}
              </div>
            )}
            <DeclarationCheckbox checked={d.declared} onChange={(on) => set("declared", on)}>
              <p>All information provided in this submission is true and accurate to the best of my knowledge. I understand that providing false information may lead to legal action under applicable laws.</p>
            </DeclarationCheckbox>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            <Icon name="arrow_back" size={16} /> Back
          </Button>
          {step < 4 ? (
            <Button type="button" onClick={() => canNext() && setStep((s) => s + 1)} disabled={!canNext()}>
              Save and Continue <Icon name="arrow_forward" size={16} />
            </Button>
          ) : (
            <Button type="button" onClick={submit} disabled={!d.declared}>Submit Grievance</Button>
          )}
        </div>
      </Card>
    </>
  );
}

function StepForm({ source, title, desc, children }: { source: CaseSource; title: string; desc: string; children: React.ReactNode }) {
  const { Tag: H, className: hClass } = stepHeading(source);
  return (
    <div className="space-y-6">
      <div>
        <H className={hClass}>{title}</H>
        <p className="mt-1 text-body-2 text-ink-muted">{desc}</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ReviewBlock({ title, rows }: { title: string; rows: [string, string | undefined][] }) {
  return (
    <div className="border-t border-line pt-5">
      <p className="mb-3 text-label-3 uppercase text-ink-hint">{title}</p>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <div className="text-body-3 text-ink-hint">{label}</div>
            <div className="mt-0.5 text-body-2 text-ink">{value || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
