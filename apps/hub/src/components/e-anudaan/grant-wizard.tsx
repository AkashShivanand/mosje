"use client";

/**
 * The E-Anudaan grant application wizard.
 *
 * DS Audit (form-wizard visual language, docs/design-system/form-wizard-visual-language.md):
 * Wizard ✅ (now draws the step panel) · Stepper ✅ · FormSection ✅ (flush sub-section) · FormCard ✅ ·
 * DocumentChecklist / DocumentRow ➕ added to the DS (the Document Centre) · FormPanel ➕ added (inside Wizard) · FormField ✅ ·
 * Input ✅ · Select ✅ · Textarea ✅ · DatePicker ✅ · RadioGroup ✅ · Checkbox ✅ · Alert ✅ · Badge ✅ ·
 * Button ✅ · ReviewSection ✅ · ReviewItem ✅ · DeclarationCheckbox ✅ · Icon ✅ · PageHeader ✅ (compact).
 *
 * One component, four shapes: the step list, the fields, the document checklist and the
 * read-back all come from the per-scheme schema in lib/e-anudaan/form-schema.ts, because the
 * live portal runs a genuinely different form per scheme — SHRESHTA Mode 2 6, AVYAY 8 for a new
 * project and 7 for a renewal, SMILE 6, NAPDDR 10 — so the step list is read from the schema and
 * filtered by branch, never assumed.
 */

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  DatePicker,
  DeclarationCheckbox,
  DescriptionList,
  FieldHint,
  FieldMessage,
  FormCard,
  FormField,
  FormSection,
  Icon,
  Input,
  Link,
  Modal,
  PageHeader,
  RadioGroup,
  ReviewItem,
  ReviewSection,
  Select,
  Textarea,
  Wizard,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { districtsOf } from "@/lib/e-anudaan/geography";
import { formatDate, formatTime, rupees } from "@/lib/e-anudaan/format";
import { schemeLabel } from "@/lib/e-anudaan/selectors";
import { claimIntro, instalmentLabel, wizardIntro } from "@/lib/e-anudaan/glossary";
import { darpanSeed as seedFromDarpan, declarationStamp, registrationOf } from "@/lib/e-anudaan/prefill";
import { checkApplication, documentsOf, type ApplicationCheck } from "@/lib/e-anudaan/submission";
import { answerField, darpanIdentity } from "@/lib/e-anudaan/submit-application";
import { DERIVED_CLAIM_SCHEMES, draftOfClaim, instalmentPlan, renewableProjects, renewalOption } from "@/lib/e-anudaan/instalments";
import type { EAnudaanState, GrantApplication } from "@/lib/e-anudaan/types";
import { activeKey, claimStartStep, draftFromRegister, draftKey, draftStep, hasAnswers, needsDraftWrite, parseDraft, stepRoute, type SavedDraft } from "@/lib/e-anudaan/drafts";
import {
  DECLARATION_TEXT,
  RENEWAL_PICKER,
  SMILE_CASE_EXISTING,
  applyAllAutoFields,
  errorSummary,
  fieldLabel,
  shownHelp,
  fieldVisible,
  isSummarySection,
  validateStep,
  visibleSections,
  visibleDocuments,
  visibleSteps,
  visibleOptions,
  isReadOnly,
  strengthAdvice,
  wizardFor,
  type FieldDef,
  type SectionDef,
  type StepDef,
  type WizardDef,
} from "@/lib/e-anudaan/form-schema";
import { withYearCheck, type UploadedDoc } from "@/lib/e-anudaan/doc-verification";
import { DEMO_FILL_EVENT, DEMO_HOLD_CHECKS_KEY, type DemoFillDetail } from "@/lib/e-anudaan/demo-scenarios";
import { CostNormsPanel } from "./cost-norms-panel";
import { ChooseSchemeFirst } from "./choose-scheme-first";
import { DocumentsChecklist, type DocumentsChecklistHandle } from "./documents-checklist";
import { ReviewDocuments } from "./document-centre-parts";
import { ServiceErrorNotice, useFailureOnLoad, useServiceErrors } from "./service-error";


/**
 * Which route the wizard is mounted on. The live portal keeps the early steps on `step-1`,
 * moves to `step-2` for the upload step and to `review` for the read-back, so the clone routes
 * the same way and carries the draft across in storage.
 */
export type WizardPhase = "form" | "documents" | "review";

/** How long the answers sit still before they are saved — a pause, not every keystroke. */
const AUTOSAVE_DELAY_MS = 600;

type SaveStatus = { kind: "idle" } | { kind: "saving" } | { kind: "saved"; at: Date } | { kind: "error" };

/**
 * Set when the applicant is sent back to a step on another route because it is incomplete. The
 * new mount reads it and shows that step's errors straight away, instead of an untouched step
 * the applicant has to press Save and Continue on to learn what is wrong.
 */
const CHECK_KEY = "e-anudaan.wizard.check";

/** What another tab did to this application's draft while this one was open. */
type DraftConflict = null | "changed" | "removed";

