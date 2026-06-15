import fs from "node:fs";
import path from "node:path";

/**
 * /design-system/design.md — the raw design contract, served in-portal so agents
 * can fetch the canonical markdown directly (no GitHub dependency). The human,
 * rendered view lives at /design-system/resources/design-context.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const file = path.join(process.cwd(), "..", "..", "packages", "design-system", "design.md");
  const md = fs.readFileSync(file, "utf8");
  return new Response(md, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
