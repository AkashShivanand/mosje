"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Textarea,
  FormField,
  Alert,
} from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";

export default function NewReadmissionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useTCStore();

  const [searchRegNo, setSearchRegNo] = React.useState("");
  const [patient, setPatient] = React.useState<any>(null);
  const [searched, setSearched] = React.useState(false);

  const [f, setF] = React.useState({
    readmissionDate: new Date().toISOString().slice(0, 10),
    reason: "",
  });

  const [errors, setErrors] = React.useState<Set<string>>(new Set());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const found = store.patients.find(
      (p) => p.registrationNumber.trim().toLowerCase() === searchRegNo.trim().toLowerCase()
    );
    if (found) {
      setPatient(found);
    } else {
      setPatient(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    const missing = new Set<string>();
    if (!f.readmissionDate) missing.add("readmissionDate");
    if (!f.reason) missing.add("reason");

    if (missing.size > 0) {
      setErrors(missing);
      return;
    }

    store.addReadmission({
      registrationNumber: patient.registrationNumber,
      name: patient.name,
      readmissionDate: f.readmissionDate,
      reason: f.reason,
    });

    // Also update patient's registrationProgress to Pending or In Progress to reflect readmission
    store.updatePatient(patient.id, {
      registrationProgress: "Pending",
      dateOfAdmission: f.readmissionDate, // Reset admission date to new readmission date
    });

    toast("Readmission registered successfully.", "success");
    router.push("/treatment-centre/irca/readmissions");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
      <div>
        <h1 className="text-xl font-bold text-ink">New Readmission Registration</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Lookup previously registered patient by registration number and create a new admission cycle.
        </p>
      </div>

      <div className="rounded-xl border border-line bg-white p-5">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <FormField label="Patient Registration Number" required>
              {(c) => (
                <Input
                  {...c}
                  value={searchRegNo}
                  onChange={(e) => setSearchRegNo(e.target.value)}
                  placeholder="e.g. DM12345678"
                />
              )}
            </FormField>
          </div>
          <Button type="submit" variant="primary">
            Search Patient
          </Button>
        </form>

        {searched && !patient && (
          <div className="mt-4">
            <Alert status="error">No patient found with registration number &quot;{searchRegNo}&quot;.</Alert>
          </div>
        )}
      </div>

      {patient && (
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <FormSection title="Patient Demographics (Auto-filled)" columns={2}>
            <div className="text-sm">
              <span className="block font-semibold text-ink-muted">Patient Name</span>
              <span className="text-ink font-medium">{patient.name}</span>
            </div>
            <div className="text-sm">
              <span className="block font-semibold text-ink-muted">Age / Gender</span>
              <span className="text-ink font-medium">{patient.age} / {patient.gender}</span>
            </div>
            <div className="text-sm">
              <span className="block font-semibold text-ink-muted">Contact Number</span>
              <span className="text-ink font-medium">{patient.contactNumber}</span>
            </div>
            <div className="text-sm">
              <span className="block font-semibold text-ink-muted">Last Admission Date</span>
              <span className="text-ink font-medium">{patient.dateOfAdmission}</span>
            </div>
          </FormSection>

          <FormSection title="Readmission Details" columns={1}>
            <FormField label="Readmission Date" required error={errors.has("readmissionDate") ? "Required" : undefined}>
              {(c) => (
                <Input
                  {...c}
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  value={f.readmissionDate}
                  onChange={(e) => setF({ ...f, readmissionDate: e.target.value })}
                  invalid={errors.has("readmissionDate")}
                />
              )}
            </FormField>

            <FormField label="Reason for Readmission" required error={errors.has("reason") ? "Required" : undefined}>
              {(c) => (
                <Textarea
                  {...c}
                  rows={3}
                  value={f.reason}
                  onChange={(e) => setF({ ...f, reason: e.target.value })}
                  placeholder="Enter details of relapse, withdrawal symptoms, or circumstances leading to readmission"
                  invalid={errors.has("reason")}
                />
              )}
            </FormField>
          </FormSection>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              appearance="outlined"
              onClick={() => router.push("/treatment-centre/irca/readmissions")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Readmission
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
