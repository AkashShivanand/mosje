import { NextResponse } from "next/server";

import { fallbackFor, PROTECTED } from "@/lib/bhashini/fallback";
import { findLanguage, SOURCE_LANGUAGE } from "@/lib/bhashini/languages";
import { isConfigured, translateStrings } from "@/lib/bhashini/server";

/**
 * POST /api/bhashini/translate
 *
 * The browser's only door to Bhashini. It exists so the ULCA credentials stay on
 * the server, and so there is one place that can batch, cache and refuse.
 *
 * Request   { "target": "hi", "strings": ["Home", "Documents"] }
 * Response  { "configured": true, "target": "hi",
 *             "translations": { "Home": "मुख्य पृष्ठ", … },
 *             "source": "bhashini" | "fallback" | "mixed" }
 *
 * ── IT ANSWERS 200 WHEN BHASHINI IS UNAVAILABLE ───────────────────────────────
 * No credentials, or Bhashini erroring, is not a 500 here. The caller is a
 * language switch on a government masthead: the correct outcome is the page
 * staying readable in English (or in the bundled Hindi), not an error state. The
 * response says which happened via `configured` and `source`, so the interface
 * can be honest about it without breaking.
 */

export const runtime = "nodejs";

/** Anything longer is a page, not a label — and pages are not translated here. */
const MAX_STRINGS = 100;

interface Body {
  target?: unknown;
  strings?: unknown;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Body must be JSON." }, { status: 400 });
  }

  const target = typeof body.target === "string" ? body.target : "";
  const strings = Array.isArray(body.strings)
    ? body.strings.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];

  if (!findLanguage(target)) {
    return NextResponse.json(
      { error: `Unknown language "${target}". See lib/bhashini/languages.ts.` },
      { status: 400 },
    );
  }
  if (strings.length === 0) {
    return NextResponse.json({ configured: isConfigured(), target, translations: {}, source: "none" });
  }
  if (strings.length > MAX_STRINGS) {
    return NextResponse.json(
      { error: `${strings.length} strings requested; the limit is ${MAX_STRINGS}.` },
      { status: 413 },
    );
  }

  // English is the source. Nothing to do, and nothing to spend.
  if (target === SOURCE_LANGUAGE) {
    return NextResponse.json({
      configured: isConfigured(),
      target,
      translations: Object.fromEntries(strings.map((s) => [s, s])),
      source: "none",
    });
  }

  const translations: Record<string, string> = {};
  const needsApi: string[] = [];

  for (const source of strings) {
    // Official names pass through untranslated — see PROTECTED.
    if (PROTECTED.has(source)) {
      const authoritative = fallbackFor(source, target);
      translations[source] = authoritative ?? source;
      continue;
    }
    const bundled = fallbackFor(source, target);
    if (bundled) {
      translations[source] = bundled;
      continue;
    }
    needsApi.push(source);
  }

  const usedFallback = Object.keys(translations).length > 0;

  if (needsApi.length === 0) {
    return NextResponse.json({ configured: isConfigured(), target, translations, source: "fallback" });
  }

  if (!isConfigured()) {
    // Untranslated strings keep their English source. A blank government label is
    // worse than an English one.
    for (const s of needsApi) translations[s] = s;
    return NextResponse.json({
      configured: false,
      target,
      translations,
      source: usedFallback ? "fallback" : "none",
      notice:
        "Bhashini credentials are not set; only bundled chrome strings were translated. " +
        "See docs/integrations/bhashini.md.",
    });
  }

  try {
    const results = await translateStrings(needsApi, target);
    needsApi.forEach((s, i) => {
      translations[s] = results[i] ?? s;
    });
    return NextResponse.json({
      configured: true,
      target,
      translations,
      source: usedFallback ? "mixed" : "bhashini",
    });
  } catch (error) {
    // Bhashini is down or rejected us. Degrade to English rather than to an error
    // page — the reader came here for the Department, not for our integration.
    for (const s of needsApi) translations[s] = s;
    console.warn("[bhashini] translation failed, serving source text:", error);
    return NextResponse.json({
      configured: true,
      target,
      translations,
      source: usedFallback ? "fallback" : "none",
      notice: "Bhashini did not respond; untranslated text is shown in English.",
    });
  }
}
