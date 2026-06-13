"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, readThemeCookie, type Theme } from "@/lib/theme";

/**
 * Light ⇄ dark appearance toggle for the gate chrome.
 *
 * The no-flash script in the root layout already set `data-theme` pre-paint;
 * this control reads the persisted theme via `useSyncExternalStore` (server
 * snapshot = light, so there is no hydration mismatch and no setState-in-effect)
 * and flips + persists it on click.
 */

const listeners = new Set<() => void>();

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return readThemeCookie();
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isDark = theme === "dark";

  const toggle = React.useCallback(() => {
    const next: Theme = isDark ? "light" : "dark";
    applyTheme(next);
    listeners.forEach((l) => l());
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-ink-muted transition-colors hover:border-border-strong hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gov-blue ${className}`}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
