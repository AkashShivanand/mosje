"use client";

/**
 * The Grant tab of the officer review: where the amount moves, the cost sheet the Programme
 * Division ASO prepares, and the Statement of Account for this release (NAPDDR; cost-sheet.ts).
 *
 * Built from the dev portal's ASO-PD review (walkthrough of 07 Oct 2026), reorganised:
 *   - The cost sheet and the Statement of Account are TWO CARDS, each with its own heading, its own
 *     saved/not-saved state and its own Save. On the dev portal the statement sat inside the cost
 *     sheet's card under two Save buttons, and in the walkthrough the designer had to ask whether
 *     they were one record or two. They are two, saved separately, and now read that way.
 *   - Each item states its norm under its name and takes one amount. The dev portal's six columns
 *     (#, item, norm, proposed, remarks, delete) do not fit the review column beside the decision.
 *     A remark is asked for where it matters: when the amount differs from the norm.
 *   - An either/or post is a choice, not two rows to delete one of (cost-sheet.ts, defect 1).
 *   - Removing an item is undoable in place, so it needs no confirmation dialog.
 *   - The balance after this release is computed, never typed (defect 3).
 *
 * DS Audit: Card ✅ · SectionTitle ✅ · Stepper ✅ · ListGroup / ListRow ✅ ·
 * FormField / Input / Select ✅ · RadioGroup ✅ · Button ✅ · IconButton ✅ · Badge ✅ · Alert ✅ ·
 * DescriptionList ✅ · Icon ✅ — nothing new.
 */

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  ListGroup,
  ListRow,
  DescriptionList,
  FormField,
  Icon,
  IconButton,
  Input,
  RadioGroup,
  SectionTitle,
  Select,
  Stepper,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { ROLES } from "@/lib/e-anudaan/roles";
import { formatDate, formatDateTime, rupees } from "@/lib/e-anudaan/format";
import {
  CHOICE_GROUP_LABEL,
  SCHEDULE_LABEL,
  amountPipeline,
  balanceAfter,
  defaultSchedule,

  releaseOf,
  schedulesFor,
  seedSheet,
  sheetChanged,
  sheetProblems,
  sheetTotals,
  statementProblems,
  netPayable,
  settlementProblems,
  type CostHead,
  type CostScheduleId,
  type SheetProblem,
} from "@/lib/e-anudaan/cost-sheet";
import type { CostSheet, CostSheetLine, GrantApplication } from "@/lib/e-anudaan/types";

const digits = (v: string) => v.replace(/[^\d]/g, "");
const grouped = (v: string) => (v === "" ? "" : Number(v).toLocaleString("en-IN"));
const savedLine = (at: string, by: string) => `Saved by ${ROLES[by as keyof typeof ROLES]?.personName ?? "the officer"} on ${formatDateTime(at)}`;

/** Whether this file is costed on the Grant tab at all. */
export function hasGrantTab(app: GrantApplication): boolean {
  return schedulesFor(app).length > 0;
}

/* ── Amount pipeline ─────────────────────────────────────────────────────── */

export function AmountPipeline({ app }: { app: GrantApplication }) {
  const stages = amountPipeline(app);
  if (!stages) return null;
  const current = stages.findIndex((s) => s.state === "current");
  return (
    <Card variant="outlined">
      <CardBody className="space-y-4">
        <SectionTitle title="Amount Pipeline" />
        <Stepper
          ariaLabel="Where the recommended amount has reached"
          current={current === -1 ? stages.length : current}
          // Vertical: the amount IS the content, and a horizontal Stepper drops its descriptions in
          // a column under 900px — which the review column always is beside the decision.
          orientation="vertical"
          steps={stages.map((s) => ({
            label: s.amount != null ? `${s.label} · ${rupees(s.amount)}` : s.label,
            description: s.amount != null ? `${s.by}${s.at ? ` · ${formatDate(s.at)}` : ""}` : s.state === "current" ? `Awaiting the ${s.by}` : s.by,
          }))}
        />
      </CardBody>
    </Card>
  );
}

/* ── Cost sheet ──────────────────────────────────────────────────────────── */

type Draft = Omit<CostSheet, "savedAt" | "savedBy">;

/** An ongoing project is costed on its recurring heads only; its one-time set-up came with its first sanction. */
const seedOpts = (app: GrantApplication) => ({ recurringOnly: app.caseType === "Ongoing" });

