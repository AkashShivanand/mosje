"use client";

// Tier-driven "register committee notification" form. UX niceties:
//  · auto-populated fields (state / district / fixed designations) are read-only
//    with a "from your login" hint
//  · required fields marked; validation is inline, per-field (not a top banner)
//  · the first editable field is focused on open
//  · Cancel / Save live in the sheet's sticky footer (submits via form id)

import * as React from "react";
import { Input, Select, FormField, Alert } from "@mosje/design-system";
import { PdfUploadField } from "./pdf-upload-field";
import { DESIGNATIONS, MAX_COMMITTEE_MEMBERS } from "@/lib/nmba/committee/masters";
import type { CommitteeTier, UploadedFile } from "@/lib/nmba/committee/types";
import type { NewCommitteeInput } from "@/lib/nmba/committee/store";

const MEMBER_OPTIONS = Array.from({ length: MAX_COMMITTEE_MEMBERS + 1 }, (_, i) => ({
  label: String(i),
  value: String(i),
}));

export type DistrictMode = "none" | "auto" | "select";
type Errors = Record<string, string>;

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <FormField label={label} id={`ro-${label.replace(/\s+/g, "-").toLowerCase()}`} hint="Filled from your login">
      {(control) => <Input {...control} value={value} readOnly disabled />}
    </FormField>
  );
}

interface CommitteeFormProps {
  tier: CommitteeTier;
  state: string;
  createdBy: string;
  districtMode: DistrictMode;
  district?: string;
  districtOptions?: string[];
  onSubmit: (input: NewCommitteeInput) => void;
  /** Form id so the sheet's footer Save button can submit it. */
  formId?: string;
}