export function GrantWizard({ schemeCode, phase = "form" }: { schemeCode: string; phase?: WizardPhase }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, submitApplication } = useEAnudaan();
  const { toast } = useToast();
  /** The simulated request layer: a save or a submit can fail, with a catalogued error (error-catalogue.ts). */
  const requests = useServiceErrors();
  /** The organisation's details are read from NGO-DARPAN when the form opens. */
  const [darpanFailure, clearDarpanFailure] = useFailureOnLoad("darpan");

  const def = wizardFor(schemeCode);
  const ngo = state.ngos[0];
  const stepperBox = React.useRef<HTMLDivElement>(null);
  const key = draftKey(ngo?.id, def?.code ?? schemeCode.toUpperCase());

  /**
   * Initial answers: what the live portal prefills from DARPAN, with any saved draft laid over
   * the top so a step-1 → step-2 → review hop keeps the answers. Computed once in a lazy state
   * initialiser rather than an effect — there is no external system to synchronise with, and a
   * setState in an effect would cascade an extra render on every mount.
   */
  const readDraft = (): SavedDraft => {
    if (typeof window === "undefined") return {};
    return parseDraft(window.localStorage.getItem(key)) ?? {};
  };
  /**
   * A Draft in the register this link continues (audit N-02): named by `?draft=`, or found from
   * `?project=` when the claim that link would start is already saved as a draft. The claim is
   * continued, never started a second time.
   */
  const [linked] = React.useState<{ app: GrantApplication; route: string; clash: boolean } | null>(() => {
    if (typeof window === "undefined" || !def || !ngo) return null;
    const draftId = searchParams.get("draft");
    const projectId = searchParams.get("project");
    const app = draftId
      ? state.applications.find((a) => a.id === draftId && a.ngoId === ngo.id && a.status === "Draft" && wizardFor(a.schemeCode)?.code === def.code)
      : projectId && ngo.institutions.some((i) => i.id === projectId)
        ? draftOfClaim(state, instalmentPlan(state, def.code, projectId))
        : undefined;
    const opened = app ? draftFromRegister(app) : null;
    if (!app || !opened) return null;
    const saved = parseDraft(window.localStorage.getItem(key));
    // This draft is already the one in the form: carry it on where it was left.
    if (hasAnswers(saved) && saved.registerId === app.id) {
      window.sessionStorage.setItem(activeKey(def.code), "1");
      return { app, route: stepRoute(def.code, saved.values ?? {}, draftStep(def.code, saved)?.index ?? 0), clash: false };
    }
    // Another draft of this scheme is saved: the applicant chooses, as on My Applications.
    if (hasAnswers(saved)) return { app, route: opened.route, clash: true };
    try {
      window.localStorage.setItem(key, JSON.stringify(opened.draft));
      window.sessionStorage.setItem(activeKey(def.code), "1");
    } catch {
      return null;
    }
    return { app, route: opened.route, clash: false };
  });
  const [clashChoice, setClashChoice] = React.useState<"pending" | "made">(() => (linked?.clash ? "pending" : "made"));
  /**
   * The draft this form was opened with, if there really was one. The banner used to say
   * "You are continuing a saved draft … last saved 21 Aug 2026" on EVERY visit, fresh ones
   * included, above four documents the applicant had never uploaded (full-wizard walk,
   * 13 Sep 2026). A fresh application now starts empty.
   */
  const [openedDraft] = React.useState(() => {
    if (typeof window === "undefined" || window.sessionStorage.getItem(activeKey(schemeCode.toUpperCase()))) return null;
    const d = readDraft();
    return hasAnswers(d) ? { savedAt: d.savedAt } : null;
  });
  /**
   * An earlier visit's draft is OFFERED, not applied: the form opens on what DARPAN supplies and
   * the applicant chooses Resume Draft or Start Fresh. Until they choose, nothing is saved — the
   * blank form must not overwrite the draft it is offering back.
   */
  const [draftChoice, setDraftChoice] = React.useState<"pending" | "made">(() => (openedDraft ? "pending" : "made"));
  const [confirmDiscard, setConfirmDiscard] = React.useState(false);

  /** What the portal knows before the applicant types anything: DARPAN, and the account on record. */
  const darpanSeed = (): Record<string, string> => seedFromDarpan(ngo);
  /**
   * "Claim the 2nd instalment" from the dashboard arrives as `?project=<ID>`: the picker option for
   * that project, when it has an instalment open. Decided once, as the form is created — only on a
   * form nobody has started, and never over a draft the applicant has not chosen to resume.
   */
  const [linkClaim] = React.useState<string | undefined>(() => {
    if (typeof window === "undefined" || !def || openedDraft || linked) return undefined;
    if ((readDraft().values ?? {}).case_type) return undefined;
    return projectOption(def, state, ngo?.id, searchParams.get("project"));
  });
  const [values, setValues] = React.useState<Record<string, string>>(() => {
    // The declaration stamp goes on LAST: a draft from an earlier day must not carry its date
    // forward, because the declaration is signed when it is submitted, not when it was begun.
    const carried = openedDraft ? {} : (readDraft().values ?? {});
    const seed: Record<string, string> = { ...darpanSeed(), ...carried, ...declarationStamp() };
    // The claim the link names (`linkClaim` above): the form opens as that project's renewal, unless
    // a draft already carried a case type in.
    const option = seed.case_type ? undefined : linkClaim;
    if (def && option) {
      const stepOne = visibleSteps(def, seed)[0]!;
      const renewalAnswer = RENEWAL_CASE_ANSWER[def.code];
      const renewal = renewalAnswer ? answerField(state, def, stepOne, seed, "case_type", renewalAnswer) : seed;
      return answerField(state, def, stepOne, renewal, RENEWAL_PICKER[def.code], option);
    }
    // Derive the totals now, not on first keystroke — a restored draft has the inputs but not
    // the read-only fields computed from them.
    return def ? applyAllAutoFields(def, seed) : seed;
  });

  /**
   * The step is the address: `?step=N` on the form route (serious audit S12, 14 Sep 2026).
   * Held in component state it was lost on a refresh, and browser Back left the form, because
   * no step ever became a history entry.
   */
  const urlStep = Number(searchParams.get("step"));
  const step = phase === "form" && Number.isInteger(urlStep) && urlStep > 0 ? urlStep : 0;

  // The steps THIS branch shows. Never `def.steps` — AVYAY gives a new project eight steps and a
  // renewal seven, so counting, indexing and labelling all have to agree on the filtered list or
  // the stepper, the "Step N of M" line and the routing disagree with one another.
  const steps = def ? visibleSteps(def, values) : [];
  const docsIndex = steps.findIndex((s) => s.kind === "documents");
  const reviewIndex = steps.findIndex((s) => s.kind === "review");
  const activeIndex = Math.min(phase === "documents" ? docsIndex : phase === "review" ? reviewIndex : step, Math.max(steps.length - 1, 0));

  const [errors, setErrors] = React.useState<Record<string, string>>(() => {
    if (typeof window === "undefined" || !def || phase !== "form" || !window.sessionStorage.getItem(CHECK_KEY)) return {};
    window.sessionStorage.removeItem(CHECK_KEY);
    const target = steps[activeIndex];
    return target ? validateStep(target, values) : {};
  });
  const [declared, setDeclared] = React.useState(false);
  const [docs, setDocs] = React.useState<Record<number, UploadedDoc>>(
    () => (openedDraft ? {} : (readDraft().docs ?? {})),
  );
  // Carried across a step-1 → step-2 → review hop, the last save's time is still the truth.
  const [save, setSave] = React.useState<SaveStatus>(() => {
    const at = openedDraft ? undefined : readDraft().savedAt;
    return at ? { kind: "saved", at: new Date(at) } : { kind: "idle" };
  });
  /** Set when Submit could not write the application to the device. */
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [conflict, setConflict] = React.useState<DraftConflict>(null);
  /**
   * What the form opened with. Nothing is saved until the answers differ from it — an untouched
   * form is not a draft, and saving one would greet the next visit with "You have a saved draft".
   * (A first-render flag is not enough: development mounts effects twice.)
   */
  const opened = React.useRef<string | null>(null);
  /**
   * The register's Draft application this form continues, if it was opened from a Draft row on My
   * Applications. Kept with every save, and handed to Submit so the Draft is replaced, not duplicated.
   */
  const [carriedRegisterId] = React.useState(() => (openedDraft ? undefined : readDraft().registerId));
  const registerId = React.useRef<string | undefined>(carriedRegisterId);
  /** The draft exactly as this tab last wrote it, so its own writes are not mistaken for another tab's. */
  const lastWritten = React.useRef<string | null>(null);
  const errorRef = React.useRef<HTMLDivElement>(null);
  /** The Upload Documents step, asked whether it may be left (the Document Centre's gate). */
  const docStep = React.useRef<DocumentsChecklistHandle>(null);
  const submitErrorRef = React.useRef<HTMLDivElement>(null);

  /**
   * The demo dock's Fill tab, applied live.
   *
   * A window event rather than a storage read: `values` and `docs` are seeded in lazy state
   * initialisers, which run once, so a panel that only wrote sessionStorage would appear to do
   * nothing until the page was reloaded. The listener also clears any standing validation
   * errors. It sets DATA only; which step to land on is the panel's business and it routes there
   * itself.
   */
  React.useEffect(() => {
    const onFill = (e: Event) => {
      const detail = (e as CustomEvent<DemoFillDetail>).detail;
      if (!def || detail?.scheme !== def.code) return;
      // DARPAN's identity and the declaration stamp are the portal's, never the demo's (C11).
      // The registration on the organisation's record too (N-16): a demo's illustrative number beside the real one gave one file two.
      const filled = applyAllAutoFields(def, { ...darpanSeed(), ...detail.values, ...darpanIdentity(darpanSeed()), ...registrationOf(ngo), ...declarationStamp() });
      setValues(filled);
      setDocs(detail.docs);
      setErrors({});
      setDeclared(false);
      // Saved NOW, not after the autosave pause. The dock moves to the step where the scenario
      // shows, which is usually another route and a new mount that reads the draft — before this,
      // "Complete & valid" pressed on a form step landed on Upload Documents with every answer gone.
      try {
        const raw = JSON.stringify({ values: filled, docs: detail.docs, savedAt: new Date().toISOString(), step: 0, registerId: registerId.current });
        window.localStorage.setItem(key, raw);
        lastWritten.current = raw;
        window.sessionStorage.setItem(activeKey(def.code), "1");
        if (detail.holdChecks) window.sessionStorage.setItem(DEMO_HOLD_CHECKS_KEY, def.code);
        else window.sessionStorage.removeItem(DEMO_HOLD_CHECKS_KEY);
        opened.current = JSON.stringify({ values: filled, docs: detail.docs });
        setDraftChoice("made");
        setSave({ kind: "saved", at: new Date() });
      } catch {
        setSave({ kind: "error" });
      }
    };
    window.addEventListener(DEMO_FILL_EVENT, onFill);
    return () => window.removeEventListener(DEMO_FILL_EVENT, onFill);
  });

  /**
   * Write the draft now. Returns whether it landed.
   *
   * The answers are saved a moment after they stop changing — and that moment was the defect
   * behind UX-01: an applicant who filled the Grant Sought step and pressed Save and Continue at
   * once moved to the upload route before the save had run, the upload route read the draft
   * without those answers, and the application was filed with ₹0 and "3 required questions
   * unanswered". Every move between steps now writes the draft first, synchronously.
   */
  const writeDraft = React.useCallback(
    (stepIndex: number = activeIndex): boolean => {
      if (!def) return false;
      try {
        const at = new Date();
        const raw = JSON.stringify({ values, docs, savedAt: at.toISOString(), step: stepIndex, registerId: registerId.current });
        window.localStorage.setItem(key, raw);
        lastWritten.current = raw;
        window.sessionStorage.setItem(activeKey(def.code), "1");
        opened.current = JSON.stringify({ values, docs });
        setSave({ kind: "saved", at });
        return true;
      } catch {
        setSave({ kind: "error" });
        return false;
      }
    },
    [def, values, docs, key, activeIndex],
  );

  React.useEffect(() => {
    const snapshot = JSON.stringify({ values, docs });
    if (opened.current === null) opened.current = snapshot;
    if (!def || draftChoice === "pending" || conflict || snapshot === opened.current) return;
    setSave({ kind: "saving" });
    const t = window.setTimeout(() => writeDraft(), AUTOSAVE_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [def, values, docs, draftChoice, conflict, writeDraft]);

  /**
   * Another tab saved or removed this draft (serious audit S13). Two tabs used to overwrite each
   * other's answers without a word. Now this tab stops saving and asks which version to keep.
   */
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;
      if (e.newValue === lastWritten.current || draftChoice === "pending") return;
      setConflict(e.newValue ? "changed" : "removed");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, draftChoice]);

  // An old code for a scheme (SMILE_GG) resolves to its form; the address is corrected to the
  // canonical code so every later step, and the success page, reads one scheme code. A `?step=N`
  // that names the upload or review step is sent to that step's own route.
  const canonical = def && def.code !== schemeCode.toUpperCase() ? def.code : null;
  const misplaced = phase === "form" && def && (steps[activeIndex]?.kind === "documents" || steps[activeIndex]?.kind === "review");
  React.useEffect(() => {
    if (canonical) {
      const suffix = phase === "documents" ? "step-2" : phase === "review" ? "review" : "step-1";
      router.replace(`/portals/e-anudaan/apply-grant/scheme/${canonical}/${suffix}`);
    } else if (misplaced && def) {
      router.replace(stepRoute(def.code, values, activeIndex));
    }
  }, [canonical, misplaced, phase, router, def, values, activeIndex]);

  /** A linked register draft opens where it was left — the Review step, for a draft from the register. */
  React.useEffect(() => {
    if (linked && !linked.clash) router.replace(linked.route, { scroll: false });
  }, [linked, router]);

  /**
   * "Claim 2nd Instalment" already answered Application Type — the project, and with it the
   * instalment and the year — so the form opens on the step after it (audit W-04). The address keeps
   * `?project=` so a refresh opens the same claim.
   */
  const jumped = React.useRef(false);
  React.useEffect(() => {
    if (jumped.current || !linkClaim || !def || phase !== "form" || step !== 0) return;
    jumped.current = true;
    const at = claimStartStep(def, values);
    const project = searchParams.get("project");
    if (at > 0 && project) {
      const route = stepRoute(def.code, values, at);
      router.replace(`${route}${route.includes("?") ? "&" : "?"}project=${encodeURIComponent(project)}`, { scroll: false });
    }
  }, [def, phase, step, values, router, searchParams, linkClaim]);

  const roomForLabels = useRoomForStageNames(stepperBox, steps.map((st) => st.title));

  /**
   * The applicant's own projects with an instalment open to claim — the renewal picker's options,
   * read from the sanctioned record rather than listed in the schema (W1, C2).
   */
  // The draft this form continues, so the picker still offers that draft's own project (N-02).
  const ownDraftId = carriedRegisterId ?? linked?.app.id;
  const dynamic = def ? { [RENEWAL_PICKER[def.code]]: renewalOptionsFor(def, state, ngo?.id, ownDraftId) } : {};

  if (!def) return <ChooseSchemeFirst />;

  const current = steps[activeIndex]!;
  const total = steps.length;
  const isDocs = current.kind === "documents";
  const isReview = current.kind === "review";

  const set = (name: string, value: string) => {
    setValues((v) => answerField(state, def, current, v, name, value));
    setErrors((e) => {
      if (!e[name]) return e;
      const rest = { ...e };
      delete rest[name];
      return rest;
    });
  };

  /**
   * Move to step `i`: the draft is written first, and the step becomes a history entry. A form
   * still exactly as it opened is not a draft, and moving does not make it one.
   */
  const navigate = (i: number, how: "push" | "replace" = "push"): boolean => {
    // The draft is saved to the portal on every move between steps; a failed save keeps the step open.
    if (requests.attempt("save-draft")) return false;
    requests.clear();
    const mustWrite = needsDraftWrite(JSON.stringify({ values, docs }), opened.current, window.localStorage.getItem(key));
    if (mustWrite && !writeDraft(i)) {
      toast("Your answers could not be saved on this device, so the next step cannot open. Try again.", "error");
      return false;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    router[how](stepRoute(def.code, values, i), { scroll: false });
    return true;
  };

  /**
   * Take the applicant to the first step that is not complete, with its errors showing.
   * Nothing is submitted and no later step opens.
   */
  const showIncomplete = (check: Extract<ApplicationCheck, { ok: false }>) => {
    const target = steps[check.stepIndex];
    if (check.stepIndex === activeIndex) {
      setErrors(check.errors);
      errorRef.current?.focus();
      return;
    }
    if (target?.kind !== "documents" && target?.kind !== "review") {
      // Same route: the errors state survives. Another route: the new mount reads the flag.
      if (phase === "form") setErrors(check.errors);
      else window.sessionStorage.setItem(CHECK_KEY, "1");
    }
    navigate(check.stepIndex);
  };

  /**
   * Jump to a step. Moving forward re-checks every visible step before it, and the upload gate:
   * a deep link to a later step, or a stepper jump, cannot carry the applicant past a step they
   * have not completed (serious audit S01).
   */
  const goto = (i: number) => {
    if (i > activeIndex) {
      const check = checkApplication(def, values, docs, i);
      if (!check.ok) {
        showIncomplete(check);
        return;
      }
    }
    setErrors({});
    navigate(i);
  };

  const next = () => goto(Math.min(activeIndex + 1, total - 1));

  const submit = () => {
    if (!declared) {
      toast("Accept the declaration above to submit.", "error");
      return;
    }
    if (requests.attempt("submit")) return;
    requests.clear();
    // Signed now: the declaration's date and time are the moment of submission.
    const signed: Record<string, string> = { ...values, ...declarationStamp() };
    // The whole application, not just the declaration. Opening the review address directly and
    // ticking the box filed ₹0, no answers and no documents (serious audit S01).
    const check = checkApplication(def, signed, docs);
    if (!check.ok) {
      toast("The application is not complete. The step that needs attention is open.", "error");
      showIncomplete(check);
      return;
    }
    const checklistNow = visibleDocuments(def, signed);
    const res = submitApplication({
      schemeCode: def.code,
      financialYear: signed.fld_financial_year ?? "2026-27",
      values: signed,
      // The uploads go with the application, each verdict checked against its financial year.
      documents: documentsOf(checklistNow, withYearCheck(checklistNow, docs, signed.fld_financial_year), (p) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, new Date().toISOString()),
      replacesDraftId: registerId.current,
    });
    if (!res.ok) {
      // Nothing was filed, so nothing is claimed and the draft stays (serious audit S03). The
      // success page used to show a reference for an application the device never held.
      setSubmitError("Your application could not be saved on this device. Nothing was submitted.");
      writeDraft();
      window.requestAnimationFrame(() => submitErrorRef.current?.focus());
      return;
    }
    setSubmitError(null);
    window.sessionStorage.removeItem(activeKey(def.code));
    lastWritten.current = null;
    window.localStorage.removeItem(key);
    toast(`Application ${res.app.id} submitted.`, "success");
    router.push(`${base(def.code)}/success?ref=${encodeURIComponent(res.app.id)}`);
  };

  /** Replace the other saved draft with the register draft this link names, and open it. */
  const openLinkedDraft = () => {
    if (!linked) return;
    const opened = draftFromRegister(linked.app);
    if (!opened) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(opened.draft));
      window.sessionStorage.setItem(activeKey(def.code), "1");
    } catch {
      toast("This draft could not be opened on this device. Try again.", "error");
      return;
    }
    setClashChoice("made");
    router.replace(opened.route, { scroll: false });
  };

  const resumeDraft = () => {
    const d = readDraft();
    const seed = { ...darpanSeed(), ...(d.values ?? {}), ...declarationStamp() };
    const restored = applyAllAutoFields(def, seed);
    setValues(restored);
    setDocs(d.docs ?? {});
    registerId.current = d.registerId;
    setErrors({});
    setDraftChoice("made");
    opened.current = JSON.stringify({ values: restored, docs: d.docs ?? {} });
    window.sessionStorage.setItem(activeKey(def.code), "1");
    if (d.savedAt) setSave({ kind: "saved", at: new Date(d.savedAt) });
    // Back where the applicant left off (serious audit UX-04), not at step 1.
    const at = draftStep(def.code, d);
    if (at && at.index !== activeIndex) router.replace(stepRoute(def.code, restored, at.index), { scroll: false });
  };

  const discardDraft = () => {
    // Back to what DARPAN supplies, not to nothing: emptying the read-only organisation fields
    // left required answers the applicant could not type.
    lastWritten.current = null;
    registerId.current = undefined;
    window.localStorage.removeItem(key);
    const fresh = applyAllAutoFields(def, darpanSeed());
    setValues(fresh);
    setErrors({});
    setDocs({});
    opened.current = JSON.stringify({ values: fresh, docs: {} });
    setSave({ kind: "idle" });
    setDraftChoice("made");
    setConfirmDiscard(false);
    if (activeIndex !== 0) router.replace(stepRoute(def.code, fresh, 0), { scroll: false });
  };

  /** The version the other tab saved, taken up here — answers, uploads and step. */
  const loadLatest = () => {
    const d = readDraft();
    const restored = applyAllAutoFields(def, { ...darpanSeed(), ...(d.values ?? {}), ...declarationStamp() });
    lastWritten.current = window.localStorage.getItem(key);
    registerId.current = d.registerId;
    opened.current = JSON.stringify({ values: restored, docs: d.docs ?? {} });
    setValues(restored);
    setDocs(d.docs ?? {});
    setErrors({});
    setConflict(null);
    if (d.savedAt) setSave({ kind: "saved", at: new Date(d.savedAt) });
    const at = draftStep(def.code, d);
    if (at && at.index !== activeIndex) router.replace(stepRoute(def.code, restored, at.index), { scroll: false });
  };

  /** Keep this tab's answers: they are saved over the other tab's, which is then told. */
  const keepMine = () => {
    setConflict(null);
    writeDraft();
  };

  // The upload step's own gate. Only the documents step can be blocked by it — an ordinary
  // field step is validated when it is left, which can reject and say what is wrong, and a form
  // whose button is simply dark is worse than one that answers back.
  //
  // The review step is gated on the declaration: "Submit Application" looked ready to press
  // before it was ticked, and answered only with a toast (form-path QA, 13 Sep 2026).
  /**
   * What this claim is, once a renewal's project is chosen — kept in view on every step, because a
   * 2nd instalment is claimed on the application ID its 1st instalment created (C7).
   */
  const claimNumber = Number(/^(\d+)/.exec(values.fld_installment_no ?? "")?.[1]);
  const claimLine =
    values.claim_stage && claimNumber && values.fld_financial_year && values.fld_project_id
      ? [claimIntro(claimNumber, values.fld_financial_year, values.fld_project_id), values.fld_application_ref ? `Application ID ${values.fld_application_ref}` : null]
          .filter(Boolean)
          .join(" · ")
      : null;
  /**
   * The line under the scheme's title (audit W-02). An application says what it is, once, on its
   * first step; a claim names its instalment, year and project on every step, because that is what
   * the applicant must keep in view. "…complete each section to register for AVYAY" was the wrong
   * verb, printed on every step, Upload Documents and Review included.
   */
  const intro = claimLine ?? (activeIndex === 0 && !isDocs && !isReview ? wizardIntro(schemeLabel(def.code)) : null);
  /** A choice about a saved draft is still to be made: the form waits for it (audit W-14). */
  const choosing = (openedDraft != null && draftChoice === "pending" && !linked?.clash) || (linked?.clash === true && clashChoice === "pending");

  const checklist = visibleDocuments(def, values);
  // The upload step keeps Continue enabled: pressed with a document that needs attention, the
  // step raises its own ErrorSummary and filters to what needs doing (Document Centre §3.5).
  // Submit stays the hard gate, through `checkApplication`.
  const gate = choosing
    ? { blocked: true, reason: "Resume the saved draft or start fresh first." }
    : isReview && !declared
      ? { blocked: true, reason: "Accept the declaration above to submit." }
      : { blocked: false, reason: null };
  /** The answer a "not accepted" failure points at: the first one the applicant can type on this step. */
  const firstAnswer = (step: StepDef | undefined) =>
    step ? visibleSections(step, values).flatMap((sec) => sec.fields).find((f) => fieldVisible(f, values) && !isReadOnly(f, values) && !f.auto) : undefined;
  const failedField = (() => {
    const at = requests.failure?.occasion === "submit" ? steps.find((st) => !st.kind || st.kind === "form") : current;
    // Only an answer drawn on THIS page can be linked to; on the upload or review route it is a banner.
    const f = phase === "form" && at === current ? firstAnswer(at) : undefined;
    return f ? { id: f.name, label: fieldLabel(f, values) } : undefined;
  })();
  const requestNotice = (where: "top" | "foot") =>
    (where === "foot") === (requests.failure?.occasion === "submit") ? (
      <ServiceErrorNotice
        failure={requests.failure}
        field={failedField}
        homeHref="/portals/e-anudaan/ngo/my-applications"
        onRetry={() => {
          requests.clear();
          if (requests.failure?.occasion === "submit") submit();
          else writeDraft();
        }}
        onDismiss={requests.clear}
      />
    ) : null;

  /** Continue on the upload step: the documents first, then every earlier step, then Review. */
  const docsNext = () => {
    if (docStep.current && !docStep.current.tryContinue()) return;
    const check = checkApplication(def, values, docs, activeIndex);
    if (!check.ok) {
      showIncomplete(check);
      return;
    }
    setErrors({});
    navigate(Math.min(activeIndex + 1, total - 1));
  };

  return (
    // Full width, as portal surfaces are (CLAUDE.md: portals are fluid). Capped at 896px, an
    // 11-step stepper had 69px a stage and broke its names mid-word ("Organisatio / n Details").
    <div className="space-y-6">
      {/* Header as the reference draws it: the scheme, one sentence of instruction, and the
          save status on the right. Position in the form is the stepper's job, not a sentence's. */}
      <PageHeader
        size="compact"
        title={def.title}
        meta={
          intro ? (
            claimLine ? (
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-semibold text-ink tabular-nums">{claimLine}</span>
                {phase === "form" && activeIndex > 0 && (
                  <Button appearance="text" size="sm" onClick={() => goto(0)}>
                    Change Project
                  </Button>
                )}
              </span>
            ) : (
              intro
            )
          ) : undefined
        }
        actions={<SaveIndicator status={save} onRetry={() => writeDraft()} />}
      />

      <div ref={stepperBox}>
      <Wizard
        steps={steps.map((s) => ({ label: s.title }))}
        current={activeIndex}
        title={isReview ? "Review Application Details" : current.title}
        description={
          isReview
            ? "Please verify all details before final submission."
            : isDocs
              ? undefined
              : current.kind === "confirm"
                ? "Confirm the sections marked for this instalment. The rest is carried forward from the sanctioned application."
                : stepLead(current)
        }
        headerActions={undefined}
        onCancel={() => router.push("/portals/e-anudaan/apply-grant")}
        onBack={() => goto(Math.max(activeIndex - 1, 0))}
        onNext={isDocs ? docsNext : next}
        onSubmit={submit}
        // No arrow in the words: the button draws its own chevron, and "Next → >" had two.
        // Saving is automatic; the button names both things moving on does.
        nextLabel="Save and Continue"
        nextDisabled={gate.blocked}
        nextBlockedReason={gate.reason ?? undefined}
        submitLabel="Submit Application"
        // NAPDDR runs to 10–11 steps; collapsed to dots the row says nothing about where the
        // applicant is, so from tablet width up every stage keeps its name. On a phone there is
        // no room for eleven names (26px a stage at 375px) and the compact bar is right.
        stepperCollapse={roomForLabels ? "never" : "auto"}
        error={errorSummary(current, errors)}
        errorRef={errorRef}
      >
        {darpanFailure && <ServiceErrorNotice failure={darpanFailure} onRetry={clearDarpanFailure} onDismiss={clearDarpanFailure} />}
        {requestNotice("top")}
        {linked?.clash && clashChoice === "pending" && (
          <Alert status="warning" title={`Another ${schemeLabel(def.code)} draft is saved on this device.`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-body-2">
                Opening the saved draft of {linked.app.instalment ? `the ${instalmentLabel(linked.app.instalment)}` : "this claim"} for Project {linked.app.institutionId} replaces the other draft on this device.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={openLinkedDraft}>
                  Open This Draft
                </Button>
                <Button appearance="text" size="sm" onClick={() => router.push("/portals/e-anudaan/ngo/my-applications")}>
                  Go to My Applications
                </Button>
              </div>
            </div>
          </Alert>
        )}
        {openedDraft && draftChoice === "pending" && !linked?.clash && (
          <Alert status="warning" title="You have a saved draft for this scheme.">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-body-2">
                {openedDraft.savedAt ? `Last updated ${formatDate(openedDraft.savedAt)}. ` : ""}
                Resume where you left off, or discard it and start with a blank form.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={resumeDraft}>
                  Resume Draft
                </Button>
                {/* Secondary, and asks first: it deletes the applicant's work (serious audit UX-05). */}
                <Button appearance="text" size="sm" onClick={() => setConfirmDiscard(true)}>
                  Start Fresh
                </Button>
              </div>
            </div>
          </Alert>
        )}
        {conflict && (
          <Alert
            status="warning"
            title={conflict === "changed" ? "This application was changed in another tab." : "This application was submitted or discarded in another tab."}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-body-2">
                {conflict === "changed"
                  ? "Load the version saved in the other tab, or keep the answers on this page. Keeping them replaces the other version."
                  : "Keep the answers on this page to save them as a draft again, or go to My Applications."}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {conflict === "changed" ? (
                  <Button size="sm" onClick={loadLatest}>
                    Load Latest Version
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => router.push("/portals/e-anudaan/ngo/my-applications")}>
                    Go to My Applications
                  </Button>
                )}
                <Button appearance="text" size="sm" onClick={keepMine}>
                  Keep This Version
                </Button>
              </div>
            </div>
          </Alert>
        )}
        {choosing ? null : isDocs ? (
          <DocumentsChecklist
            ref={docStep}
            schemeCode={def.code}
            documentsNote={def.documentsNote}
            documents={checklist}
            uploaded={docs}
            values={values}
            onChange={setDocs}
          />
        ) : isReview ? (
          <>
            <ReviewStep def={def} values={values} docs={docs} onDocsChange={setDocs} declared={declared} onDeclare={setDeclared} onEdit={goto} />
            {/* Beside the button that was pressed, and focused, so it is seen where the applicant is
                looking — at the foot of a review several screens long. */}
            {requestNotice("foot")}
            {submitError && (
              <div ref={submitErrorRef} tabIndex={-1} className="outline-none">
                <Alert status="error" title={submitError}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-body-2">Your answers are still on this page. Try again.</p>
                    <Button size="sm" onClick={submit}>
                      Try Again
                    </Button>
                  </div>
                </Alert>
              </div>
            )}
          </>
        ) : current.kind === "confirm" ? (
          <ConfirmStep def={def} step={current} values={values} errors={errors} onChange={set} dynamic={dynamic} />
        ) : (
          <FormStep def={def} step={current} values={values} errors={errors} onChange={set} dynamic={dynamic} />
        )}
      </Wizard>
      </div>

      <Modal
        open={confirmDiscard}
        onClose={() => setConfirmDiscard(false)}
        title="Discard Saved Draft?"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button appearance="outlined" onClick={() => setConfirmDiscard(false)}>
              Keep Draft
            </Button>
            <Button variant="danger" onClick={discardDraft}>
              Discard Draft
            </Button>
          </div>
        }
      >
        <p className="text-body-2">
          The answers and documents saved for this {schemeLabel(def.code)} application will be deleted. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

