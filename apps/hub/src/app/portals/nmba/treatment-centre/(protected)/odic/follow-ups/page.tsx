"use client";

import * as React from "react";
import { Button, Input, Select, FormField, Checkbox } from "@mosje/design-system";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { DataTable } from "@/components/nmba/data-table";
import type { ColumnDef } from "@/components/nmba/data-table";
import type { FollowUp } from "@/lib/nmba/treatment-centre/types";
import { useToast } from "@/components/nmba/toast";
import { YES_NO_NR, INTERVENTION_REFERRAL } from "@/lib/nmba/treatment-centre/master-data";

function labelOf(options: { label: string; value: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

type Row = FollowUp & { sno: number };

const columns: ColumnDef<Row>[] = [
  { key: "sno", header: "S.No" },
  { key: "registrationNumber", header: "Registration Number", render: (r) => <span className="font-mono text-navy">{r.registrationNumber}</span> },
  { key: "name", header: "Beneficiary Name" },
  { key: "followUpDate", header: "Date of last Visit" },
  { key: "followUpNumber", header: "Follow-Up No." },
  {
    key: "referralMadeTo",
    header: "Referral Made To",
    render: (r) => <>{r.referralMadeTo || "—"}</>,
    exportValue: (r) => r.referralMadeTo ?? "",
  },
  {
    key: "nextFollowUpDate",
    header: "Date of Next Follow Up",
    render: (r) => <>{r.nextFollowUpDate || "—"}</>,
    exportValue: (r) => r.nextFollowUpDate ?? "",
  },
];

const INITIAL = {
  registrationNumber: "",
  followUpDate: "",
  medicalDetails: "",
  psychosocial: "",
  referralMadeTo: "",
  nextFollowUpDate: "",
};

export default function OdicFollowUpsPage() {
  const store = useTCStore();
  const { toast } = useToast();

  const [f, setF] = React.useState(INITIAL);
  const [interventionTypes, setInterventionTypes] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<Set<string>>(new Set());

  const set = (key: keyof typeof INITIAL) => (value: string) => setF((prev) => ({ ...prev, [key]: value }));

  const toggleIntervention = (value: string) =>
    setInterventionTypes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const err = (k: string) => (errors.has(k) ? "This field is required." : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = new Set<string>();
    if (!f.registrationNumber.trim()) missing.add("registrationNumber");
    if (!f.followUpDate) missing.add("followUpDate");
    if (interventionTypes.length === 0) missing.add("interventionTypes");
    if (interventionTypes.includes("Medical") && !f.medicalDetails.trim()) missing.add("medicalDetails");
    if (interventionTypes.includes("Psychosocial") && !f.psychosocial) missing.add("psychosocial");
    if (!f.referralMadeTo) missing.add("referralMadeTo");
    if (!f.nextFollowUpDate) missing.add("nextFollowUpDate");
    if (missing.size > 0) {
      setErrors(missing);
      return;
    }

    // Look up the beneficiary so the list shows a friendly name where possible.
    const match = store.beneficiaries.find((b) => b.registrationNumber === f.registrationNumber.trim());
    const priorCount = store.followUps.filter((p) => p.registrationNumber === f.registrationNumber.trim()).length;

    store.addFollowUp({
      registrationNumber: f.registrationNumber.trim(),
      name: match?.name ?? "—",
      followUpDate: f.followUpDate,
      followUpNumber: priorCount + 1,
      status: "Completed",
      interventionTypes,
      medicalDetails: interventionTypes.includes("Medical") ? f.medicalDetails.trim() : undefined,
      psychosocial: interventionTypes.includes("Psychosocial") ? labelOf(YES_NO_NR, f.psychosocial) : undefined,
      referralMadeTo: labelOf(INTERVENTION_REFERRAL, f.referralMadeTo),
      nextFollowUpDate: f.nextFollowUpDate,
    });

    setF(INITIAL);
    setInterventionTypes([]);
    setErrors(new Set());
    toast("Follow-up recorded successfully.", "success");
  };

  const rows: Row[] = store.followUps.map((p, i) => ({ ...p, sno: i + 1 }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 rounded-xl bg-navy px-5 py-3.5 text-white">
        <h1 className="text-headline-1">Follow-up ODIC</h1>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <h2 className="mb-4 text-title-2 text-navy">Follow-up (OPD Basic)</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Registration Number of the Patient" required error={err("registrationNumber")}>
              {(c) => (
                <Input
                  {...c}
                  value={f.registrationNumber}
                  onChange={(e) => set("registrationNumber")(e.target.value)}
                  placeholder="Registration Number of the Patient"
                  invalid={errors.has("registrationNumber")}
                />
              )}
            </FormField>
            <FormField label="Date of last Visit" required error={err("followUpDate")}>
              {(c) => (
                <Input
                  {...c}
                  type="date"
                  value={f.followUpDate}
                  onChange={(e) => set("followUpDate")(e.target.value)}
                  invalid={errors.has("followUpDate")}
                />
              )}
            </FormField>
          </div>

          <div className="rounded-xl border border-line bg-surface-muted/40 p-4">
            <h3 className="mb-3 text-title-3 text-navy">Intervention Provided</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span id="fu-intervention-label" className="text-label-1 text-ink">
                  Intervention Provided during the Visit <span className="ds-field__required">*</span>
                </span>
                <div
                  role="group"
                  aria-labelledby="fu-intervention-label"
                  className={`flex flex-wrap gap-x-4 gap-y-2 rounded-lg border p-3 ${errors.has("interventionTypes") ? "border-danger-fg" : "border-line"}`}
                >
                  {["Medical", "Psychosocial"].map((opt) => (
                    <Checkbox
                      key={opt}
                      checked={interventionTypes.includes(opt)}
                      onChange={() => {
                        toggleIntervention(opt);
                        setErrors((prev) => { const n = new Set(prev); n.delete("interventionTypes"); return n; });
                      }}
                      label={opt}
                    />
                  ))}
                </div>
                {errors.has("interventionTypes") && <p className="text-label-2 text-danger-fg">Select at least one intervention.</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {interventionTypes.includes("Medical") && (
                  <FormField label="Medical" required error={err("medicalDetails")}>
                    {(c) => <Input {...c} value={f.medicalDetails} onChange={(e) => set("medicalDetails")(e.target.value)} placeholder="Medical intervention details" invalid={errors.has("medicalDetails")} />}
                  </FormField>
                )}
                {interventionTypes.includes("Psychosocial") && (
                  <FormField label="Psychosocial" required error={err("psychosocial")}>
                    {(c) => <Select {...c} value={f.psychosocial} onChange={(e) => set("psychosocial")(e.target.value)} placeholder="Select Psychosocial" options={YES_NO_NR} invalid={errors.has("psychosocial")} />}
                  </FormField>
                )}
                <FormField label="Referral Made To" required error={err("referralMadeTo")}>
                  {(c) => <Select {...c} value={f.referralMadeTo} onChange={(e) => set("referralMadeTo")(e.target.value)} placeholder="Select" options={INTERVENTION_REFERRAL} invalid={errors.has("referralMadeTo")} />}
                </FormField>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Date of Next Follow Up" required error={err("nextFollowUpDate")}>
              {(c) => (
                <Input
                  {...c}
                  type="date"
                  value={f.nextFollowUpDate}
                  onChange={(e) => set("nextFollowUpDate")(e.target.value)}
                  invalid={errors.has("nextFollowUpDate")}
                />
              )}
            </FormField>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">Submit</Button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <h2 className="mb-4 text-title-2 text-navy">Follow-up ODIC List</h2>
        <DataTable columns={columns} data={rows} total={rows.length} />
      </div>
    </div>
  );
}
