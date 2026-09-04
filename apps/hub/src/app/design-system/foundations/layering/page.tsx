import * as React from "react";
import type { Metadata } from "next";

import "./layering.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Layering",
  description:
    "The z-index ladder — fifteen named rungs that say what sits above what across the SAMAVESH estate, from the page to the statutory accessibility panel, and the only values app code may write.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * A NEW foundation. Until 2026-09-04 the estate carried a Tier-1 z ladder nobody consumed
 * (UX4G/Bootstrap's 1000–1090) while components stacked at 20, 30, 60, 70, 90, 1010,
 * 999999 and 2147483000 — and the rule that governs floating elements said "there is no
 * --sa-z-* scale yet". The ladder below is the one the estate actually renders.
 */

const rows = FOUNDATIONS.layering.tokens;
const order = ["base", "raised", "dropdown", "sticky", "fixed", "overlay", "modal", "popover", "toast", "tooltip", "rail", "launcher", "statutory", "demo", "top"];
const ladder = order.map((k) => rows.find((r) => r.path === `z/${k}`)).filter((r): r is NonNullable<typeof r> => Boolean(r));
const product = ladder.filter((r) => Number(r.value) < 1000);
const chrome = ladder.filter((r) => Number(r.value) >= 1000);

export default function LayeringPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Layering"
      status="New"
      since="0.49.0"
      summary="Layering is the order in which surfaces stack when they overlap. SAMAVESH names fifteen rungs, in steps of a hundred, so that a menu is always above the page, a modal above its scrim, a toast above a modal, and nothing the Department draws ever sits on the statutory accessibility control. These are the only z-index values app code may write."
      figma={{
        absent:
          "Code-only. Figma has no z-axis property — canvas order is layer order — so there is nothing to bind and no variable is published. The ladder is enforced in CSS and documented here.",
      }}
      glance={[
        { value: product.length, label: "product rungs", note: "base to tooltip, steps of 100" },
        { value: chrome.length, label: "chrome rungs", note: "rails, statutory panel, demo dock" },
        { value: "100", label: "step", note: "room for local order inside a layer" },
        { value: "1:1", label: "with elevation", note: "each shadow role names its rung" },
        { value: "0", label: "literals allowed", note: "beyond 0, 1 and 2 inside a component" },
        { value: "3", label: "reserved rungs", note: "statutory · demo · top — never assigned" },
      ]}
      sections={[
        {
          id: "ladder",
          keyword: "LADDER",
          title: "Fifteen Rungs, in the Order the Reader Meets Them",
          description:
            "Read from the bottom. Everything below 1000 is product — surfaces a page creates. Everything from 1000 is estate chrome: the two floating rails, the third-party accessibility panel, and the demo scaffolding that must sit above it while the estate is a prototype.",
          content: (
            <>
              <ol className="ly-ladder" reversed>
                {[...ladder].reverse().map((r) => {
                  const rung = r.path.split("/")[1] ?? "";
                  const reserved = ["statutory", "demo", "top"].includes(rung);
                  return (
                    <li key={r.path} className={`ly-rung ${Number(r.value) >= 1000 ? "ly-rung--chrome" : ""} ${reserved ? "ly-rung--reserved" : ""}`}>
                      <span className="ly-rung__value">{r.value}</span>
                      <span className="ly-rung__name">z/{rung}</span>
                      <span className="ly-rung__use">{r.description}</span>
                    </li>
                  );
                })}
              </ol>
              <Callout type="warning" title="Three rungs are reserved">
                <code>z/statutory</code> is the UX4G accessibility panel&rsquo;s own value — third-party markup the Department does not
                own. <code>z/demo</code> and <code>z/top</code> exist for the demo dock and the one panel allowed above it. Nothing else
                may bind them; they are named so that nothing lands there by accident.
              </Callout>
            </>
          ),
        },
        {
          id: "local",
          keyword: "LOCAL",
          title: "Inside a Component, 1 and 2 Are Order, Not Layer",
          description:
            "A caret over its own field or a selected tab over its rail is local order inside the component's stacking context. Those use z/raised (1) or a literal 2, never a ladder value — a ladder value inside a component leaks the moment the component sits in a modal.",
          content: (
            <>
              <p>
                The test is simple: does this element have to beat a <em>sibling component</em>, or only its own parts? Only the
                first case is layering. Every component that opens something — a menu, a listbox, a date grid — creates a new stacking
                context (<code>position</code> plus a ladder value) so its children&rsquo;s local order cannot escape.
              </p>
              <DoDont
                cards={[
                  { type: "do", preview: <code>.ds-combobox__list {"{"} z-index: var(--sa-z-dropdown); {"}"}</code>, label: "A list opened from a control is a dropdown, whichever component opened it." },
                  { type: "do", preview: <code>.ds-input__label {"{"} z-index: var(--sa-z-raised); {"}"}</code>, label: "A floating label only has to clear its own field." },
                  { type: "dont", preview: <code>z-index: 9999</code>, label: "A number between rungs, or above them, is a component announcing it has stopped cooperating." },
                ]}
              />
            </>
          ),
        },
        {
          id: "pairing",
          keyword: "PAIRING",
          title: "Elevation and Layering Move Together",
          description:
            "A surface that casts a bigger shadow is a surface that sits higher. Every elevation role names its rung, so binding the shadow tells you the layer: card on base, raised on raised, dropdown on dropdown, modal on modal over its overlay, toast on toast.",
          content: (
            <div className="ly-pairs">
              {[
                ["elevation/card", "z/base"],
                ["elevation/raised", "z/raised"],
                ["elevation/dropdown", "z/dropdown"],
                ["elevation/modal", "z/modal"],
                ["elevation/toast", "z/toast"],
              ].map(([e, z]) => (
                <div key={e} className="ly-pair">
                  <code>{e}</code>
                  <span aria-hidden="true">↔</span>
                  <code>{z}</code>
                </div>
              ))}
            </div>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="All fifteen are Tier 2 and code-only: write z-index: var(--sa-z-<rung>). There is no Tier-1 ladder beneath them — a primitive would have nothing to be an alias target of — and no Figma variable, because a canvas has no z-axis."
      a11y={[
        {
          criterion: "2.4.3 Focus Order",
          level: "A",
          description: "Visual stacking agrees with focus order: what is on top is what receives focus.",
          status: "partial",
          evidence: "Modal and side sheet trap focus above z/overlay (Modal reviewed 2026-09-04). Toasts at z/toast are announced by live region rather than focused; no automated check yet.",
        },
        {
          criterion: "1.3.2 Meaningful Sequence",
          level: "A",
          description: "Layer order never contradicts reading order for content that is not transient.",
          status: "verified",
          evidence: "Only transient surfaces (dropdown and above) take a ladder value; page content stacks at z/base in DOM order.",
        },
        {
          criterion: "GIGW 3.0 — accessibility widget",
          level: "GIGW",
          description: "The statutory accessibility control is never obscured.",
          status: "verified",
          evidence: "z/statutory (999999) is reserved; every SAMAVESH launcher sits at z/launcher (1010) beneath it by construction (floating-element-placement.md).",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 — z-index ladder (Bootstrap 1000–1090)",
          says: "dropdown 1000 · sticky 1020 · fixed 1030 · offcanvas 1040 · modal-backdrop 1050 · modal 1060 · popover 1070 · toast 1090.",
          does: "Fifteen rungs from 0 in steps of 100 for product surfaces, then the estate's real chrome values above 1000.",
          why: "UX4G's ladder assumed Bootstrap's chrome; this estate's chrome is the UX4G accessibility panel itself at 999999, which Bootstrap's ladder cannot sit under. Order is preserved rung for rung; only the numbers moved, and the third-party value is named so nothing can collide with it.",
        },
      ]}
      related={[
        { label: "Elevation", href: "/design-system/foundations/elevation", reason: "the shadow that pairs with each rung" },
        { label: "Motion", href: "/design-system/foundations/motion", reason: "what enters a higher layer uses the enter pair" },
      ]}
    />
  );
}
