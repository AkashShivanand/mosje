"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "@mosje/design-system";

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
  /*
   * The design system's Tabs: roving focus, arrow keys, Home and End, selection
   * following focus — the keyboard model this file used to implement for itself.
   * `idBase="docs"` keeps the ids the panels below are labelled by.
   */
  const active = Math.max(0, tabs.findIndex((t) => t.id === activeTabId));
  return (
    <div className="docs-tabs-container">
      <div className="docs-tabs-list">
        <Tabs
          idBase="docs"
          ariaLabel="Component documentation"
          divider
          panel
          tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
          active={active}
          onChange={(i) => {
            const id = tabs[i]?.id;
            if (id && onTabChange) onTabChange(id);
          }}
        />
      </div>
      <div className="docs-tabs-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`docs-panel-${tab.id}`}
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
