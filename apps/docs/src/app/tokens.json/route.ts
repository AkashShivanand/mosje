import fs from "node:fs";
import path from "node:path";

/**
 * /design-system/tokens.json — the generated DTCG token export, served in-portal
 * so agents and tools have a stable machine endpoint (no GitHub dependency).
 * Read at build time from the single source of truth in @mosje/tokens.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const file = path.join(process.cwd(), "..", "..", "packages", "tokens", "dist", "figma.tokens.json");
  const json = fs.readFileSync(file, "utf8");
  return new Response(json, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
