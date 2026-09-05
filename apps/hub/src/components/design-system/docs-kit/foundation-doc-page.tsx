import * as React from "react";
import Link from "next/link";

import { A11yChecklist, type A11yItem } from "./a11y-checklist";
import { DocsTabs } from "./docs-tabs";
import { FeedbackBar } from "./feedback-bar";
import { FoundationTokenTable } from "./foundation-token-table";
import { StatusBadge, type Status } from "./status-badge";
import type { FigmaSource, RelatedComponent } from "./component-doc-page";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import type { FoundationTokenRow } from "@/lib/design-system/foundations-data.generated";

/**
 * ONE SHAPE FOR EVERY FOUNDATION PAGE — the foundations analogue of `ComponentDocPage`.
 *
 * The census on 2026-09-04 found the eleven foundation pages built on FIVE different
 * page shells, none carrying a maturity badge, tabs or a feedback bar (0 of 11 on the
 * six-element standard), "Tokens" landing anywhere from third to sixth, heading titles
 * split between claim-shaped ("Why the margin is out of step with the cap") and folder
 * nouns ("Tokens", "Guidance"), and two pages hand-typing the very values they documented
 * — the Elevation page printing three of six roles with a shadow ink retired a month
 * earlier, the Motion page hard-coding its own durations under a table of the tokens for
 * them. The colour and typography pages were the exceptions, and they were exceptions
 * because their data was GENERATED.
 *
 * This template makes that the rule. What a reader meets, in order:
 *
 *   1. eyebrow + name + maturity     what am I looking at, can I rely on it
 *   2. summary                       what it is, in the department's register
 *   3. Figma link OR declared absence the design source — or the honest sentence that this
 *                                    foundation is code-only (layering has no canvas axis)
 *   4. at a glance                   three to six COUNTED numbers, from the generated data
 *   5. Overview / Tokens / A11y tabs numbered, claim-titled sections; the generated token
 *                                    table; the criteria and the standards register
 *   6. related foundations           the way out to the next thing
 *   7. feedback bar                  a way to say the page is wrong
 *
 * NOTHING HERE TAKES AN INLINE STYLE. Every rule lives in `docs-kit.css` under `.fdp*`,
 * bound to `--sa-*`. Section titles are CLAIMS, not folder nouns: "Twelve intents, and you
 * never pick a duration", never "Tokens". Numbered `NN / KEYWORD` eyebrows mirror the
 * Figma documentation grammar (`figma-documentation-style.md` §4) so the two surfaces read
 * as one document.
 */

export interface GlanceStat {
  /** A number you counted or measured — never a round-sounding estimate. */
  value: string | number;
  label: string;
  note?: string;
}

export interface FoundationSection {
  id: string;
  /** One uppercase word naming the section's subject — INTENTS, LADDER, STANDARDS. */
  keyword: string;
  /** A claim, in Title Case. */
  title: string;
  /** One or two sentences, government register. */
  description?: string;
  content: React.ReactNode;
}

export interface StandardsRow {
  /** e.g. "DBIM 3.0 §4 iii" */
  clause: string;
  says: string;
  does: string;
  why: string;
}

export interface FoundationDocPageProps {
  name: string;
  status: Status;
  summary: string;
  figma: FigmaSource;
  since?: string;
  glance: GlanceStat[];
  /** Overview tab — numbered sections in reading order. */
  sections: FoundationSection[];
  /** Tokens tab — the generated rows for this foundation. */
  tokens: FoundationTokenRow[];
  /** Tokens tab — one paragraph on how the names are built, above the table. */
  tokensIntro?: React.ReactNode;
  /** Tokens tab — anything below the table: a naming diagram, a migration note. */
  tokensExtra?: React.ReactNode;
  a11y: A11yItem[];
  /** Deviations from DBIM / GIGW / UX4G, with the clause cited. Empty means none. */
  standards?: StandardsRow[];
  /** Accessibility tab — anything below the checklist and the register. */
  accessibility?: React.ReactNode;
  related?: RelatedComponent[];
}

const pad = (n: number): string => String(n).padStart(2, "0");