const base = (code: string) => `/portals/e-anudaan/apply-grant/scheme/${code}`;

/** The Case Type answer that opens a scheme's renewal branch. SHRESHTA has no Case Type: choosing the institution is the renewal. */
const RENEWAL_CASE_ANSWER: Partial<Record<string, string>> = {
  AVYAY: "Ongoing / Renewal of an existing project",
  NAPDDR: "Ongoing / Renewal of an existing project",
  SMILE: SMILE_CASE_EXISTING,
};

/**
 * The renewal picker's options for a scheme whose claims are derived from the sanction record. A
 * project whose claim is saved as a draft is left out — except to that draft itself.
 */
function renewalOptionsFor(def: WizardDef | undefined, state: EAnudaanState, ngoId: string | undefined, keepDraftId?: string): string[] {
  return def && ngoId && DERIVED_CLAIM_SCHEMES.has(def.code) ? renewableProjects(state, ngoId, def.code, new Date(), keepDraftId).map(renewalOption) : [];
}

/** The picker option for `?project=<ID>`, when that project has an instalment open. */
function projectOption(def: WizardDef | undefined, state: EAnudaanState, ngoId: string | undefined, projectId: string | null): string | undefined {
  if (!projectId) return undefined;
  return renewalOptionsFor(def, state, ngoId).find((o) => o.split(" — ")[0] === projectId);
}

