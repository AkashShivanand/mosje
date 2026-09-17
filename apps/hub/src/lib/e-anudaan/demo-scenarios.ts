/**
 * One-click states for the e-Anudaan grant wizard, driven from the demo dock.
 *
 * The precedent is the dock's Sign in tab: a reviewer should not have to type forty fields
 * and upload twelve documents to see what a rejected application looks like. Each scenario
 * below puts the wizard into one state a real applicant can be in, so the flow can be shown
 * rather than described.
 *
 * WHY IT IS A SCENARIO LIST AND NOT A "FILL FORM" BUTTON. The states worth demonstrating are
 * not degrees of completeness — they are different outcomes. A form filled with valid answers
 * and one filled with answers that fail validation are equally "filled"; the second is the one
 * that shows the error summary. Naming each state makes the demo reproducible: a reviewer can
 * ask for "documents rejected" and get the same screen twice.
 */

import {
  applyAllAutoFields,
  costedStrength,
  fieldVisible,
  isReadOnly,
  stepFields,
  visibleDocuments,
  visibleSteps,
  type FieldDef,
  type WizardDef,
} from "./form-schema.ts";
import { stepRoute } from "./drafts.ts";
import { districtsOf } from "./geography.ts";
import { currentFinancialYear } from "./instalments.ts";
import { darpanSeed } from "./prefill.ts";
import { demoVerdictFor, type UploadedDoc, type VerdictState } from "./doc-verification.ts";
import { DEMO_APPLICANT, demoAnswer, preferredOption } from "./demo-answers.ts";

/** The event the wizard listens for. Dispatched on `window` by the demo dock panel. */
export const DEMO_FILL_EVENT = "e-anudaan:demo-fill";

export interface DemoFillDetail {
  scheme: string;
  values: Record<string, string>;
  docs: Record<number, UploadedDoc>;
  /**
   * Hold every check in "Being checked" until a state is set under Document States (audit D-06). The
   * prototype's checker answers in under two seconds, so "Documents verifying" settled before the
   * page painted and the state it names was never seen.
   */
  holdChecks?: boolean;
  /**
   * Show the errors of this step (an index into the branch's visible steps) as the form opens, as
   * if Next had been pressed there. A rule preset lands on the step its bad answer is on.
   */
  errorsAt?: number;
}

/** Set in sessionStorage, to the scheme code, while the demo holds the upload step's checks. */
export const DEMO_HOLD_CHECKS_KEY = "e-anudaan.demo.hold-checks";

export interface DemoScenario {
  id: string;
  label: string;
  /** One line saying what the reviewer will see. Rendered under the button. */
  effect: string;
  /** Which phase of the wizard this scenario is worth looking at. */
  lands: "form" | "documents" | "review";
}

export const DEMO_SCENARIOS: readonly DemoScenario[] = [
  { id: "blank", label: "Empty form", lands: "form",
    effect: "Clears every answer and every upload, back to a first visit." },
  { id: "validation-errors", label: "Validation errors", lands: "form",
    effect: "Fills the form but leaves mandatory answers out and puts a malformed email and mobile in — press Next to raise the error summary." },
  { id: "complete", label: "Complete & valid", lands: "documents",
    effect: "Every answer present and every mandatory document verified. The step clears." },
  { id: "docs-missing", label: "Documents part-uploaded", lands: "documents",
    effect: "Answers complete, roughly half the checklist filled. Next is held with the count outstanding." },
  { id: "docs-verifying", label: "Documents verifying", lands: "documents",
    effect: "Every document uploaded and held in checking. Next is held until a state is set under Document States." },
  { id: "docs-review", label: "Documents need review", lands: "documents",
    effect: "Uploads accepted below the confidence threshold. An officer confirms them by hand — the applicant is not blocked." },
  { id: "docs-rejected", label: "Documents rejected", lands: "documents",
    effect: "The checker refuses the uploads and names each reason. Next is blocked until they are replaced." },
  { id: "check-unavailable", label: "Checker offline", lands: "documents",
    effect: "The automatic check is down, so uploads are accepted and routed to a reviewer. The applicant is never trapped by an outage." },
  { id: "ready-to-submit", label: "Ready to submit", lands: "review",
    effect: "Everything complete and verified, on the review page with the declaration still to tick." },
];

