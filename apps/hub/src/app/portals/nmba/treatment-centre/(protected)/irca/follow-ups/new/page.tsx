"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Textarea,
  Select,
  FormField,
  Alert,
  type SelectOption,
} from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { FormSection } from "@/components/nmba/treatment-centre/tc-form";

const STATUS_OPTIONS: SelectOption[] = [
  { label: "Improved", value: "Improved" },
  { label: "Stable", value: "Stable" },
  { label: "Deteriorated", value: "Deteriorated" },
  { label: "Relapsed", value: "Relapsed" },
];

export default function NewFollowUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const store = useTCStore();

  const [searchRegNo, setSearchRegNo] = React.useState("");
  const [patient, setPatient] = React.useState<(typeof store.patients)[number] | null>(null);
  const [searched, setSearched] = React.useState(false);

  const [f, setF] = React.useState({
    followUpDate: new Date().toISOString().slice(0, 10),
    followUpNumber: "1",
    status: "Improved",
    complaints: "",
    medicalReview: "",
    psychologicalNotes: "",
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
      // Auto-calculate follow-up number
      const existingCount = store.followUps.filter(
        (fu) => fu.registrationNumber === found.registrationNumber
      ).length;
      setF((prev) => ({
        ...prev,
        followUpNumber: String(existingCount + 1),
      }));
    } else {
      setPatient(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    const missing = new Set<string>();
    if (!f.followUpDate) missing.add("followUpDate");
    if (!f.followUpNumber) missing.add("followUpNumber");
    if (!f.status) missing.add("status");

    if (missing.size > 0) {
      setErrors(missing);
      return;
    }

    store.addFollowUp({
      registrationNumber: patient.registrationNumber,
      name: patient.name,
      followUpDate: f.followUpDate,
      followUpNumber: Number(f.followUpNumber) || 1,
      status: f.status,
    });

    toast("Follow-up registered successfully.", "success");
    router.push("/portals/nmba/treatment-centre/irca/follow-ups");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-4">
      <div>
        <h1 className="text-xl font-bold text-ink">New OPD Follow-Up Registration</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Lookup patient by registration number and record follow-up details.
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
            <Alert status="error">No active patient found with registration number &quot;{searchRegNo}&quot;.</Alert>
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
              <span className="block font-semibold text-ink-muted">Date of Admission</span>
              <span className="text-ink font-medium">{patient.dateOfAdmission}</span>
            </div>
          </FormSection>

          <FormSection title="Follow-up Visit Records" columns={2}>
            <FormField label="Follow-Up Date" required error={errors.has("followUpDate") ? "Required" : undefined}>
              {(c) => (
                <Input
                  {...c}
                  type="date"
                  max={new Date().toISOString().slice(0, 10)}
                  value={f.followUpDate}
                  onChange={(e) => setF({ ...f, followUpDate: e.target.value })}
                  invalid={errors.has("followUpDate")}
                />
              )}
            </FormField>

            <FormField label="Follow-Up Number" required error={errors.has("followUpNumber") ? "Required" : undefined}>
              {(c) => (
                <Input
                  {...c}
                  type="number"
                  min={1}
                  value={f.followUpNumber}
                  onChange={(e) => setF({ ...f, followUpNumber: e.target.value })}
                  invalid={errors.has("followUpNumber")}
                />
              )}
            </FormField>

            <FormField label="Status" required error={errors.has("status") ? "Required" : undefined}>
              {(c) => (
                <Select
                  {...c}
                  value={f.status}
                  onChange={(e) => setF({ ...f, status: e.target.value })}
                  options={STATUS_OPTIONS}
                  invalid={errors.has("status")}
                />
              )}
            </FormField>

            <div className="col-span-2">
              <FormField label="Complaints / Symptoms Reported">
                {(c) => (
                  <Textarea
                    {...c}
                    rows={2}
                    value={f.complaints}
                    onChange={(e) => setF({ ...f, complaints: e.target.value })}
                    placeholder="Enter complaints, withdrawal symptoms, or other patient issues"
                  />
                )}
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField label="Medical Review Notes">
                {(c) => (
                  <Textarea
                    {...c}
                    rows={2}
                    value={f.medicalReview}
                    onChange={(e) => setF({ ...f, medicalReview: e.target.value })}
                    placeholder="Enter physician/medical examination remarks and medication updates"
                  />
                )}
              </FormField>
            </div>

            <div className="col-span-2">
              <FormField label="Counselling / Psychological Notes">
                {(c) => (
                  <Textarea
                    {...c}
                    rows={2}
                    value={f.psychologicalNotes}
                    onChange={(e) => setF({ ...f, psychologicalNotes: e.target.value })}
                    placeholder="Enter counsellor advice, psychiatric review or support notes"
                  />
                )}
              </FormField>
            </div>
          </FormSection>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              appearance="outlined"
              onClick={() => router.push("/portals/nmba/treatment-centre/irca/follow-ups")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Register Follow-Up
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
