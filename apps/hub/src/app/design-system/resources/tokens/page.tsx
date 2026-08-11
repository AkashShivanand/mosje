import * as React from "react";
import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Callout } from "@/components/design-system/docs-kit/index";
import { figmaUrl } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Design tokens",
  description:
    "Every SAMAVESH design token and its resolved value, rendered from the generated DTCG export — colors with live swatches, plus spacing, radius, type, shadow, and motion.",
};

export const dynamic = "force-static";

interface Leaf {
  path: string;
  value: string;
}

function flatten(obj: unknown, prefix: string, out: Leaf[]): void {
  if (obj !== null && typeof obj === "object") {
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      flatten(val, prefix ? `${prefix}.${key}` : key, out);
    }
  } else if (obj !== undefined) {
    out.push({ path: prefix, value: String(obj) });
  }
}

const isColor = (v: string): boolean => /^(#|rgb|hsl)/i.test(v.trim());

function loadTokenGroups(): Array<{ group: string; leaves: Leaf[] }> {
  const file = path.join(process.cwd(), "..", "..", "packages", "tokens", "dist", "figma.tokens.json");
  const tokens = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
  return Object.entries(tokens).map(([group, value]) => {
    const leaves: Leaf[] = [];
    flatten(value, "", leaves);
    return { group, leaves };
  });
}

export default function TokensPage(): React.JSX.Element {
  const groups = loadTokenGroups();
  const total = groups.reduce((n, g) => n + g.leaves.length, 0);

  return (
    <>
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Design tokens</h1>
          <p className="docs-page-header__desc">
            All {total} tokens and their resolved values, rendered live from the
            generated DTCG export (<code>@mosje/tokens</code>) — so this reference
            is always in sync with the system. Consume the public contract as{" "}
            <code>--sa-*</code> CSS variables; never hardcode values.
          </p>
        </div>
      </header>

      <Callout type="info" title="Raw + Figma">
        Machines: the same data as raw JSON at{" "}
        <a href="/design-system/tokens.json" target="_blank" rel="noopener noreferrer">
          tokens.json
        </a>
        . Designers: it round-trips to the{" "}
        <a href={figmaUrl()} target="_blank" rel="noopener noreferrer">
          Figma library ↗
        </a>{" "}
        via the DTCG export.
      </Callout>

      {groups.map(({ group, leaves }) => (
        <section key={group} className="docs-section" style={{ marginTop: "var(--sa-stack-2xl)" }}>
          <span className="docs-section__label">{leaves.length} tokens</span>
          <h2 id={group} className="docs-section__heading" style={{ textTransform: "capitalize" }}>
            {group}
          </h2>
          <table className="token-table">
            <thead>
              <tr>
                {leaves.some((l) => isColor(l.value)) && <th style={{ width: 40 }} aria-label="Swatch" />}
                <th>Token</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leaf) => {
                const color = isColor(leaf.value);
                return (
                  <tr key={leaf.path}>
                    {leaves.some((l) => isColor(l.value)) && (
                      <td>
                        {color && (
                          <span
                            className="token-table__preview"
                            style={{ background: leaf.value, display: "inline-block" }}
                            aria-hidden="true"
                          />
                        )}
                      </td>
                    )}
                    <td>
                      <code className="token-table__name">{group}.{leaf.path}</code>
                    </td>
                    <td>
                      <code className="token-table__value">{leaf.value}</code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
    </>
  );
}
