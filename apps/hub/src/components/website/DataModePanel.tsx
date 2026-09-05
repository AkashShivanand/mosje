"use client";

import * as React from "react";
import { RadioGroup, Toggle } from "@mosje/design-system";
import { useDataMode } from "@/lib/data-mode/context";
import type { DataMode, PreviewState } from "@/lib/data-mode/types";
import "./data-mode.css";

/**
 * The demo rail's Data tab.
 *
 * Three groups of control, each answering a different question a walkthrough
 * runs into:
 *
 *   · WHAT to show — live figures, illustrative ones, or both.
 *   · WHETHER TO SAY SO — the provenance marks, off by default, because this
 *     prototype's job is to look like the finished service and a row of badges
 *     is scaffolding. The cost of that default is stated on the control itself.
 *   · WHAT IT LOOKS LIKE WHEN IT GOES WRONG — loading, empty and error, forced
 *     from here rather than by breaking a feed to get there.
 *
 * THE EXPLANATION IS CONTEXTUAL, NOT LISTED. Three options each carrying three
 * lines of prose made 400 vertical pixels of text in a fixed-height panel — a
 * wall to read before anything could be chosen. Only the SELECTED option
 * explains itself now, in one line, and it crossfades as the choice moves. The
 * common path is visible; the detail is one selection deep.
 *
 * None of it touches the department's data, and none of it is reachable without
 * the demo tools open.
 */

const OPTIONS: { id: DataMode; label: string; blurb: string }[] = [
  {
    id: "live",
    label: "Live only",
    blurb:
      "Only what the department's API returns. Where a feed is unpopulated, the card shows an empty state.",
  },
  {
    id: "hybrid",
    label: "Live + illustrative",
    blurb:
      "Live figures wherever the API answers, illustrative ones for the gaps. The default, and the one to demo with.",
  },
  {
    id: "mock",
    label: "Illustrative only",
    blurb:
      "The mirrored snapshot throughout, ignoring the API. For when the feed is down and the walkthrough must not depend on it.",
  },
];

/** Every state a card can be in, so a walkthrough can show any of them without
 *  having to arrange the conditions that produce it. */
const PREVIEWS: { id: PreviewState; label: string }[] = [
  { id: "normal", label: "Normal" },
  { id: "loading", label: "Loading" },
  { id: "empty", label: "Empty" },
  { id: "no-results", label: "No matches" },
  { id: "not-published", label: "Not published" },
  { id: "error", label: "Error" },
  { id: "restricted", label: "Restricted" },
  { id: "offline", label: "Offline" },
];

export function DataModePanel() {
  const { mode, setMode, marks, setMarks, preview, setPreview, previewScope, setPreviewScope } =
    useDataMode();
  const name = React.useId();
  const active = OPTIONS.find((o) => o.id === mode) ?? OPTIONS[1]!;

  return (
    <div className="dm-panel">
      <section className="dm-panel__group">
        <RadioGroup
          className="dm-panel__opts"
          legend="Data source"
          name={name}
          size="sm"
          options={OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
          value={mode}
          onChange={(v) => setMode(v as DataMode)}
        />
        {/* Keyed so the crossfade replays on every change: the line is the
            answer to the click, and a silent swap reads as nothing happening. */}
        <p key={active.id} className="dm-panel__explain">
          {active.blurb}
        </p>
      </section>

      <section className="dm-panel__group">
        <Toggle size="small" checked={marks} onChange={(e) => setMarks(e.target.checked)} label="Show data marks" />
        <p className="dm-panel__hint">
              A <b>Live</b> or <b>Illustrative</b> badge on every card. Off so the
              page reads as the finished service.
            </p>
      </section>

      <section className="dm-panel__group">
        <h3 className="dm-panel__legend">Preview an edge state</h3>
        <div className="dm-panel__chips" role="group" aria-label="Preview an edge state">
          {PREVIEWS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`dm-panel__chip${preview === p.id ? " is-on" : ""}`}
              aria-pressed={preview === p.id}
              onClick={() => setPreview(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {preview !== "normal" && (
          /* A SUB-CHOICE, SO IT IS A DIFFERENT KIND OF OBJECT. Two rows of
             same-size pills read as peers — and with the row above wrapping to
             two lines, the second row looked like more of the first. Colour
             cannot carry that hierarchy: the level below is a segmented
             control, which is ONE object with two positions rather than a set
             of independent choices, and it is indented under a rule that says
             what it belongs to. */
          <div className="dm-panel__sub">
            <span className="dm-panel__sub-label">Apply to</span>
            <div className="dm-panel__seg" role="group" aria-label="Apply the edge state to">
              {(
                [
                  ["all", "Whole dashboard"],
                  ["one", "First card"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`dm-panel__seg-btn${previewScope === id ? " is-on" : ""}`}
                  aria-pressed={previewScope === id}
                  onClick={() => setPreviewScope(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="dm-panel__hint">
              {previewScope === "one"
                ? "A partial failure: one card in trouble while the rest of the page stays trustworthy."
                : "Every card in this section."}
            </p>
          </div>
        )}
      </section>

      <p className="dm-panel__note">
        Nothing here changes the department&rsquo;s data, and these controls are
        visible only to whoever has the demo tools open.
      </p>
    </div>
  );
}
