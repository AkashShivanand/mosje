"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

/**
 * Everything the root layout hangs on every page, EXCEPT inside an embed.
 *
 * ── AN EMBED IS A FRAGMENT, NOT A PAGE ──────────────────────────────────────
 *
 * `/embed/*` is rendered inside somebody else's page — today the department's
 * WordPress site. That host already has its own masthead, its own footer and
 * its own accessibility controls, so a second accessibility widget, a second
 * chat launcher and a demo rail arriving inside the frame are not extra
 * features; they are a second copy of things the citizen already has, floating
 * in the middle of an article.
 *
 * ── THE ACCESSIBILITY WIDGET IS THE DELIBERATE PART ──────────────────────────
 *
 * `.claude/rules/accessibility-entry-point.md` says the widget is always
 * mounted and that a page with no door to it is a WCAG regression. That rule is
 * about a PAGE. An embed is not one: it has no `<h1>`, no navigation and no
 * landing route, and the page a reader is actually on supplies the door. Two
 * widgets inside one visual page is precisely the "two doors" defect that rule
 * exists to prevent, so honouring its intent here means leaving ours out.
 *
 * Recorded rather than assumed — if this estate ever serves an embed into a
 * host with no accessibility controls of its own, this is the decision to
 * revisit.
 */
export function NotInEmbed({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/embed" || pathname.startsWith("/embed/")) return null;
  return <>{children}</>;
}
