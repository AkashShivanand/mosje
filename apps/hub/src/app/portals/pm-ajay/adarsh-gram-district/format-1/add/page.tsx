"use client";

/* Adarsh Gram — District: Create Format I, Village Level Data.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-1/add.

   DS Audit: FormScreen ✅ (owns the required note, the error summary, the sticky
   actions and the submitting/saved states) · FormSection ✅ · FormInset ✅ (the VLCC
   members list — "one entry of a repeatable group", built for exactly this) ·
   FormField ✅ · Input ✅ · Select ✅ · MediaUpload ✅ · Button ✅ · Icon ✅. Nothing added.

   Deliberate departures from the live screen, both explained where they change behaviour:
   - State and District are not drawn as two disabled fields. `agency/add` already made
     this call for the same reason: a district officer has exactly one state and one
     district, so the section description says which rather than the form drawing two
     fields nobody can change (`.claude/rules/ui-restraint-and-copy.md` §1).
   - The five VLCC member rows the section requires cannot be removed; only a row added
     beyond the minimum can be. The live screen draws a remove icon on all five, but a
     control that would break a stated minimum the moment it is pressed is not a control
     worth offering — the same reasoning `form-inset-playground.tsx` already applies
     ("Remove" appears only when `entries.length > 1`), generalised to a minimum of 5. */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  FormField,
  FormInset,
  FormScreen,
  FormSection,
  Icon,
  Input,
  MediaUpload,
  Select,
  type ErrorSummaryItem,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BLOCKS,
  DISTRICT_SCOPE,
  GRAM_PANCHAYATS,
  VILLAGES,
} from "@/lib/pm-ajay/district/registers";

/** VLCC — Village Level Convergence Committee — the roles the committee is drawn from. */
const VLCC_DESIGNATIONS = [
  "Sarpanch",
  "Ward Member",
  "Panchayat Secretary",
  "Anganwadi Worker",
  "ASHA Worker",
  "Village Level Worker",
  "School Headmaster",
  "Junior Engineer",
] as const;

const MIN_MEMBERS = 5;

interface MemberDraft {
  id: number;
  name: string;
  designation: string;
  mobile: string;
  email: string;
  address: string;
  remarks: string;
}

