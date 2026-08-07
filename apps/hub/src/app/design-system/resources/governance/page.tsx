import * as React from "react";
import type { Metadata } from "next";
import { Callout, StatusBadge } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Governance",
  description:
    "How SAMAVESH is governed — the component lifecycle, the RFC process for proposing components, our semantic versioning policy, and the deprecation window.",
};

type Stage = "Proposed" | "Alpha" | "Beta" | "Stable" | "Deprecated";

const LIFECYCLE: { stage: Stage; meaning: string; safeToUse: string }[] = [
  {
    stage: "Proposed",
    meaning: "An idea submitted via RFC. Not safe to use yet.",
    safeToUse: "No — there is no code behind it yet.",
  },
  {
    stage: "Alpha",
    meaning: "Built but not tested with real users. Expect API changes.",
    safeToUse: "Experiment only — do not ship to citizens.",
  },
  {
    stage: "Beta",
    meaning:
      "Tested with 1+ real product. Mostly stable, minor API changes possible.",
    safeToUse: "Yes, with care — pin the version and watch the changelog.",
  },
  {
    stage: "Stable",
    meaning:
      "Production-ready. Breaking changes only with a major version + deprecation window.",
    safeToUse: "Yes — this is the default safe choice.",
  },
  {
    stage: "Deprecated",
    meaning: "Will be removed. Codemod available. Migration path documented.",
    safeToUse: "Migrate away — it works today but is on its way out.",
  },
];

