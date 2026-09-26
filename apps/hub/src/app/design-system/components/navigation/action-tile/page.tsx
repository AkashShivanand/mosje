import type { Metadata } from "next";
import * as React from "react";

import { ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { Specimen } from "./specimen";

export const metadata: Metadata = {
  title: "Action Tile",
  description: "One destination as a tile: a task, a group of people, a role, an account, a helpline or a report.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    status: "verified",
    evidence: "axe-core link-name, /website at 1440 and 375 (tools/website-redesign/axe-scan.mjs), 22 Sep 2026: 0 violations across 33 tiles",
    level: "A",
    description:
      "The whole tile is one anchor, so its accessible name is its title, then its value and description, then the action text. Nothing inside it is separately interactive.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    status: "verified",
    evidence: "axe-core target-size, /website at 1440 and 375, 22 Sep 2026: 0 violations; every tile ≥ 48px tall",
    level: "AA",
    description: "The tile is at least `--sa-target-spacious` (48px) tall, and the whole tile is the target.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    status: "verified",
    evidence: "Keyboard pass of /website, 22 Sep 2026: every tile one Tab stop with a visible ring, including on the navy band",
    level: "AA",
    description:
      "The estate's focus ring; on the navy `inverse` ground it takes `--sa-focus-ringInner`, because the brand ring does not clear 3:1 on navy.",
  },
  {
    criterion: "GIGW 3.0 — New window notice",
    status: "verified",
    evidence: "Rendered name on /website, 22 Sep 2026: “File a Grievance (opens in a new window)”",
    level: "GIGW",
    description: "`external` swaps the arrow for `open_in_new` and adds a visually hidden “(opens in a new window)” inside the anchor.",
  },
];

export default function ActionTilePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Action Tile"
      status="New"
      summary="One destination as a tile — a task on a home page, a group of people a scheme serves, a role, an account to follow, a helpline to call, a report to open. One link, one tab stop, one name."
      figma={{ absent: "Code only for now: no library master yet. A designer places the nearest drawn tile and names ActionTile in the handoff note." }}
      since="0.70.0"
      specimen={<Specimen />}
      propsFrom="ActionTileProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The reader is choosing where to go, by name: a task, a group, a role, an account, a helpline, a report.",
          "Several destinations of one kind sit together in a grid or a row.",
        ],
        avoid: [
          "A portal — that is PortalCard, with its saffron rule and code.",
          "Content the reader reads rather than a place they go — that is Card.",
          "A tile that needs a second control inside it — `action` is text, not a button.",
        ],
      }}
      related={[
        { label: "Portal Card", href: "/design-system/components/navigation/portal-card", reason: "for a portal in a grid of portals" },
        { label: "Link", href: "/design-system/components/navigation/link", reason: "for a destination inside a sentence" },
      ]}
    />
  );
}
