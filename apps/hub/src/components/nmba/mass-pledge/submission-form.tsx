"use client";

// DS Audit — every control below is imported, none re-implemented:
//   FormField ✅ · Input ✅ · Select ✅ · Button ✅ · Alert ✅ · FormSection ✅
//   GeoPhotoInput ✅ (added this session) · DeclarationCheckbox ✅ (added this session)
//   IdentityHeader → composes DS controls only.

import * as React from "react";
import { useRouter } from "next/navigation";
import { Send, ShieldCheck } from "lucide-react";
import {
  Alert,
  Button,
  DeclarationCheckbox,
  FormField,
  FormSection,
  GeoPhotoInput,
  Input,
  type GeoPhoto,
} from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { IdentityHeader, type IdentityValue } from "./identity-header";
import { usePortalSession } from "@/lib/nmba/committee/session-context";
import {
  useMassPledgeStore,
  StorageBudgetError,
} from "@/lib/nmba/mass-pledge/store";
import {
  COUNT_HINTS,
  EVENT_DATE,
  EVENT_DATE_LABEL,
  MAX_PHOTOS,
  MAX_PHOTO_MB,
  MIN_PHOTOS,
  reporterKindForSession,
} from "@/lib/nmba/mass-pledge/masters";
import {
  findExistingSubmission,
  initialStatus,
  initialVerification,
} from "@/lib/nmba/mass-pledge/workflow";
import { computeTotal, REPORTER_LABEL } from "@/lib/nmba/mass-pledge/types";

const BASE = "/portals/nmba/admin/mass-pledge";

/** One id so all three count fields can describe the same message. */
const COUNTS_ERROR_ID = "mp-counts-error";

/** Mocked OTP. Real verification is a backend concern this prototype has no room for. */
function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

type CountField = "youth" | "women" | "others";

interface FieldErrors {
  coordinatingMinistry?: string;
  counts?: string;
  photos?: string;
  officerName?: string;
  officerDesignation?: string;
  contactNo?: string;
  declaration?: string;
  storage?: string;
}