/** The sheet as the file holds it, or a fresh one at the norm. */
function draftOf(app: GrantApplication): Draft {
  if (!app.costSheet) return seedSheet(defaultSchedule(app)!, seedOpts(app));
  return structuredClone({ schedule: app.costSheet.schedule, lines: app.costSheet.lines, choices: app.costSheet.choices });
}

const HEAD_LABEL: Record<CostHead, string> = { nonRecurring: "Non-Recurring (One-Time)", recurring: "Recurring (Annual)" };

export function CostSheetCard({ app, editable }: { app: GrantApplication; editable: boolean }) {
  const { saveCostSheet } = useEAnudaan();
  const { toast } = useToast();
  const schedules = schedulesFor(app);
  // The parent keys this card on the saved sheet's timestamp, so a save — here, in another tab, or
  // the demo rail's reset — remounts it on what the file now holds.
  const initial = (): Draft => draftOf(app);
  const [draft, setDraft] = React.useState<Draft>(initial);
  const [tried, setTried] = React.useState(false);

  if (!schedules.length) return null;
  // Read by everyone after the ASO; drawn for the ASO while they hold the file.
  if (!editable && !app.costSheet) return null;

  const totals = sheetTotals(draft, app);
  const problems = sheetProblems(draft, app, rupees);
  const changed = sheetChanged(draft, app.costSheet);
  const problemFor = (match: (p: SheetProblem) => boolean) => (tried ? problems.find(match)?.message : undefined);

  const update = (id: string, patch: Partial<CostSheetLine>) =>
    setDraft((d) => ({ ...d, lines: d.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  const add = (head: CostHead) =>
    setDraft((d) => ({
      ...d,
      lines: [...d.lines, { id: `added-${Date.now().toString(36)}`, head, label: "", norm: 0, proposed: 0, added: true }],
    }));
  const save = () => {
    setTried(true);
    if (problems.length) {
      toast(`The cost sheet was not saved. ${problems.length} thing${problems.length === 1 ? "" : "s"} to put right.`, "error");
      return;
    }
    const res = saveCostSheet(app.id, { ...draft, lines: draft.lines.filter((l) => !(l.added && l.removed)) });
    if (res.ok) {
      setTried(false);
      toast(`Cost sheet saved. Recommended grant ${rupees(totals.proposed)}.`, "success");
    }
  };

  const state = !app.costSheet ? (
    <Badge status="warning" size="sm">Not Saved</Badge>
  ) : changed && editable ? (
    <Badge status="warning" size="sm">Unsaved Changes</Badge>
  ) : (
    <Badge status="success" size="sm">Saved</Badge>
  );

  return (
    <Card variant="outlined" id="cost-sheet">
      <CardBody className="space-y-5">
        <SectionTitle
          title="Cost Sheet"
          description={
            app.costSheet && !changed
              ? `${SCHEDULE_LABEL[draft.schedule]} · ${savedLine(app.costSheet.savedAt, app.costSheet.savedBy)}.`
              : `${SCHEDULE_LABEL[draft.schedule]} · Opens at the scheme's cost norm. Each head may be recommended up to the lower of its norm and the NGO's claim.`
          }
        >
          {state}
        </SectionTitle>

        {editable && schedules.length > 1 && (
          <FormField label="Bed Capacity" id="cost-sheet-schedule" hint="Set by the reviewing officer for a general IRCA. Changing it reopens the sheet at that norm.">
            {(c) => (
              <Select
                {...c}
                containerClassName="max-w-xs"
                options={schedules.map((s) => ({ value: s, label: SCHEDULE_LABEL[s] }))}
                value={draft.schedule}
                onChange={(e) => {
                  setDraft(seedSheet(e.target.value as CostScheduleId, seedOpts(app)));
                  setTried(false);
                }}
              />
            )}
          </FormField>
        )}

        {/* An ongoing project's sheet has no one-time head to show (seedOpts). */}
        {(app.caseType === "Ongoing" ? (["recurring"] as const) : (["nonRecurring", "recurring"] as const)).map((head) => (
          <HeadTable
            key={head}
            head={head}
            draft={draft}
            app={app}
            editable={editable}
            totals={totals[head]}
            tried={tried}
            problems={problems}
            onLine={update}
            onChoose={(group, id) => setDraft((d) => ({ ...d, choices: { ...d.choices, [group]: id } }))}
            onAdd={() => add(head)}
            headError={problemFor((p) => p.target.kind === "head" && p.target.head === head)}
          />
        ))}

        {/* The recommended grant: BOTH heads (cost-sheet.ts, defect 2), beside the ceiling it is held to. */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4">
          <DescriptionList
            columns={2}
            size="sm"
            items={[
              { term: "Admissible Ceiling", value: <span className="tabular-nums">{rupees(totals.admissible)}</span> },
              { term: "NGO's Claim", value: <span className="tabular-nums">{rupees(app.total)}</span> },
            ]}
          />
          <p className="text-right">
            <span className="block text-body-3 text-ink-muted">Recommended Grant</span>
            <strong className={`block text-headline-4 tabular-nums ${totals.proposed > totals.admissible ? "text-[var(--sa-text-status-error-bolder)]" : "text-ink"}`}>
              {rupees(totals.proposed)}
            </strong>
          </p>
        </div>

        {editable && (
          <div className="flex flex-wrap items-center justify-end gap-3">
            {changed && app.costSheet && (
              <Button appearance="text" onClick={() => { setDraft(initial()); setTried(false); }}>
                Discard Changes
              </Button>
            )}
            <Button
              appearance="outlined"
              onClick={() => {
                setDraft(seedSheet(draft.schedule, seedOpts(app)));
                setTried(false);
              }}
            >
              Reset to Norm
            </Button>
            <Button onClick={save} disabled={!changed}>
              <Icon name="save" size={16} aria-hidden /> Save Cost Sheet
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

type Row = { kind: "line"; line: CostSheetLine; n: number } | { kind: "choice"; group: string; lines: CostSheetLine[]; n: number };

function HeadTable({
  head,
  draft,
  app,
  editable,
  totals,
  tried,
  problems,
  onLine,
  onChoose,
  onAdd,
  headError,
}: {
  head: CostHead;
  draft: Draft;
  app: GrantApplication;
  editable: boolean;
  totals: ReturnType<typeof sheetTotals>["recurring"];
  tried: boolean;
  problems: SheetProblem[];
  onLine: (id: string, patch: Partial<CostSheetLine>) => void;
  onChoose: (group: string, lineId: string) => void;
  onAdd: () => void;
  headError?: string;
}) {
  const lines = draft.lines.filter((l) => l.head === head);
  const removed = lines.filter((l) => l.removed && !l.added);
  // One row per item, and one row per either/or group in the place its first option stood.
  const rows: Row[] = [];
  const seen = new Set<string>();
  for (const l of lines) {
    if (l.removed) continue;
    if (l.choice) {
      if (seen.has(l.choice.group)) continue;
      seen.add(l.choice.group);
      rows.push({ kind: "choice", group: l.choice.group, lines: lines.filter((x) => x.choice?.group === l.choice!.group && !x.removed), n: rows.length + 1 });
    } else rows.push({ kind: "line", line: l, n: rows.length + 1 });
  }
  const lineError = (id: string) => (tried ? problems.find((p) => p.target.kind === "line" && p.target.id === id)?.message : undefined);
  const choiceError = (group: string) => (tried ? problems.find((p) => p.target.kind === "choice" && p.target.group === group)?.message : undefined);
  if (!editable && rows.length === 0) return null;

  const amount = (l: CostSheetLine, label: string) =>
    editable ? (
      <Input
        aria-label={`Proposed amount, ${label}`}
        inputMode="numeric"
        prefix="₹"
        prefixLabel="rupees"
        className="w-[9.5rem] text-right tabular-nums"
        value={grouped(String(l.proposed))}
        invalid={!!lineError(l.id)}
        onChange={(e) => onLine(l.id, { proposed: Number(digits(e.target.value) || 0) })}
      />
    ) : (
      <span className="tabular-nums">{rupees(l.proposed)}</span>
    );

  const removeButton = (ids: string[], name: string) => (
    <IconButton
      appearance="text"
      size="sm"
      icon={<Icon name="delete" size={20} />}
      aria-label={`Remove ${name}`}
      tooltip
      onClick={() => ids.forEach((id) => onLine(id, { removed: true }))}
    />
  );

  return (
    <section className="space-y-3" aria-labelledby={`head-${head}`}>
      <h4 id={`head-${head}`} className="text-body-2 font-semibold text-ink">
        {HEAD_LABEL[head]}
      </h4>
      {/* A list, not a table: each item's amount sits beside it on a wide column and wraps under
          it on a phone (ListRow's trailing slot). The six-column table this replaced cut the
          amount off at 390px and set the item names one word to a line. */}
      <ListGroup aria-label={`${HEAD_LABEL[head]} items of expense`} bordered size="sm">
        {rows.map((r) => {
          if (r.kind === "choice") {
            const chosen = r.lines.find((l) => l.id === draft.choices[r.group]);
            const name = CHOICE_GROUP_LABEL[r.group] ?? r.group;
            return (
              <ListRow
                key={`choice-${r.group}`}
                leading={<span className="w-6 text-body-3 tabular-nums text-ink-muted">{r.n}</span>}
                title={
                  <RadioGroup
                    legend={`${name} — Choose One`}
                    name={`choice-${head}-${r.group}`}
                    size="sm"
                    readOnly={!editable}
                    value={draft.choices[r.group] ?? ""}
                    onChange={(v) => onChoose(r.group, v)}
                    error={choiceError(r.group)}
                    options={r.lines.map((l) => ({ value: l.id, label: l.choice!.option, description: optionDetail(l) }))}
                  />
                }
                trailing={
                  <span className="flex items-center gap-2">
                    {chosen ? amount(chosen, `${name}, ${chosen.choice!.option}`) : <span className="text-body-3 text-ink-muted">Choose one</span>}
                    {editable && removeButton(r.lines.map((l) => l.id), name)}
                  </span>
                }
              />
            );
          }
          const l = r.line;
          return (
            <ListRow
              key={l.id}
              leading={<span className="w-6 text-body-3 tabular-nums text-ink-muted">{r.n}</span>}
              title={<ItemCell line={l} editable={editable} error={lineError(l.id)} onLine={onLine} />}
              trailing={
                <span className="flex items-center gap-2">
                  {amount(l, l.label || "new item")}
                  {editable && removeButton([l.id], l.label || "new item")}
                </span>
              }
            />
          );
        })}
        <ListRow
          title={<span className="font-semibold">{head === "recurring" ? "Recurring" : "Non-Recurring"} Total</span>}
          trailing={<strong className="tabular-nums text-ink">{rupees(totals.proposed)}</strong>}
        />
      </ListGroup>

      {/* The ceiling this head is held to, and only where the proposal breaks it, what to do. */}
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-body-3 text-ink-muted">
        <span>Norm <span className="tabular-nums text-ink">{rupees(totals.norm)}</span></span>
        <span>NGO&apos;s claim <span className="tabular-nums text-ink">{rupees(totals.claimed)}</span></span>
        <span>Admissible <strong className="tabular-nums text-ink">{rupees(totals.admissible)}</strong></span>
      </p>
      {totals.over > 0 && (
        <p className="text-body-3 text-[var(--sa-text-status-error-bolder)]" role={headError ? "alert" : undefined}>
          <Icon name="error" size={16} className="me-1 align-[-3px]" aria-hidden />
          {rupees(totals.over)} above the admissible {rupees(totals.admissible)}.{" "}
          {totals.claimed < totals.norm ? "The NGO claimed less than the norm, so its claim is the ceiling." : ""}
        </p>
      )}

      {editable && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button appearance="text" size="sm" onClick={onAdd}>
            <Icon name="add" size={16} aria-hidden /> Add Item
          </Button>
          {removed.length > 0 && (
            <span className="flex flex-wrap items-center gap-x-2 text-body-3 text-ink-muted">
              Removed:
              {removed.map((l) => (
                <Button key={l.id} appearance="text" size="sm" onClick={() => onLine(l.id, { removed: false })} aria-label={`Restore ${l.label}`}>
                  <Icon name="undo" size={16} aria-hidden /> {shortName(l)}
                </Button>
              ))}
            </span>
          )}
        </div>
      )}
      {!editable && app.costSheet && removed.length > 0 && (
        <p className="text-body-3 text-ink-muted">Removed by the officer: {removed.map(shortName).join("; ")}.</p>
      )}
    </section>
  );
}

/** An either/or option under its own name: the norm and the rate, not the post's name again. */
const optionDetail = (l: CostSheetLine) => {
  const rate = /\((Rs\.[^)]*)\)/.exec(l.label)?.[1];
  const extra = /\), (for .*)$/.exec(l.label)?.[1];
  return [`Norm ${rupees(l.norm)}`, rate, extra].filter(Boolean).join(" · ");
};

const shortName = (l: CostSheetLine) => (l.choice ? `${CHOICE_GROUP_LABEL[l.choice.group] ?? l.choice.group}, ${l.choice.option}` : l.label.split(" — ")[0]!.split(" (")[0]!);

/** An item: its name and norm, and — where the amount differs from the norm — the reason. */
function ItemCell({
  line: l,
  editable,
  error,
  onLine,
}: {
  line: CostSheetLine;
  editable: boolean;
  error?: string;
  onLine: (id: string, patch: Partial<CostSheetLine>) => void;
}) {
  const differs = !l.added && l.proposed !== l.norm;
  if (l.added) {
    return editable ? (
      <FormField label="Item of Expense" id={`item-${l.id}`} error={error} hint="Added by you · no norm">
        {(c) => <Input {...c} value={l.label} onChange={(e) => onLine(l.id, { label: e.target.value })} />}
      </FormField>
    ) : (
      <span>
        {l.label} <span className="block text-body-3 text-ink-muted">Added by the officer · no norm</span>
        {l.remark && <span className="block text-body-3 text-ink-muted">Remark: {l.remark}</span>}
      </span>
    );
  }
  return (
    <div className="space-y-1">
      <span className="block text-body-2 text-ink">{l.label}</span>
      <span className="block text-body-3 text-ink-muted">
        Norm <span className="tabular-nums">{rupees(l.norm)}</span>
        {differs && (
          <span className={l.proposed > l.norm ? "text-[var(--sa-text-status-warning-bolder)]" : undefined}>
            {" "}· {l.proposed > l.norm ? `${rupees(l.proposed - l.norm)} above` : `${rupees(l.norm - l.proposed)} below`} the norm
          </span>
        )}
      </span>
      {error && <span className="block text-body-3 text-[var(--sa-text-status-error-bolder)]">{error}</span>}
      {/* A remark is asked for where it explains something: an amount off the norm. A link on all
          twenty-four rows doubled every row's height and read as twenty-four things to do. */}
      {editable ? (
        (differs || l.remark) && (
          <Input
            aria-label={`Reason for the change, ${l.label}`}
            placeholder="Reason for the change from the norm"
            size="sm"
            value={l.remark ?? ""}
            onChange={(e) => onLine(l.id, { remark: e.target.value || undefined })}
          />
        )
      ) : (
        l.remark && <span className="block text-body-3 text-ink">Remark: {l.remark}</span>
      )}
    </div>
  );
}

/* ── Statement of Account ────────────────────────────────────────────────── */

export function StatementOfAccountCard({ app, editable }: { app: GrantApplication; editable: boolean }) {
  const { saveBudgetStatement } = useEAnudaan();
  const { toast } = useToast();
  const saved = app.budgetStatement;
  const [allocation, setAllocation] = React.useState(saved ? String(saved.allocation) : "");
  const [expenditure, setExpenditure] = React.useState(saved ? String(saved.expenditure) : "");
  // An ongoing project's instalment is settled against the utilisation certificate for the last one.
  const ongoing = app.caseType === "Ongoing";
  const [payable, setPayable] = React.useState(saved?.settlement ? String(saved.settlement.payable) : "");
  const [unspentUc, setUnspentUc] = React.useState(saved?.settlement ? String(saved.settlement.unspentUc) : "");
  const [tried, setTried] = React.useState(false);

  if (!hasGrantTab(app)) return null;
  if (!editable && !saved) return null;

  const release = releaseOf(app);
  const problems = { ...statementProblems({ allocation, expenditure }, release, rupees), ...(ongoing ? settlementProblems({ payable, unspentUc }) : {}) };
  const ready = !problems.allocation && !problems.expenditure;
  const balance = ready ? balanceAfter({ allocation: Number(allocation), expenditure: Number(expenditure) }, release) : null;
  // The release moved after the statement was saved — the cost sheet was saved again since.
  const stale = !!saved && saved.release !== release;
  const settlementReady = ongoing && !problems.payable && !problems.unspentUc;
  const changed =
    !saved ||
    stale ||
    String(saved.allocation) !== allocation ||
    String(saved.expenditure) !== expenditure ||
    (ongoing && (String(saved.settlement?.payable ?? "") !== payable || String(saved.settlement?.unspentUc ?? "") !== unspentUc));

  const save = () => {
    setTried(true);
    if (Object.keys(problems).length) return;
    const res = saveBudgetStatement(app.id, {
      allocation: Number(allocation),
      expenditure: Number(expenditure),
      release,
      ...(ongoing ? { settlement: { payable: Number(payable), unspentUc: Number(unspentUc) } } : {}),
    });
    if (res.ok) {
      setTried(false);
      toast("Statement of Account saved.", "success");
    }
  };

  const state = !saved ? (
    <Badge status="warning" size="sm">Not Saved</Badge>
  ) : stale ? (
    <Badge status="warning" size="sm">Out of Date</Badge>
  ) : changed && editable ? (
    <Badge status="warning" size="sm">Unsaved Changes</Badge>
  ) : (
    <Badge status="success" size="sm">Saved</Badge>
  );

  const money = (value: string, set: (v: string) => void, id: string, label: string, error?: string, hint?: string) => (
    <FormField label={label} id={id} required error={tried ? error : undefined} hint={hint}>
      {(c) => (
        <Input
          {...c}
          inputMode="numeric"
          prefix="₹"
          prefixLabel="rupees"
          className="tabular-nums"
          readOnly={!editable}
          value={grouped(value)}
          onChange={(e) => set(digits(e.target.value))}
        />
      )}
    </FormField>
  );

  return (
    <Card variant="outlined" id="statement-of-account">
      <CardBody className="space-y-5">
        <SectionTitle
          title="Statement of Account"
          description={
            saved && !changed
              ? `The scheme's budget position for this release · ${savedLine(saved.savedAt, saved.savedBy)}.`
              : ongoing
                ? "The scheme's budget position for this release, and the utilisation of the last instalment. Saved separately from the cost sheet."
                : "The scheme's budget position for this release. Saved separately from the cost sheet."
          }
        >
          {state}
        </SectionTitle>
        {stale && (
          <Alert status="warning" title="The Release Has Changed">
            The cost sheet was saved again after this statement, so the release is now {rupees(release)}, not {rupees(saved!.release)}. Save the statement again.
          </Alert>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {money(allocation, setAllocation, "soa-allocation", "Budgetary Allocation", problems.allocation, "For the scheme, this financial year.")}
          {money(expenditure, setExpenditure, "soa-expenditure", "Expenditure to Date", problems.expenditure)}
        </div>
        <DescriptionList
          columns={2}
          size="sm"
          items={[
            {
              term: "This Release",
              value: <span className="tabular-nums">{rupees(release)}</span>,
              hint: app.costSheet ? "The recommended grant on the saved cost sheet" : "The NGO's claim, until the cost sheet is saved",
            },
            {
              term: "Balance After This Release",
              value:
                balance == null ? (
                  <span className="text-ink-muted">Enter both figures</span>
                ) : (
                  <span className={`tabular-nums ${balance < 0 ? "text-[var(--sa-text-status-error-bolder)]" : ""}`}>{rupees(balance)}</span>
                ),
              hint: "Allocation, less expenditure to date, less this release",
            },
          ]}
        />
        {ongoing && (
          <div className="space-y-4">
            <h3 className="text-body-2 font-semibold text-ink">Settlement — Utilisation Certificate Check</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {money(payable, setPayable, "soa-payable", "Amount Payable This Instalment", problems.payable, "After deducting the project's own share.")}
              {money(unspentUc, setUnspentUc, "soa-unspent", "Less: Unspent as per Utilisation Certificate", problems.unspentUc)}
            </div>
            <DescriptionList
              size="sm"
              items={[
                {
                  term: "Net Amount Payable",
                  value: settlementReady ? (
                    <span className="tabular-nums">{rupees(netPayable({ payable: Number(payable), unspentUc: Number(unspentUc) }))}</span>
                  ) : (
                    <span className="text-ink-muted">Enter both figures</span>
                  ),
                },
              ]}
            />
          </div>
        )}
        {problems.balance && (
          <p className="text-body-3 text-[var(--sa-text-status-error-bolder)]" role="alert">
            {problems.balance}
          </p>
        )}
        {editable && (
          <div className="flex justify-end">
            <Button onClick={save} disabled={!changed}>
              <Icon name="save" size={16} aria-hidden /> Save Statement
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/** What the Grant tab still needs from the ASO, for the decision panel's checklist. */
export function grantBlockers(app: GrantApplication): ("costSheet" | "statement")[] {
  if (!hasGrantTab(app)) return [];
  const out: ("costSheet" | "statement")[] = [];
  if (!app.costSheet) out.push("costSheet");
  const stmt = app.budgetStatement;
  if (!stmt || stmt.release !== releaseOf(app) || (app.caseType === "Ongoing" && !stmt.settlement)) out.push("statement");
  return out;
}

