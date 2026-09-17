"use client";

/**
 * The demo dock's "Fill" tab for the e-Anudaan grant wizard.
 *
 * DS Audit: SegmentedControl ✅ · FormField ✅ · Select ✅ · Button ✅ · ListGroup / ListRow ✅ ·
 * Accordion ✅ — nothing new needed.
 *
 * The dock's Sign in tab is the precedent: a reviewer should not have to type forty answers and
 * upload twelve documents to reach the screen they came to look at.
 *
 * THREE SECTIONS, NOT ONE LIST. This tab was nine scenario rows followed by thirteen force-state
 * buttons, 1,028px of content in a 552px body, edge to edge with no inset — the reported "scroll so
 * long the sections do not show". It is now three questions a reviewer asks, one at a time:
 *
 *   Answers    — fill the form right, empty it, or trip ONE of its rules and land on the message.
 *   Documents  — put real sample files into the checklist: all correct, every check at once, one
 *                document with one outcome, or one check everywhere it can happen.
 *   Journeys   — the application-wide states: part-uploaded, held in checking, ready to submit.
 *
 * Long option sets are pickers, not lists, so no section outgrows the panel on a laptop.
 *
 * It talks to the wizard by window events rather than by writing storage alone, because the wizard
 * reads its draft in a lazy state initialiser — storage written after mount would not be seen until
 * a reload, and a demo control that needs a refresh will be read as broken.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionItem, Button, FormField, ListGroup, ListRow, SegmentedControl, Select } from "@mosje/design-system";
import { visibleDocuments, wizardFor, type WizardDef } from "@/lib/e-anudaan/form-schema";
import { CHECK_BY_ID, DOC_CHECKS, type CheckId } from "@/lib/e-anudaan/doc-checks";
import { DOC_LIST_EVENT, type DocListDetail } from "@/lib/e-anudaan/document-centre";
import {
  buildRulePreset,
  buildScenario,
  DEMO_FILL_EVENT,
  DEMO_SCENARIOS,
  routeForScenario,
  rulePresetsFor,
} from "@/lib/e-anudaan/demo-scenarios";
import {
  checkEverywhere,
  DEMO_PENDING_SAMPLES_KEY,
  DEMO_PLACE_SAMPLES_EVENT,
  everyCheckAtOnce,
  everyDocumentPasses,
  sampleChoices,
  type SampleChoice,
  type SamplePlacement,
} from "@/lib/e-anudaan/sample-files";
import { DemoDocumentStates } from "./demo-document-states";

/** `/portals/e-anudaan/apply-grant/scheme/AVYAY/step-1` → `AVYAY`. */
export function schemeFromPath(pathname: string | null): string | null {
  return /\/apply-grant\/scheme\/([A-Za-z0-9_]+)/.exec(pathname ?? "")?.[1]?.toUpperCase() ?? null;
}

type Section = "answers" | "documents" | "journeys";

const SECTIONS: { value: Section; label: string }[] = [
  { value: "answers", label: "Answers" },
  { value: "documents", label: "Documents" },
  { value: "journeys", label: "Journeys" },
];

/** How each outcome is grouped in the pickers — the applicant's words for what happens. */
const OUTCOME_GROUPS: { outcome: SampleChoice["outcome"]; label: string }[] = [
  { outcome: "passes", label: "Looks Right" },
  { outcome: "refused", label: "Refused Before Upload" },
  { outcome: "failed", label: "Upload Fails" },
  { outcome: "invalid", label: "Doesn't Match" },
  { outcome: "review", label: "Check the Details" },
  { outcome: "unavailable", label: "Check Unavailable" },
];

const SECTION_KEY = "e-anudaan.demo.fill-section";

