import * as React from "react";
import Link from "next/link";

import { A11yChecklist, type A11yItem } from "./a11y-checklist";
import { DocsTabs } from "./docs-tabs";
import { FeedbackBar } from "./feedback-bar";
import { PropsTable, type PropDef } from "./props-table";
import type { GeneratedPropsKey } from "@/lib/design-system/props.generated";
import { StatusBadge, type Status } from "./status-badge";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

/**
 * ONE SHAPE FOR EVERY COMPONENT PAGE — rendered, not repeated.
 *
 * The census on 2026-08-31 found three of one hundred component pages carrying
 * the full documentation shape. The reason was never that authors disagreed
 * with the shape; it was that the shape had to be retyped every time. Ninety-
 * nine pages declared their own `const h2Style: React.CSSProperties`, and with
 * them came 161 unbound `lineHeight` numbers and 107 `maxWidth` px literals
 * across NINE different measures — on the estate's strictest surface, where
 * `.claude/rules/documentation-ds-linkage.md` forbids a literal that merely
 * equals a token.
 *
 * A template is the only fix that holds. Six elements a reader is owed arrive
 * by construction rather than by memory, the measure is one value in one CSS
 * file, and a change to the house style is one edit instead of a hundred.
 *
 * WHAT IT GUARANTEES, in the order a reader meets it:
 *
 *   1. name + maturity badge      what am I looking at, and can I rely on it
 *   2. summary                    what it is, in the department's register
 *   3. Figma link OR a declared   the design source — and when there is none,
 *      absence                    a sentence saying so, because a missing link
 *                                 and an unbuilt component are different facts
 *   4. specimen                   the component, running
 *   5. when to use / when not     the question that stops the wrong choice
 *   6. Design / Code / A11y tabs  props table and checklist inside, always
 *   7. related components         the way out to the next thing
 *   8. feedback bar               a way to say the page is wrong
 *
 * NOTHING HERE TAKES AN INLINE STYLE. Every rule lives in `docs-kit.css` under
 * the `components` layer, bound to `--sa-*`. If a page needs a value this
 * template does not give it, the value belongs in the CSS file — not in a
 * `style={{ }}` on the page, which is how the estate got here.
 */

/** Where the design source lives — or an honest statement that it does not exist yet. */
export type FigmaSource =
  | { node: keyof typeof FIGMA_NODES; absent?: never }
  /**
   * Sixty-six of a hundred documented components have no node in FIGMA_NODES.
   * A page for one of those says so in a sentence a reader can act on, rather
   * than linking to nothing or omitting the row and letting the reader assume
   * the library was never checked.
   */
  | { node?: never; absent: string };

export interface RelatedComponent {
  label: string;
  href: string;
  /** Why a reader here might want that one instead — one clause, not a sentence. */
  reason: string;
}

export interface ComponentDocPageProps {
  /** Title Case, as the component is known to a reader — "Portal Card", not `PortalCard`. */
  name: string;
  status: Status;
  /** One or two sentences. Government register: plain, formal, factual. */
  summary: string;
  figma: FigmaSource;
  /** The release this component's current API arrived in, e.g. "0.42.0". */
  since?: string;
  /** The component, running. Never a screenshot. */
  specimen: React.ReactNode;
  /**
   * Hand-written rows. PREFER `propsFrom` — a hand-written table is how this
   * estate came to document a `ChartCard` prop called `action` when the prop is
   * `actions`, and to mark two optional `AppShell` props required. Use this only
   * for what the extractor cannot see: a hook's arguments, a callback's shape.
   */
  props?: PropDef[];
  /**
   * Key in `GENERATED_PROPS` — the props read out of the TypeScript source by
   * `tools/props-extract/extract.mjs`. This is the correct way to document an
   * API, because it cannot drift from it.
   */
  propsFrom?: GeneratedPropsKey;
  a11y: A11yItem[];
  /**
   * The two lists that stop the wrong component being chosen. `avoid` is the
   * half that gets skipped, and the half that does the work.
   */
  whenToUse?: { use: string[]; avoid: string[] };
  related?: RelatedComponent[];
  /** Extra Design-tab content, below the usage lists. */
  design?: React.ReactNode;
  /** Extra Code-tab content, below the props table — examples, recipes, gotchas. */
  code?: React.ReactNode;
  /** Extra Accessibility-tab content, below the checklist — keyboard maps, SR behaviour. */
  accessibility?: React.ReactNode;
}