/**
 * A plausible answer for every field the branch shows.
 *
 * Filled in TWO passes because the form cascades: District's options come from the State
 * field (`districtsOf`), and several fields are read-only derivations (`auto`). Answering in
 * declaration order would pick a district before a state existed, so states are answered
 * first and the dependent fields after.
 */
function fullValues(def: WizardDef, seed: Record<string, string> = {}): Record<string, string> {
  // What the portal supplies comes first — NGO-Darpan's identity and the year now running — so the
  // payload is complete on its own and the wizard only has to lay the signed-in NGO's record over it.
  const out: Record<string, string> = { ...darpanSeed(undefined), fld_financial_year: currentFinancialYear(), ...seed };
  const all: FieldDef[] = [];
  for (const step of def.steps) for (const section of step.sections) all.push(...section.fields);

  // A locked answer the portal has supplied is the portal's, never the demo's: DARPAN's name, ID,
  // State and District, a new application's financial year. The demo used to write "Illustrative
  // name of NGO / VO" over what NGO-Darpan had supplied. Options drawn from the applicant's own
  // records (a renewal's project) are not invented either.
  const answerable = (f: FieldDef) => !f.auto && !f.optionsFrom && !(isReadOnly(f, out) && (out[f.name] ?? "").trim() !== "");
  const independent = all.filter((f) => !f.districtsOf);
  const dependent = all.filter((f) => f.districtsOf);
  for (const f of independent) if (answerable(f)) out[f.name] ??= answerFor(f);
  for (const f of dependent) if (answerable(f)) out[f.name] ??= answerFor(f, out);
  // A beneficiary count that agrees with the project type it is costed for (audit W-01): "Complete &
  // valid" put 12 residents in a home the cost-norms panel costs for 25.
  for (const f of all) if (f.advisory === "costedStrength" && seed[f.name] == null) {
    const strength = costedStrength(out);
    if (strength) out[f.name] = String(strength);
  }

  return applyAllAutoFields(def, out);
}

/**
 * One field's answer. Illustrative throughout — no real organisation, account or beneficiary.
 *
 * `rule` matters as much as `kind`: a field carrying `ifsc` or `pan` is validated against a
 * format, so a generic string would put the demo into the error state the "complete" scenario
 * exists to avoid. Each rule gets a value shaped like the real thing that identifies nothing.
 */
function answerFor(f: FieldDef, values?: Record<string, string>): string {
  if (f.districtsOf) {
    const state = values?.[f.districtsOf];
    const districts = state ? districtsOf(state) : [];
    return districts.includes(DEMO_APPLICANT.district) ? DEMO_APPLICANT.district : (districts[0] ?? DEMO_APPLICANT.district);
  }
  // The demo applicant's choice where the list offers it — a Pune society's project in Maharashtra,
  // not in whichever state sorts first.
  if (f.options?.length) return preferredOption(f.options);
  const told = demoAnswer(f);
  if (told !== undefined) return told;

  switch (f.rule) {
    case "ifsc": return DEMO_APPLICANT.ifsc;
    case "pan": return DEMO_APPLICANT.pan;
    case "pin": return DEMO_APPLICANT.pin;
    case "nameAndPhone": return "Anil Kulkarni, 9800000103";
    case "accountNumber": return DEMO_APPLICANT.account;
    case "notFuture": return "2016-04-01";
    // A date that must follow another one: every demo date was 1 Apr 2026, so "Complete & valid"
    // stopped on Organisation Details with "Must be later than the date of registration."
    case "afterRegistration":
    case "afterPeriodFrom": return "2031-03-31";
    default: break;
  }
  switch (f.kind) {
    case "date": return "2026-04-01";
    case "time": return "10:30";
    // A figure in rupees is filled as money, not as the generic 12: "Complete & valid" asked for a
    // ₹12 non-recurring grant beside cost norms of ₹20 lakh, and the review step read it back (W-01).
    case "number": return /₹|grant|cost|amount|expenditure|turnover|salary|honorarium|rent/i.test(f.label) ? "250000" : "10";
    case "checkbox": return "true";
    default:
      // Every free-text field the demo applicant answers is named in demo-answers.ts; one that is
      // not is a new field, and the test beside this file fails until it is given an answer.
      return "";
  }
}


