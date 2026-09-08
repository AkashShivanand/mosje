"use client";

import * as React from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  EmptyState,
  Icon,
  Link,
  LiveRegion,
  Pagination,
  RadioGroup,
  SectionTitle,
  Select,
  Stepper,
  useLiveRegion,
} from "@mosje/design-system";
import {
  DEPWD,
  GROUPS,
  JURISDICTION_LABEL,
  NEEDS,
  STAGES,
  STATES,
  matchSchemes,
  type Answers,
  type GroupId,
  type NeedId,
  type Scheme,
  type StageId,
} from "./schemes";
import "./scheme-finder.css";

/**
 * SCHEMES FOR YOUR SITUATION — the home-page finder, as a website section.
 *
 * DS Audit: SectionTitle ✅ · Stepper ✅ · RadioGroup (card) ✅ · Select ✅ ·
 * Chip ✅ · Button ✅ · Card ✅ · Badge ✅ · Alert ✅ · EmptyState ✅ · Link ✅ ·
 * LiveRegion ✅ · Icon ✅. Nothing hand-rolled but the layout and the scheme
 * row's fact list.
 *
 * ── WHAT IT REPLACES ────────────────────────────────────────────────────────
 *
 * The first "Find support for you" was a static page in an iframe: its own
 * stylesheet, its own buttons, and a voice — "You told us", "Show what I can
 * apply for", "we ask so we can" — that belonged to a product and not to a
 * Department. This is the same decision drawn again as the website would
 * actually build it: the estate's components, the estate's tokens, and copy in
 * the register `ui-restraint-and-copy.md` sets.
 *
 * ── THE FOUR QUESTIONS, AND WHY NOT FIVE ────────────────────────────────────
 *
 * The earlier version opened with "Who is this for? Myself / Someone in my
 * family / An organisation I run". Nothing downstream read that answer; it was
 * a question asked to feel considerate. Every question here changes the list:
 * the group, the stage of life, the kind of help, and the State — the four axes
 * of the eligibility model in the handoff, in the order a citizen thinks of
 * them. Any may be left unanswered, and leaving one unanswered widens the list
 * rather than ending it.
 *
 * ── THE STEPPER IS ALSO THE SUMMARY ─────────────────────────────────────────
 *
 * A finished stage shows the answer given as its description, so the reader
 * can see everything they have said without a second "your answers" panel,
 * and can return to any finished stage by selecting it. On the answer screen
 * the same answers appear as dismissable chips: removing one widens the list
 * in place, which is the cheapest way back from "nothing lists all of these".
 *
 * ── TWO RULES THE COPY KEEPS ────────────────────────────────────────────────
 *
 * No screen says anyone is eligible: a scheme LISTS a group, and the sanctioning
 * authority decides an application (`lib/chatbot/content.ts`). And nothing on
 * screen counts schemes — a count on a prototype is a number a reader will take
 * as published (decision recorded in the handoff, §6).
 */

type Step = 0 | 1 | 2 | 3;
const ANSWER = 4;
const STEP_LABELS = [
  "Group",
  "Stage of Life",
  "Kind of Help",
  "State or UT",
  "Schemes",
] as const;

const NOT_ANSWERED = "Not answered";
const PAGE_SIZE = 6;

function labelOf<Id extends string>(
  list: readonly { id: Id; label: string }[],
  id: Id | undefined,
) {
  return id ? list.find((o) => o.id === id)?.label : undefined;
}