export function SubmissionForm() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const session = usePortalSession();
  const router = useRouter();
  const { toast } = useToast();
  const { submissions, addSubmission } = useMassPledgeStore();

  const reporterKind = reporterKindForSession(session);

  const [identity, setIdentity] = React.useState<IdentityValue>({
    coordinatingMinistry: "",
  });
  const [counts, setCounts] = React.useState<Record<CountField, string>>({
    youth: "",
    women: "",
    others: "",
  });
  const [photos, setPhotos] = React.useState<GeoPhoto[]>([]);
  const [officerName, setOfficerName] = React.useState("");
  const [officerDesignation, setOfficerDesignation] = React.useState("");
  const [contactNo, setContactNo] = React.useState("");
  const [declaration, setDeclaration] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  // ── OTP (assumption A9) ───────────────────────────────────────────────────
  const [sentOtp, setSentOtp] = React.useState<string | null>(null);
  const [otpEntry, setOtpEntry] = React.useState("");
  const [contactVerified, setContactVerified] = React.useState(false);
  const otpRef = React.useRef<HTMLInputElement>(null);

  // The code field appears below the button that was just pressed. Move focus
  // into it, otherwise a screen-reader or keyboard user gets no indication a
  // new field exists to fill in.
  React.useEffect(() => {
    if (sentOtp) otpRef.current?.focus();
  }, [sentOtp]);

  const parsed = {
    youth: Number(counts.youth || 0),
    women: Number(counts.women || 0),
    others: Number(counts.others || 0),
  };
  const total = computeTotal(parsed);

  const existing = findExistingSubmission(submissions, session, EVENT_DATE);

  if (!reporterKind) {
    return (
      <Alert status="info" title="Nothing to report from this login">
        The Admin account oversees the national rollup and does not file
        participation figures. Sign in as a State, District, Block or
        organisation account to submit a report.
      </Alert>
    );
  }

  // Acceptance criterion 14 — one report per entity per event date.
  if (existing) {
    return (
      <Alert status="warning" title="You have already reported for this event">
        A report for {EVENT_DATE_LABEL} was already filed from this account.{" "}
        <Button
          appearance="text"
          onClick={() => router.push(`${BASE}/${existing.id}`)}
        >
          Open the existing report
        </Button>
      </Alert>
    );
  }

  const setCount = (field: CountField, raw: string) => {
    // Digits only: a negative or fractional headcount is not a real number.
    const cleaned = raw.replace(/[^\d]/g, "");
    setCounts((c) => ({ ...c, [field]: cleaned }));
  };

  const handleSendOtp = () => {
    if (!/^\d{10}$/.test(contactNo)) {
      setErrors((e) => ({
        ...e,
        contactNo: "Enter a 10-digit mobile number first.",
      }));
      return;
    }
    setErrors((e) => ({ ...e, contactNo: undefined }));
    setSentOtp(generateOtp());
    setOtpEntry("");
    setContactVerified(false);
  };

  const handleVerifyOtp = () => {
    if (otpEntry === sentOtp) {
      setContactVerified(true);
      toast("Mobile number verified.", "success");
    } else {
      setErrors((e) => ({
        ...e,
        contactNo: "That code does not match. Try again.",
      }));
    }
  };

  function validate(): FieldErrors {
    const next: FieldErrors = {};

    if (reporterKind === "ADMIN_TIER" && !identity.coordinatingMinistry) {
      next.coordinatingMinistry = "Select the coordinating ministry.";
    }
    if (total <= 0) {
      next.counts =
        "Enter the number of participants. At least one figure must be above zero.";
    }

    if (photos.length < MIN_PHOTOS) {
      next.photos = `Attach at least ${MIN_PHOTOS} photograph of the event.`;
    } else if (photos.length > MAX_PHOTOS) {
      next.photos = `Attach no more than ${MAX_PHOTOS} photographs.`;
    }

    if (!officerName.trim())
      next.officerName = "Enter the reporting officer's name.";
    if (!officerDesignation.trim())
      next.officerDesignation = "Enter the officer's designation.";

    if (!/^\d{10}$/.test(contactNo)) {
      next.contactNo = "Enter a 10-digit mobile number.";
    } else if (!contactVerified) {
      next.contactNo =
        "Verify the mobile number with the one-time code before submitting.";
    }

    if (!declaration)
      next.declaration = "You must accept the declaration to submit.";

    return next;
  }

  /**
   * Move the user to the first thing they need to fix.
   *
   * Without this, submitting an incomplete form leaves focus on <body> and the
   * errors above the fold behind them: the officer sees a toast at the bottom
   * of a long form and has to scroll back up hunting for what is wrong.
   */
  const focusFirstError = () => {
    window.requestAnimationFrame(() => {
      const root = formRef.current;
      if (!root) return;
      const invalid = root.querySelector<HTMLElement>('[aria-invalid="true"]');
      if (!invalid) return;
      // The photo uploader marks a wrapper, not a control, so fall back to the
      // first focusable thing inside whatever is flagged.
      const target = invalid.matches("input, select, textarea, button")
        ? invalid
        : invalid.querySelector<HTMLElement>("input, select, textarea, button");
      (target ?? invalid).scrollIntoView({ block: "center", behavior: "smooth" });
      target?.focus({ preventScroll: true });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast("Please correct the highlighted fields.", "error");
      focusFirstError();
      return;
    }

    setSubmitting(true);
    const status = initialStatus(session);
    try {
      const created = addSubmission({
        reporterKind,
        // Assumption A10: taken from the constant, never read back from the DOM,
        // so editing the disabled input in devtools cannot change what is filed.
        eventDate: EVENT_DATE,
        ...(reporterKind === "ADMIN_TIER"
          ? {
              state: session.state,
              district: session.district,
              block: session.block,
              coordinatingMinistry: identity.coordinatingMinistry,
            }
          : {
              // Always the account's own organisation — never a typed value.
              entityName: session.entityName,
            }),
        counts: parsed,
        photos,
        reportingOfficerName: officerName.trim(),
        reportingOfficerDesignation: officerDesignation.trim(),
        contactNo,
        contactVerified,
        declarationAccepted: true,
        status,
        verification: initialVerification(reporterKind),
        locationUnavailable: photos.every((p) => p.lat === null),
        createdBy: session.accountId,
        history: [
          {
            at: new Date().toISOString(),
            actorAccountId: session.accountId,
            actorDisplayName: session.displayName,
            actorRole: session.role,
            action: "SUBMITTED",
          },
        ],
      });

      toast(
        status === "APPROVED"
          ? "Report submitted and published."
          : "Report submitted for approval.",
        "success",
      );
      router.push(`${BASE}/${created.id}`);
    } catch (error) {
      setSubmitting(false);
      if (error instanceof StorageBudgetError) {
        setErrors((prev) => ({ ...prev, storage: error.message }));
        toast("Could not save — the submission is too large.", "error");
        return;
      }
      toast("Something went wrong while saving. Please try again.", "error");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {reporterKind === "SPIRITUAL_ORG" && (
        <Alert status="warning" title="Placeholder list">
          The requirement specifies eight spiritual organisations but the list
          was never supplied. These eight are stand-ins so the form can be
          tested. They are not a confirmed roster and will be replaced once the
          Ministry provides the list.
        </Alert>
      )}

      <FormSection
        title="Who is reporting"
        description={`${REPORTER_LABEL[reporterKind]} · resolved from your login and not editable.`}
        columns={3}
      >
        <IdentityHeader
          reporterKind={reporterKind}
          session={session}
          value={identity}
          onChange={setIdentity}
          errors={errors}
          disabled={submitting}
        />

        <FormField
          label="Date of event"
          hint="Fixed for this campaign and cannot be changed."
        >
          {(control) => (
            <Input {...control} value={EVENT_DATE_LABEL} readOnly disabled />
          )}
        </FormField>
      </FormSection>

      <FormSection
        title="Participation"
        description="Count each participant once. The three categories below do not overlap."
        columns={3}
      >
        {(["youth", "women", "others"] as const).map((field) => (
          <FormField
            key={field}
            label={
              <span className="inline-flex items-center gap-1.5">
                {field === "youth"
                  ? "Youth"
                  : field === "women"
                    ? "Women"
                    : "Others"}
              </span>
            }
            id={`mp-${field}`}
            required
            hint={COUNT_HINTS[field]}
          >
            {(control) => (
              <Input
                {...control}
                // The rule spans all three fields, so all three are flagged and
                // point at one message. Passing `error` to each FormField would
                // print the same sentence three times under adjacent fields.
                aria-invalid={errors.counts ? true : undefined}
                aria-describedby={
                  [control["aria-describedby"], errors.counts ? COUNTS_ERROR_ID : null]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                type="text"
                inputMode="numeric"
                value={counts[field]}
                disabled={submitting}
                placeholder="0"
                onChange={(e) => setCount(field, e.target.value)}
              />
            )}
          </FormField>
        ))}
      </FormSection>

      {errors.counts && (
        <p id={COUNTS_ERROR_ID} className="-mt-2 text-sm text-danger-strong" role="alert">
          {errors.counts}
        </p>
      )}

      {/* Outside the FormSection: its grid is for fields, and the running total
          is a summary that must span the full width. */}
      <div className="-mt-2 flex items-center justify-between rounded-lg border border-line bg-surface-muted px-4 py-3">
        <span className="text-sm font-semibold text-ink">
          Total participants
        </span>
        <output
          aria-live="polite"
          className="text-lg font-bold tabular-nums text-navy"
        >
          {total.toLocaleString("en-IN")}
        </output>
      </div>


      <FormSection
        title="Photographs of the event"
        description={`${MIN_PHOTOS} to ${MAX_PHOTOS} photographs, JPEG or PNG, up to ${MAX_PHOTO_MB} MB each.`}
        columns={1}
      >
        <FormField
          label="Geo-tagged photographs"
          id="mp-photos"
          required
          error={errors.photos}
          hint="Location is read from the photograph where available, otherwise from this device."
        >
          {(control) => (
            <GeoPhotoInput
              {...control}
              value={photos}
              onChange={setPhotos}
              minItems={MIN_PHOTOS}
              maxItems={MAX_PHOTOS}
              maxSizeMb={MAX_PHOTO_MB}
              disabled={submitting}
            />
          )}
        </FormField>
      </FormSection>

      <FormSection title="Reporting officer" columns={2}>
        <FormField
          label="Name of the reporting officer"
          id="mp-officer-name"
          required
          error={errors.officerName}
        >
          {(control) => (
            <Input
              {...control}
              value={officerName}
              disabled={submitting}
              placeholder="Full name"
              onChange={(e) => setOfficerName(e.target.value)}
            />
          )}
        </FormField>

        <FormField
          label="Designation"
          id="mp-officer-designation"
          required
          error={errors.officerDesignation}
        >
          {(control) => (
            <Input
              {...control}
              value={officerDesignation}
              disabled={submitting}
              placeholder="e.g. Block Development Officer"
              onChange={(e) => setOfficerDesignation(e.target.value)}
            />
          )}
        </FormField>

        <FormField
          label="Contact number"
          id="mp-contact"
          required
          error={errors.contactNo}
          hint="Verified by a one-time code before the report can be submitted."
        >
          {(control) => (
            <div className="flex gap-2">
              <Input
                {...control}
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={contactNo}
                disabled={submitting || contactVerified}
                placeholder="10-digit mobile number"
                onChange={(e) => {
                  setContactNo(e.target.value.replace(/\D/g, ""));
                  setContactVerified(false);
                  setSentOtp(null);
                }}
              />
              {!contactVerified && (
                <Button
                  type="button"
                  appearance="outlined"
                  onClick={handleSendOtp}
                  disabled={submitting}
                >
                  {sentOtp ? "Resend" : "Send code"}
                </Button>
              )}
            </div>
          )}
        </FormField>

        {contactVerified ? (
          <div className="flex items-end">
            <p className="flex items-center gap-1.5 pb-2 text-sm font-semibold text-approve">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Mobile number verified
            </p>
          </div>
        ) : (
          sentOtp && (
            <FormField
              label="One-time code"
              id="mp-otp"
              hint={`Prototype: the code is ${sentOtp}. A real deployment sends this by SMS.`}
            >
              {(control) => (
                <div className="flex gap-2">
                  <Input
                    {...control}
                    ref={otpRef}
                    inputMode="numeric"
                    maxLength={6}
                    value={otpEntry}
                    placeholder="6-digit code"
                    onChange={(e) =>
                      setOtpEntry(e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <Button
                    type="button"
                    appearance="outlined"
                    onClick={handleVerifyOtp}
                  >
                    Verify
                  </Button>
                </div>
              )}
            </FormField>
          )
        )}
      </FormSection>

      <DeclarationCheckbox
        checked={declaration}
        onChange={setDeclaration}
        error={errors.declaration}
        disabled={submitting}
      >
        <ul>
          <li>The reported figures are correct.</li>
          <li>
            The photographs pertain to the event conducted on{" "}
            <strong>{EVENT_DATE_LABEL}</strong>.
          </li>
        </ul>
      </DeclarationCheckbox>

      {errors.storage && (
        <Alert status="error" title="Could not save">
          {errors.storage}
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting}
          iconLeft={<Send className="h-4 w-4" />}
        >
          {submitting ? "Submitting…" : "Submit report"}
        </Button>
      </div>
    </form>
  );
}
