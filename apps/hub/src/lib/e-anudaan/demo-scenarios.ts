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
  visibleDocuments,
  visibleSteps,
  type FieldDef,
  type WizardDef,
} from "./form-schema";
import { districtsOf } from "./geography";
import { demoVerdictFor, type UploadedDoc, type VerdictState } from "./doc-verification";

/** The event the wizard listens for. Dispatched on `window` by the demo dock panel. */
export const DEMO_FILL_EVENT = "e-anudaan:demo-fill";

export interface DemoFillDetail {
  scheme: string;
  values: Record<string, string>;
  docs: Record<number, UploadedDoc>;
}

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
    effect: "Every document uploaded and still being checked. Next is held until the check finishes." },
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
  const out: Record<string, string> = { ...seed };
  const all: FieldDef[] = [];
  for (const step of def.steps) for (const section of step.sections) all.push(...section.fields);

  const independent = all.filter((f) => !f.auto && !f.districtsOf);
  const dependent = all.filter((f) => !f.auto && f.districtsOf);
  for (const f of independent) out[f.name] ??= answerFor(f);
  for (const f of dependent) out[f.name] ??= answerFor(f, out);

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
    return (state ? districtsOf(state)[0] : undefined) ?? "Pune";
  }
  // `noUncheckedIndexedAccess` is on, so an indexed read is `string | undefined` even after a
  // length test. The fallback is never reached; writing it is cheaper than asserting.
  if (f.options?.length) return f.options[0] ?? "";

  switch (f.rule) {
    case "ifsc": return "SBIN0000001";
    case "pan": return "AAAAA0000A";
    case "pin": return "411001";
    case "nameAndPhone": return "Illustrative Name, 9800000000";
    case "lettersOnly": return "Illustrative Name";
    default: break;
  }
  switch (f.kind) {
    case "email": return "contact@sankalpseva.example.org";
    case "tel": return "9800000000";
    case "date": return "2026-04-01";
    case "time": return "10:30";
    case "number": return "12";
    case "checkbox": return "true";
    case "textarea": {
      const text = `Illustrative response for "${stripStar(f.label)}", entered by the SAMAVESH prototype demo tools.`;
      return f.maxLength ? text.slice(0, f.maxLength) : text;
    }
    default: {
      const text = `Illustrative ${stripStar(f.label).toLowerCase()}`;
      return f.maxLength ? text.slice(0, f.maxLength) : text;
    }
  }
}

const stripStar = (label: string) => label.replace(/\s*\*$/, "").trim();

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
      verdict: demoVerdictFor(state, d.title),
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
      return { scheme: def.code, values: full, docs: docsWith(def, full, "pending") };
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
