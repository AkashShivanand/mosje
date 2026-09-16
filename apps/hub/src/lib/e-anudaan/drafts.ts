/**
 * Saved application drafts: where they live, what they hold, and where "Continue" takes the
 * applicant.
 *
 * A draft saved only the answers, so Resume Draft returned to step 1 whichever step the applicant
 * had left, and no screen listed the draft — the only way back was to start the same scheme again
 * and hope (serious audit UX-04, 14 Sep 2026). The step is saved with the answers now, and My
 * Applications lists every draft with a Continue to that step.
 */

import { DEMO_VERDICTS, type UploadedDoc } from "./doc-verification.ts";
import { validateStep, visibleDocuments, visibleSteps, wizardFor, type WizardDef } from "./form-schema.ts";
import { formatDate } from "./format.ts";
import type { GrantApplication } from "./types.ts";

export const DRAFT_PREFIX = "e-anudaan.draft.";

/** One key per NGO and scheme: an applicant holds at most one draft of each scheme's form. */
export const draftKey = (ngoId: string | undefined, code: string) => `${DRAFT_PREFIX}${ngoId ?? "anon"}.${code}`;

/**
 * Set in sessionStorage while an application is being filled in this tab. The form spans three
 * routes, each a new mount; with this set the next mount carries the draft on instead of offering
 * it back as "You have a saved draft". Continue on My Applications sets it too — the applicant has
 * already chosen to resume.
 */
export const activeKey = (code: string) => `e-anudaan.wizard.active.${code}`;

export interface SavedDraft {
  values?: Record<string, string>;
  docs?: Record<number, UploadedDoc>;
  savedAt?: string;
  /** Index into the branch's visible steps of the step the applicant was on. */
  step?: number;
  /**
   * The register's Draft application this form continues, when it was opened from a Draft row on
   * My Applications. Submitting files it in that record's place, so the Draft row does not stay
   * behind beside the application it became.
   */
  registerId?: string;
}

export function parseDraft(raw: string | null): SavedDraft | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as SavedDraft;
    return d && typeof d === "object" ? d : null;
  } catch {
    return null;
  }
}

/** A draft is one with answers in it; an empty object left by an untouched form is not. */
export const hasAnswers = (d: SavedDraft | null): d is SavedDraft => !!d?.values && Object.keys(d.values).length > 0;

/**
 * Must moving between steps write the draft? Not while the answers are exactly what the form
 * opened with (the DARPAN prefill) and no draft is stored: pressing Submit on an untouched review
 * page, which opens the first incomplete step, saved the prefill as a draft and listed it under
 * Saved Drafts. A stored draft is always rewritten, so it carries the step moved to.
 *
 * `snapshot` and `opened` are the wizard's `JSON.stringify({ values, docs })` now and on opening.
 */
export function needsDraftWrite(snapshot: string, opened: string | null, stored: string | null): boolean {
  return hasAnswers(parseDraft(stored)) || opened === null || snapshot !== opened;
}

/** The step a draft resumes on, clamped to the steps its own answers make visible. */
export function draftStep(code: string, draft: SavedDraft): { index: number; title: string; total: number } | null {
  const wizard = wizardFor(code);
  if (!wizard) return null;
  const steps = visibleSteps(wizard, draft.values ?? {});
  const index = Math.min(Math.max(Number.isInteger(draft.step) ? (draft.step as number) : 0, 0), steps.length - 1);
  return { index, title: steps[index]?.title ?? "", total: steps.length };
}

/** The route that shows step `index` of a scheme's form for these answers. */
export function stepRoute(code: string, values: Record<string, string>, index: number): string {
  const base = `/portals/e-anudaan/apply-grant/scheme/${code}`;
  const wizard = wizardFor(code);
  const kind = wizard ? visibleSteps(wizard, values)[index]?.kind : undefined;
  if (kind === "documents") return `${base}/step-2`;
  if (kind === "review") return `${base}/review`;
  return index > 0 ? `${base}/step-1?step=${index}` : `${base}/step-1`;
}