export function SchemeFinder(): React.JSX.Element {
  const [step, setStep] = React.useState<number>(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const { ref: liveRef, announce } = useLiveRegion();

  /* Focus follows the question, so a keyboard or screen-reader user lands on
     what changed and not on whichever control happened to keep focus. Skipped
     on the first render: stealing focus from the page on load is a defect. */
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (next: number, message: string) => {
    setStep(next);
    announce(message);
  };

  const descriptions: (string | undefined)[] = [
    step > 0 ? (labelOf(GROUPS, answers.group) ?? NOT_ANSWERED) : undefined,
    step > 1 ? (labelOf(STAGES, answers.stage) ?? NOT_ANSWERED) : undefined,
    step > 2 ? (labelOf(NEEDS, answers.need) ?? NOT_ANSWERED) : undefined,
    step > 3 ? (answers.state ?? NOT_ANSWERED) : undefined,
    undefined,
  ];

  const steps = STEP_LABELS.map((label, i) => ({
    label,
    description: descriptions[i],
  }));

  const isSignpost = answers.group === "pwd";

  const next = () => {
    /* Disability is another department's remit: the remaining questions cannot
       change that answer, so the finder goes straight to the signpost. */
    if (step === 0 && isSignpost) {
      go(
        ANSWER,
        "Support for persons with disabilities is provided by a different department.",
      );
      return;
    }
    const n = step + 1;
    go(
      n,
      n === ANSWER
        ? "Schemes matching the answers given."
        : `Question ${n + 1} of 4. ${QUESTION_TEXT[n as Step]}`,
    );
  };

  const back = () => {
    const n = Math.max(0, step - 1);
    go(n, `Question ${n + 1} of 4. ${QUESTION_TEXT[n as Step]}`);
  };

  const restart = () => {
    setAnswers({});
    go(0, `Question 1 of 4. ${QUESTION_TEXT[0]}`);
  };

  return (
    <section className="xsf" aria-labelledby="xsf-title">
      <div className="sa-container">
        <SectionTitle
          eyebrow="Schemes & Services"
          title="Schemes for Your Situation"
          headingId="xsf-title"
          description="Answer up to four short questions about who the scheme is for, the stage of life, the kind of help required and the State. Each answer narrows the list; any question may be left unanswered."
        />

        <div className="xsf__body">
          {/* The original's segmented progress bar, as the design system draws
              progress: one row above the panel, the answer beneath each finished
              stage, and a finished stage reopenable from the row. */}
          <Stepper
            steps={steps}
            current={step}
            size="sm"
            ariaLabel="Questions"
            onStepSelect={(i) =>
              go(i, `Question ${i + 1} of 4. ${QUESTION_TEXT[i as Step]}`)
            }
          />

          <div
            className={
              step === ANSWER ? "xsf__panel xsf__panel--answer" : "xsf__panel"
            }
          >
            {step === ANSWER ? (
              <AnswerPanel
                key={`${answers.group}|${answers.stage}|${answers.need}|${answers.state}`}
                answers={answers}
                signpost={isSignpost}
                onRemove={(key) => {
                  setAnswers((a) => ({ ...a, [key]: undefined }));
                  announce("Answer removed. The list has widened.");
                }}
                onChange={() => go(0, `Question 1 of 4. ${QUESTION_TEXT[0]}`)}
                onRestart={restart}
              />
            ) : (
              <div className="xsf__step" key={step}>
                <p className="xsf__count">Question {step + 1} of 4</p>
                <h3 className="xsf__question" ref={headingRef} tabIndex={-1}>
                  {QUESTION_TEXT[step as Step]}
                </h3>
                <p className="xsf__hint">{HINT_TEXT[step as Step]}</p>

                <div className="xsf__options">
                  {step === 0 && (
                    <RadioGroup
                      name="xsf-group"
                      legend={QUESTION_TEXT[0]}
                      hideLegend
                      variant="card"
                      orientation="horizontal"
                      value={answers.group}
                      onChange={(v) =>
                        setAnswers((a) => ({ ...a, group: v as GroupId }))
                      }
                      options={GROUPS.map((g) => ({
                        value: g.id,
                        label: g.label,
                        description: g.description,
                        icon: <Icon name={g.icon} size={24} aria-hidden />,
                      }))}
                    />
                  )}
                  {step === 1 && (
                    <RadioGroup
                      name="xsf-stage"
                      legend={QUESTION_TEXT[1]}
                      hideLegend
                      variant="card"
                      orientation="horizontal"
                      value={answers.stage}
                      onChange={(v) =>
                        setAnswers((a) => ({ ...a, stage: v as StageId }))
                      }
                      options={STAGES.map((s) => ({
                        value: s.id,
                        label: s.label,
                        description: s.description,
                        icon: <Icon name={s.icon} size={24} aria-hidden />,
                      }))}
                    />
                  )}
                  {step === 2 && (
                    <RadioGroup
                      name="xsf-need"
                      legend={QUESTION_TEXT[2]}
                      hideLegend
                      variant="card"
                      orientation="horizontal"
                      value={answers.need}
                      onChange={(v) =>
                        setAnswers((a) => ({ ...a, need: v as NeedId }))
                      }
                      options={NEEDS.map((n) => ({
                        value: n.id,
                        label: n.label,
                        description: n.description,
                        icon: <Icon name={n.icon} size={24} aria-hidden />,
                      }))}
                    />
                  )}
                  {step === 3 && (
                    <div className="xsf__select">
                      <Select
                        aria-label={QUESTION_TEXT[3]}
                        placeholder="Choose a State or Union Territory"
                        value={answers.state ?? ""}
                        onChange={(e) => {
                          /* Read before the updater runs: React has released
                             the event by the time a queued updater executes. */
                          const state = e.currentTarget.value || undefined;
                          setAnswers((a) => ({ ...a, state }));
                        }}
                        options={STATES.map((s) => ({ value: s, label: s }))}
                      />
                    </div>
                  )}
                </div>

                <div className="xsf__actions">
                  {step > 0 && (
                    <Button
                      variant="neutral"
                      appearance="outlined"
                      onClick={back}
                      iconLeft={
                        <Icon name="arrow_back" size={20} aria-hidden />
                      }
                    >
                      Back
                    </Button>
                  )}
                  <div className="xsf__actions-end">
                    <Button variant="neutral" appearance="text" onClick={next}>
                      Leave Unanswered
                    </Button>
                    <Button
                      onClick={next}
                      iconRight={
                        <Icon
                          name={step === 3 ? "list_alt" : "arrow_forward"}
                          size={20}
                          aria-hidden
                        />
                      }
                    >
                      {step === 3 ? "Show Schemes" : "Continue"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="xsf__rail-note">
            A scheme listing a group as its target group is not a decision on an
            application; the sanctioning authority decides. Nothing entered here
            is stored.
          </p>
        </div>
      </div>
      <LiveRegion ref={liveRef} />
    </section>
  );
}

const QUESTION_TEXT: Record<Step, string> = {
  0: "Who is the scheme for?",
  1: "Which stage of life applies?",
  2: "What kind of help is needed?",
  3: "Which State or Union Territory?",
};

const HINT_TEXT: Record<Step, string> = {
  0: "Choose the group the Department lists. Persons with disabilities are directed to the department that serves them.",
  1: "Leave unanswered to see schemes at every stage.",
  2: "Choose the closest. It can be changed afterwards.",
  3: "Central schemes apply in every State. Where a State runs its own schemes for the same groups, they are shown for the State chosen.",
};

/* ── The answer ─────────────────────────────────────────────────────────── */

function AnswerPanel({
  answers,
  signpost,
  onRemove,
  onChange,
  onRestart,
}: {
  answers: Answers;
  signpost: boolean;
  onRemove: (key: keyof Answers) => void;
  onChange: () => void;
  onRestart: () => void;
}) {
  const schemes = signpost ? [] : matchSchemes(answers);
  /* Paged, never scrolled inside the panel (`data-state-completeness.md` §4).
     Six keeps the panel to about one screen; one answer alone can list
     fourteen schemes, and a page that grows to three screens for a single
     answer is the "too much" state left undesigned. The page resets whenever
     the list changes, so a removed answer never leaves the reader on page 3
     of a list that now has one — the parent keys this panel on the answers. */
  const [page, setPage] = React.useState(1);
  const topRef = React.useRef<HTMLHeadingElement>(null);
  const changePage = (n: number) => {
    setPage(n);
    /* A new page starts at its top, not at the pager the reader just pressed. */
    topRef.current?.focus();
  };
  const totalPages = Math.max(1, Math.ceil(schemes.length / PAGE_SIZE));
  const shown = schemes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const chips = (
    [
      { key: "group", label: labelOf(GROUPS, answers.group) ?? "" },
      { key: "stage", label: labelOf(STAGES, answers.stage) ?? "" },
      { key: "need", label: labelOf(NEEDS, answers.need) ?? "" },
      { key: "state", label: answers.state ?? "" },
    ] as const satisfies readonly { key: keyof Answers; label: string }[]
  ).filter((c) => c.label);

  return (
    <div className="xsf__step">
      <p className="xsf__count">Schemes</p>
      <h3 className="xsf__question" tabIndex={-1} ref={topRef}>
        {signpost
          ? "Support for Persons with Disabilities"
          : "Schemes Matching the Answers Given"}
      </h3>
      <p className="xsf__hint">
        {signpost
          ? "Schemes for persons with disabilities are run by a separate department of the same Ministry."
          : "Each scheme names the group it is for. Remove an answer to widen the list."}
      </p>

      {chips.length > 0 && (
        <div className="xsf__answers">
          <span className="xsf__answers-label">Answers</span>
          {chips.map((c) => (
            <Chip
              key={c.key}
              size="sm"
              onDismiss={() => onRemove(c.key)}
              dismissLabel={`Remove ${c.label}`}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      )}

      {signpost ? (
        <div className="xsf__signpost">
          <Alert
            status="info"
            title={DEPWD.name}
            action={
              <Link href={DEPWD.href} external variant="standalone">
                Go to depwd.gov.in
              </Link>
            }
          >
            The Department of Empowerment of Persons with Disabilities runs the
            schemes for persons with disabilities, including the Unique
            Disability ID. This Department does not.
          </Alert>
        </div>
      ) : schemes.length === 0 ? (
        <div className="xsf__empty">
          <EmptyState
            icon={<Icon name="search_off" size={40} aria-hidden />}
            title="No scheme in the register lists all of these together"
            description="Remove one of the answers above to widen the list. The kind of help is usually the answer to remove first."
            action={
              <Button
                variant="neutral"
                appearance="outlined"
                onClick={onChange}
              >
                Change Answers
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <ul className="xsf__list">
            {shown.map((s) => (
              <li key={s.id}>
                <SchemeRow scheme={s} />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="xsf__pager">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={changePage}
                label="Scheme pages"
                size="sm"
              />
            </div>
          )}
        </>
      )}

      <div className="xsf__actions">
        <Button
          variant="neutral"
          appearance="outlined"
          onClick={onChange}
          iconLeft={<Icon name="edit" size={20} aria-hidden />}
        >
          Change Answers
        </Button>
        <div className="xsf__actions-end">
          <Button variant="neutral" appearance="text" onClick={onRestart}>
            Start Again
          </Button>
        </div>
      </div>
    </div>
  );
}

function SchemeRow({ scheme: s }: { scheme: Scheme }) {
  const jurisdiction =
    s.jurisdiction.kind === "state"
      ? `${JURISDICTION_LABEL.state} · ${s.jurisdiction.state}`
      : JURISDICTION_LABEL[s.jurisdiction.kind];

  return (
    <Card className="xsf__scheme">
      <CardBody>
        <div className="xsf__scheme-head">
          <h4 className="xsf__scheme-title">{s.title}</h4>
          <div className="xsf__tags">
            <Badge
              status={s.jurisdiction.kind === "state" ? "warning" : "primary"}
            >
              {jurisdiction}
            </Badge>
            {s.runBy && <Badge status="neutral">{s.runBy}</Badge>}
          </div>
        </div>
        <dl className="xsf__facts">
          <dt>For</dt>
          <dd>{s.forWhom}</dd>
          <dt>Provides</dt>
          <dd>{s.provides}</dd>
        </dl>
        <div className="xsf__scheme-actions">
          <Link href={s.url} external variant="standalone" size="sm">
            Scheme details
          </Link>
          {s.apply &&
            (s.apply.kind === "phone" ? (
              <Button
                size="sm"
                appearance="outlined"
                href={s.apply.href}
                iconLeft={<Icon name="call" size={16} aria-hidden />}
              >
                {s.apply.label}
              </Button>
            ) : (
              <Button
                size="sm"
                appearance="outlined"
                href={s.apply.href}
                external
              >
                {s.apply.label}
              </Button>
            ))}
        </div>
      </CardBody>
    </Card>
  );
}
