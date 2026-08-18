"use client";

import * as React from "react";
import { Icon } from "../icon/icon";
import { Tooltip } from "../feedback/tooltip";
import { TabsOverflow } from "./tabs-overflow";
import "./tabs.css";

/**
 * Which chrome marks the selected tab.
 *
 * `rail` is the vertical counterpart of `underline` — the same 2px mark, moved to the
 * leading edge — so it belongs with a `vertical` orientation and reads as broken beside
 * a horizontal list.
 */
export type TabIndicator = "underline" | "rail" | "pill";

/** Applies to the whole list, never to one tab. Heights: 36 / 44 / 48. */
export type TabSize = "s" | "m" | "l";

/**
 * `enclosed` is the filled, bordered track that holds pills. `none` is an open list that
 * takes an underline (horizontal) or a rail (vertical).
 *
 * PAIRING: `none` + `pill` and `enclosed` + `underline` both read as broken — a pill
 * floating on an open list has nothing to sit in, and an underline inside a filled track
 * competes with the track's own edge.
 */
export type TabTrack = "none" | "enclosed";

export type TabOrientation = "horizontal" | "vertical";

export interface TabDef {
  /** Stable id fragment (used to build tab/panel ids). */
  id: string;
  /** Visible, accessible tab label. */
  label: string;
  /** Material Symbols Rounded glyph name, placed before the label. Sized by `size`. */
  icon?: string;
  /** A small unread/attention dot after the label. Inherits the tab's own state colour. */
  badge?: boolean;
  /**
   * Renders the tab as unavailable. It STAYS in the tablist and keeps `role="tab"` —
   * it is marked `aria-disabled`, not removed — so a screen-reader user still hears that
   * the section exists. Arrow navigation skips over it.
   */
  disabled?: boolean;
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
  /** Selected-tab chrome. @default "pill" */
  indicator?: TabIndicator;
  /** Tab height and type scale. @default "m" */
  size?: TabSize;
  /** Open list or filled track. @default "enclosed" */
  track?: TabTrack;
  /** Lay the tabs out in a row or a column. @default "horizontal" */
  orientation?: TabOrientation;
  /**
   * Draw the rule the indicator sits in. Ignored when `track="enclosed"`, which has its
   * own border. @default true
   */
  divider?: boolean;
  /**
   * Offer the `Tabs / More` overflow menu when the row cannot show every tab.
   *
   * OFF by default, and opt-in for a reason: turning it on wraps the tablist in
   * a positioning element, so the rendered DOM changes. Every consumer that
   * does not ask for it renders exactly what it did before.
   *
   * Horizontal only — a vertical list wraps its labels instead of clipping
   * them, so it has nothing to overflow. The button appears only when tabs are
   * actually hidden, never as permanent chrome.
   *
   * It does NOT remove tabs from the tablist: every tab stays focusable and
   * arrow-reachable, and the menu is a pointer shortcut to the ones scrolled
   * out of view.
   */
  overflow?: boolean;
}

/** The first non-disabled index at or after `from`, walking `dir`, wrapping. */
function step(tabs: TabDef[], from: number, dir: 1 | -1): number | null {
  const n = tabs.length;
  for (let k = 1; k <= n; k++) {
    const i = (((from + dir * k) % n) + n) % n;
    if (!tabs[i]?.disabled) return i;
  }
  return null;
}

/** The first (`dir` 1) or last (`dir` -1) non-disabled index. */
function edge(tabs: TabDef[], dir: 1 | -1): number | null {
  for (let k = 0; k < tabs.length; k++) {
    const i = dir === 1 ? k : tabs.length - 1 - k;
    if (!tabs[i]?.disabled) return i;
  }
  return null;
}

/**
 * MoSJE / SAMAVESH Tabs — the WAI-ARIA Tabs pattern with **automatic
 * activation**: `role=tablist/tab`, `aria-selected`, `aria-controls`, a roving
 * `tabindex`, and Arrow / Home / End keyboard navigation. A polite live region
 * announces the active section on change (WCAG 4.1.3).
 *
 * Pair each active tab with a {@link TabPanel} using the same `idBase`.
 * The parent owns the active index and renders one panel at a time.
 *
 * OVERFLOW: a horizontal list that outgrows its container scrolls
 * (`overflow-x: auto`). The Figma library carries a `Tabs / More` menu trigger for
 * this; it has no counterpart here yet, so there is no `overflow` prop to set.
 */