/** Uploads for the checklist, every one carrying the given verdict. */
function docsWith(def: WizardDef, values: Record<string, string>, state: VerdictState,
                  take?: number): Record<number, UploadedDoc> {
  const list = visibleDocuments(def, values);
  const chosen = take == null ? list : list.slice(0, take);
  const out: Record<number, UploadedDoc> = {};
  for (const d of chosen) {
    out[d.n] = {
      fileName: `${d.title.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 40)}.pdf`,
      sizeKb: 68 + (d.n % 7) * 3,
      uploadedOn: "07 Sep 2026",
      verdict: demoVerdictFor(state, d.title, values.fld_financial_year),
    };
  }
  return out;
}

/**
 * The wizard's route for a scenario's landing phase.
 *
 * The clone routes each phase to its own URL — `step-1` for the form, `step-2` for uploads,
 * `review` for the read-back — so navigating is a push, not a step index. The caller does it
 * rather than the wizard: the wizard's own `goto` is declared below its `!def` early return
 * and an effect cannot reach it without a stale binding.
 */
export function routeForScenario(id: string, schemeCode: string): string {
  const base = `/portals/e-anudaan/apply-grant/scheme/${schemeCode}`;
  const lands = DEMO_SCENARIOS.find((s) => s.id === id)?.lands ?? "form";
  return lands === "documents" ? `${base}/step-2` : lands === "review" ? `${base}/review` : `${base}/step-1`;
}

/** Build the payload for one scenario. */
export function buildScenario(id: string, def: WizardDef): DemoFillDetail {
  const full = fullValues(def);

  switch (id) {
    case "blank":
      return { scheme: def.code, values: {}, docs: {} };

    case "validation-errors": {
      // Everything answered EXCEPT the mandatory fields of the first step, plus two answers
      // that are well-formed strings and invalid values — the case a required-only check misses.
      const v = { ...full };
      // The first step THIS branch shows — AVYAY gives a new project eight steps and a
      // renewal seven, so the first step is not always `def.steps[0]`.
      const first = visibleSteps(def, full)[0];
      for (const section of first?.sections ?? []) {
        for (const f of section.fields) if (f.required) delete v[f.name];
      }
      v.fld_contact_email = "sankalpseva.example.org";   // no @
      v.fld_contact_mobile = "98000";                    // too short
      return { scheme: def.code, values: v, docs: {} };
    }

    case "docs-missing": {
      const list = visibleDocuments(def, full);
      return { scheme: def.code, values: full,
               docs: docsWith(def, full, "verified", Math.ceil(list.length / 2)) };
    }
    case "docs-verifying":
      return { scheme: def.code, values: full, docs: docsWith(def, full, "pending"), holdChecks: true };
    case "docs-review":
      return { scheme: def.code, values: full, docs: docsWith(def, full, "review") };
    case "docs-rejected":
      return { scheme: def.code, values: full, docs: docsWith(def, full, "invalid") };
    case "check-unavailable":
      return { scheme: def.code, values: full, docs: docsWith(def, full, "unavailable") };

    case "complete":
    case "ready-to-submit":
    default:
      return { scheme: def.code, values: full, docs: docsWith(def, full, "verified") };
  }
}

/* ── One preset per validation rule ─────────────────────────────────────────────────────────── */

/**
 * The data that trips exactly ONE of the form's rules, everything else answered correctly.
 *
 * "Validation errors" above shows the error summary; these show each message, so a reviewer can ask
 * for "the IFSC error" and see the words the applicant sees. Each is derived from the scheme's own
 * fields: a preset appears only where the open scheme has a field the rule guards, and it lands on
 * the step that field is on, with that step's errors showing.
 */
export interface RulePreset {
  id: string;
  label: string;
  /** The field it breaks, and how. */
  finds: (f: FieldDef, values: Record<string, string>) => boolean;
  bad: (f: FieldDef, values: Record<string, string>) => string | undefined;
}

const text = (f: FieldDef) => f.kind === "text" || f.kind === "textarea";

