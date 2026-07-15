import * as React from "react";
import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Markdown } from "@/components/design-system/docs-kit/markdown";
import { Callout } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "AI design context (design.md)",
  description:
    "The authoritative design contract an AI agent reads before building UI on SAMAVESH — token vocabulary, theming axes, component inventory, and the non-negotiable rules. Rendered from the source design.md.",
};

// Static: read the canonical design.md at build time so this page IS the source
// of truth (no hand-copied duplicate that can drift).
export const dynamic = "force-static";

function loadDesignDoc(): string {
  const file = path.join(process.cwd(), "..", "..", "packages", "design-system", "design.md");
  const raw = fs.readFileSync(file, "utf8");
  return raw
    .replace(/^<!--[\s\S]*?-->\s*/, "") // drop the leading editorial HTML comment
    .replace(/^#\s.*\n+/, ""); // drop the first H1 (the page header below supplies the title)
}

export default function DesignContextPage(): React.JSX.Element {
  const doc = loadDesignDoc();

  return (
    <>
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">AI design context</h1>
          <p className="docs-page-header__desc">
            The contract an AI agent (or a new engineer) reads before building UI
            on SAMAVESH. This page is rendered live from{" "}
            <code>packages/design-system/design.md</code> — the source of truth —
            so it never drifts from the system.
          </p>
        </div>
      </header>

      <Callout type="info" title="Machine-readable endpoints">
        Agents and tools can also consume the raw artifacts directly:{" "}
        <a href="/design-system/llms.txt" target="_blank" rel="noopener noreferrer">
          llms.txt
        </a>{" "}
        (portal index) and{" "}
        <a href="/design-system/tokens.json" target="_blank" rel="noopener noreferrer">
          tokens.json
        </a>{" "}
        (every token + resolved value, DTCG). A human-friendly token reference
        lives at <a href="/design-system/resources/tokens">Design tokens</a>.
      </Callout>

      <article style={{ marginTop: "var(--ds-space-8)" }}>
        <Markdown>{doc}</Markdown>
      </article>
    </>
  );
}