/**
 * Where a Draft in the register is continued from a link: the form, told which draft to open. A
 * link cannot write the draft into the form's storage itself, so the wizard reads `?draft=` and
 * opens it (`draftFromRegister`), as My Applications' Continue does (audit N-02).
 */
export function draftResumeRoute(app: Pick<GrantApplication, "id" | "schemeCode">): string {
  const code = wizardFor(app.schemeCode)?.code ?? app.schemeCode;
  return `/portals/e-anudaan/apply-grant/scheme/${code}/step-1?draft=${encodeURIComponent(app.id)}`;
}

/**
 * The step a claim opened from its link starts on (audit W-04). "Claim 2nd Instalment" already
 * names the project, so Application Type is answered: the form opens on the step after it, with
 * Application Type shown as done. Anything short of a complete first step opens on step 1, where
 * the gap is shown — never a later step with an unanswered question behind it.
 */
export function claimStartStep(wizard: WizardDef, values: Record<string, string>): number {
  if (!values.claim_stage) return 0;
  const steps = visibleSteps(wizard, values);
  const first = steps[0];
  if (!first || steps.length < 2 || Object.keys(validateStep(first, values)).length > 0) return 0;
  return 1;
}

export interface DraftListing {
  key: string;
  code: string;
  savedAt?: string;
  step: { index: number; title: string; total: number };
  route: string;
}

/** Every draft this NGO holds, newest first. */
export function listDrafts(entries: Iterable<[string, string | null]>, ngoId: string | undefined): DraftListing[] {
  const prefix = `${DRAFT_PREFIX}${ngoId ?? "anon"}.`;
  const out: DraftListing[] = [];
  for (const [key, raw] of entries) {
    if (!key.startsWith(prefix)) continue;
    const code = key.slice(prefix.length);
    const draft = parseDraft(raw);
    if (!hasAnswers(draft)) continue;
    const step = draftStep(code, draft);
    if (!step) continue;
    out.push({ key, code, savedAt: draft.savedAt, step, route: stepRoute(code, draft.values ?? {}, step.index) });
  }
  return out.sort((a, b) => (b.savedAt ?? "").localeCompare(a.savedAt ?? ""));
}

/**
 * A Draft application in the register, opened as a form (audit C4 · S15, 14 Sep 2026).
 *
 * My Applications gave a Draft row a Submit button that filed it in one click, without the checks
 * the form runs. A Draft row now continues the draft in the form: its answers, and any uploaded
 * document the scheme's checklist asks for by the same title, open on the Review step, where
 * Submit runs `checkApplication` and takes the applicant to the first step that is not complete.
 */
export function draftFromRegister(app: GrantApplication): { key: string; draft: SavedDraft; route: string } | null {
  const wizard = wizardFor(app.schemeCode);
  if (!wizard || app.status !== "Draft") return null;
  const values = { ...(app.formValues ?? {}) };
  const docs: Record<number, UploadedDoc> = {};
  for (const def of visibleDocuments(wizard, values)) {
    const held = app.documents.find((d) => d.fileName && d.title === def.title);
    if (!held?.fileName) continue;
    docs[def.n] = {
      fileName: held.fileName,
      sizeKb: held.sizeKb ?? 0,
      uploadedOn: held.uploadedAt ? formatDate(held.uploadedAt) : "",
      // Checked again as the upload step checks any file, rather than a verdict carried forward.
      verdict: held.aiVerdict ?? DEMO_VERDICTS.pending,
    };
  }
  const steps = visibleSteps(wizard, values);
  const review = Math.max(steps.findIndex((s) => s.kind === "review"), 0);
  return {
    key: draftKey(app.ngoId, wizard.code),
    draft: { values, docs, savedAt: app.updatedAt, step: review, registerId: app.id },
    route: stepRoute(wizard.code, values, review),
  };
}