function UsageList({
  tone,
  title,
  items,
}: {
  tone: "use" | "avoid";
  title: string;
  items: string[];
}): React.JSX.Element {
  return (
    <div className={`cdp-usage cdp-usage--${tone}`}>
      <h3 className="cdp-usage__title">
        <span className="cdp-usage__glyph" aria-hidden="true">
          {tone === "use" ? "✓" : "✕"}
        </span>
        {title}
      </h3>
      <ul className="cdp-usage__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ComponentDocPage({
  name,
  status,
  summary,
  figma,
  since,
  specimen,
  props,
  propsFrom,
  a11y,
  whenToUse,
  related,
  design,
  code,
  accessibility,
}: ComponentDocPageProps): React.JSX.Element {
  return (
    <article className="docs-article cdp">
      <header className="cdp__header">
        <div className="cdp__titlerow">
          <h1 className="cdp__title">{name}</h1>
          <StatusBadge status={status} />
        </div>

        <p className="cdp__summary">{summary}</p>

        <div className="cdp__meta">
          {figma.node ? (
            <a
              className="cdp__figma"
              href={figmaUrl(FIGMA_NODES[figma.node])}
              target="_blank"
              rel="noopener noreferrer"
            >
              Figma Component Spec <span aria-hidden="true">↗</span>
            </a>
          ) : (
            /* Not a defect being hidden — a fact being stated. See FigmaSource. */
            <p className="cdp__figma-absent">{figma.absent}</p>
          )}
          {since ? (
            <p className="cdp__since">
              Current API since <strong>v{since}</strong>
            </p>
          ) : null}
        </div>
      </header>

      <section className="cdp__section" aria-labelledby="cdp-specimen">
        <h2 id="cdp-specimen" className="cdp__h2">
          Specimen
        </h2>
        {/* `data-no-toc`: a specimen is a LIVE component, so any heading inside it
            belongs to the thing being demonstrated, not to this page. Without
            this the Review Screen page's contents list read "1Organisation
            Details · 2Project Details · 3Grant Sought" — the specimen's own
            section headings, numbered by its own markup, offered as navigation
            for a documentation page that has no such sections. */}
        <div className="cdp__specimen" data-no-toc>
          {specimen}
        </div>
      </section>

      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="cdp__tabbody">
                {whenToUse ? (
                  <section className="cdp__section" aria-labelledby="cdp-usage">
                    <h2 id="cdp-usage" className="cdp__h2">
                      When to Use It, and When Not
                    </h2>
                    <div className="cdp__usagegrid">
                      <UsageList tone="use" title="Use it when" items={whenToUse.use} />
                      <UsageList tone="avoid" title="Reach for something else when" items={whenToUse.avoid} />
                    </div>
                  </section>
                ) : null}
                {design}
              </div>
            ),
          },
          {
            id: "code",
            label: "Code",
            content: (
              <div className="cdp__tabbody">
                <section className="cdp__section" aria-labelledby="cdp-props">
                  <h2 id="cdp-props" className="cdp__h2">
                    Props
                  </h2>
                  <PropsTable from={propsFrom} props={props} />
                </section>
                {code}
              </div>
            ),
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="cdp__tabbody">
                <section className="cdp__section" aria-labelledby="cdp-a11y">
                  <h2 id="cdp-a11y" className="cdp__h2">
                    Criteria This Component Meets
                  </h2>
                  <A11yChecklist items={a11y} />
                </section>
                {accessibility}
              </div>
            ),
          },
        ]}
      />

      {related?.length ? (
        <section className="cdp__section" aria-labelledby="cdp-related">
          <h2 id="cdp-related" className="cdp__h2">
            Related Components
          </h2>
          <ul className="cdp__related">
            {related.map((r) => (
              <li key={r.href}>
                {/* `next/link`, like every other link in the docs shell: a raw
                    anchor here re-downloads the shell, the sidebar and the
                    search index on the one link whose job is moving between
                    pages. */}
                <Link className="cdp__related-link" href={r.href}>
                  {r.label}
                </Link>
                <span className="cdp__related-reason">{r.reason}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <FeedbackBar componentName={name} />
    </article>
  );
}
