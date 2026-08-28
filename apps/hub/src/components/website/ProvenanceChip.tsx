"use client";

import * as React from "react";
import { useDataMode } from "@/lib/data-mode/context";
import "./data-mode.css";

export type CardProvenance = "live" | "mixed" | "mock";

const COPY: Record<CardProvenance, { label: string; title: string }> = {
  live: {
    label: "Live",
    title: "Every figure on this card came from the department's live report feed.",
  },
  mixed: {
    label: "Part illustrative",
    title:
      "Some figures on this card are live and some are illustrative, because the feed does not yet publish them. Illustrative figures are consistent with the live ones but are not departmental figures.",
  },
  mock: {
    label: "Illustrative",
    title:
      "The feed does not yet publish these figures. What is shown is illustrative — it shows how the card will read, and is not a departmental figure.",
  },
};

/**
 * What a card is claiming about its own numbers.
 *
 * The genuine risk in a prototype that fills gaps with illustrative data is not
 * a wrong chart — it is a stakeholder screenshotting an illustrative figure into
 * a deck where it becomes a departmental one. When marks are ON, one is drawn on
 * EVERY card in EVERY mode, including the live one: a chip that appears only
 * when something is wrong teaches people not to look for it.
 *
 * Quiet by design — it is a footnote, not a warning — and never colour alone:
 * each state carries its own word, so it survives a greyscale print and a
 * colour-blind reader (WCAG 1.4.1).
 *
 * HIDDEN BY DEFAULT, by product decision. See `DemoDataSettings.marks` for the
 * trade that was made and what it costs.
 */
export function ProvenanceChip({ kind }: { kind: CardProvenance }) {
  const { marks } = useDataMode();
  const { label, title } = COPY[kind];
  // ONE GATE, HERE. Every card asks for a chip unconditionally; whether one is
  // drawn is a single decision in a single place. A conditional at each of the
  // fifteen call sites is fifteen chances to forget one, and a card that
  // silently stops declaring itself is the failure this component exists to
  // prevent.
  if (!marks) return null;
  return (
    <span className={`dm-chip dm-chip--${kind}`} title={title}>
      <span className="dm-chip__dot" aria-hidden />
      {label}
      <span className="sr-only">. {title}</span>
    </span>
  );
}
