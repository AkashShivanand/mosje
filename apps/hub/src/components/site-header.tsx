import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { SITE_NAV } from "./site-nav-items";

/**
 * Shared gate chrome. Rendered at the top of every hub gating page so the
 * estate reads as one cohesive product. `current` highlights the active nav
 * item; pass the matching href (or "/" for the landing gate).
 *
 * The nav appears twice by design: a flat row from `md` up, and a disclosure
 * panel below it. Only one is ever in the accessibility tree, because the
 * other is `display: none` — so both can carry the "Primary" label without
 * producing duplicate landmarks.
 */
export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/72">
      <div className="relative mx-auto flex h-16 max-w-[1280px] items-center gap-4 px-6">
        {/* Brand lockup — National Emblem + wordmark */}
        <Link
          href="/"
          aria-label="MoSJE Digital Estate — home"
          className="group flex items-center gap-3 rounded-lg pr-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gov-blue"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/National-Emblem-logo.svg"
            alt="National Emblem of India"
            width={24}
            height={39}
            className="estate-emblem h-9 w-auto"
          />
          <span className="flex flex-col border-l border-border pl-3 leading-none">
            <span className="text-[15px] font-bold tracking-tight text-ink">
              MoSJE
            </span>
            <span className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Digital Estate
            </span>
          </span>
        </Link>

        {/* Primary nav — md and up */}
        <nav
          aria-label="Primary"
          className="ml-auto hidden items-center gap-0.5 md:flex"
        >
          {SITE_NAV.map(({ label, href, newTab }) => {
            const active = current === href;
            return (
              <a
                key={href}
                href={href}
                {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gov-blue-tonal text-gov-blue-dark"
                    : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                }`}
              >
                {label}
                {newTab && (
                  <>
                    {/* WCAG 3.2.5 — say that the link opens a new tab. */}
                    <span aria-hidden="true" className="ml-1 text-[0.85em] opacity-70">
                      ↗
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </>
                )}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-1">
          <ThemeToggle />
          <MobileNav current={current} />
        </div>
      </div>
    </header>
  );
}
