"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Checkbox,
  FormField,
  Input,
  Radio,
  Select,
  Textarea,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { WIZARD_STEPS, validateGrant, type FieldDef } from "@/lib/e-anudaan/form-schema";

/**
 * The Grant-in-Aid application wizard.
 *
 * Eight steps under ONE URL — the live portal's actual behaviour, which the bundle's route table
 * (step-1 / step-2 / review / success) misrepresents. The stepper is display-only, exactly as
 * observed; advance is the single "Next →" at the foot of the form.
 */
export function GrantWizard({ schemeCode }: { schemeCode: string }) {
  const router = useRouter();
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const [step, setStep] = React.useState(0);
  const [declared, setDeclared] = React.useState(false);
  const [showPdfPreview, setShowPdfPreview] = React.useState(false);

  const ngo = state.ngos[0];
  const scheme = state.schemes.find((s) => s.code === schemeCode);
  if (!scheme && process.env.NODE_ENV === "development") {
    // optional debug logger for scheme validation
  }

  // Pre-fill initial state matching live AVYAY draft resumption state
  const [values, setValues] = React.useState<Record<string, string>>(() => ({
    caseType: "Ongoing / Renewal of an existing project",
    existingProjectId: "IP/AR/DIB/40040 — Project · FY 2026-27",
    financialYear: "2026-27",
    installment: "1st Installment",
    ngoName: ngo?.name ?? "harijan sevak sangh",
    darpanId: ngo?.darpanId ?? "LGN/00003712",
    projectId: "IP/AR/DIB/40040",
    statute: "Societies Registration Act XXI of 1860",
    registrationNo: ngo?.registrationNo ?? "34-35",
    registeredOn: "1997-12-12",
    address: "Harijan Sevak Sangh, Kingsway Camp, Delhi - 110009",
    nature: "Senior Citizens' Home — 50 beneficiaries",
    agencyType: "Voluntary Organisation (NGO)",
    cityCategory: "Y — city of 5 to 50 lakh",
    projectState: ngo?.state ?? "Arunachal Pradesh",
    projectDistrict: ngo?.district ?? "Dibang Valley",
    projectLocation: "Roing, Dibang Valley, Arunachal Pradesh - 792110",
    projectInCharge: "Ramesh Sharma (9876543210)",
    functionalStatus: "Functional",
    commencedOn: "1997-12-12",
    building: "Owned",
    totalArea: "4500",
    numberOfRooms: "12",
    accountNo: "000123456789",
    ifsc: "SBIN0000491",
    bankBranch: "State Bank of India, Main Branch",
    scBeneficiaries: "50",
    otherBeneficiaries: "0",
    totalBeneficiaries: "50",
    recurring: "12341324",
    nonRecurring: "43324",
    total: "12384648",
    dec_no_fee: "No",
    dec_blacklist: "No",
    authorisedName: "Akash Kumar",
    authorisedContact: "9999999999",
    place: "Delhi",
    declaredOn: "2026-08-16",
  }));

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));
  const current = WIZARD_STEPS[step]!;
  const isDocs = current.title === "Upload Documents";
  const isReview = current.title === "Review & Submit";
  const progressPercent = Math.round(((step + 1) / WIZARD_STEPS.length) * 100);

  const next = () => {
    const err = validateGrant(values);
    if (current.title === "Grant Sought & Declaration" && err) {
      toast(err, "error");
      return;
    }
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Sticky Progress & Auto-Save Command Header */}
      <div className="sticky top-2 z-30 rounded-xl border border-line bg-surface/95 p-4 shadow-sm backdrop-blur-md transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy font-bold text-sm">
              {step + 1}/8
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink">{current.title}</h2>
              <p className="text-xs text-ink-muted">Est. time remaining: ~{Math.max(1, 9 - step * 1.1).toFixed(0)} mins</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs flex items-center gap-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto-saved
            </Badge>
            <Button
              appearance="outlined"
              size="sm"
              onClick={() => toast("Draft application saved to cloud.", "success")}
            >
              💾 Save Draft
            </Button>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 rounded-full bg-line overflow-hidden">
            <div
              className="h-full bg-navy transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-navy">{progressPercent}%</span>
        </div>
      </div>

      {/* Stepper Navigation — Clickable for completed steps */}
      <nav aria-label="Application progress steps">
        <ol className="flex flex-wrap gap-x-4 gap-y-2">
          {WIZARD_STEPS.map((s, i) => {
            const isCompleted = i < step;
            const isCurrent = i === step;

            return (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted || isCurrent) {
                      setStep(i);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  disabled={!isCompleted && !isCurrent}
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                    isCurrent
                      ? "bg-navy text-white font-semibold shadow-sm"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                      : "bg-surface-muted text-ink-muted cursor-not-allowed opacity-60"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? "bg-white text-navy"
                        : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-line text-ink-muted"
                    }`}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </span>
                  <span>{s.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Yellow Draft Resumption Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50/90 p-4 text-sm text-amber-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-200/80 text-amber-800 font-bold">
            ℹ
          </div>
          <div>
            <p className="font-semibold">Continuing Saved Draft (FY 2026-27)</p>
            <p className="text-xs text-amber-800">Last saved 17 Aug 2026 at 11:42 AM. Your progress is retained across sessions.</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 shadow-sm hover:bg-amber-100 transition-all"
          onClick={() => {
            if (confirm("Are you sure you want to clear this draft and start fresh?")) {
              setValues({ caseType: "New project", financialYear: "2026-27" });
              toast("Form cleared for fresh application", "info");
            }
          }}
        >
          🔄 Start fresh application
        </button>
      </div>

      {/* Main Step Render */}
      {isDocs ? (
        <DocumentsStep />
      ) : isReview ? (
        <ReviewStep
          values={values}
          declared={declared}
          onDeclare={setDeclared}
          onJumpToStep={(s) => {
            setStep(s);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onPreviewPdf={() => setShowPdfPreview(true)}
        />
      ) : (
        <div className="space-y-5">
          {current.sections.map((section) => (
            <section key={section.title} className="rounded-xl border border-line bg-surface p-5 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                  <span>{section.title}</span>
                </h2>
                {section.lead && <p className="mt-1 text-sm text-ink-muted">{section.lead}</p>}
              </div>

              {/* Contextual Smart Calculators / Info Cards per Step */}
              {step === 0 && values.caseType === "Ongoing / Renewal of an existing project" && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-ink space-y-1">
                  <p className="font-bold text-navy flex items-center gap-1.5">
                    <span>📌</span> Selected Ongoing Project Details
                  </p>
                  <p><span className="font-medium text-ink-muted">Project ID:</span> IP/AR/DIB/40040 | <span className="font-medium text-ink-muted">Location:</span> Dibang Valley, Arunachal Pradesh</p>
                  <p><span className="font-medium text-ink-muted">Last Inspection:</span> Satisfactory (12 Jan 2026) | <span className="font-medium text-ink-muted">Beneficiaries:</span> 50 Senior Citizens</p>
                </div>
              )}

              {step === 2 && (
                <CentralShareCalculator agencyType={values.agencyType} stateName={values.projectState} />
              )}

              {step === 4 && (
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-blue-50 text-blue-800 border-blue-200">
                    🧮 Total Beneficiaries: {Number(values.scBeneficiaries || 0) + Number(values.otherBeneficiaries || 0)}
                  </Badge>
                  {values.totalArea && values.numberOfRooms && (
                    <Badge className="bg-purple-50 text-purple-800 border-purple-200">
                      🏢 Area Density: ~{(Number(values.totalArea) / Number(values.numberOfRooms || 1)).toFixed(0)} sq.ft per room
                    </Badge>
                  )}
                </div>
              )}

              {step === 5 && (
                <GrantCalculationCard
                  recurring={values.recurring}
                  nonRecurring={values.nonRecurring}
                  total={values.total}
                />
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields
                  .filter((f) => {
                    if (step === 0 && values.caseType === "New project") {
                      return f.name === "caseType" || f.name === "financialYear";
                    }
                    return true;
                  })
                  .map((f) => (
                    <Field key={f.name} field={f} value={values[f.name] ?? ""} onChange={(v) => set(f.name, v)} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between rounded-xl border border-line bg-surface p-4 shadow-sm">
        <Button
          appearance="outlined"
          disabled={step === 0}
          onClick={() => {
            setStep((s) => Math.max(s - 1, 0));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          ← Back
        </Button>
        {isReview ? (
          <Button
            disabled={!declared}
            onClick={() => {
              toast("Application submitted successfully to Ministry review chain!", "success");
              router.push("/portals/e-anudaan/ngo/my-applications");
            }}
          >
            Submit Application ✓
          </Button>
        ) : (
          <Button onClick={next}>Next Step →</Button>
        )}
      </div>

      {/* PDF Preview Modal */}
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="text-lg font-bold text-ink">Draft Application Form Preview (AVYAY)</h3>
              <button
                type="button"
                onClick={() => setShowPdfPreview(false)}
                className="text-ink-muted hover:text-ink font-bold"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto space-y-3 p-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg">
              <p className="font-bold text-center text-sm">MINISTRY OF SOCIAL JUSTICE &amp; EMPOWERMENT</p>
              <p className="text-center font-semibold">AVYAY (Atal Vayo Abhyuday Yojana) — FY 2026-27</p>
              <hr />
              <p>Project ID: {values.projectId}</p>
              <p>NGO Name: {values.ngoName} (Darpan ID: {values.darpanId})</p>
              <p>Nature of Project: {values.nature}</p>
              <p>Location: {values.projectLocation}</p>
              <p>Grant Sought: Recurring ₹{values.recurring} + Non-Recurring ₹{values.nonRecurring} = Total ₹{values.total}</p>
              <p>Authorised Representative: {values.authorisedName} ({values.authorisedContact})</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button appearance="outlined" onClick={() => setShowPdfPreview(false)}>
                Close
              </Button>
              <Button onClick={() => toast("Draft PDF downloaded successfully.", "success")}>
                📥 Download PDF Draft
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Dynamic Central Share Percentage Calculator Helper Card */
function CentralShareCalculator({ agencyType, stateName }: { agencyType?: string; stateName?: string }) {
  const isGovtOrPri = agencyType && ["State Government", "Urban Local Body (ULB)", "Panchayati Raj Institution (PRI)", "Regional Resource & Training Centre (RRTC)"].includes(agencyType);
  const isHimalayanOrNe = stateName && ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Himachal Pradesh", "Uttarakhand", "Jammu & Kashmir", "Ladakh"].includes(stateName);

  let share = "90%";
  let ruleReason = "Voluntary Organisation (NGO) in standard state";

  if (isGovtOrPri) {
    share = "100%";
    ruleReason = "Government / ULB / PRI / RRTC implementing agency";
  } else if (isHimalayanOrNe) {
    share = "95%";
    ruleReason = "NE & Himalayan State project location";
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-950 space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-bold flex items-center gap-1">
          💡 Central Financial Assistance Share: <span className="text-blue-700 font-extrabold text-sm">{share}</span>
        </span>
        <Badge className="bg-blue-100 text-blue-800 text-[10px]">Rule-Based Derived Share</Badge>
      </div>
      <p className="text-blue-900/80">Reason: {ruleReason}. Remaining share is borne by the implementing agency.</p>
    </div>
  );
}

/** Real-time Grant Calculation Card */
function GrantCalculationCard({ recurring, nonRecurring, total }: { recurring?: string; nonRecurring?: string; total?: string }) {
  const r = Number(recurring || 0);
  const nr = Number(nonRecurring || 0);
  const calcTotal = r + nr;
  const match = Number(total || 0) === calcTotal;

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-950 space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-bold">🧮 Live Financial Breakdown:</span>
        <Badge className={match ? "bg-emerald-200 text-emerald-900" : "bg-amber-200 text-amber-900"}>
          {match ? "Formula Balanced ✓" : "Mismatch Warning"}
        </Badge>
      </div>
      <p className="font-mono">
        Recurring (₹{r.toLocaleString("en-IN")}) + Non-Recurring (₹{nr.toLocaleString("en-IN")}) ={" "}
        <span className="font-bold text-emerald-900">Total Grant (₹{calcTotal.toLocaleString("en-IN")})</span>
      </p>
    </div>
  );
}

function Field({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  const label = field.required ? `${field.label} *` : field.label;
  const wide = field.kind === "textarea" || field.kind === "radio";

  if (field.kind === "radio") {
    return (
      <fieldset className={wide ? "sm:col-span-2" : undefined}>
        <legend className="text-sm font-semibold text-ink">{label}</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {(field.options ?? []).map((o) => (
            <Radio
              key={o}
              name={field.name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              label={o}
            />
          ))}
        </div>
        {field.help && <p className="mt-1 text-xs text-ink-muted">{field.help}</p>}
      </fieldset>
    );
  }

  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <FormField label={label} id={field.name} hint={field.help}>
        {(control) =>
          field.kind === "select" ? (
            <Select {...control} value={value} onChange={(e) => onChange(e.target.value)}>
              <option value="">Select…</option>
              {(field.options ?? []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          ) : field.kind === "textarea" ? (
            <Textarea {...control} value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
          ) : (
            <Input
              {...control}
              type={field.kind === "number" ? "number" : field.kind}
              value={value}
              readOnly={field.readOnly}
              onChange={(e) => onChange(e.target.value)}
            />
          )
        }
      </FormField>
    </div>
  );
}

/** Step 6 — 9 Mandatory AVYAY Documents Checklist with AI Verification Badges */
function DocumentsStep() {
  const avyayDocs = [
    {
      id: "doc1",
      title: "1. Registration Certificate",
      status: "Uploaded",
      file: "Approval for Renaming of NHAA portal.pdf - 667 KB",
      verification: null,
    },
    {
      id: "doc2",
      title: "2. Annual Report of NGO — previous FY",
      status: "Uploaded",
      file: "Annual_Report_FY2025-26.pdf - 1 KB",
      badge: "Verified - 100%",
      verification: "✓ Document verified — Annual Report of NGO. Valid Annual Report for FY 2025-26 from Sample Welfare Society with all required information present. Financial Year: 2025-26. Organisation Name: Sample Welfare Society",
    },
    {
      id: "doc3",
      title: "3. Bank Details of the Project",
      status: "Uploaded",
      file: "Bank_Details_Project.pdf - 1 KB",
      badge: "Verified - 95%",
      verification: "✓ Document verified — Bank Details of the Project. Valid bank details document with all required fields present; account name includes project designation, IFSC code verified as 11-character format. IFSC: SBIN0000491. Account Name: Sample Welfare Society - AVYAY Project. Account Number: 000123456789",
    },
    {
      id: "doc4",
      title: "4. Beneficiary List",
      status: "Uploaded",
      file: "Beneficiary_List.pdf - 1 KB",
      badge: "Verified - 95%",
      verification: "✓ Document verified — Beneficiary List. Valid beneficiary list for FY 2025-26 with 50 senior citizens; confirm year requirement. Beneficiary Count: 50",
    },
    { id: "doc5", title: "5. Staff List", status: "Pending" },
    { id: "doc6", title: "6. Rent Agreement", status: "Pending" },
    { id: "doc7", title: "7. Budget Estimate", status: "Pending" },
    { id: "doc8", title: "8. Audited Accounts of Project", status: "Pending" },
    { id: "doc9", title: "9. Utilisation Certificate (GFR-12A)", status: "Pending" },
  ];

  const uploadedCount = avyayDocs.filter((d) => d.status === "Uploaded").length;

  return (
    <section className="rounded-xl border border-line bg-surface p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div>
          <h2 className="text-base font-bold text-ink">Mandatory Document Upload Checklist</h2>
          <p className="text-xs text-ink-muted">PDF · Max 5 MB per file · 9 mandatory slots.</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 font-bold text-xs">
          {uploadedCount} / 9 Uploaded
        </Badge>
      </div>

      <div className="space-y-3">
        {avyayDocs.map((doc) => (
          <div key={doc.id} className="rounded-lg border border-line p-4 space-y-2 bg-surface hover:border-navy/30 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-ink">{doc.title}</span>
                <span className="text-xs text-ink-muted cursor-help" title="Mandatory document under AVYAY scheme guidelines">ⓘ</span>
                {doc.badge && (
                  <Badge className="bg-emerald-600 text-white font-medium text-xs">
                    {doc.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {doc.status === "Uploaded" ? (
                  <>
                    <Badge className="bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      Uploaded
                    </Badge>
                    <Button appearance="outlined" size="sm">
                      👁 View
                    </Button>
                    <Button appearance="outlined" size="sm">
                      Replace
                    </Button>
                    <Button appearance="outlined" size="sm">
                      Re-verify
                    </Button>
                  </>
                ) : (
                  <Button appearance="outlined" size="sm">
                    📁 Upload PDF
                  </Button>
                )}
              </div>
            </div>

            {doc.file && <p className="text-xs font-mono text-ink-muted">{doc.file}</p>}

            {doc.verification && (
              <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
                {doc.verification}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/** Step 7 — Review & Submit read-back with Direct Jump-to-Edit links */
function ReviewStep({
  values,
  declared,
  onDeclare,
  onJumpToStep,
  onPreviewPdf,
}: {
  values: Record<string, string>;
  declared: boolean;
  onDeclare: (v: boolean) => void;
  onJumpToStep: (step: number) => void;
  onPreviewPdf: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50/80 p-4">
        <div>
          <h3 className="font-bold text-blue-950 text-sm">Final Application Summary Review</h3>
          <p className="text-xs text-blue-900/80">Please review all sections carefully before submitting to the Ministry.</p>
        </div>
        <Button appearance="outlined" size="sm" onClick={onPreviewPdf}>
          👁 Preview Draft PDF
        </Button>
      </div>

      {WIZARD_STEPS.slice(0, 5).map((stepDef, idx) => (
        <section key={stepDef.title} className="rounded-xl border border-line bg-surface p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h2 className="text-sm font-bold text-navy flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-navy text-white text-xs">
                {idx + 1}
              </span>
              {stepDef.title}
            </h2>
            <Button
              appearance="outlined"
              size="sm"
              onClick={() => onJumpToStep(idx)}
              className="text-xs"
            >
              ✏️ Edit Section
            </Button>
          </div>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {stepDef.sections.flatMap((sec) => sec.fields).map((f) => (
              <div key={f.name} className="flex flex-col border-b border-line/40 pb-1.5">
                <dt className="text-[11px] text-ink-muted font-medium">{f.label}</dt>
                <dd className="text-xs font-semibold text-ink">{values[f.name] || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="rounded-xl border border-line bg-surface p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-navy border-b border-line pb-2">
          Legal Declaration &amp; Authorised Submission
        </h2>
        <Checkbox
          checked={declared}
          onChange={(e) => onDeclare(e.target.checked)}
          label="I hereby declare that all particulars furnished in this application form are true, accurate and complete to the best of my knowledge and belief. No material facts have been concealed."
        />
      </section>
    </div>
  );
}
