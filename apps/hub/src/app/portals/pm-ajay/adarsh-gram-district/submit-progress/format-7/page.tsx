"use client";

/* Adarsh Gram — District: Submit Progress — Format VII (District Report).
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/submit-progress/format-7.

   DS Audit: WizardScreen ✅ (owns the stepper, per-step focus and the Back/Continue/
   Submit row) · FormSection ✅ · FormField ✅ · Input ✅ · Textarea ✅ · DataTable ✅ ·
   Button ✅ · IconButton ✅ · Icon ✅. Nothing added.

   WHY A WIZARD, NOT A FORM: the live screen carries ~70 fields across three tables —
   General Information, District Level Officers (repeatable), the Convergence Committee
   and capacity-building counts, and a Village Level Convergence Committee row per
   village in the district. `WizardScreen`'s own docstring draws the line at eight
   fields; this clears it by a wide margin, and the four sections are also four
   genuine stage boundaries a district officer fills in order — who to name, what was
   held, what each village reports — so a step per section is not an arbitrary split.

   Every question on the live screen's four sections is reproduced. State, District and
   No. of Villages Selected are read-only context on the live screen too, so — unlike
   `agency/add`'s two dead fields — they stay as fields here rather than moving to prose,
   per the build brief's instruction not to drop a question Format VII asks. The Village
   Level Convergence Committee table is one row per village in `VILLAGES` (12, this
   district's own register) rather than the live screen's 735 — the illustrative data is
   scoped to the district register the brief hands over, not to the live screen's row
   count, and every figure stays consistent with that scope. */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  DataTable,
  FormField,
  FormSection,
  Icon,
  IconButton,
  Input,
  Textarea,
  WizardScreen,
  type DataTableColumn,
  type StepperStep,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import { DISTRICT_SCOPE, VILLAGES, type VillageRecord } from "@/lib/pm-ajay/district/registers";

interface OfficerDraft {
  id: string;
  name: string;
  designation: string;
  email: string;
  landline: string;
  mobile: string;
  fax: string;
  officeAddress: string;
  pinCode: string;
}

const EMPTY_OFFICER = (id: string): OfficerDraft => ({
  id,
  name: "",
  designation: "",
  email: "",
  landline: "",
  mobile: "",
  fax: "",
  officeAddress: "",
  pinCode: "",
});

interface VillageMeeting {
  meetings: string;
  lastMeetingDate: string;
}

const STEPS: StepperStep[] = [
  { label: "General Information", description: "State, district and the report month" },
  { label: "District Officers", description: "Who the state can reach about this return" },
  { label: "Committee & Training", description: "Convergence Committee meetings and capacity building" },
  { label: "Village Meetings", description: "VLCC meetings held, by village" },
];