export function FoundationDocPage({
  name,
  status,
  summary,
  figma,
  since,
  glance,
  sections,
  tokens,
  tokensIntro,
  tokensExtra,
  a11y,
  standards,
  accessibility,
  related,
}: FoundationDocPageProps): React.JSX.Element {
  return (
    <article className="docs-article fdp">
      <header className="fdp__header">
        <p className="fdp__eyebrow">
          <span>Foundations</span>
          <span className="fdp__pill">SAMAVESH</span>
        </p>
        <div className="fdp__titlerow">
          <h1 className="fdp__title">{name}</h1>
          <StatusBadge status={status} />
        </div>
        <p className="fdp__summary">{summary}</p>
        <div className="fdp__meta">
          {figma.node ? (
            <a className="fdp__figma" href={figmaUrl(FIGMA_NODES[figma.node])} target="_blank" rel="noopener noreferrer">
              Figma Foundation Page <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <p className="fdp__figma-absent">{figma.absent}</p>
          )}
          {since ? (
            <p className="fdp__since">
              Current contract since <strong>v{since}</strong>
            </p>
          ) : null}
        </div>

        {glance.length ? (
          <dl className="fdp__glance" aria-label={`${name} at a glance`}>
            {glance.map((g) => (
              <div key={g.label} className="fdp__stat">
                <dt className="fdp__stat-label">{g.label}</dt>
                <dd className="fdp__stat-value">{g.value}</dd>
                {g.note ? <dd className="fdp__stat-note">{g.note}</dd> : null}
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      <DocsTabs
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="fdp__tabbody">
                <nav className="fdp__toc" aria-label="On this page">
                  <ol>
                    {sections.map((s, i) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`}>
                          <span className="fdp__toc-n">{pad(i + 1)}</span> {s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                {sections.map((s, i) => (
                  <section key={s.id} id={s.id} className="fdp__section" aria-labelledby={`${s.id}-h`}>
                    <header className="fdp__section-head">
                      <p className="fdp__section-eyebrow">
                        {pad(i + 1)} / {s.keyword}
                      </p>
                      <h2 id={`${s.id}-h`} className="fdp__h2">
                        {s.title}
                      </h2>
                      {s.description ? <p className="fdp__section-desc">{s.description}</p> : null}
                    </header>
                    <div className="fdp__section-body">{s.content}</div>
                  </section>
                ))}
              </div>
            ),
          },
          {
            id: "tokens",
            label: "Tokens",
            content: (
              <div className="fdp__tabbody">
                <section className="fdp__section" aria-labelledby="fdp-tokens-h">
                  <header className="fdp__section-head">
                    <p className="fdp__section-eyebrow">TOKENS / CONTRACT</p>
                    <h2 id="fdp-tokens-h" className="fdp__h2">
                      Every Token, Its Value, and Where It Lives
                    </h2>
                    <p className="fdp__section-desc">
                      {tokensIntro ??
                        "Read from the build, never typed. Tier 2 is the public contract you bind in code and in Figma; Tier 1 is the private ladder beneath it, shown so the alias chain is visible and banned in app code by the tier-discipline gate."}
                    </p>
                  </header>
                  {/* A foundation with no token family of its own (illustration, brand) says so in
                      tokensIntro and carries its contract in tokensExtra; an empty table would read
                      as a broken build. */}
                  {tokens.length ? <FoundationTokenTable rows={tokens} /> : null}
                  {tokensExtra ? <div className="fdp__section-body">{tokensExtra}</div> : null}
                </section>
              </div>
            ),
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="fdp__tabbody">
                <section className="fdp__section" aria-labelledby="fdp-a11y-h">
                  <header className="fdp__section-head">
                    <p className="fdp__section-eyebrow">A11Y / CRITERIA</p>
                    <h2 id="fdp-a11y-h" className="fdp__h2">
                      Criteria This Foundation Carries
                    </h2>
                  </header>
                  <A11yChecklist items={a11y} />
                </section>
                <section className="fdp__section" aria-labelledby="fdp-standards-h">
                  <header className="fdp__section-head">
                    <p className="fdp__section-eyebrow">STANDARDS / REGISTER</p>
                    <h2 id="fdp-standards-h" className="fdp__h2">
                      Where This Departs From DBIM, GIGW or UX4G, and Why
                    </h2>
                    <p className="fdp__section-desc">
                      Authority order is quality (incl. WCAG 2.2 AA), then DBIM, GIGW, UX4G. A standard&rsquo;s list is a floor,
                      not a ceiling: the estate adds what is missing and never deletes what quality needs. Each row is a recorded
                      decision with the clause cited.
                    </p>
                  </header>
                  {standards?.length ? (
                    <div className="fdp__scroll">
                      <table className="fdp__standards">
                        <thead>
                          <tr>
                            <th scope="col">Clause</th>
                            <th scope="col">The standard says</th>
                            <th scope="col">SAMAVESH does</th>
                            <th scope="col">Why quality wins</th>
                          </tr>
                        </thead>
                        <tbody>
                          {standards.map((r) => (
                            <tr key={r.clause}>
                              <td>
                                <code>{r.clause}</code>
                              </td>
                              <td>{r.says}</td>
                              <td>{r.does}</td>
                              <td>{r.why}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="fdp__none">No recorded deviation. Every value here sits inside the published clauses.</p>
                  )}
                </section>
                {accessibility}
              </div>
            ),
          },
        ]}
      />

      {related?.length ? (
        <section className="fdp__section" aria-labelledby="fdp-related-h">
          <h2 id="fdp-related-h" className="fdp__h2">
            Related Foundations
          </h2>
          <ul className="fdp__related">
            {related.map((r) => (
              <li key={r.href}>
                <Link className="fdp__related-link" href={r.href}>
                  {r.label}
                </Link>
                <span className="fdp__related-reason">{r.reason}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <FeedbackBar componentName={`${name} (foundation)`} />
    </article>
  );
}
