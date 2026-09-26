"use client";

/* Adarsh Gram — District: Format – III(A), Manage Survey.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/format-3a/survey-edit.

   DS Audit: WorklistScreen ✅ (register, all seven states, pager, phone cards) ·
   FormPanel ✅ + FormSection ✅ + FormField ✅ (the correction panel) · Alert ✅
   (save confirmation) · Badge ✅ · Select ✅ · NumberInput ✅ · Textarea ✅. Nothing added.

   The live capture shows only the filter row — Block, Gram Panchayat, Village, Category,
   Survey Status — because nothing had been picked when it was taken; the register and the
   correction step that follow are not in the capture. Per the build brief ("read the
   screenshot and build what it actually offers"), this reproduces what the screen's own
   filters and its "+ Survey" action say it must do: narrow to one village, then let the
   officer pick a household and correct its submitted survey. Picking a household opens a
   correction panel in place — a `RecordScreen`/`FormScreen` pair would mean leaving the
   register and losing the filters that found the household, for a form with four fields. */

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Badge,
  Button,
  FormField,
  FormPanel,
  FormSection,
  Icon,
  IconButton,
  NumberInput,
  Select,
  Textarea,
  WorklistScreen,
  screenCopy,
  type BadgeStatus,
  type ErrorSummaryItem,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_BASE } from "@/lib/pm-ajay/district/nav";
import {
  BLOCKS,
  GRAM_PANCHAYATS,
  HOUSEHOLDS,
  INDICATOR_DOMAINS,
  VILLAGES,
  type HouseholdRecord,
} from "@/lib/pm-ajay/district/registers";
import { HOUSEHOLD_CATEGORIES, SURVEY_STATUSES, surveyDetailFor } from "@/lib/pm-ajay/district/format-3a";

const ALL = "All";

const SURVEY_STATUS_TONE: Record<HouseholdRecord["surveyStatus"], BadgeStatus> = {
  Surveyed: "success",
  Pending: "warning",
  "Re-survey Required": "danger",
};

const COLUMNS: WorklistColumn<HouseholdRecord>[] = [
  { key: "id", header: "Household ID", priority: 1 },
  { key: "head", header: "Head of Household", priority: 1 },
  { key: "category", header: "Category", priority: 2 },
  { key: "members", header: "Number of Persons", align: "end", priority: 3 },
  {
    key: "surveyStatus",
    header: "Survey Status",
    priority: 2,
    render: (row) => <Badge status={SURVEY_STATUS_TONE[row.surveyStatus]}>{row.surveyStatus}</Badge>,
  },
  { key: "surveyedOn", header: "Surveyed On", priority: 3, render: (row) => row.surveyedOn ?? "Not yet surveyed" },
];

interface CorrectionDraft {
  category: string;
  members: number | null;
  surveyStatus: HouseholdRecord["surveyStatus"];
  domain: string;
  remarks: string;
}

