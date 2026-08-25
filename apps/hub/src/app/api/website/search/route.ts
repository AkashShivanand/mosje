import { NextResponse } from "next/server";
import { searchIndex, suggest, MIN_QUERY_LENGTH } from "@/lib/website/search";
import { recordResultClick } from "@/lib/website/search/analytics";

/**
 * The masthead autocomplete's data source, and the click beacon.
 *
 * WHY A ROUTE AND NOT A CLIENT-SIDE INDEX. The corpus is ~2,700 records and about
 * a megabyte of strings. Shipping it to the browser to make suggestions feel
 * instant would cost every visitor that megabyte — on the connections this site
 * is actually used over — to save a few tens of milliseconds on a keystroke. The
 * field debounces instead.
 *
 * GET  /api/website/search?q=…&limit=8   → suggestions
 * POST /api/website/search               → record that a result was opened
 */

/** Suggestions are derived from a static corpus; they can sit in a CDN briefly. */
export const revalidate = 3600;

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  // CLAMP BOTH ENDS. `Math.min(n, 20)` alone only holds the ceiling, and the
  // floor is the end that leaks: `Number("-1")` is truthy, so a negative limit
  // survived as-is and `suggest()` passed it to `.slice(0, -1)` — which returns
  // everything but the last row. `?limit=-1` answered with all 251 records, the
  // whole corpus this route exists to avoid shipping. Floor at 1, and floor the
  // value itself so a fractional limit cannot slice on a non-integer.
  const requested = Number(searchParams.get("limit") ?? 8) || 8;
  const limit = Math.min(Math.max(1, Math.floor(requested)), 20);

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ query, suggestions: [] });
  }

  const suggestions = suggest(searchIndex(), query, limit).map((entry) => ({
    title: entry.title,
    description: entry.description.slice(0, 120),
    href: entry.href,
    type: entry.type,
    section: entry.section,
    iconName: entry.iconName,
  }));

  return NextResponse.json({ query, suggestions });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as {
      query?: unknown;
      href?: unknown;
      position?: unknown;
    };
    if (typeof body.query === "string" && typeof body.href === "string") {
      recordResultClick(
        body.query,
        body.href,
        typeof body.position === "number" ? body.position : -1,
      );
    }
  } catch {
    /* A malformed beacon is not worth an error page. */
  }
  // 204: the caller is a fire-and-forget beacon and has nothing to read.
  return new NextResponse(null, { status: 204 });
}
