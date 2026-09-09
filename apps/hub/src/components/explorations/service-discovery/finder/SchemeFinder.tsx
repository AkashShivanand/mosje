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
  Stepper,
  useLiveRegion,
} from "@mosje/design-system";
import {
  SD_DEPWD,
  SD_OFFERINGS,
  SD_PERSONAS,
  SD_ROUTES,
  SD_SIGNPOST,
  sdMatch,
  sdApplyLabel,
  sdOffersFor,
  type SdScheme,
} from "@/lib/explorations/service-discovery-master";
import "./scheme-finder.css";

/**
 * FIND SCHEMES FOR YOU — the home-page finder, as a website section.
 *
 * DS Audit: SectionTitle ✅ · Stepper ✅ · RadioGroup (card) ✅ · Chip ✅ ·
 * Button ✅ · Card ✅ · Badge ✅ · Alert ✅ · EmptyState ✅ · Link ✅ ·
 * LiveRegion ✅ · Icon ✅ · Pagination ✅. Nothing hand-rolled but the layout
 * and the scheme row's fact list.
 *
 * ── TWO QUESTIONS, AND WHY NOT FOUR ─────────────────────────────────────────
 *
 * The previous version asked four: the group, the stage of life, the kind of
 * help and the State. The 8 September 2026 review cut it to two. Stage of life
 * is already inside the persona — "Students" covers school and college, and
 * senior citizens are a persona of their own. None of the Department's schemes
 * is State-specific: they are Central schemes the States implement. And a
 * question that changes nothing downstream is a question a citizen answers for
 * no reason. So: who is looking for support, and what kind of support.
 *
 * ── ONE LIST ───────────────────────────────────────────────────────────────
 *
 * The personas, the offerings and the schemes are read from
 * `lib/explorations/service-discovery-master.ts`, generated from the scheme
 * master in `docs/research`. The static prototypes and the assistant read the
 * same master, so no two options can name different schemes for one person.
 *
 * ── TWO RULES THE COPY KEEPS ────────────────────────────────────────────────
 *
 * No screen says anyone is eligible: a scheme NAMES a group, and the sanctioning
 * authority decides an application (`lib/chatbot/content.ts`). And nothing on
 * screen counts schemes — a count on a prototype is a number a reader will take
 * as published (decision recorded in the handoff, §6, and again on 8 September).
 */

const ANSWER = 2;
const STEP_LABELS = ["Who It Is For", "What It Provides", "Schemes"] as const;
const NOT_ANSWERED = "Not answered";
const PAGE_SIZE = 6;

/** Material Symbols for the personas and offerings — what a scheme gives, never a face. */
const PERSONA_ICON: Record<string, string> = {
  student: "school",
  sc: "groups",
  obc: "diversity_3",
  dnt: "hiking",
  safai: "cleaning_services",
  senior: "elderly",
  tg: "transgender",
  drug: "health_and_safety",
  begging: "night_shelter",
  atrocity: "balance",
  ngo: "volunteer_activism",
  pwd: "accessible",
};
const OFFERING_ICON: Record<string, string> = {
  scholarship: "school",
  schooling: "apartment",
  loan: "account_balance",
  skill: "construction",
  care: "home_health",
  deaddiction: "medication",
  protection: "gavel",
  grant: "handshake",
};

interface Answers {
  who?: string;
  offer?: string;
}

const QUESTION_TEXT = ["Who Is Looking for Support?", "What Kind of Support?"] as const;
const HINT_TEXT = [
  "Choose the one that describes you. Persons with disabilities are directed to the department that serves them.",
  "Only what the Department provides for that group is listed. Leave unanswered to see all of it.",
] as const;

const personaLabel = (id?: string) =>
  id === SD_SIGNPOST.id ? SD_SIGNPOST.label : SD_PERSONAS.find((p) => p.id === id)?.label;