export default function GovernancePage(): React.JSX.Element {
  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Governance</h1>
          <p className="docs-page-header__desc">
            SAMAVESH serves 13 websites and 20 portals, so changes have to be
            predictable. This page explains, in plain English, how a component
            grows up — from a sketch in an RFC to production-ready and, one day,
            retired — and the rules that protect teams who depend on it.
          </p>
        </div>
      </header>

      {/* ── Section 1: Lifecycle ──────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">For everyone</span>
        <h2 id="lifecycle" className="docs-section__heading">
          The component lifecycle
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Every component carries a <strong>status badge</strong>. It is a
            promise about how much you can trust it today. Read the status before
            you build with anything.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--ds-spacing-md)",
            marginTop: "var(--ds-spacing-lg)",
          }}
        >
          {LIFECYCLE.map((item) => (
            <div
              key={item.stage}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(120px, 160px) 1fr",
                gap: "var(--ds-spacing-lg)",
                alignItems: "start",
                padding: "var(--ds-spacing-lg)",
                border: "1px solid var(--ds-border)",
                borderRadius: "var(--ds-radius-md)",
                background: "var(--ds-surface)",
              }}
            >
              <div style={{ paddingTop: 2 }}>
                <StatusBadge status={item.stage} />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "var(--ds-text-body-1)",
                    color: "var(--ds-ink)",
                    margin: 0,
                    lineHeight: "var(--ds-leading-body-1)",
                  }}
                >
                  {item.meaning}
                </p>
                <p
                  style={{
                    fontSize: "var(--ds-text-body-2)",
                    color: "var(--ds-ink-muted)",
                    margin: "var(--ds-spacing-sm) 0 0",
                  }}
                >
                  <strong>Safe to use?</strong> {item.safeToUse}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Callout type="tip" title="The short version">
          Reach for <strong>Stable</strong> components by default. Use{" "}
          <strong>Beta</strong> when you need something newer, but pin the
          version. Treat <strong>Alpha</strong> and <strong>Proposed</strong> as
          previews, and start planning your move whenever you see{" "}
          <strong>Deprecated</strong>.
        </Callout>
      </section>

      {/* ── Section 2: RFC process ────────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Process</span>
        <h2 id="rfc" className="docs-section__heading">
          Proposing a new component (the RFC process)
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Anything new to the system starts as an <strong>RFC</strong> (Request
            for Comments). This keeps decisions in the open and prevents the same
            component being built three different ways in three different portals.
          </p>
          <ol>
            <li>
              <strong>Open an RFC issue.</strong> File an issue on{" "}
              <a
                href="https://github.com/AkashShivanand/MoSJE/issues/new"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>{" "}
              using the RFC template. Describe the problem, who needs it, and how
              you imagine it working.
            </li>
            <li>
              <strong>Show the need.</strong> Point to at least one real portal or
              website that needs it. Components that serve only a single screen
              usually belong in that app, not the shared system.
            </li>
            <li>
              <strong>Discussion &amp; review.</strong> The core team and other
              teams comment. The component is marked{" "}
              <StatusBadge status="Proposed" /> while this happens.
            </li>
            <li>
              <strong>Accepted &rarr; built.</strong> Once accepted, it is built
              and ships as <StatusBadge status="Alpha" />, then graduates to{" "}
              <StatusBadge status="Beta" /> after a real product uses it, and{" "}
              <StatusBadge status="Stable" /> once it is proven.
            </li>
          </ol>
        </div>
        <Callout type="info" title="Not every idea becomes a component">
          An RFC can also conclude that an existing component already covers the
          need, or that the pattern belongs in one app rather than the shared
          system. That is a successful outcome too — it keeps the system small and
          coherent.
        </Callout>
      </section>

      {/* ── Section 3: Semver policy ──────────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Policy</span>
        <h2 id="semver" className="docs-section__heading">
          Versioning policy (semver)
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            SAMAVESH follows <strong>semantic versioning</strong>:{" "}
            <code>MAJOR.MINOR.PATCH</code>. The version number tells you what to
            expect before you even read the changelog.
          </p>
          <ul>
            <li>
              <strong>MAJOR</strong> (e.g. 1.0.0 &rarr; 2.0.0) — breaking changes.
              Something you depend on changed shape. Upgrade deliberately and read
              the migration notes.
            </li>
            <li>
              <strong>MINOR</strong> (e.g. 1.2.0 &rarr; 1.3.0) — new features,
              backward-compatible. Safe to adopt.
            </li>
            <li>
              <strong>PATCH</strong> (e.g. 1.2.3 &rarr; 1.2.4) — bug fixes only.
              Always safe.
            </li>
          </ul>
          <p>
            Once a component is <StatusBadge status="Stable" />, we will only make
            a breaking change to it in a <strong>major</strong> version, and only
            after a deprecation window (below).
          </p>
        </div>
        <Callout type="warning" title="We are pre-1.0">
          While the system is below v1.0, minor versions{" "}
          <em>may still contain breaking changes</em> — this is standard semver
          behaviour for early releases. Pin your version and read the{" "}
          <a href="/design-system/resources/changelog">changelog</a> before upgrading.
        </Callout>
      </section>

      {/* ── Section 4: Deprecation window ─────────────────────── */}
      <section className="docs-section">
        <span className="docs-section__label">Policy</span>
        <h2 id="deprecation" className="docs-section__heading">
          Deprecation window
        </h2>
        <div className="docs-section__body ds-prose">
          <p>
            Nothing stable disappears without warning. When we decide to remove or
            replace a stable component, we give you{" "}
            <strong>two minor versions</strong> of runway before it is gone.
          </p>
          <ol>
            <li>
              <strong>Marked Deprecated.</strong> The component is tagged{" "}
              <StatusBadge status="Deprecated" /> and a console warning points to
              the replacement.
            </li>
            <li>
              <strong>Migration path published.</strong> The docs and changelog
              explain exactly what to use instead, and a{" "}
              <strong>codemod</strong> is provided where possible to automate the
              change.
            </li>
            <li>
              <strong>Removed after two minor versions.</strong> For example, if
              something is deprecated in v0.8, it will not be removed before v0.10.
              That gives every team a predictable window to migrate.
            </li>
          </ol>
        </div>
        <Callout type="tip" title="What to do when you see Deprecated">
          Don&rsquo;t panic, but don&rsquo;t ignore it either. Check the migration
          note, run the codemod if one exists, and schedule the change before the
          removal version lands.
        </Callout>
      </section>
    </>
  );
}