export function DemoFillPanel({ pathname }: { pathname: string | null }) {
  const router = useRouter();
  const scheme = schemeFromPath(pathname);
  const def = wizardFor(scheme ?? undefined);
  const onUploadStep = Boolean(pathname?.includes("/step-2"));

  const [section, setSection] = React.useState<Section>(() => {
    try {
      const saved = typeof window === "undefined" ? null : (window.sessionStorage.getItem(SECTION_KEY) as Section | null);
      if (saved && SECTIONS.some((s) => s.value === saved)) return saved;
    } catch {
      // Private window: start on the section the step suggests.
    }
    return onUploadStep ? "documents" : "answers";
  });
  const [done, setDone] = React.useState<string | null>(null);

  const choose = (next: Section) => {
    setSection(next);
    setDone(null);
    try {
      window.sessionStorage.setItem(SECTION_KEY, next);
    } catch {
      // Remembering the section is a convenience.
    }
  };

  if (!def) {
    return (
      <div className="p-4">
        <p className="text-body-2 text-ink-muted">
          Open a grant application to fill it. The scheme is taken from the address.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <p className="text-body-3 text-ink-muted">
        Fills the <strong className="text-ink">{def.code}</strong> application with the demo applicant&rsquo;s
        answers and sample files. Every file is marked as a sample.
      </p>
      <SegmentedControl ariaLabel="What to fill" options={SECTIONS} value={section} onChange={choose} />

      {section === "answers" && <AnswersSection def={def} router={router} onDone={setDone} />}
      {section === "documents" && <DocumentsSection def={def} router={router} onUploadStep={onUploadStep} onDone={setDone} />}
      {section === "journeys" && <JourneysSection def={def} router={router} onDone={setDone} />}

      <p role="status" aria-live="polite" className="text-body-3 text-ink-muted min-h-5">
        {done}
      </p>
    </div>
  );
}

type Router = ReturnType<typeof useRouter>;

/* ── Answers ─────────────────────────────────────────────────────────────────────────────────── */

function AnswersSection({ def, router, onDone }: { def: WizardDef; router: Router; onDone: (s: string) => void }) {
  const rules = React.useMemo(() => rulePresetsFor(def), [def]);
  const [rule, setRule] = React.useState(rules[0]?.preset.id ?? "");

  const scenario = (id: string, words: string) => {
    window.dispatchEvent(new CustomEvent(DEMO_FILL_EVENT, { detail: buildScenario(id, def) }));
    router.push(id === "complete" ? `/portals/e-anudaan/apply-grant/scheme/${def.code}/step-1` : routeForScenario(id, def.code));
    onDone(words);
  };

  const trip = () => {
    const built = buildRulePreset(rule, def);
    if (!built) return;
    window.dispatchEvent(new CustomEvent(DEMO_FILL_EVENT, { detail: built.detail }));
    router.push(built.route);
    onDone(`${rules.find((r) => r.preset.id === rule)?.preset.label ?? "Rule"} — the step with the message is open.`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => scenario("complete", "Every answer filled correctly, and every document marked as looking right.")}>
          Fill Correctly
        </Button>
        <Button size="sm" appearance="outlined" onClick={() => scenario("validation-errors", "Mandatory answers left out on the first step. Press Next to see the summary.")}>
          Leave Answers Out
        </Button>
        <Button size="sm" appearance="text" onClick={() => scenario("blank", "The form is empty.")}>
          Empty the Form
        </Button>
      </div>

      {rules.length > 0 && (
        <section className="space-y-2" aria-labelledby="demo-trip-rule">
          <h3 id="demo-trip-rule" className="text-body-2 font-semibold text-ink">
            Trip One Rule
          </h3>
          <p className="text-body-3 text-ink-muted">
            Everything else correct; opens the step with that rule&rsquo;s message.
          </p>
          <FormField id="demo-rule" label="Rule">
            {(c) => (
              <Select {...c} size="sm" value={rule} onChange={(e) => setRule(e.target.value)}>
                {rules.map(({ preset, fieldLabel }) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label} — {fieldLabel}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <Button size="sm" appearance="outlined" onClick={trip}>
            Fill and Show the Message
          </Button>
        </section>
      )}
    </div>
  );
}

/* ── Documents ───────────────────────────────────────────────────────────────────────────────── */

function useChecklist(def: WizardDef, onUploadStep: boolean): { n: number; title: string }[] {
  const fallback = React.useMemo(() => visibleDocuments(def, buildScenario("complete", def).values).map((d) => ({ n: d.n, title: d.title })), [def]);
  const [live, setLive] = React.useState<DocListDetail | null>(() =>
    typeof window === "undefined" ? null : ((window as unknown as { __eAnudaanDocList?: DocListDetail }).__eAnudaanDocList ?? null),
  );
  React.useEffect(() => {
    const on = (e: Event) => setLive((e as CustomEvent<DocListDetail>).detail);
    window.addEventListener(DOC_LIST_EVENT, on);
    return () => window.removeEventListener(DOC_LIST_EVENT, on);
  }, []);
  return onUploadStep && live?.scheme === def.code ? live.documents : fallback;
}

function DocumentsSection({ def, router, onUploadStep, onDone }: { def: WizardDef; router: Router; onUploadStep: boolean; onDone: (s: string) => void }) {
  const docs = useChecklist(def, onUploadStep);
  const [docN, setDocN] = React.useState<string>(() => String(docs[0]?.n ?? ""));
  const doc = docs.find((d) => String(d.n) === docN) ?? docs[0];
  const choices = React.useMemo(() => (doc ? sampleChoices(doc.title) : []), [doc]);
  const [choiceId, setChoiceId] = React.useState<string>("valid");
  const choice = choices.find((c) => c.id === choiceId) ?? choices[0];

  const everywhereOptions = React.useMemo(() => {
    const ids = new Set(docs.flatMap((d) => sampleChoices(d.title).map((c) => c.id)));
    return DOC_CHECKS.filter((c) => ids.has(c.id));
  }, [docs]);
  const [everywhere, setEverywhere] = React.useState<string>(() => everywhereOptions[0]?.id ?? "");

  const place = (placements: SamplePlacement[], words: string) => {
    if (!placements.length) return;
    const detail = { scheme: def.code, placements };
    if (onUploadStep) {
      window.dispatchEvent(new CustomEvent(DEMO_PLACE_SAMPLES_EVENT, { detail }));
    } else {
      // From a form step: the answers the checks compare against go in first, then the step opens
      // and places the files as it mounts.
      window.dispatchEvent(new CustomEvent(DEMO_FILL_EVENT, { detail: { ...buildScenario("complete", def), docs: {} } }));
      try {
        window.sessionStorage.setItem(DEMO_PENDING_SAMPLES_KEY, JSON.stringify(detail));
      } catch {
        return;
      }
      router.push(`/portals/e-anudaan/apply-grant/scheme/${def.code}/step-2`);
    }
    onDone(words);
  };

  return (
    <div className="space-y-4">
      {!onUploadStep && (
        <p className="text-body-3 text-ink-muted">These fill the answers correctly too, and open Upload Documents.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => place(everyDocumentPasses(docs), `${docs.length} correct documents placed.`)}>
          Every Document Correct
        </Button>
        <Button size="sm" appearance="outlined" onClick={() => place(everyCheckAtOnce(docs), "A different check in every document.")}>
          Every Check at Once
        </Button>
      </div>

      <section className="space-y-2" aria-labelledby="demo-one-document">
        <h3 id="demo-one-document" className="text-body-2 font-semibold text-ink">
          One Document
        </h3>
        <FormField id="demo-sample-doc" label="Document">
          {(c) => (
            <Select {...c} size="sm" value={doc ? String(doc.n) : ""} onChange={(e) => { setDocN(e.target.value); setChoiceId("valid"); }}>
              {docs.map((d, i) => (
                <option key={d.n} value={String(d.n)}>
                  {i + 1}. {d.title}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField id="demo-sample-outcome" label="File">
          {(c) => (
            <Select {...c} size="sm" value={choice?.id ?? ""} onChange={(e) => setChoiceId(e.target.value)}>
              {OUTCOME_GROUPS.map((g) => {
                const inGroup = choices.filter((x) => x.outcome === g.outcome);
                return inGroup.length ? (
                  <optgroup key={g.outcome} label={g.label}>
                    {inGroup.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.label}
                      </option>
                    ))}
                  </optgroup>
                ) : null;
              })}
            </Select>
          )}
        </FormField>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            appearance="outlined"
            disabled={!doc || !choice}
            onClick={() => doc && choice && place([{ n: doc.n, ...choice.source }], `${choice.label}: placed in ${doc.title}.`)}
          >
            Place the File
          </Button>
          {choice?.source.url && !choice.source.padToKb && (
            <a className="text-body-3 text-[var(--sa-text-brand-primary-base)] underline-offset-2 hover:underline" href={choice.source.url} target="_blank" rel="noopener noreferrer" download={choice.source.fileName}>
              Download It
            </a>
          )}
        </div>
      </section>

      {everywhereOptions.length > 0 && (
        <section className="space-y-2" aria-labelledby="demo-one-check">
          <h3 id="demo-one-check" className="text-body-2 font-semibold text-ink">
            One Check, Everywhere
          </h3>
          <FormField id="demo-sample-check" label="Check">
            {(c) => (
              <Select {...c} size="sm" value={everywhere} onChange={(e) => setEverywhere(e.target.value)}>
                {everywhereOptions.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.label}
                  </option>
                ))}
              </Select>
            )}
          </FormField>
          <Button
            size="sm"
            appearance="outlined"
            onClick={() => {
              const placed = checkEverywhere(docs, everywhere as CheckId);
              place(placed, `${CHECK_BY_ID[everywhere as CheckId]?.label ?? "Check"}: placed in ${placed.length} of ${docs.length} documents.`);
            }}
          >
            Place in Every Document That Can Show It
          </Button>
        </section>
      )}

      {onUploadStep && (
        <Accordion variant="flush">
          <AccordionItem title="Hold a Document in One State">
            <div className="pt-2">
              <DemoDocumentStates />
            </div>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}

/* ── Journeys ────────────────────────────────────────────────────────────────────────────────── */

const JOURNEYS = ["docs-missing", "docs-verifying", "docs-review", "docs-rejected", "check-unavailable", "ready-to-submit"] as const;

function JourneysSection({ def, router, onDone }: { def: WizardDef; router: Router; onDone: (s: string) => void }) {
  const run = (id: string) => {
    window.dispatchEvent(new CustomEvent(DEMO_FILL_EVENT, { detail: buildScenario(id, def) }));
    router.push(routeForScenario(id, def.code));
    onDone(`${DEMO_SCENARIOS.find((s) => s.id === id)?.label ?? "State"} applied.`);
  };
  return (
    <ListGroup bordered size="sm" aria-label="Application states">
      {JOURNEYS.map((id) => {
        const s = DEMO_SCENARIOS.find((x) => x.id === id)!;
        return (
          <ListRow
            key={id}
            title={s.label}
            description={s.effect}
            trailing={
              <Button appearance="outlined" size="sm" onClick={() => run(id)} aria-label={`Apply: ${s.label}`}>
                Apply
              </Button>
            }
          />
        );
      })}
    </ListGroup>
  );
}