export function CommitteeForm({
  tier,
  state,
  createdBy,
  districtMode,
  district,
  districtOptions = [],
  onSubmit,
  formId = "napddr-register-form",
}: CommitteeFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [block, setBlock] = React.useState("");
  const [chiefSecretaryName, setChiefSecretaryName] = React.useState("");
  const [chairpersonName, setChairpersonName] = React.useState("");
  const [memberSecretaryName, setMemberSecretaryName] = React.useState("");
  const [memberSecretaryDesignation, setMemberSecretaryDesignation] = React.useState("");
  const [nodalDepartment, setNodalDepartment] = React.useState("");
  const [formationDate, setFormationDate] = React.useState("");
  const [memberCount, setMemberCount] = React.useState("");
  const [notification, setNotification] = React.useState<UploadedFile | null>(null);
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitting, setSubmitting] = React.useState(false);

  // Focus the first editable field when the form mounts (skips the disabled State field).
  React.useEffect(() => {
    formRef.current
      ?.querySelector<HTMLElement>("input:not([disabled]), select:not([disabled])")
      ?.focus();
  }, []);

  const clearError = (key: string) =>
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));

  const resolvedDistrict = districtMode === "auto" ? district : selectedDistrict;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const next: Errors = {};
    if (districtMode === "select" && !selectedDistrict) next.district = "Select the district.";
    if (tier === "BLOCK" && !block.trim()) next.block = "Enter the block name.";
    if (tier === "STATE" && !chiefSecretaryName.trim())
      next.chiefSecretary = "Enter the Chief Secretary's name.";
    if (tier !== "STATE" && !chairpersonName.trim())
      next.chairperson = "Enter the Chairperson's name.";
    if (tier !== "BLOCK" && !memberSecretaryName.trim())
      next.memberSecretary = "Enter the Member Secretary's name.";
    if (tier === "STATE" && !memberSecretaryDesignation.trim())
      next.memberSecretaryDesignation = "Enter the designation.";
    if (tier !== "BLOCK" && !nodalDepartment.trim())
      next.nodalDepartment = "Enter the nodal department.";
    if (!formationDate) next.formationDate = "Select the formation date.";
    if (memberCount === "") next.memberCount = "Select the number of members.";
    if (!notification) next.notification = "Upload the committee notification (PDF).";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Focus the first field flagged (in visual order).
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      });
      return;
    }

    setSubmitting(true);
    const base: NewCommitteeInput = {
      tier,
      state,
      formationDate,
      memberCount: Number(memberCount),
      notification: notification!,
      createdBy,
    };

    if (tier === "STATE") {
      onSubmit({
        ...base,
        chiefSecretaryName: chiefSecretaryName.trim(),
        memberSecretaryName: memberSecretaryName.trim(),
        memberSecretaryDesignation: memberSecretaryDesignation.trim(),
        nodalDepartment: nodalDepartment.trim(),
      });
    } else if (tier === "DISTRICT") {
      onSubmit({
        ...base,
        district: resolvedDistrict,
        chairpersonName: chairpersonName.trim(),
        chairpersonDesignation: DESIGNATIONS.districtChairperson,
        memberSecretaryName: memberSecretaryName.trim(),
        memberSecretaryDesignation: DESIGNATIONS.districtMemberSecretary,
        nodalDepartment: nodalDepartment.trim(),
      });
    } else {
      onSubmit({
        ...base,
        district: resolvedDistrict,
        block: block.trim(),
        chairpersonName: chairpersonName.trim(),
        chairpersonDesignation: DESIGNATIONS.blockChairperson,
      });
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <form id={formId} ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <p className="text-body-2 text-ink-muted">
        Enter the committee&rsquo;s details and upload the signed notification. Fields marked{" "}
        <span className="text-danger">*</span> are required.
      </p>

      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        <ReadOnly label="State" value={state} />

        {districtMode === "auto" && <ReadOnly label="District" value={district ?? ""} />}
        {districtMode === "select" && (
          <FormField label="District" id="district-select" required error={errors.district}>
            {(control) => (
              <Select
                {...control}
                options={districtOptions.map((d) => ({ label: d, value: d }))}
                placeholder="Select district"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  clearError("district");
                }}
              />
            )}
          </FormField>
        )}

        {tier === "BLOCK" && (
          <FormField label="Block" id="block" required error={errors.block}>
            {(control) => (
              <Input
                {...control}
                value={block}
                onChange={(e) => {
                  setBlock(e.target.value);
                  clearError("block");
                }}
                placeholder="Enter block name"
              />
            )}
          </FormField>
        )}

        {tier === "STATE" ? (
          <FormField
            label="Name of the Chief Secretary (Sh./Smt./Ms.)"
            id="chief-secretary"
            required
            error={errors.chiefSecretary}
          >
            {(control) => (
              <Input
                {...control}
                value={chiefSecretaryName}
                onChange={(e) => {
                  setChiefSecretaryName(e.target.value);
                  clearError("chiefSecretary");
                }}
                placeholder="e.g. Sh. A. B. Sharma"
              />
            )}
          </FormField>
        ) : (
          <FormField
            label="Name of the Chairperson (Sh./Smt./Ms.)"
            id="chairperson"
            required
            error={errors.chairperson}
          >
            {(control) => (
              <Input
                {...control}
                value={chairpersonName}
                onChange={(e) => {
                  setChairpersonName(e.target.value);
                  clearError("chairperson");
                }}
                placeholder="e.g. Sh. A. B. Sharma"
              />
            )}
          </FormField>
        )}

        {tier === "DISTRICT" && (
          <ReadOnly label="Designation of the Chairperson" value={DESIGNATIONS.districtChairperson} />
        )}
        {tier === "BLOCK" && (
          <ReadOnly label="Designation of the Chairperson" value={DESIGNATIONS.blockChairperson} />
        )}

        {tier !== "BLOCK" && (
          <FormField
            label="Name of the Member Secretary"
            id="member-secretary"
            required
            error={errors.memberSecretary}
          >
            {(control) => (
              <Input
                {...control}
                value={memberSecretaryName}
                onChange={(e) => {
                  setMemberSecretaryName(e.target.value);
                  clearError("memberSecretary");
                }}
                placeholder="e.g. Smt. C. D. Verma"
              />
            )}
          </FormField>
        )}
        {tier === "STATE" && (
          <FormField
            label="Designation of the Member Secretary"
            id="member-secretary-designation"
            required
            error={errors.memberSecretaryDesignation}
          >
            {(control) => (
              <Input
                {...control}
                value={memberSecretaryDesignation}
                onChange={(e) => {
                  setMemberSecretaryDesignation(e.target.value);
                  clearError("memberSecretaryDesignation");
                }}
                placeholder="e.g. Secretary, Social Justice Dept."
              />
            )}
          </FormField>
        )}
        {tier === "DISTRICT" && (
          <ReadOnly
            label="Designation of the Member Secretary"
            value={DESIGNATIONS.districtMemberSecretary}
          />
        )}

        {tier !== "BLOCK" && (
          <FormField
            label="Name of the Nodal Department for Drug Demand Reduction"
            id="nodal-dept"
            required
            error={errors.nodalDepartment}
          >
            {(control) => (
              <Input
                {...control}
                value={nodalDepartment}
                onChange={(e) => {
                  setNodalDepartment(e.target.value);
                  clearError("nodalDepartment");
                }}
                placeholder="e.g. Social Justice & Special Assistance Dept."
              />
            )}
          </FormField>
        )}

        <FormField label="Date of Committee Formation" id="formation-date" required error={errors.formationDate}>
          {(control) => (
            <Input
              {...control}
              type="date"
              value={formationDate}
              onChange={(e) => {
                setFormationDate(e.target.value);
                clearError("formationDate");
              }}
            />
          )}
        </FormField>

        <FormField label="Number of Committee Members" id="member-count" required error={errors.memberCount}>
          {(control) => (
            <Select
              {...control}
              options={MEMBER_OPTIONS}
              placeholder="Select (0–50)"
              value={memberCount}
              onChange={(e) => {
                setMemberCount(e.target.value);
                clearError("memberCount");
              }}
            />
          )}
        </FormField>
      </div>

      <div className="border-t border-line pt-5">
        <label htmlFor="committee-notification" className="mb-2 block text-label-1 text-ink">
          Committee Notification <span className="text-danger">*</span>
        </label>
        <PdfUploadField
          id="committee-notification"
          value={notification}
          hint="Upload the signed committee notification (max 10 MB)."
          onChange={(f) => {
            setNotification(f);
            clearError("notification");
          }}
        />
        {errors.notification && (
          <p role="alert" className="mt-1.5 text-body-3 text-danger">
            {errors.notification}
          </p>
        )}
      </div>

      {errorCount > 0 && (
        <Alert status="error">
          Please correct the {errorCount} highlighted field{errorCount === 1 ? "" : "s"}.
        </Alert>
      )}
    </form>
  );
}