const emptyMember = (id: number): MemberDraft => ({
  id,
  name: "",
  designation: "",
  mobile: "",
  email: "",
  address: "",
  remarks: "",
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Format1AddPage() {
  const router = useRouter();

  const [block, setBlock] = React.useState("");
  const [gramPanchayat, setGramPanchayat] = React.useState("");
  const [village, setVillage] = React.useState("");
  const [households, setHouseholds] = React.useState("");
  const [currentPopulation, setCurrentPopulation] = React.useState("");
  const [currentScPopulation, setCurrentScPopulation] = React.useState("");
  const [surveyFrom, setSurveyFrom] = React.useState("");
  const [surveyTo, setSurveyTo] = React.useState("");
  const [approvalLetter, setApprovalLetter] = React.useState<{ dataUrl: string; fileName: string } | null>(null);
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [members, setMembers] = React.useState<MemberDraft[]>(() =>
    Array.from({ length: MIN_MEMBERS }, (_, i) => emptyMember(i + 1)),
  );
  const nextMemberId = React.useRef(MIN_MEMBERS + 1);

  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | undefined>(undefined);

  const latitudeRef = React.useRef<HTMLInputElement>(null);

  const gpOptions = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villageOptions = gramPanchayat
    ? VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat).map((v) => v.village)
    : [];
  const censusVillage = VILLAGES.find(
    (v) => v.block === block && v.gramPanchayat === gramPanchayat && v.village === village,
  );

  const dirty =
    Boolean(block || gramPanchayat || village || households || currentPopulation || currentScPopulation) ||
    members.some((m) => m.name || m.designation || m.mobile || m.email || m.address || m.remarks);

  const errorFor = (fieldId: string) => errors.find((e) => e.fieldId === fieldId)?.message;

  const setMember = (id: number, key: keyof MemberDraft, value: string) => {
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, [key]: value } : m)));
  };

  const addMember = () => {
    setMembers((list) => [...list, emptyMember(nextMemberId.current++)]);
  };

  const removeMember = (id: number) => {
    setMembers((list) => list.filter((m) => m.id !== id));
  };

  const validate = (): ErrorSummaryItem[] => {
    const found: ErrorSummaryItem[] = [];
    if (!block) found.push({ fieldId: "f1-block", message: "Choose the block this village lies in." });
    if (!gramPanchayat) found.push({ fieldId: "f1-gp", message: "Choose the Gram Panchayat." });
    if (!village) found.push({ fieldId: "f1-village", message: "Choose the village." });
    if (!households.trim() || Number(households) <= 0)
      found.push({ fieldId: "f1-households", message: "Enter the number of households." });
    if (!currentPopulation.trim() || Number(currentPopulation) <= 0)
      found.push({ fieldId: "f1-current-population", message: "Enter the current total population." });
    if (!currentScPopulation.trim() || Number(currentScPopulation) < 0)
      found.push({ fieldId: "f1-current-sc-population", message: "Enter the current SC population." });
    if (
      currentScPopulation.trim() &&
      currentPopulation.trim() &&
      Number(currentScPopulation) > Number(currentPopulation)
    )
      found.push({
        fieldId: "f1-current-sc-population",
        message: "The SC population cannot exceed the total population.",
      });
    if (!surveyFrom) found.push({ fieldId: "f1-survey-from", message: "Enter the date the survey period began." });
    if (!surveyTo) found.push({ fieldId: "f1-survey-to", message: "Enter the date the survey period ended." });
    if (surveyFrom && surveyTo && surveyFrom > surveyTo)
      found.push({ fieldId: "f1-survey-to", message: "The survey period cannot end before it begins." });
    if (!approvalLetter)
      found.push({ fieldId: "f1-approval-letter", message: "Upload the VLCC member approval letter." });

    members.forEach((m, i) => {
      if (!m.name.trim())
        found.push({ fieldId: `vlcc-${m.id}-name`, message: `Enter the name of VLCC member ${i + 1}.` });
      if (!m.designation)
        found.push({ fieldId: `vlcc-${m.id}-designation`, message: `Choose the designation of VLCC member ${i + 1}.` });
      if (!/^[0-9]{10}$/.test(m.mobile.trim()))
        found.push({ fieldId: `vlcc-${m.id}-mobile`, message: `Enter a ten-digit mobile number for VLCC member ${i + 1}.` });
      if (m.email.trim() && !EMAIL_RE.test(m.email.trim()))
        found.push({ fieldId: `vlcc-${m.id}-email`, message: `Enter a valid email address for VLCC member ${i + 1}.` });
      if (m.address.trim().length < 10 || m.address.trim().length > 100)
        found.push({ fieldId: `vlcc-${m.id}-address`, message: `Enter an address of 10–100 characters for VLCC member ${i + 1}.` });
    });

    return found;
  };

  const onSubmit = () => {
    const found = validate();
    setErrors(found);
    if (found.length > 0) return;

    setSubmitting(true);
    /* No API yet: the register is illustrative, so the save is acknowledged and the
       officer is returned to the register rather than pretending a record was written. */
    window.setTimeout(() => {
      setSubmitting(false);
      setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      router.push(`${DISTRICT_BASE}/format-1`);
    }, 600);
  };

  const onSaveDraft = () => {
    if (!village) {
      setErrors([{ fieldId: "f1-village", message: "Choose the village before saving a draft." }]);
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSavedAt(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      router.push(`${DISTRICT_BASE}/format-1`);
    }, 600);
  };

  return (
    <FormScreen
      breadcrumb={[
        { label: "Dashboard", href: `${DISTRICT_BASE}/dashboard` },
        { label: "Format – I: Village Level Data", href: `${DISTRICT_BASE}/format-1` },
        { label: "Create – Format I: Village Level Data" },
      ]}
      eyebrow="Adarsh Gram — District · Village Format I to IV"
      title="Create – Format I: Village Level Data"
      meta={`Population, households and VLCC committee details recorded once for each village taken up under Adarsh Gram in ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}.`}
      errors={errors}
      onSubmit={onSubmit}
      submitLabel="Submit"
      onCancel={() => router.push(`${DISTRICT_BASE}/format-1`)}
      secondaryActions={
        <Button type="button" appearance="outlined" onClick={onSaveDraft} disabled={submitting}>
          Save as Draft
        </Button>
      }
      submitting={submitting}
      dirty={dirty}
      savedAt={savedAt}
    >
      <FormSection
        title="Village Level Data"
        description={`Recorded for ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state} — the district you are posted to.`}
        columns={3}
      >
        <FormField label="Block" id="f1-block" required error={errorFor("f1-block")}>
          {(control) => (
            <Select
              {...control}
              value={block}
              placeholder="Select Block"
              onChange={(event) => {
                setBlock(event.target.value);
                setGramPanchayat("");
                setVillage("");
              }}
            >
              {BLOCKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField label="Gram Panchayat" id="f1-gp" required error={errorFor("f1-gp")}>
          {(control) => (
            <Select
              {...control}
              disabled={!block}
              value={gramPanchayat}
              placeholder="Select Gram Panchayat"
              onChange={(event) => {
                setGramPanchayat(event.target.value);
                setVillage("");
              }}
            >
              {gpOptions.map((gp) => (
                <option key={gp} value={gp}>
                  {gp}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField label="Village" id="f1-village" required error={errorFor("f1-village")}>
          {(control) => (
            <Select
              {...control}
              disabled={!gramPanchayat}
              value={village}
              placeholder="Select Village"
              onChange={(event) => setVillage(event.target.value)}
            >
              {villageOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField label="Population of Village (Census 2011)" id="f1-population" hint="Auto-filled once the village is chosen.">
          {(control) => (
            <Input {...control} type="number" disabled value={censusVillage ? String(censusVillage.population) : ""} placeholder="Auto-filled" />
          )}
        </FormField>
        <FormField label="SC Population (Census 2011)" id="f1-sc-population" hint="Auto-filled once the village is chosen.">
          {(control) => (
            <Input {...control} type="number" disabled value={censusVillage ? String(censusVillage.scPopulation) : ""} placeholder="Auto-filled" />
          )}
        </FormField>
        <FormField label="No. of Households" id="f1-households" required error={errorFor("f1-households")}>
          {(control) => (
            <Input {...control} type="number" inputMode="numeric" min={0} value={households} onChange={(e) => setHouseholds(e.target.value)} />
          )}
        </FormField>

        <FormField label="Current Total Population" id="f1-current-population" required error={errorFor("f1-current-population")}>
          {(control) => (
            <Input
              {...control}
              type="number"
              inputMode="numeric"
              min={0}
              value={currentPopulation}
              onChange={(e) => setCurrentPopulation(e.target.value)}
            />
          )}
        </FormField>
        <FormField label="Current SC Population" id="f1-current-sc-population" required error={errorFor("f1-current-sc-population")}>
          {(control) => (
            <Input
              {...control}
              type="number"
              inputMode="numeric"
              min={0}
              value={currentScPopulation}
              onChange={(e) => setCurrentScPopulation(e.target.value)}
            />
          )}
        </FormField>
        <FormField label="Survey Period From" id="f1-survey-from" required error={errorFor("f1-survey-from")}>
          {(control) => <Input {...control} type="date" value={surveyFrom} onChange={(e) => setSurveyFrom(e.target.value)} />}
        </FormField>
        <FormField label="Survey Period To" id="f1-survey-to" required error={errorFor("f1-survey-to")}>
          {(control) => <Input {...control} type="date" value={surveyTo} onChange={(e) => setSurveyTo(e.target.value)} />}
        </FormField>

        <FormField
          label="Upload VLCC Member Approval Letter"
          id="f1-approval-letter"
          required
          hint="PDF only, up to 1 MB."
          error={errorFor("f1-approval-letter")}
          className="ds-form-span-full"
        >
          {(control) => (
            <MediaUpload
              {...control}
              accept="application/pdf"
              maxSizeMb={1}
              value={approvalLetter?.dataUrl}
              fileName={approvalLetter?.fileName}
              onChange={(dataUrl, fileName) => setApprovalLetter({ dataUrl, fileName })}
              onClear={() => setApprovalLetter(null)}
              promptLabel="Click or drag the approval letter to upload"
              hintLabel="PDF, up to 1 MB."
            />
          )}
        </FormField>
      </FormSection>

      <FormSection
        title="GPS Coordinates of Village"
        description="Select a village first to drop the location pin."
        columns={2}
      >
        <div className="ds-form-span-full">
          <Button
            type="button"
            appearance="outlined"
            iconLeft={<Icon name="location_on" size={20} />}
            disabled={!village}
            onClick={() => latitudeRef.current?.focus()}
          >
            Pick Location on Map
          </Button>
        </div>
        <FormField label="Latitude" id="f1-latitude">
          {(control) => (
            <Input {...control} ref={latitudeRef} value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Drop a pin" />
          )}
        </FormField>
        <FormField label="Longitude" id="f1-longitude">
          {(control) => (
            <Input {...control} value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Drop a pin" />
          )}
        </FormField>
      </FormSection>

      <FormSection
        title="VLCC Members (Min 5 Required)"
        description="Name, designation, mobile number and address of each Village Level Convergence Committee member. Add more beyond the minimum of five where the committee is larger."
        columns={1}
      >
        {members.map((m, i) => (
          <FormInset
            key={m.id}
            title={`Member ${i + 1}`}
            columns={3}
            actions={
              members.length > MIN_MEMBERS ? (
                <Button
                  type="button"
                  appearance="text"
                  variant="neutral"
                  size="sm"
                  iconLeft={<Icon name="close" size={18} />}
                  onClick={() => removeMember(m.id)}
                  aria-label={`Remove Member ${i + 1}`}
                >
                  Remove
                </Button>
              ) : undefined
            }
          >
            <FormField label="Name" id={`vlcc-${m.id}-name`} required error={errorFor(`vlcc-${m.id}-name`)}>
              {(control) => (
                <Input {...control} value={m.name} onChange={(e) => setMember(m.id, "name", e.target.value)} placeholder="Name" />
              )}
            </FormField>
            <FormField label="Designation" id={`vlcc-${m.id}-designation`} required error={errorFor(`vlcc-${m.id}-designation`)}>
              {(control) => (
                <Select
                  {...control}
                  value={m.designation}
                  placeholder="Select Designation"
                  onChange={(e) => setMember(m.id, "designation", e.target.value)}
                >
                  {VLCC_DESIGNATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Mobile" id={`vlcc-${m.id}-mobile`} required error={errorFor(`vlcc-${m.id}-mobile`)}>
              {(control) => (
                <Input
                  {...control}
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  value={m.mobile}
                  onChange={(e) => setMember(m.id, "mobile", e.target.value)}
                  placeholder="10 digits"
                />
              )}
            </FormField>
            <FormField label="Email" id={`vlcc-${m.id}-email`} error={errorFor(`vlcc-${m.id}-email`)}>
              {(control) => (
                <Input
                  {...control}
                  type="email"
                  autoComplete="email"
                  value={m.email}
                  onChange={(e) => setMember(m.id, "email", e.target.value)}
                  placeholder="Email"
                />
              )}
            </FormField>
            <FormField
              label="Address"
              id={`vlcc-${m.id}-address`}
              required
              hint="10 to 100 characters."
              error={errorFor(`vlcc-${m.id}-address`)}
            >
              {(control) => (
                <Input
                  {...control}
                  maxLength={100}
                  value={m.address}
                  onChange={(e) => setMember(m.id, "address", e.target.value)}
                  placeholder="Address"
                />
              )}
            </FormField>
            <FormField label="Remarks" id={`vlcc-${m.id}-remarks`}>
              {(control) => (
                <Input {...control} value={m.remarks} onChange={(e) => setMember(m.id, "remarks", e.target.value)} placeholder="Remarks" />
              )}
            </FormField>
          </FormInset>
        ))}
        <Button type="button" appearance="outlined" size="sm" iconLeft={<Icon name="add" size={20} />} onClick={addMember}>
          Add Member
        </Button>
      </FormSection>
    </FormScreen>
  );
}
