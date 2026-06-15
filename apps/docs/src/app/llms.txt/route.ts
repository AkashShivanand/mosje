import { NAV } from "@/lib/nav";

/**
 * /design-system/llms.txt — an llms.txt index (https://llmstxt.org) of the
 * SAMAVESH documentation, generated from the portal navigation so it stays in
 * sync automatically: add a page to `lib/nav.ts` and it appears here.
 */
export const dynamic = "force-static";

const SUMMARY =
  "The shared design system for the MoSJE / DoSJE (Government of India) digital estate — design tokens, foundations, and React components behind 13 websites and 20+ portals. AI agents and engineers: read the design contract first, then build only from the documented tokens and components.";

export function GET(): Response {
  const lines: string[] = [];

  lines.push("# SAMAVESH Design System");
  lines.push("");
  lines.push(`> ${SUMMARY}`);
  lines.push("");

  // The canonical machine-readable artifacts.
  lines.push("## Start here");
  lines.push(
    "- [Design contract (design.md)](https://github.com/AkashShivanand/MoSJE/blob/main/packages/design-system/design.md): the authoritative AI design context — token vocabulary, theming axes, component inventory, and the non-negotiable rules. Read before building UI.",
  );
  lines.push(
    "- [Design tokens (DTCG JSON)](https://github.com/AkashShivanand/MoSJE/blob/main/packages/tokens/dist/figma.tokens.json): every token and resolved value, Figma-compatible.",
  );
  lines.push(
    "- [Figma library](https://www.figma.com/design/qyzTEy8dlb3ssYctlkMX5o/SAMAVESH-Design-System): the designer source of truth, kept in sync with the tokens.",
  );
  lines.push("");

  for (const group of NAV) {
    lines.push(`## ${group.title}`);
    const seen = new Set<string>();
    for (const item of group.items) {
      if (seen.has(item.href)) continue;
      seen.add(item.href);
      const note = item.badge ? `: ${item.badge}` : "";
      lines.push(`- [${item.label}](${item.href})${note}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