export const RULE_PRESETS: readonly RulePreset[] = [
  { id: "rule-required", label: "Mandatory Answer Left Out",
    finds: (f) => Boolean(f.required) && text(f), bad: () => undefined },
  { id: "rule-email", label: "Email Without @",
    finds: (f) => f.kind === "email", bad: () => "office.sankalpseva.example.org" },
  { id: "rule-mobile", label: "Mobile Number Too Short",
    finds: (f) => f.kind === "tel" && /mobile/i.test(`${f.name} ${f.label}`), bad: () => "98000" },
  { id: "rule-telephone", label: "Telephone With Letters",
    finds: (f) => f.kind === "tel" && !/mobile/i.test(`${f.name} ${f.label}`), bad: () => "020-HADAPSAR" },
  { id: "rule-number", label: "Figure in Words",
    finds: (f) => f.kind === "number" && !f.notMoreThan, bad: () => "twenty five" },
  { id: "rule-not-more-than", label: "Part Larger Than the Whole",
    finds: (f) => Boolean(f.notMoreThan),
    bad: (f, v) => String(Number(v[f.notMoreThan!] || 0) + 5) },
  { id: "rule-letters-only", label: "Name With Digits",
    finds: (f) => f.rule === "lettersOnly", bad: () => "Anil Kulkarni 2" },
  { id: "rule-pin", label: "PIN Code of Five Digits",
    finds: (f) => f.rule === "pin", bad: () => "41102" },
  { id: "rule-ifsc", label: "IFSC Code Malformed",
    finds: (f) => f.rule === "ifsc", bad: () => "SBIN000001" },
  { id: "rule-account-number", label: "Account Number With Letters",
    finds: (f) => f.rule === "accountNumber", bad: () => "1234-5678-ABC" },
  { id: "rule-pan", label: "PAN of the Wrong Holder Type",
    finds: (f) => f.rule === "pan", bad: () => "ABCXE1234F" },
  { id: "rule-not-future", label: "Date Later Than Today",
    finds: (f) => f.rule === "notFuture", bad: () => "2031-01-01" },
  { id: "rule-after-registration", label: "Expiry Before Registration",
    finds: (f) => f.rule === "afterRegistration", bad: (_f, v) => shiftYear(v.fld_registration_date, -1) ?? "2010-01-01" },
  { id: "rule-after-period-from", label: "Period Ending Before It Starts",
    finds: (f) => f.rule === "afterPeriodFrom", bad: (_f, v) => shiftYear(v.fld_track_period_from, -1) ?? "2010-01-01" },
  { id: "rule-must-be-yes", label: "Account Not in the Organisation's Name",
    finds: (f) => f.rule === "mustBeYes", bad: () => "No" },
];

function shiftYear(iso: string | undefined, by: number): string | undefined {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  return `${Number(iso.slice(0, 4)) + by}${iso.slice(4)}`;
}

interface RuleTarget { stepIndex: number; field: FieldDef }

/** Where a preset's rule bites in this scheme: the first visible, typeable field it guards. */
function ruleTarget(preset: RulePreset, def: WizardDef, values: Record<string, string>): RuleTarget | undefined {
  const steps = visibleSteps(def, values);
  // A figure that feeds a total breaks the total too, and the preset would show two errors.
  const feeds = new Set(def.steps.flatMap((s) => stepFields(s)).flatMap((f) => (f.auto?.kind === "sum" ? f.auto.from : [])));
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!;
    if (step.kind === "documents" || step.kind === "review") continue;
    for (const f of stepFields(step)) {
      if (f.auto || !fieldVisible(f, values) || isReadOnly(f, values) || feeds.has(f.name)) continue;
      if (preset.finds(f, values)) return { stepIndex: i, field: f };
    }
  }
  return undefined;
}

/** The presets the open scheme can show, each with the label of the field it breaks. */
export function rulePresetsFor(def: WizardDef): { preset: RulePreset; fieldLabel: string }[] {
  const full = fullValues(def);
  return RULE_PRESETS.flatMap((preset) => {
    const target = ruleTarget(preset, def, full);
    return target ? [{ preset, fieldLabel: target.field.label.replace(/\s*\*$/, "") }] : [];
  });
}

/** A rule preset's payload and the address of the step it lands on. */
export function buildRulePreset(id: string, def: WizardDef): { detail: DemoFillDetail; route: string } | undefined {
  const preset = RULE_PRESETS.find((p) => p.id === id);
  if (!preset) return undefined;
  const values = fullValues(def);
  const target = ruleTarget(preset, def, values);
  if (!target) return undefined;
  const bad = preset.bad(target.field, values);
  if (bad === undefined) delete values[target.field.name];
  else values[target.field.name] = bad;
  const filled = applyAllAutoFields(def, values);
  return {
    detail: { scheme: def.code, values: filled, docs: {}, errorsAt: target.stepIndex },
    route: stepRoute(def.code, filled, target.stepIndex),
  };
}
