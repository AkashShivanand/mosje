"use client";

import * as React from "react";
import { Icon } from "@mosje/design-system";
import { SITE_NAV } from "./site-nav-items";

/**
 * Primary navigation for phones and small tablets.
 *
 * The header nav is `hidden md:flex`, so below 768px the estate previously had
 * no header navigation at all — the AppSwitcher FAB was the only way to move
 * between destinations, and nothing on screen said so.
 *
 * Deliberately a disclosure panel rather than a full-screen overlay: five
 * links do not justify taking over the viewport, and a panel keeps the page
 * you are on visible behind it, so you can see you have not gone anywhere.
 */
export function MobileNav({ current }: { current?: string }) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Escape closes and returns focus to the trigger — otherwise focus is left
  // orphaned on a panel that no longer exists.
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="site-mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gov-blue"
      >
        <Icon name={open ? "close" : "menu"} size={22} aria-hidden />
      </button>

      {/* Rendered only when open: a permanently-mounted panel would put five
          links in the tab order of every phone page. */}
      {open && (
        <nav
          id="site-mobile-nav"
          aria-label="Primary"
          className="site-mobile-nav absolute inset-x-0 top-full border-b border-border bg-surface p-3 shadow-lg"
        >
          <ul className="flex flex-col gap-0.5">
            {SITE_NAV.map(({ label, href, newTab }) => {
              const active = current === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    {...(newTab
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-gov-blue-tonal text-gov-blue-dark"
                        : "text-ink hover:bg-surface-muted"
                    }`}
                  >
                    {label}
                    {newTab && (
                      <>
                        {/* WCAG 3.2.5 — say that the link opens a new tab. */}
                        <span aria-hidden="true" className="ml-1.5 text-[0.85em] opacity-70">
                          ↗
                        </span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
