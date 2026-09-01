"use client";

import * as React from "react";
import { Badge, type BadgeStatus } from "@mosje/design-system";
import { useDataMode } from "@/lib/data-mode/context";
import "./data-mode.css";

export type CardProvenance = "live" | "mixed" | "mock";

const COPY: Record<
  CardProvenance,
  { label: string; status: BadgeStatus; title: string }
> = {
  live: {
    label: "Live",
    // A live figure is a good outcome, and `success` is the only status whose
    // tonal green says so without shouting. `mixed` is the one a reader has to
    // look at twice, so it takes `warning`. `mock` is NOT an alarm — nothing is
    // wrong with an illustrative figure that declares itself — so it stays
    // neutral, which is also what the hand-rolled chip did.
    status: "success",
    title: "Every figure on this card came from the department's live report feed.",
  },
  mixed: {
    label: "Part illustrative",
    status: "warning",
    title:
      "Some figures on this card are live and some are illustrative, because the feed does not yet publish them. Illustrative figures are consistent with the live ones but are not departmental figures.",
  },
  mock: {
    label: "Illustrative",
    status: "neutral",
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
 * IT IS A `Badge`, NOT A PILL OF ITS OWN. A small status pill with a leading
 * dot is exactly what `Badge` is, and the hand-rolled version had drifted away
 * from the estate: uppercase at weight 700 with letter-spacing, the loudest
 * typographic treatment available, on a component whose own docstring calls it
 * a footnote. What is left in this file is what genuinely belongs to the app —
 * the wording, the status mapping, and the one gate below.
 *
 * HIDDEN BY DEFAULT, by product decision. See `DemoDataSettings.marks` for the
 * trade that was made and what it costs.
 */
export function ProvenanceChip({ kind }: { kind: CardProvenance }) {
  const { marks } = useDataMode();
  const { label, status, title } = COPY[kind];
  // ONE GATE, HERE. Every card asks for a chip unconditionally; whether one is
  // drawn is a single decision in a single place. A conditional at each of the
  // fifteen call sites is fifteen chances to forget one, and a card that
  // silently stops declaring itself is the failure this component exists to
  // prevent.
  if (!marks) return null;
  return (
    <Badge status={status} size="sm" dot className="dm-chip" title={title}>
      {label}
      <span className="sr-only">. {title}</span>
    </Badge>
  );
}
