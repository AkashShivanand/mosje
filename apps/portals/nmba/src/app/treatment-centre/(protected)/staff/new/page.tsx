"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  FormField,
} from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";

export default function NewStaffPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useTCStore();

  const [f, setF] = React.useState({
    name: "",
    designation: "",
    qualification: "",
    contactNumber: "",
  });

  const [errors, setErrors] = React.useState<Set<string>>(new Set());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const missing = new Set<string>();
    if (!f.name) missing.add("name");
    if (!f.designation) missing.add("designation");
    if (!f.qualification) missing.add("qualification");
    if (!f.contactNumber) missing.add("contactNumber");
    if (f.contactNumber && f.contactNumber.length !== 10) missing.add("contactNumberFormat");

    if (missing.size > 0) {
      setErrors(missing);
      return;
    }

    store.addStaff({
      name: f.name,
      designation: f.designation,
      qualification: f.qualification,
      contactNumber: f.contactNumber,
    });

    toast("Staff member registered successfully.", "success");
    router.push("/treatment-centre/staff");
  };

  const err = (key: string): string | undefined => {
    if (errors.has(key)) return "This field is required.";
    if (key === "contactNumber" && errors.has("contactNumberFormat")) {
      return "Enter a valid 10-digit mobile number.";
    }
    return undefined;
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto py-4">
      <div>
        <h1 className="text-xl font-bold text-ink">Register New Staff Member</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Add details of a new staff member employed at the centre.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <FormSection title="Staff Member Details" columns={1}>
          <FormField label="Full Name" required error={err("name")}>
            {(c) => (
              <Input
                {...c}
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                placeholder="Full name of staff member"
                invalid={errors.has("name")}
              />
            )}
          </FormField>

          <FormField label="Designation" required error={err("designation")}>
            {(c) => (
              <Input
                {...c}
                value={f.designation}
                onChange={(e) => setF({ ...f, designation: e.target.value })}
                placeholder="e.g. Counsellor, Doctor, Ward Boy"
                invalid={errors.has("designation")}
              />
            )}
          </FormField>

          <FormField label="Qualification" required error={err("qualification")}>
            {(c) => (
              <Input
                {...c}
                value={f.qualification}
                onChange={(e) => setF({ ...f, qualification: e.target.value })}
                placeholder="e.g. MBBS, MA Psychology, High School"
                invalid={errors.has("qualification")}
              />
            )}
          </FormField>

          <FormField label="Contact Number" required error={err("contactNumber")}>
            {(c) => (
              <Input
                {...c}
                type="tel"
                maxLength={10}
                value={f.contactNumber}
                onChange={(e) => setF({ ...f, contactNumber: e.target.value.replace(/\D/g, "") })}
                placeholder="10-digit mobile number"
                invalid={errors.has("contactNumber") || errors.has("contactNumberFormat")}
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
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Staff Member
          </Button>
        </div>
      </form>
    </div>
  );
}