export default function ManageSurveyPage() {
  const [block, setBlock] = React.useState("");
  const [gramPanchayat, setGramPanchayat] = React.useState("");
  const [village, setVillage] = React.useState("");
  const [category, setCategory] = React.useState(ALL);
  const [surveyStatus, setSurveyStatus] = React.useState(ALL);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<CorrectionDraft | null>(null);
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState<string | null>(null);

  const gramPanchayats = block ? (GRAM_PANCHAYATS[block] ?? []) : [];
  const villages = React.useMemo(
    () => (gramPanchayat ? VILLAGES.filter((v) => v.block === block && v.gramPanchayat === gramPanchayat) : []),
    [block, gramPanchayat],
  );

  const asked = village !== "";

  const rows = React.useMemo(() => {
    if (!asked) return [];
    return HOUSEHOLDS.filter((h) => {
      if (h.village !== village) return false;
      if (category !== ALL && h.category !== category) return false;
      if (surveyStatus !== ALL && h.surveyStatus !== surveyStatus) return false;
      return true;
    });
  }, [asked, village, category, surveyStatus]);

  const registerTotal = asked ? HOUSEHOLDS.filter((h) => h.village === village).length : 0;
  const activeFilterCount = (category !== ALL ? 1 : 0) + (surveyStatus !== ALL ? 1 : 0);

  const editingHousehold = editingId ? (HOUSEHOLDS.find((h) => h.id === editingId) ?? null) : null;

  const openCorrection = (row: HouseholdRecord) => {
    const detail = surveyDetailFor(row.id);
    setEditingId(row.id);
    setDraft({
      category: row.category,
      members: row.members,
      surveyStatus: row.surveyStatus,
      domain: detail?.domain ?? INDICATOR_DOMAINS[0],
      remarks: detail?.remarks ?? "",
    });
    setErrors([]);
    setConfirmation(null);
  };

  const closeCorrection = () => {
    setEditingId(null);
    setDraft(null);
    setErrors([]);
  };

  const onSave = () => {
    if (!draft || !editingHousehold) return;
    const found: ErrorSummaryItem[] = [];
    if (draft.members == null || draft.members < 1)
      found.push({ fieldId: "sv-members", message: "Enter the number of persons in the household." });
    if (draft.surveyStatus === "Re-survey Required" && !draft.remarks.trim())
      found.push({ fieldId: "sv-remarks", message: "Say why the household needs a re-survey." });
    setErrors(found);
    if (found.length > 0) return;

    setSubmitting(true);
    /* No API yet: the register is illustrative, so the correction is acknowledged and
       the officer is returned to the register rather than pretending a record was
       written. */
    window.setTimeout(() => {
      setSubmitting(false);
      setConfirmation(`Survey corrected for ${editingHousehold.head}, ${editingHousehold.village}.`);
      closeCorrection();
    }, 500);
  };

  return (
    <>
      <WorklistScreen
        eyebrow="Adarsh Gram — District"
        title="Format – III(A): Manage Survey"
        meta={`Correct a household's submitted Format III(A) survey.`}
        summary={
          confirmation ? (
            <Alert status="success" dismissible onDismiss={() => setConfirmation(null)}>
              {confirmation}
            </Alert>
          ) : undefined
        }
        actions={
          <>
            <Button href={`${DISTRICT_BASE}/dashboard`} linkAs={Link} appearance="outlined" iconLeft={<Icon name="arrow_back" size={20} />}>
              Back to Dashboard
            </Button>
            <Button href={`${DISTRICT_BASE}/format-3a/add`} linkAs={Link} iconLeft={<Icon name="add" size={20} />}>
              Survey
            </Button>
          </>
        }
        filters={
          <>
            <FormField label="Block" id="sv-filter-block" required>
              {(control) => (
                <Select
                  {...control}
                  placeholder="Select Block"
                  value={block}
                  onChange={(event) => {
                    setBlock(event.target.value);
                    setGramPanchayat("");
                    setVillage("");
                    closeCorrection();
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
            <FormField label="Gram Panchayat" id="sv-filter-gp" required disabled={!block}>
              {(control) => (
                <Select
                  {...control}
                  placeholder="Select Gram Panchayat"
                  value={gramPanchayat}
                  onChange={(event) => {
                    setGramPanchayat(event.target.value);
                    setVillage("");
                    closeCorrection();
                  }}
                >
                  {gramPanchayats.map((gp) => (
                    <option key={gp} value={gp}>
                      {gp}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Village" id="sv-filter-village" required disabled={!gramPanchayat}>
              {(control) => (
                <Select
                  {...control}
                  placeholder="Select Village"
                  value={village}
                  onChange={(event) => {
                    setVillage(event.target.value);
                    closeCorrection();
                  }}
                >
                  {villages.map((v) => (
                    <option key={v.id} value={v.village}>
                      {v.village}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Category" id="sv-filter-category">
              {(control) => (
                <Select {...control} value={category} onChange={(event) => setCategory(event.target.value)}>
                  <option value={ALL}>All</option>
                  {HOUSEHOLD_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Survey Status" id="sv-filter-status">
              {(control) => (
                <Select {...control} value={surveyStatus} onChange={(event) => setSurveyStatus(event.target.value)}>
                  <option value={ALL}>All</option>
                  {SURVEY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </>
        }
        activeFilterCount={activeFilterCount}
        onClearFilters={() => {
          setCategory(ALL);
          setSurveyStatus(ALL);
        }}
        asked={asked}
        columns={COLUMNS}
        rows={rows}
        registerTotal={registerTotal}
        getRowId={(row) => row.id}
        noun="household"
        pluralNoun="households"
        rowActions={(row) => (
          <IconButton
            icon={<Icon name="edit" size={20} />}
            aria-label={`Correct survey for ${row.id}`}
            variant="neutral"
            appearance="text"
            size="sm"
            tooltip
            onClick={() => openCorrection(row)}
          />
        )}
        copy={screenCopy({
          idleTitle: "Choose a Village",
          idleDescription: "Select Block, Gram Panchayat and Village to manage its household surveys.",
          emptyTitle: "No Household Is on the Register for This Village",
          emptyDescription: "A household must be added on Manage Household before its survey can be corrected.",
          filteredTitle: "No Household Matches Those Filters",
          filteredDescription: "Clear the category or survey status filter to see every household in this village.",
        })}
      />

      {editingHousehold && draft ? (
        <FormPanel
          title={`Correct Survey — ${editingHousehold.head}`}
          description={`${editingHousehold.village}, ${gramPanchayat}, ${block} block.`}
          footer={
            <div className="sa-form__actions">
              <div className="sa-form__actions-state" aria-live="polite">
                {submitting ? "Saving…" : null}
              </div>
              <div className="sa-form__actions-buttons">
                <Button type="button" appearance="outlined" onClick={closeCorrection}>
                  Cancel
                </Button>
                <Button type="button" disabled={submitting} onClick={onSave}>
                  Save Correction
                </Button>
              </div>
            </div>
          }
        >
          <FormSection title="Survey Particulars" columns={2}>
            <FormField label="Category" id="sv-category" required>
              {(control) => (
                <Select
                  {...control}
                  value={draft.category}
                  onChange={(event) => setDraft((d) => (d ? { ...d, category: event.target.value } : d))}
                >
                  {HOUSEHOLD_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <NumberInput
              id="sv-members"
              label="Number of Persons"
              required
              value={draft.members}
              onValueChange={(value) => setDraft((d) => (d ? { ...d, members: value } : d))}
              min={1}
              error={errors.find((e) => e.fieldId === "sv-members")?.message as string | undefined}
            />
            <FormField label="Survey Status" id="sv-status" required>
              {(control) => (
                <Select
                  {...control}
                  value={draft.surveyStatus}
                  onChange={(event) =>
                    setDraft((d) => (d ? { ...d, surveyStatus: event.target.value as HouseholdRecord["surveyStatus"] } : d))
                  }
                >
                  {SURVEY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField label="Domain Assessed" id="sv-domain" required>
              {(control) => (
                <Select
                  {...control}
                  value={draft.domain}
                  onChange={(event) => setDraft((d) => (d ? { ...d, domain: event.target.value } : d))}
                >
                  {INDICATOR_DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
            <FormField
              label="Remarks"
              id="sv-remarks"
              className="ds-form-span-full"
              required={draft.surveyStatus === "Re-survey Required"}
              hint="Required when the survey is returned for a re-survey."
              error={errors.find((e) => e.fieldId === "sv-remarks")?.message}
            >
              {(control) => (
                <Textarea
                  {...control}
                  value={draft.remarks}
                  onChange={(event) => setDraft((d) => (d ? { ...d, remarks: event.target.value } : d))}
                  placeholder="What the re-survey should check, or what changed."
                />
              )}
            </FormField>
          </FormSection>
        </FormPanel>
      ) : null}
    </>
  );
}
