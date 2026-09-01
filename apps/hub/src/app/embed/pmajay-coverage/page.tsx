import type { Metadata } from "next";
import { PmajayWorksMap } from "@/components/website/PmajayWorksMap";
import { getPmajayReach } from "@/lib/website/pmajay-api";
import "@/app/website/website.css";
import "./embed.css";

/**
 * PM-AJAY's Scheme Coverage section, on its own, for embedding elsewhere.
 *
 * ── WHY A ROUTE AND NOT A BUNDLE ────────────────────────────────────────────
 *
 * The department's live site is WordPress with Elementor, and the ask is to put
 * this section into a page there. Three ways to do that, and only one of them
 * keeps a single source of truth:
 *
 *  1. Ship the section as a script the theme loads. It is React, it carries the
 *     whole `--sa-*` token contract, an SVG map, and a 10,157-row index it
 *     fetches on demand. Dropping that into a WordPress theme means its CSS and
 *     the theme's meet in one cascade, and every future change to the section
 *     needs a second release into WordPress.
 *  2. Export it as static HTML. It is an interactive instrument — layers toggle,
 *     the list sorts, pages, searches and drills three levels. Static HTML is a
 *     screenshot with extra steps.
 *  3. THIS: a route that renders the section and nothing else, framed by the
 *     WordPress page. One deployment, one codebase, and the embed updates when
 *     the estate does. Style isolation is free — an iframe is its own document,
 *     so nothing here can leak into the theme and nothing there can reach in.
 *
 * ── WHAT THIS PAGE DELIBERATELY DOES NOT RENDER ─────────────────────────────
 *
 * No masthead, no footer, no breadcrumb, no accessibility bar, no chatbot, no
 * demo rail. The host page already has its own chrome and its own accessibility
 * controls, and a second set inside a frame is two of everything the citizen has
 * to tell apart. `app/embed/layout.tsx` is where that exclusion lives.
 */
export const metadata: Metadata = {
  title: "PM-AJAY Scheme Coverage",
  /*
   * An embed is not a page anyone should land on from a search result — it has
   * no heading above it, no navigation and no context. The canonical home of
   * this content is the organisation page that frames it properly.
   */
  robots: { index: false, follow: false },
};

/*
 * Same revalidation as the page it is taken from. An embed serving fresher or
 * staler figures than its own site would be two answers to one question.
 */
export const revalidate = 3600;

export default async function PmajayCoverageEmbed() {
  const reach = await getPmajayReach();
  return (
    <main className="pmw-embed">
      <PmajayWorksMap data={reach} />
    </main>
  );
}
