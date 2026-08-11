"use client";

import * as React from "react";
import "./tabs.css";

export interface TabDef {
  /** Stable id fragment (used to build tab/panel ids). */
  id: string;
  /** Visible, accessible tab label. */
  label: string;
}

export interface TabsProps {
  /** Ordered tab definitions. */
  tabs: TabDef[];
  /** 0-based index of the active tab (owned by the parent). */
  active: number;
  /** Called with the next active index on click or keyboard navigation. */
  onChange: (index: number) => void;
  /** Namespace for the generated tab/panel ids (e.g. `React.useId()`). */
  idBase: string;
  /** Accessible name for the tablist. @default "Sections" */
  ariaLabel?: string;
}

/**
 * MoSJE / SAMAVESH Tabs — the WAI-ARIA Tabs pattern with **automatic
 * activation**: `role=tablist/tab`, `aria-selected`, `aria-controls`, a roving
 * `tabindex`, and Arrow / Home / End keyboard navigation. A polite live region
 * announces the active section on change (WCAG 4.1.3).
 *
 * Pair each active tab with a {@link TabPanel} using the same `idBase`.
 * The parent owns the active index and renders one panel at a time.
 */
export function Tabs({ tabs, active, onChange, idBase, ariaLabel = "Sections" }: TabsProps) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);

  // Slides the active-tab pill to the selected button's measured position
  // instead of each tab painting its own background — that's what lets the
  // indicator glide with a CSS `transition` rather than snap. Measured with
  // `getBoundingClientRect` (not `offsetLeft`) so it's correct regardless of
  // the tablist's padding/border box. `prefers-reduced-motion` is handled in
  // CSS (`transition: none`), not here — the position still updates, it just
  // stops animating.
  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;
    const btn = refs.current[active];
    const indicator = indicatorRef.current;
    if (!list || !btn || !indicator) return;
    const listRect = list.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    indicator.style.transform = `translateX(${btnRect.left - listRect.left}px)`;
    indicator.style.width = `${btnRect.width}px`;
  }, [active]);

  // Runs before paint so the very first placement (and every tab-count
  // change) never renders one frame at the wrong spot.
  React.useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator, tabs.length]);

  React.useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const move = (index: number) => {
    onChange(index);
    // focus follows selection (automatic-activation tabs)
    requestAnimationFrame(() => refs.current[index]?.focus());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (i + 1) % tabs.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (i - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    move(next);
  };

  return (
    <>
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className="ds-tabs"
      >
        <span ref={indicatorRef} className="ds-tabs__indicator" aria-hidden="true" />
        {tabs.map((t, i) => {
          const selected = active === i;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idBase}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${idBase}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`ds-tabs__tab${selected ? " is-selected" : ""}`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className="ds-sr-only">
        {`Section ${active + 1} of ${tabs.length}: ${tabs[active]?.label ?? ""}`}
      </div>
    </>
  );
}

/** The panel paired with the active {@link Tabs} tab. Render one per active tab. */
export function TabPanel({
  idBase,
  tabId,
  children,
}: {
  idBase: string;
  tabId: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`${idBase}-panel-${tabId}`}
      aria-labelledby={`${idBase}-tab-${tabId}`}
      tabIndex={0}
      className="ds-tabpanel"
    >
      {children}
    </div>
  );
}