/**
 * Whether every stage of the stepper can show its name without breaking a word.
 *
 * Measured on the form, not the viewport: a 1024px laptop with the sidebar open gave eleven stages
 * 58px each and broke "Application" mid-word although the viewport was "wide" — and a fixed
 * pixel threshold still broke "Infrastructure," at 90px (14 Sep 2026). So the longest WORD in the
 * stage names is measured in the stepper's own label style and compared with the column each stage
 * gets; if any word would not fit, the stepper takes its compact form instead.
 */
function useRoomForStageNames(box: React.RefObject<HTMLDivElement | null>, titles: readonly string[]): boolean {
  const [room, setRoom] = React.useState(true);
  const key = titles.join("|");
  React.useEffect(() => {
    const el = box.current;
    if (!el) return;
    const probe = document.createElement("span");
    probe.className = "ds-stepper__label";
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;left:-9999px;top:0";
    el.appendChild(probe);
    const words = [...new Set(key.split(/[|\s]+/).filter(Boolean))];
    const widest = Math.max(
      0,
      ...words.map((w) => {
        probe.textContent = w;
        return probe.getBoundingClientRect().width;
      }),
    );
    probe.remove();
    const stages = Math.max(key.split("|").length, 1);
    // The stepper sits on the page ground with no card round it; only the gutter between columns
    // comes off each column's width.
    // Every word of every stage name must fit its column whole. From 768px the NGO rail leaves an
    // eight-stage form 52px a stage (72px at 1024), and a name broken mid-word ("Applica / tion") reads
    // worse than the compact bar — so the bar stays until the column can hold the words. Showing names
    // at tablet widths needs the rail collapsed there (a shell decision), not a narrower label.
    const measure = () => setRoom(el.getBoundingClientRect().width / stages - 12 >= widest);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [box, key]);
  return room;
}

/* ── Save status ──────────────────────────────────────────────────────────── */

/** "Draft saved at 10:42 AM" — announced politely, and never silent about a failure. */
function SaveIndicator({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) {
  if (status.kind === "idle") return null;
  return (
    <span className="flex shrink-0 items-center gap-2" role="status" aria-live="polite">
      {status.kind === "saving" && <Badge status="neutral">Saving…</Badge>}
      {status.kind === "saved" && (
        <Badge status="neutral">
          <Icon name="cloud_done" size={16} aria-hidden />
          Draft saved at {formatTime(status.at)}
        </Badge>
      )}
      {status.kind === "error" && (
        <>
          <Badge status="danger">
            <Icon name="error" size={16} aria-hidden />
            Draft not saved.
          </Badge>
          <Button appearance="text" size="sm" onClick={onRetry}>
            Try Again
          </Button>
        </>
      )}
    </span>
  );
}

/* ── The ordinary field steps ─────────────────────────────────────────────── */

type DynamicOptions = Readonly<Record<string, readonly string[]>>;

function FormStep({
  def,
  step,
  values,
  errors,
  onChange,
  dynamic,
}: {
  def: WizardDef;
  step: StepDef;
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
  dynamic: DynamicOptions;
}) {
  // A section with nothing to ask on this branch is not drawn — a renewal's Grant Sought, whose
  // figures are the sanctioned ones under Grant for This Instalment.
  const sections = visibleSections(step, values);
  // A step with one section already carries that section's name in the panel's head band, so
  // the sub-section drops its own label and lead rather than repeating them.
  const solo = sections.length === 1;
  return (
    <>
      {sections.map((section) =>
        isSummarySection(section, values) ? (
          <SummarySection key={section.title} section={section} values={values} errors={errors} onChange={onChange} dynamic={dynamic} />
        ) : (
          <FormSection
            key={section.title}
            title={solo && section.title === step.title ? undefined : section.title}
            description={solo ? undefined : section.lead}
            columns={section.columns ?? 3}
          >
            {def.costNorms && section.title === "Grant Sought" && (
              <div className="ds-form-span-full">
                <CostNormsPanel
                  natureOfProject={values.fld_nature_of_project}
                  agencyType={values.fld_agency_type}
                  projectState={values.fld_project_state}
                  cityCategory={values.fld_city_category}
                  buildingOwnership={values.fld_building_ownership}
                  recurringSought={values.fld_grant_recurring}
                  nonRecurringSought={values.fld_grant_non_recurring}
                beneficiaries={values.fld_total_beneficiaries}
                />
              </div>
            )}
            <SectionFields section={section} values={values} errors={errors} onChange={onChange} dynamic={dynamic} />
          </FormSection>
        ),
      )}
    </>
  );
}

function SectionFields({
  section,
  values,
  errors,
  onChange,
  dynamic,
}: {
  section: SectionDef;
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
  dynamic: DynamicOptions;
}) {
  return (
    <>
      {section.fields
        .filter((f) => fieldVisible(f, values))
        .map((f) => (
          <Field
            key={f.name}
            field={f}
            values={values}
            value={values[f.name] ?? ""}
            error={errors[f.name]}
            parentValue={f.districtsOf ? values[f.districtsOf] : undefined}
            onChange={(v) => onChange(f.name, v)}
            dynamic={dynamic}
          />
        ))}
    </>
  );
}

/**
 * A record the portal already holds, drawn once and compactly rather than as a row of locked
 * boxes: a renewal's bank account — bank, branch, the number masked and shown once, IFSC, and PFMS
 * registration beside it (review call 11 Sep 2026, T549–559, T635–636). It cannot be changed
 * here; the change is a request under Project Bank Accounts (T545–576).
 */
function SummarySection({
  section,
  values,
  errors,
  onChange,
  dynamic,
}: {
  section: SectionDef;
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
  dynamic: DynamicOptions;
}) {
  const shown = section.fields.filter((f) => fieldVisible(f, values));
  const fixed = shown.filter((f) => isReadOnly(f, values) || f.auto);
  const open = shown.filter((f) => !(isReadOnly(f, values) || f.auto));
  return (
    <FormSection title={section.title} columns={3}>
      <div className="ds-form-span-full space-y-2">
        <DescriptionList
          columns={3}
          size="sm"
          items={fixed.map((f) => ({ term: fieldLabel(f, values), value: reviewValue(f, values[f.name] ?? "") }))}
        />
        <p className="text-body-3 text-ink-muted">
          To change this account, raise a request under{" "}
          <Link href="/portals/e-anudaan/ngo/bank-accounts">Project Bank Accounts</Link>. The change takes effect once the Ministry approves it.
        </p>
      </div>
      {open.length > 0 && <SectionFields section={{ ...section, fields: open }} values={values} errors={errors} onChange={onChange} dynamic={dynamic} />}
    </FormSection>
  );
}

/**
 * A 2nd or 3rd instalment's one step for everything already on record (C39, T667–675).
 *
 * The same fields the full form asks, so nothing is lost and validation is unchanged — but only
 * the sections that must be re-confirmed for this instalment are open: the beneficiaries, the
 * instalment's amount and the declaration. The rest arrive filled in from the sanctioned
 * application and stay closed to a one-line summary; Edit opens one where something has changed.
 * A section holding an error opens itself, so a problem is never hidden in a closed row.
 */
function ConfirmStep({
  def,
  step,
  values,
  errors,
  onChange,
  dynamic,
}: {
  def: WizardDef;
  step: StepDef;
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
  dynamic: DynamicOptions;
}) {
  const [editing, setEditing] = React.useState<ReadonlySet<string>>(new Set());
  const sections = visibleSections(step, values);
  const toggle = (title: string) =>
    setEditing((cur) => {
      const next = new Set(cur);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  const hasError = (section: SectionDef) => section.fields.some((f) => errors[f.name]);

  const reconfirm = sections.filter((x) => x.reconfirm);
  const carried = sections.filter((x) => !x.reconfirm);

  return (
    <>
      <FormStep def={def} step={{ ...step, sections: reconfirm }} values={values} errors={errors} onChange={onChange} dynamic={dynamic} />
      {carried.map((section) => {
        if (isSummarySection(section, values)) {
          return <SummarySection key={section.title} section={section} values={values} errors={errors} onChange={onChange} dynamic={dynamic} />;
        }
        const open = editing.has(section.title) || hasError(section);
        return (
          <FormSection
            key={section.title}
            title={section.title}
            columns={section.columns ?? 3}
            actions={
              hasError(section) ? undefined : (
                <Button appearance="text" size="sm" onClick={() => toggle(section.title)} aria-expanded={open} aria-label={`${open ? "Close" : "Edit"} ${section.title}`}>
                  <Icon name={open ? "expand_less" : "edit"} size={16} aria-hidden /> {open ? "Done" : "Edit"}
                </Button>
              )
            }
          >
            {open ? (
              <SectionFields section={section} values={values} errors={errors} onChange={onChange} dynamic={dynamic} />
            ) : (
              <p className="ds-form-span-full text-body-2 text-ink-muted">{sectionSummary(section, values)}</p>
            )}
          </FormSection>
        );
      })}
    </>
  );
}

/**
 * A closed section's one line: its first three answers, each readable on its own — a name or a
 * choice as it stands, a number or a Yes/No with its label ("Rooms 12", "Kitchen facilities
 * available: Yes"), a long answer cut short. "Owned · 420 · 12" said nothing a clerk could check.
 */
function sectionSummary(section: SectionDef, values: Record<string, string>): string {
  const short = (label: string) => label.replace(/\s*\(.*?\)\s*/g, " ").replace(/^Number of /i, "").trim();
  const parts = section.fields
    .filter((f) => fieldVisible(f, values) && (values[f.name] ?? "").trim())
    .slice(0, 3)
    .map((f) => {
      const raw = values[f.name] ?? "";
      const label = short(fieldLabel(f, values));
      if (f.kind === "number") return `${label} ${reviewValue(f, raw)}`;
      if (f.kind === "radio" || f.kind === "checkbox") return `${label}: ${reviewValue(f, raw)}`;
      if (f.kind === "textarea") return raw.length > 70 ? `${raw.slice(0, 67).trimEnd()}…` : raw;
      // A short choice does not explain itself: "· NGO ·" read as a stray word (audit W-07). It
      // carries its label; a long one ("Senior Citizens' Home — 25 beneficiaries") does not need to.
      if (f.kind === "select" && raw.length <= 16) return `${label}: ${reviewValue(f, raw)}`;
      return reviewValue(f, raw);
    });
  return parts.length ? parts.join(" · ") : "Nothing recorded.";
}

/** The one line under a step's title: its only section's lead, when it has one. */
function stepLead(step: StepDef): string | undefined {
  return step.sections.length === 1 ? step.sections[0]?.lead : undefined;
}

function Field({
  field,
  values,
  value,
  error,
  parentValue,
  onChange,
  dynamic,
}: {
  field: FieldDef;
  /** The whole answer set — some options and some read-only states depend on another field. */
  values: Record<string, string>;
  value: string;
  error?: string;
  parentValue?: string;
  onChange: (v: string) => void;
  dynamic?: DynamicOptions;
}) {
  const wide = field.wide || field.kind === "textarea" || field.kind === "radio";
  // Not `field.options` — an option can be branch-specific (AVYAY offers Physiotherapy Clinic
  // and Mobile Medicare Unit to renewals only), and a field can be editable on one branch and
  // fixed on another.
  const options = field.districtsOf ? districtsOf(parentValue) : visibleOptions(field, values, dynamic);
  const isAuto = Boolean(field.auto);
  // Branch-aware: each path is shown only its own wording.
  const readOnly = isReadOnly(field, values) || isAuto;
  // A locked box already says it cannot be typed in; a sentence naming where its value came from
  // is not help (form-wizard visual language §5).
  const help = shownHelp(field, values, readOnly);
  // Branch-aware too: a renewal's grant figures are labelled as sanctioned, not estimated.
  const label = fieldLabel(field, values);

  // The applicant's own renewable projects, when there are none: the answer, and the one reason
  // that tells them what to do — not an empty list to open.
  if (field.optionsFrom && options.length === 0) {
    return (
      <div className="ds-form-span-full">
        <Alert status="info" title="None of your projects has an instalment open to claim.">
          <p className="text-body-2">
            An instalment opens once the one before it has been sanctioned. Choose New project to apply for a new project.
          </p>
        </Alert>
        {error && (
          <FieldMessage status="error" role="alert" className="mt-1">
            {error}
          </FieldMessage>
        )}
      </div>
    );
  }

  // SMILE's undertakings (a)–(j) are individual tick-boxes, not Yes/No pairs.
  if (field.kind === "checkbox") {
    return (
      <div className={wide ? "ds-form-span-full" : undefined}>
        <Checkbox
          name={field.name}
          checked={value === "true"}
          onChange={(e) => onChange(e.target.checked ? "true" : "")}
          label={label}
          // A required tick-box that says so only in its styling is announced as optional.
          required={field.required || undefined}
          aria-invalid={error != null || undefined}
        />
        {help && <FieldHint className="mt-1">{help}</FieldHint>}
        {error && (
          <FieldMessage status="error" role="alert" className="mt-1">
            {error}
          </FieldMessage>
        )}
      </div>
    );
  }

  if (field.kind === "radio") {
    return (
      // The DS group, not a hand-built fieldset: its legend carries the same required marker as
      // every other DS field. The hand-built one drew a plain black "*" beside the red asterisks
      // of the text fields around it, on every step of every form.
      <div className={wide ? "ds-form-span-full" : undefined}>
        <RadioGroup
          legend={label}
          name={field.name}
          value={value || undefined}
          onChange={onChange}
          options={options.map((o) => ({ value: o, label: o }))}
          hint={help}
          error={error}
          required={field.required}
          orientation="horizontal"
        />
      </div>
    );
  }

  // An editable date is the design system's DatePicker: typed as dd/mm/yyyy, with a calendar as
  // the second way in. A read-only date (the declaration's own stamp) stays a read-only box —
  // DatePicker has no read-only state, only disabled.
  if (field.kind === "date" && !readOnly) {
    return (
      <div className={wide ? "ds-form-span-full" : undefined}>
        <DatePicker
          label={label}
          id={field.name}
          hint={help}
          error={error}
          required={field.required}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div className={wide ? "ds-form-span-full" : undefined}>
      <FormField
        label={label}
        id={field.name}
        hint={help}
        error={error}
        // Advice that never blocks: AVYAY's beneficiaries below the strength the project type is costed for (W-01).
        warning={strengthAdvice(field, values)}
        required={field.required}
        // On the field itself, not only the box inside: the design system withholds the required
        // mark from a field the applicant cannot change — a computed or carried-forward amount, the
        // declaration's date (audit W-03).
        readOnly={readOnly || undefined}
        characterCount={field.maxLength != null ? { value, maxLength: field.maxLength } : undefined}
      >
        {(control) =>
          field.kind === "number" && readOnly && field.label.includes("₹") && /^\d+(\.\d+)?$/.test(value) ? (
            // A worked-out or sanctioned amount reads as money — "₹20,34,140", not "2034140".
            <Input {...control} value={rupees(Number(value))} readOnly onChange={() => undefined} />
          ) : field.kind === "select" && readOnly ? (
            // A native <select> ignores `readonly`, so a "read-only" select stayed fully editable
            // — the renewal's bank account among them (review call, T545–576). Read-only answers
            // render as a read-only text box showing the value, like every other locked field.
            <Input {...control} value={value} readOnly onChange={() => undefined} />
          ) : field.kind === "select" ? (
            <Select
              {...control}
              value={value}
              disabled={Boolean(field.districtsOf) && options.length === 0}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">Select…</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          ) : field.kind === "textarea" ? (
            <Textarea
              {...control}
              rows={3}
              value={value}
              maxLength={field.maxLength}
              readOnly={readOnly}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : (
            <Input
              {...control}
              type={field.kind === "number" ? "text" : field.kind}
              inputMode={field.kind === "number" ? "numeric" : undefined}
              value={value}
              readOnly={readOnly}
              onChange={(e) => onChange(e.target.value)}
            />
          )
        }
      </FormField>
    </div>
  );
}

/* ── Review & Submit ──────────────────────────────────────────────────────── */

function ReviewStep({
  def,
  values,
  docs,
  onDocsChange,
  declared,
  onDeclare,
  onEdit,
}: {
  def: WizardDef;
  values: Record<string, string>;
  docs: Record<number, UploadedDoc>;
  onDocsChange: React.Dispatch<React.SetStateAction<Record<number, UploadedDoc>>>;
  declared: boolean;
  onDeclare: (v: boolean) => void;
  onEdit: (step: number) => void;
}) {
  // Same filtered list the wizard walks. Reading back `def.steps` here would show a renewal the
  // Justification section it was never asked to fill, and hand `onEdit` an index into a different
  // list from the one the stepper is numbering.
  const branchSteps = visibleSteps(def, values);
  const formSteps = branchSteps
    .map((s, i) => ({ step: s, index: i }))
    .filter(({ step }) => step.kind !== "documents" && step.kind !== "review");

  const documentsIndex = branchSteps.findIndex((s) => s.kind === "documents");
  const editButton = (label: string, index: number) => (
    <Button appearance="text" size="sm" onClick={() => onEdit(index)} aria-label={`Edit ${label}`}>
      <Icon name="edit" size={16} aria-hidden /> Edit
    </Button>
  );

  return (
    <>
      {formSteps.flatMap(({ step, index }) =>
        visibleSections(step, values).map((section) => (
          <ReviewSection
            key={`${step.title}-${section.title}`}
            title={section.title}
            columns={4}
            // A record the portal holds (a renewal's bank account) is not edited from here.
            actions={isSummarySection(section, values) ? undefined : editButton(section.title, index)}
          >
            {section.fields
              .filter((f) => fieldVisible(f, values))
              .map((f) => (
                <ReviewItem
                  key={f.name}
                  label={fieldLabel(f, values)}
                  // A ticked undertaking reads "Yes", not the raw "true" the live
                  // read-back prints (recorded as a live rough edge, not cloned).
                  value={reviewValue(f, values[f.name] ?? "")}
                  wide={f.kind === "textarea" || f.kind === "checkbox"}
                />
              ))}
          </ReviewSection>
        )),
      )}

      <FormCard title="Uploaded Documents" actions={documentsIndex >= 0 ? editButton("Uploaded Documents", documentsIndex) : undefined}>
        <ReviewDocuments
          schemeCode={def.code}
          documents={visibleDocuments(def, values)}
          uploaded={docs}
          setUploaded={onDocsChange}
          values={values}
          onEditDocuments={documentsIndex >= 0 ? () => onEdit(documentsIndex) : undefined}
        />
      </FormCard>

      <DeclarationCheckbox checked={declared} onChange={onDeclare} title="Declaration" lead="">
        {DECLARATION_TEXT}
      </DeclarationCheckbox>
    </>
  );
}

/**
 * An answer as the review step reads it back: dates as "01 Apr 2015", times as "10:30 AM" and
 * rupee amounts grouped as "₹25,00,000", instead of the raw "2015-04-01", "10:30" and "2500000"
 * the inputs hold.
 */
function reviewValue(field: FieldDef, raw: string): string {
  const v = raw.trim();
  // A ticked undertaking reads "Yes", not the raw "true" the live read-back prints.
  if (field.kind === "checkbox") return v === "true" ? "Yes" : "";
  if (!v) return "";
  if (field.kind === "date") {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    // Built in local time: `new Date("2015-04-01")` is midnight UTC, the previous day west of it.
    return m ? formatDate(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))) : v;
  }
  if (field.kind === "time") return formatTime(v) || v;
  if (field.kind === "number" && field.label.includes("₹") && /^\d+(\.\d+)?$/.test(v)) return rupees(Number(v));
  return v;
}
