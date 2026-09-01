"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface DocsTabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

function DocsTabsInner({ tabs }: DocsTabsProps): React.JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get("tab");

  // Default to the first tab if none is specified or if it's invalid
  const activeTabId = tabs.find((t) => t.id === activeTabParam)
    ? activeTabParam
    : tabs[0]?.id;

  const handleTabChange = (id: string) => {
    router.replace(`${pathname}?tab=${id}`, { scroll: false });
  };

  return <TabsShell tabs={tabs} activeTabId={activeTabId} onTabChange={handleTabChange} />;
}

function TabsShell({
  tabs,
  activeTabId,
  onTabChange,
}: DocsTabsProps & {
  activeTabId: string | null | undefined;
  onTabChange?: (id: string) => void;
}): React.JSX.Element {
  const listRef = React.useRef<HTMLDivElement>(null);

  /**
   * ROVING TAB INDEX NEEDS ARROW KEYS, OR IT IS A TRAP.
   *
   * `tabIndex={-1}` on the unselected tabs takes them out of the Tab sequence —
   * which is correct, and is half of the WAI-ARIA tabs pattern. The other half
   * is that Left/Right then move between them. Without it a keyboard reader
   * reaches the selected tab and there is no key, anywhere, that selects
   * another one: the Design panel is all they will ever see.
   *
   * This shipped on 95 of the estate's documentation pages, which means the
   * Code and Accessibility panels of the design system — including every props
   * table and every accessibility checklist — were unreachable without a
   * mouse. WCAG 2.1.1.
   *
   * Home/End are part of the same pattern and cost one line each.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key) || !onTabChange) return;

    const current = tabs.findIndex((t) => t.id === activeTabId);
    if (current < 0) return;

    let next = current;
    if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;

    const target = tabs[next];
    if (!target) return;

    event.preventDefault();
    onTabChange(target.id);
    // Selection follows focus, so the newly selected tab must receive it.
    // Reading the node from the list rather than holding a ref array keeps this
    // correct when the tab set changes between renders.
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[next]?.focus();
  };

  return (
    <div className="docs-tabs-container">
      <div
        className="docs-tabs-list"
        role="tablist"
        aria-label="Component documentation"
        ref={listRef}
        onKeyDown={onKeyDown}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            /*
             * `id` and `aria-controls` are what tell assistive technology which
             * panel this tab owns. Without the pair a screen reader announces
             * "tab" and "tab panel" as unrelated regions, so a reader who moves
             * to the panel has no way to know which tab produced it.
             */
            id={`docs-tab-${tab.id}`}
            aria-controls={`docs-tabpanel-${tab.id}`}
            role="tab"
            aria-selected={activeTabId === tab.id}
            tabIndex={activeTabId === tab.id ? 0 : -1}
            onClick={onTabChange ? () => onTabChange(tab.id) : undefined}
            className={`docs-tabs-trigger ${activeTabId === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="docs-tabs-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`docs-tabpanel-${tab.id}`}
            aria-labelledby={`docs-tab-${tab.id}`}
            role="tabpanel"
            /*
             * The panel is a tab stop so a reader can Tab from the tablist
             * straight into the content. The ARIA tabs pattern asks for this
             * whenever the panel does not begin with a focusable element, and
             * a documentation panel usually begins with prose.
             */
            tabIndex={activeTabId === tab.id ? 0 : undefined}
            hidden={activeTabId !== tab.id}
            className="docs-tabs-panel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Tabbed layout for a documentation page, with the open tab in `?tab=`.
 *
 * **The Suspense boundary is why the site builds.** `useSearchParams()` opts a
 * route out of static prerendering unless it sits under one, and Next fails the
 * build rather than warning: the production deploy died on
 * `/design-system/components/actions/button` with "useSearchParams() should be
 * wrapped in a suspense boundary", which is why nothing reached production for
 * four hours. Putting the boundary here rather than in each page means a docs
 * page cannot forget it.
 *
 * **The fallback renders the first tab, not a spinner.** It is what gets baked
 * into the static HTML, so it is what a crawler and a reader on a cold load
 * actually see. A spinner there would mean the documentation prerenders to
 * nothing. The tabs render as inert markup until the client takes over and the
 * `?tab=` value is known — a moment where the content is present but not yet
 * switchable, which is the right way round for a documentation page.
 */
export function DocsTabs({ tabs }: DocsTabsProps): React.JSX.Element {
  return (
    <React.Suspense fallback={<TabsShell tabs={tabs} activeTabId={tabs[0]?.id} />}>
      <DocsTabsInner tabs={tabs} />
    </React.Suspense>
  );
}