const offeringLabel = (id?: string) => SD_OFFERINGS.find((o) => o.id === id)?.label;

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

  const isSignpost = answers.who === SD_SIGNPOST.id;

  const steps = STEP_LABELS.map((label, i) => ({
    label,
    description:
      i === 0 && step > 0
        ? (personaLabel(answers.who) ?? NOT_ANSWERED)
        : i === 1 && step > 1
          ? (offeringLabel(answers.offer) ?? NOT_ANSWERED)
          : undefined,
  }));

  const next = () => {
    /* Disability is another department's remit: the second question cannot
       change that answer, so the finder goes straight to the signpost. */
    if (step === 0 && isSignpost) {
      go(ANSWER, "Support for persons with disabilities is provided by a different department.");
      return;
    }
    const n = step + 1;
    go(n, n === ANSWER ? "Schemes that name the group chosen." : `Question 2 of 2. ${QUESTION_TEXT[1]}`);
  };

  const back = () => go(0, `Question 1 of 2. ${QUESTION_TEXT[0]}`);

  const restart = () => {
    setAnswers({});
    go(0, `Question 1 of 2. ${QUESTION_TEXT[0]}`);
  };

  const offers = answers.who && !isSignpost ? sdOffersFor(answers.who) : [];

  return (
    <section className="xsf" aria-labelledby="xsf-title">
      <div className="sa-container">
        <SectionTitle
          eyebrow="Schemes & Services"
          title="Find Schemes for You"
          headingId="xsf-title"
          description="Two short questions: who the scheme is for, and what kind of support. The second may be left unanswered. Nothing entered here is stored."
        />

        <div className="xsf__body">
          <Stepper
            steps={steps}
            current={step}
            size="sm"
            ariaLabel="Questions"
            onStepSelect={(i) => {
              if (i === 1 && !answers.who) return;
              go(i, i === ANSWER ? "Schemes that name the group chosen." : `Question ${i + 1} of 2. ${QUESTION_TEXT[i as 0 | 1]}`);
            }}
          />

          <div className={step === ANSWER ? "xsf__panel xsf__panel--answer" : "xsf__panel"}>
            {step === ANSWER ? (
              <AnswerPanel
                key={`${answers.who}|${answers.offer}`}
                answers={answers}
                signpost={isSignpost}
                onRemoveOffer={() => {
                  setAnswers((a) => ({ ...a, offer: undefined }));
                  announce("Answer removed. The list has widened.");
                }}
                onChange={() => go(0, `Question 1 of 2. ${QUESTION_TEXT[0]}`)}
                onRestart={restart}
              />
            ) : (
              <div className="xsf__step" key={step}>
                <p className="xsf__count">Question {step + 1} of 2</p>
                <h3 className="xsf__question" ref={headingRef} tabIndex={-1}>
                  {QUESTION_TEXT[step as 0 | 1]}
                </h3>
                <p className="xsf__hint">{HINT_TEXT[step as 0 | 1]}</p>

                <div className="xsf__options">
                  {step === 0 && (
                    <RadioGroup
                      name="xsf-who"
                      legend={QUESTION_TEXT[0]}
                      hideLegend
                      variant="card"
                      orientation="horizontal"
                      value={answers.who}
                      onChange={(v) => setAnswers({ who: v })}
                      options={[
                        ...SD_PERSONAS.map((g) => ({
                          value: g.id,
                          label: g.label,
                          description: g.sub,
                          icon: <Icon name={PERSONA_ICON[g.id] ?? "person"} size={24} aria-hidden />,
                        })),
                        {
                          value: SD_SIGNPOST.id,
                          label: SD_SIGNPOST.label,
                          description: SD_SIGNPOST.sub,
                          icon: <Icon name={PERSONA_ICON.pwd ?? "accessible"} size={24} aria-hidden />,
                        },
                      ]}
                    />
                  )}
                  {step === 1 && (
                    <RadioGroup
                      name="xsf-offer"
                      legend={QUESTION_TEXT[1]}
                      hideLegend
                      variant="card"
                      orientation="horizontal"
                      value={answers.offer}
                      onChange={(v) => setAnswers((a) => ({ ...a, offer: v }))}
                      options={offers.map((o) => ({
                        value: o.id,
                        label: o.label,
                        description: o.sub,
                        icon: <Icon name={OFFERING_ICON[o.id] ?? "category"} size={24} aria-hidden />,
                      }))}
                    />
                  )}
                </div>

                <div className="xsf__actions">
                  {step > 0 && (
                    <Button
                      variant="neutral"
                      appearance="outlined"
                      onClick={back}
                      iconLeft={<Icon name="arrow_back" size={20} aria-hidden />}
                    >
                      Back
                    </Button>
                  )}
                  <div className="xsf__actions-end">
                    {step === 1 && (
                      <Button variant="neutral" appearance="text" onClick={next}>
                        Leave Unanswered
                      </Button>
                    )}
                    <Button
                      onClick={next}
                      disabled={step === 0 && !answers.who}
                      iconRight={<Icon name={step === 1 ? "list_alt" : "arrow_forward"} size={20} aria-hidden />}
                    >
                      {step === 1 ? "Show Schemes" : "Continue"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="xsf__rail-note">
            A scheme naming a group as its target group is not a decision on an
            application; the sanctioning authority decides. Nothing entered here
            is stored.
          </p>
        </div>
      </div>
      <LiveRegion ref={liveRef} />
    </section>
  );
}

/* ── The answer ─────────────────────────────────────────────────────────── */

function AnswerPanel({
  answers,
  signpost,
  onRemoveOffer,
  onChange,
  onRestart,
}: {
  answers: Answers;
  signpost: boolean;
  onRemoveOffer: () => void;
  onChange: () => void;
  onRestart: () => void;
}) {
  const schemes = signpost ? [] : sdMatch(answers.who, answers.offer);
  /* Paged, never scrolled inside the panel (`data-state-completeness.md` §4).
     The page resets whenever the list changes — the parent keys this panel on
     the answers — so a removed answer never leaves the reader on page 3 of a
     list that now has one. */
  const [page, setPage] = React.useState(1);
  const topRef = React.useRef<HTMLHeadingElement>(null);
  const changePage = (n: number) => {
    setPage(n);
    topRef.current?.focus();
  };
  const totalPages = Math.max(1, Math.ceil(schemes.length / PAGE_SIZE));
  const shown = schemes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const who = personaLabel(answers.who);
  const offer = offeringLabel(answers.offer);

  return (
    <div className="xsf__step">
      <p className="xsf__count">Schemes</p>
      <h3 className="xsf__question" tabIndex={-1} ref={topRef}>
        {signpost ? "Schemes for Persons with Disabilities" : "Schemes for Your Group"}
      </h3>
      <p className="xsf__hint">
        {signpost
          ? "Schemes for persons with disabilities are run by a separate department of the same Ministry."
          : "Each scheme names the group chosen. The application is made where the scheme says."}
      </p>

      {(who || offer) && (
        <div className="xsf__answers">
          <span className="xsf__answers-label">Chosen</span>
          {who && (
            <Chip size="sm">{who}</Chip>
          )}
          {offer && (
            <Chip size="sm" onDismiss={onRemoveOffer} dismissLabel={`Remove ${offer}`}>
              {offer}
            </Chip>
          )}
        </div>
      )}

      {signpost ? (
        <>
          <div className="xsf__signpost">
            <Alert
              status="info"
              title="These schemes are run by a different Department"
              action={
                <Link href={`https://${SD_SIGNPOST.to}`} external variant="standalone">
                  Go to {SD_SIGNPOST.to}
                </Link>
              }
            >
              The Department of Empowerment of Persons with Disabilities, a separate
              Department of the same Ministry, runs the schemes for persons with
              disabilities and issues the Unique Disability ID. They are listed here so
              that nobody is turned away empty-handed.
            </Alert>
          </div>
          <ul className="xsf__list">
            {SD_DEPWD.schemes.map((s) => (
              <li key={s.id}>
                <Card className="xsf__scheme">
                  <CardBody>
                    <div className="xsf__scheme-head">
                      <h4 className="xsf__scheme-title">{s.name}</h4>
                      <div className="xsf__tags">
                        <Badge status="warning">Run by DEPwD</Badge>
                      </div>
                    </div>
                    <dl className="xsf__facts">
                      <dt>For</dt>
                      <dd>{s.named}</dd>
                      <dt>Provides</dt>
                      <dd>{s.provides}</dd>
                    </dl>
                    <div className="xsf__scheme-actions">
                      <Link href={`https://${SD_SIGNPOST.to}`} external variant="standalone" size="sm">
                        Open on {SD_SIGNPOST.to}
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </>
      ) : schemes.length === 0 ? (
        <div className="xsf__empty">
          <EmptyState
            icon={<Icon name="search_off" size={40} aria-hidden />}
            title="No scheme in the Department's record provides that for this group"
            description="Remove the second answer to see everything the Department provides for the group."
            action={
              <Button variant="neutral" appearance="outlined" onClick={onRemoveOffer}>
                Remove the Second Answer
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

function SchemeRow({ scheme: s }: { scheme: SdScheme }) {
  const route = SD_ROUTES[s.apply[0] ?? ""];
  const isPhone = route?.href?.startsWith("tel:") ?? false;

  return (
    <Card className="xsf__scheme">
      <CardBody>
        <div className="xsf__scheme-head">
          <h4 className="xsf__scheme-title">{s.name}</h4>
          <div className="xsf__tags">
            <Badge status="primary">{s.type}</Badge>
            {s.umbrella && <Badge status="neutral">{s.umbrella}</Badge>}
          </div>
        </div>
        <dl className="xsf__facts">
          <dt>For</dt>
          <dd>{s.named}</dd>
          <dt>Provides</dt>
          <dd>{s.provides}</dd>
        </dl>
        <div className="xsf__scheme-actions">
          {s.page && (
            <Link href={s.page} external variant="standalone" size="sm">
              Scheme details
            </Link>
          )}
          {route &&
            (route.href ? (
              <Button
                size="sm"
                appearance="outlined"
                href={route.href}
                external={!isPhone}
                iconLeft={isPhone ? <Icon name="call" size={16} aria-hidden /> : undefined}
              >
                {sdApplyLabel(s.apply[0])}
              </Button>
            ) : (
              <span className="xsf__route">Applied through {route.label}</span>
            ))}
        </div>
      </CardBody>
    </Card>
  );
}
