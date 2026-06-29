"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, FormField } from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";
import type { StaffDesignation } from "@/lib/treatment-centre/types";

const DESIGNATION_OPTIONS: { label: string; value: StaffDesignation }[] = [
  { label: "PROJECT COORDINATOR CUM VOCATIONAL COUNSELLOR", value: "PROJECT COORDINATOR CUM VOCATIONAL COUNSELLOR" },
  { label: "DOCTOR",                                         value: "DOCTOR" },
  { label: "COUNSELLOR / SOCIAL WORKER / PSYCHOLOGIST",      value: "COUNSELLOR / SOCIAL WORKER / PSYCHOLOGIST" },
  { label: "NURSE",                                           value: "NURSE" },
  { label: "PROFESSIONAL PERSON EDUCATOR",                   value: "PROFESSIONAL PERSON EDUCATOR" },
];

export default function NewStaffPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useTCStore();

  const [f, setF] = React.useState({
    designation: "" as StaffDesignation | "",
    name: "",
    mobile: "",
    education: "",
  });

  const [errors, setErrors] = React.useState<Set<string>>(new Set());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = new Set<string>();
    if (!f.designation) missing.add("designation");
    if (!f.name.trim()) missing.add("name");
    if (!f.mobile) missing.add("mobile");
    if (f.mobile && !/^\d{10}$/.test(f.mobile)) missing.add("mobileFormat");
    if (!f.education.trim()) missing.add("education");

    if (missing.size > 0) {
      setErrors(missing);
      return;
    }

    store.addStaff({
      designation: f.designation as StaffDesignation,
      name: f.name.trim(),
      mobile: f.mobile,
      education: f.education.trim(),
    });

    toast("Staff member added successfully.", "success");
    router.push("/treatment-centre/staff");
  };

  const err = (key: string): string | undefined => {
    if (key === "mobile" && errors.has("mobileFormat")) return "Enter a valid 10-digit mobile number.";
    if (errors.has(key)) return "This field is required.";
    return undefined;
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-4">
      <div>
        <h1 className="text-xl font-bold text-ink">Add Staff</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Add a staff member employed at this treatment centre.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <FormSection title="Staff Details" columns={1}>
          <FormField label="Designation" required error={err("designation")}>
            {(c) => (
              <Select
                {...c}
                value={f.designation}
                onChange={(e) => setF({ ...f, designation: e.target.value as StaffDesignation })}
                options={[
                  { label: "Select Designation", value: "" },
                  ...DESIGNATION_OPTIONS,
                ]}
                invalid={errors.has("designation")}
              />
            )}
          </FormField>

          <FormField label="Name" required error={err("name")}>
            {(c) => (
              <Input
                {...c}
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                placeholder="Name"
                invalid={errors.has("name")}
              />
            )}
          </FormField>

          <FormField label="Mobile" required error={err("mobile")}>
            {(c) => (
              <Input
                {...c}
                type="tel"
                maxLength={10}
                value={f.mobile}
                onChange={(e) => setF({ ...f, mobile: e.target.value.replace(/\D/g, "") })}
                placeholder="10-digit mobile number"
                invalid={errors.has("mobile") || errors.has("mobileFormat")}
              />
            )}
          </FormField>

          <FormField label="Education" required error={err("education")}>
            {(c) => (
              <Input
                {...c}
                value={f.education}
                onChange={(e) => setF({ ...f, education: e.target.value })}
                placeholder="e.g. MBBS, M.A. Psychology, B.Sc. Nursing"
                invalid={errors.has("education")}
              />
            )}
          </FormField>
        </FormSection>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            appearance="outlined"
            onClick={() => router.push("/treatment-centre/staff")}
          >
            Reset
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