export function Tabs({
  tabs,
  active,
  onChange,
  idBase,
  ariaLabel = "Sections",
  indicator = "pill",
  size = "m",
  track = "enclosed",
  orientation = "horizontal",
  divider = true,
  overflow = false,
}: TabsProps) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const labelRefs = React.useRef<Array<HTMLSpanElement | null>>([]);
  const listRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const [clipped, setClipped] = React.useState<boolean[]>([]);
  const [hidden, setHidden] = React.useState<number[]>([]);

  const vertical = orientation === "vertical";
  const iconSize = size === "s" ? 16 : size === "l" ? 24 : 20;
  // The rule only exists on an open list; an enclosed track draws its own border.
  const showDivider = divider && track === "none";

  // Slides the indicator to the selected button's measured position instead of each
  // tab painting its own chrome — that's what lets it glide with a CSS `transition`
  // rather than snap. Measured with `getBoundingClientRect` (not `offsetLeft`) so it is
  // correct whatever the tablist's own box looks like, then corrected by two terms that
  // an eyeballed version misses:
  //
  //   clientLeft/clientTop — the BORDER width. `getBoundingClientRect` reports the
  //     border box, but an absolutely positioned child is laid out against the PADDING
  //     box, so on the enclosed track (1px border) the mark sat exactly 1px right of
  //     the tab it was marking. Measured, not guessed: deltaX was 1, clientLeft was 1.
  //   scrollLeft/scrollTop — the mark scrolls WITH the content while the rects are
  //     reported against the viewport, so without this it drifts by exactly the scroll
  //     distance once a horizontal list overflows.
  //
  // `prefers-reduced-motion` is handled in CSS (`transition: none`), not here — the
  // position still updates, it just stops animating.
  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;
    const btn = refs.current[active];
    const mark = indicatorRef.current;
    if (!list || !btn || !mark) return;
    const listRect = list.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    if (vertical) {
      const y = btnRect.top - listRect.top - list.clientTop + list.scrollTop;
      mark.style.transform = `translateY(${y}px)`;
      mark.style.height = `${btnRect.height}px`;
      // Cleared so a runtime orientation change cannot leave the cross-axis size
      // pinned to whatever the other orientation last wrote.
      mark.style.width = "";
    } else {
      const x = btnRect.left - listRect.left - list.clientLeft + list.scrollLeft;
      mark.style.transform = `translateX(${x}px)`;
      mark.style.width = `${btnRect.width}px`;
      mark.style.height = "";
    }
  }, [active, vertical]);

  /**
   * A truncated label must stay RECOVERABLE — by every input, not just a mouse.
   *
   * This tracks which labels are actually clipped, so only those get a tooltip
   * and every other tab is spared a redundant one. It is STATE rather than an
   * attribute set imperatively because the rescue is now a real `Tooltip`, which
   * has to be rendered.
   *
   * Note there is no feedback loop: wrapping a tab in `Tooltip` renders the same
   * button, so measuring cannot change what was measured.
   */
  const updateTruncation = React.useCallback(() => {
    const next = labelRefs.current.map((el) => !!el && el.scrollWidth > el.clientWidth + 1);
    setClipped((prev) =>
      prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next,
    );
  }, []);

  /**
   * Which tabs are not fully inside the tablist's visible box.
   *
   * Measured, not derived from a count: a tab is "hidden" when either edge
   * falls outside, which is what a user actually experiences. Recomputed on
   * SCROLL as well as on resize, because scrolling is precisely what changes
   * the answer — the menu lists what you cannot see right now.
   */
  const updateOverflow = React.useCallback(() => {
    const list = listRef.current;
    if (!overflow || vertical || !list) {
      setHidden((prev) => (prev.length ? [] : prev));
      return;
    }
    const box = list.getBoundingClientRect();
    const next: number[] = [];
    refs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      // 1px of tolerance: sub-pixel layout should not report a flush tab hidden.
      if (r.left < box.left - 1 || r.right > box.right + 1) next.push(i);
    });
    setHidden((prev) =>
      prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next,
    );
  }, [overflow, vertical]);

  // Runs before paint so the very first placement (and every tab-count
  // change) never renders one frame at the wrong spot.
  React.useLayoutEffect(() => {
    updateIndicator();
    updateTruncation();
    updateOverflow();
  }, [updateIndicator, updateTruncation, updateOverflow, tabs, size, indicator, track, orientation]);

  /**
   * Re-measure whenever the BOX changes, not just the window.
   *
   * A `resize` listener only fires for the viewport, and both of the things
   * measured here depend on the container instead: whether a label is clipped is
   * a function of the width it was given, and the indicator is placed from the
   * selected tab's rect. A collapsing sidebar, a sibling growing, a panel
   * opening, or a webfont swapping in all change those without the window
   * moving — and the symptom is silent, because a stale indicator still looks
   * like an indicator. Observed live: narrowing the container left the rail at
   * 44px against a tab that had wrapped to 64px, and only a window resize
   * corrected it.
   *
   * Every TAB is observed as well as the list, because a font swap resizes the
   * labels without changing the list's own box.
   */
  React.useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      updateIndicator();
      updateTruncation();
      updateOverflow();
    });
    if (listRef.current) ro.observe(listRef.current);
    for (const el of refs.current) if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [updateIndicator, updateTruncation, updateOverflow, tabs.length]);

  // Scrolling changes which tabs are visible without changing any box, so a
  // ResizeObserver cannot see it.
  React.useEffect(() => {
    const list = listRef.current;
    if (!list || !overflow || vertical) return;
    list.addEventListener("scroll", updateOverflow, { passive: true });
    return () => list.removeEventListener("scroll", updateOverflow);
  }, [updateOverflow, overflow, vertical]);

  const move = (index: number | null) => {
    if (index === null) return;
    onChange(index);
    // focus follows selection (automatic-activation tabs)
    requestAnimationFrame(() => refs.current[index]?.focus());
  };

  // Both key pairs stay live in both orientations. WAI-ARIA only REQUIRES the pair that
  // matches `aria-orientation`, and honouring the other as well costs a user nothing
  // while rescuing anyone who reached for the axis they could see.
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next: number | null = null;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = step(tabs, i, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = step(tabs, i, -1);
        break;
      case "Home":
        next = edge(tabs, 1);
        break;
      case "End":
        next = edge(tabs, -1);
        break;
      default:
        return;
    }
    e.preventDefault();
    move(next);
  };

  /**
   * Chosen from the overflow menu. Selecting is not enough — the tab is by
   * definition off-screen, so it is scrolled into view and focused, or the user
   * picks something and nothing appears to happen.
   */
  const selectFromMenu = (index: number) => {
    onChange(index);
    requestAnimationFrame(() => {
      refs.current[index]?.scrollIntoView({ block: "nearest", inline: "nearest" });
      refs.current[index]?.focus();
    });
  };

  const showMore = overflow && !vertical && hidden.length > 0;

  const listClass = [
    "ds-tabs",
    `ds-tabs--${orientation}`,
    `ds-tabs--${indicator}`,
    `ds-tabs--track-${track}`,
    `ds-tabs--${size}`,
    overflow && !vertical ? "ds-tabs--overflow" : "",
    showDivider ? "ds-tabs--divider" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const tablist = (
    <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation={orientation}
        className={listClass}
      >
        <span ref={indicatorRef} className="ds-tabs__indicator" aria-hidden="true" />
        {tabs.map((t, i) => {
          const selected = active === i;
          const button = (
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${idBase}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${idBase}-panel-${t.id}`}
              // `aria-disabled`, never the native `disabled` attribute: a natively
              // disabled button leaves the focus order and stops being announced, so a
              // screen-reader user loses the fact that the section exists at all.
              aria-disabled={t.disabled || undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                if (!t.disabled) onChange(i);
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`ds-tabs__tab${selected ? " is-selected" : ""}${
                t.disabled ? " is-disabled" : ""
              }`}
            >
              {t.icon ? <Icon name={t.icon} size={iconSize} className="ds-tabs__icon" /> : null}
              <span
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                className="ds-tabs__label"
              >
                {t.label}
              </span>
              {t.badge ? <span className="ds-tabs__badge" aria-hidden="true" /> : null}
            </button>
          );

          // Only a label that is ACTUALLY clipped gets a tooltip. It opens on
          // hover and — the half `title` never did — instantly on keyboard focus.
          // `duplicatesTriggerName` stops it being announced a second time: the
          // clipping is CSS, so the full name is already in the accessibility tree.
          return clipped[i] ? (
            <Tooltip key={t.id} content={t.label} duplicatesTriggerName>
              {button}
            </Tooltip>
          ) : (
            <React.Fragment key={t.id}>{button}</React.Fragment>
          );
        })}
    </div>
  );

  return (
    <>
      {overflow && !vertical ? (
        // The wrapper exists ONLY when overflow is enabled, so no consumer that
        // has not asked for it sees a DOM change. The trigger sits OUTSIDE the
        // tablist — a tablist owns tabs, and a button among them misdescribes
        // the structure — which is also what keeps it pinned while tabs scroll.
        <div className="ds-tabs-bar">
          {tablist}
          {showMore ? (
            <TabsOverflow
              hidden={hidden}
              tabs={tabs}
              size={size}
              onSelect={selectFromMenu}
              // NOT lowercased: `ariaLabel` is a proper noun as often as not, and
              // "More pm-ajay components" is what lowercasing it produced.
              ariaLabel={`More ${ariaLabel}`}
            />
          ) : null}
        </div>
      ) : (
        tablist
      )}
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