export default function SubmitProgressFormat7Page() {
  const router = useRouter();
  const [current, setCurrent] = React.useState(0);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [showErrors, setShowErrors] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const errorRef = React.useRef<HTMLDivElement>(null);

  // Step 1 — General Information.
  const [reportMonth, setReportMonth] = React.useState("");

  // Step 2 — District Level Officers.
  const nextOfficerId = React.useRef(2);
  const [officers, setOfficers] = React.useState<OfficerDraft[]>([EMPTY_OFFICER("officer-1")]);

  const updateOfficer = (id: string, patch: Partial<OfficerDraft>) => {
    setOfficers((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };
  const addOfficer = () => {
    setOfficers((prev) => [...prev, EMPTY_OFFICER(`officer-${nextOfficerId.current++}`)]);
  };
  const removeOfficer = (id: string) => {
    setOfficers((prev) => (prev.length > 1 ? prev.filter((o) => o.id !== id) : prev));
  };

  // Step 3 — Convergence Committee and capacity building.
  const [meetingsHeld, setMeetingsHeld] = React.useState("");
  const [capacityBuildingCount, setCapacityBuildingCount] = React.useState("");
  const [personsTrained, setPersonsTrained] = React.useState("");
  const [lastTrainingDate, setLastTrainingDate] = React.useState("");

  // Step 4 — Village Level Convergence Committee, one row per village in the register.
  const [vlcc, setVlcc] = React.useState<Record<string, VillageMeeting>>(() =>
    Object.fromEntries(VILLAGES.map((v) => [v.id, { meetings: "", lastMeetingDate: "" }])),
  );
  const updateVlcc = (villageId: string, patch: Partial<VillageMeeting>) => {
    setVlcc((prev) => ({
      ...prev,
      [villageId]: { meetings: "", lastMeetingDate: "", ...prev[villageId], ...patch },
    }));
  };

  const validateStep = (step: number): string | null => {
    if (step === 0 && !reportMonth) {
      return "Enter the report month before continuing.";
    }
    if (step === 1) {
      const incomplete = officers.some(
        (o) => !o.name.trim() || !o.designation.trim() || !o.officeAddress.trim() || !o.pinCode.trim(),
      );
      if (incomplete) {
        return "Fill in the Name, Designation, Office Address and Pin Code for every officer before continuing.";
      }
    }
    if (step === 2 && !meetingsHeld.trim()) {
      return "Enter the number of District PMAGY Convergence Committee meetings held so far.";
    }
    return null;
  };

  const handleBack = () => {
    setShowErrors(false);
    setError(undefined);
    setCurrent((c) => Math.max(c - 1, 0));
  };

  const handleNext = () => {
    const message = validateStep(current);
    if (message) {
      setShowErrors(true);
      setError(message);
      return;
    }
    setShowErrors(false);
    setError(undefined);
    setCurrent((c) => Math.min(c + 1, STEPS.length - 1));
  };

  const handleSubmit = () => {
    const message = validateStep(current);
    if (message) {
      setShowErrors(true);
      setError(message);
      return;
    }
    setSubmitting(true);
    // No API yet: the return is illustrative, so the submission is acknowledged and the
    // officer is returned to the dashboard rather than pretending a return was filed.
    window.setTimeout(() => {
      setSubmitting(false);
      router.push(`${DISTRICT_BASE}/dashboard`);
    }, 600);
  };

  const officerColumns: DataTableColumn<OfficerDraft>[] = [
    {
      key: "sno",
      header: "S.No.",
      render: (row) => `${officers.findIndex((o) => o.id === row.id) + 1}.`,
    },
    {
      key: "name",
      header: "Name *",
      render: (row) => (
        <FormField
          label="Name"
          id={`officer-name-${row.id}`}
          labelHidden
          required
          error={showErrors && !row.name.trim() ? "Name is required." : undefined}
        >
          {(control) => (
            <Input {...control} value={row.name} onChange={(e) => updateOfficer(row.id, { name: e.target.value })} placeholder="Name" />
          )}
        </FormField>
      ),
    },
    {
      key: "designation",
      header: "Designation *",
      render: (row) => (
        <FormField
          label="Designation"
          id={`officer-designation-${row.id}`}
          labelHidden
          required
          error={showErrors && !row.designation.trim() ? "Designation is required." : undefined}
        >
          {(control) => (
            <Input
              {...control}
              value={row.designation}
              onChange={(e) => updateOfficer(row.id, { designation: e.target.value })}
              placeholder="Designation"
            />
          )}
        </FormField>
      ),
    },
    {
      key: "email",
      header: "Email Id",
      render: (row) => (
        <FormField label="Email Id" id={`officer-email-${row.id}`} labelHidden>
          {(control) => (
            <Input
              {...control}
              type="email"
              value={row.email}
              onChange={(e) => updateOfficer(row.id, { email: e.target.value })}
              placeholder="Email ID"
            />
          )}
        </FormField>
      ),
    },
    {
      key: "landline",
      header: "Landline No.",
      render: (row) => (
        <FormField label="Landline No." id={`officer-landline-${row.id}`} labelHidden>
          {(control) => (
            <Input
              {...control}
              value={row.landline}
              onChange={(e) => updateOfficer(row.id, { landline: e.target.value })}
              placeholder="Landline No."
            />
          )}
        </FormField>
      ),
    },
    {
      key: "mobile",
      header: "Mobile No",
      render: (row) => (
        <FormField label="Mobile No" id={`officer-mobile-${row.id}`} labelHidden>
          {(control) => (
            <Input
              {...control}
              inputMode="numeric"
              autoComplete="tel"
              value={row.mobile}
              onChange={(e) => updateOfficer(row.id, { mobile: e.target.value })}
              placeholder="Mobile No."
            />
          )}
        </FormField>
      ),
    },
    {
      key: "fax",
      header: "Fax No.",
      render: (row) => (
        <FormField label="Fax No." id={`officer-fax-${row.id}`} labelHidden>
          {(control) => (
            <Input {...control} value={row.fax} onChange={(e) => updateOfficer(row.id, { fax: e.target.value })} placeholder="Fax Number" />
          )}
        </FormField>
      ),
    },
    {
      key: "officeAddress",
      header: "Office Address *",
      render: (row) => (
        <FormField
          label="Office Address"
          id={`officer-address-${row.id}`}
          labelHidden
          required
          error={showErrors && !row.officeAddress.trim() ? "Office address is required." : undefined}
        >
          {(control) => (
            <Textarea
              {...control}
              value={row.officeAddress}
              onChange={(e) => updateOfficer(row.id, { officeAddress: e.target.value })}
              rows={1}
              placeholder="3–150 characters"
            />
          )}
        </FormField>
      ),
    },
    {
      key: "pinCode",
      header: "Pin Code *",
      render: (row) => (
        <FormField
          label="Pin Code"
          id={`officer-pin-${row.id}`}
          labelHidden
          required
          error={showErrors && !row.pinCode.trim() ? "Pin code is required." : undefined}
        >
          {(control) => (
            <Input
              {...control}
              inputMode="numeric"
              value={row.pinCode}
              onChange={(e) => updateOfficer(row.id, { pinCode: e.target.value })}
              placeholder="Pin Code"
            />
          )}
        </FormField>
      ),
    },
    {
      key: "action",
      header: "Action",
      noExport: true,
      render: (row) => (
        <IconButton
          icon={<Icon name="delete" size={20} />}
          aria-label={`Remove officer row ${officers.findIndex((o) => o.id === row.id) + 1}`}
          variant="danger"
          appearance="text"
          size="sm"
          tooltip
          disabled={officers.length === 1}
          onClick={() => removeOfficer(row.id)}
        />
      ),
    },
  ];

  const vlccRows = React.useMemo(
    () => VILLAGES.map((village) => ({ village, meeting: vlcc[village.id] })),
    [vlcc],
  );

  const vlccColumns: DataTableColumn<{ village: VillageRecord; meeting: VillageMeeting }>[] = [
    {
      key: "sno",
      header: "S.No.",
      render: (row) => `${VILLAGES.findIndex((v) => v.id === row.village.id) + 1}.`,
    },
    {
      key: "name",
      header: "Name of Panchayat / Village",
      render: (row) => `${row.village.gramPanchayat} / ${row.village.village}`,
    },
    {
      key: "year",
      header: "Selection Year",
      render: () => DISTRICT_SCOPE.financialYear,
    },
    {
      key: "meetings",
      align: "end",
      header: "No. of Meetings",
      render: (row) => (
        <FormField label={`No. of meetings — ${row.village.village}`} id={`vlcc-meetings-${row.village.id}`} labelHidden>
          {(control) => (
            <Input
              {...control}
              type="number"
              min={0}
              value={row.meeting.meetings}
              onChange={(e) => updateVlcc(row.village.id, { meetings: e.target.value })}
              placeholder="Enter no. of meetings"
            />
          )}
        </FormField>
      ),
    },
    {
      key: "lastMeeting",
      header: "Date of Last Meeting",
      render: (row) => (
        <FormField label={`Date of last meeting — ${row.village.village}`} id={`vlcc-date-${row.village.id}`} labelHidden>
          {(control) => (
            <Input
              {...control}
              type="date"
              value={row.meeting.lastMeetingDate}
              onChange={(e) => updateVlcc(row.village.id, { lastMeetingDate: e.target.value })}
            />
          )}
        </FormField>
      ),
    },
  ];

  return (
    <WizardScreen
      eyebrow="Adarsh Gram — District · Submit Progress"
      title="Format VII – Reporting Format for District"
      description={`The district's own quarterly return to the state — ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}, FY ${DISTRICT_SCOPE.financialYear}.`}
      steps={STEPS}
      current={current}
      onBack={handleBack}
      onNext={handleNext}
      onSubmit={handleSubmit}
      submitLabel={submitting ? "Saving…" : "Submit Format VII"}
      onCancel={() => router.push(`${DISTRICT_BASE}/dashboard`)}
      error={error}
      errorRef={errorRef}
    >
      {current === 0 && (
        <FormSection title="General Information" columns={2}>
          <FormField label="Name of State" id="f7-state" disabled>
            {(control) => <Input {...control} value={DISTRICT_SCOPE.state} readOnly />}
          </FormField>
          <FormField label="District" id="f7-district" disabled>
            {(control) => <Input {...control} value={DISTRICT_SCOPE.district} readOnly />}
          </FormField>
          <FormField label="No. of Villages Selected" id="f7-villages" disabled>
            {(control) => <Input {...control} value={String(VILLAGES.length)} readOnly />}
          </FormField>
          <FormField
            label="Report Month"
            id="f7-report-month"
            required
            error={showErrors && !reportMonth ? "Enter the report month." : undefined}
          >
            {(control) => (
              <Input {...control} type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)} />
            )}
          </FormField>
        </FormSection>
      )}

      {current === 1 && (
        <FormSection
          title="Details of District Level Officers"
          columns={1}
          description="At least one officer the state or the department can reach about this district's return."
        >
          <DataTable
            columns={officerColumns as unknown as DataTableColumn<Record<string, unknown>>[]}
            data={officers as unknown as Record<string, unknown>[]}
            total={officers.length}
            caption="District level officers"
            showPageSizes={false}
          />
          <Button type="button" appearance="outlined" iconLeft={<Icon name="add" size={20} />} onClick={addOfficer}>
            Add Officer
          </Button>
        </FormSection>
      )}

      {current === 2 && (
        <>
          <FormSection title="District PMAGY Convergence Committee" columns={1}>
            <FormField
              label="No. of Meetings Held So Far"
              id="f7-meetings-held"
              required
              error={showErrors && !meetingsHeld.trim() ? "Enter the number of meetings held." : undefined}
            >
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  min={0}
                  value={meetingsHeld}
                  onChange={(e) => setMeetingsHeld(e.target.value)}
                  placeholder="Enter no. of meetings"
                />
              )}
            </FormField>
          </FormSection>

          <FormSection
            title="Capacity Building Training"
            columns={3}
            description="Held at the district for panchayat and village level functionaries, so far."
          >
            <FormField label="No. of Capacity Building Trainings" id="f7-cb-count">
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  min={0}
                  value={capacityBuildingCount}
                  onChange={(e) => setCapacityBuildingCount(e.target.value)}
                  placeholder="Enter no. of capacity building"
                />
              )}
            </FormField>
            <FormField label="No. of Persons Trained" id="f7-cb-trained">
              {(control) => (
                <Input
                  {...control}
                  type="number"
                  min={0}
                  value={personsTrained}
                  onChange={(e) => setPersonsTrained(e.target.value)}
                  placeholder="Enter no. of persons trained"
                />
              )}
            </FormField>
            <FormField label="Date of Last Capacity Building Training" id="f7-cb-date">
              {(control) => (
                <Input {...control} type="date" value={lastTrainingDate} onChange={(e) => setLastTrainingDate(e.target.value)} />
              )}
            </FormField>
          </FormSection>
        </>
      )}

      {current === 3 && (
        <FormSection
          title="Village Level Convergence Committee (VLCC) Meetings"
          columns={1}
          description="Meetings held so far and the date of the last one, by panchayat and village."
        >
          <DataTable
            columns={vlccColumns as unknown as DataTableColumn<Record<string, unknown>>[]}
            data={vlccRows as unknown as Record<string, unknown>[]}
            total={vlccRows.length}
            caption="Village Level Convergence Committee meetings"
            pageSizes={[20, 50, 100]}
          />
        </FormSection>
      )}
    </WizardScreen>
  );
}
