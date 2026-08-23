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

export function DocsTabs({ tabs }: DocsTabsProps): React.JSX.Element {
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

  return (
    <div className="docs-tabs-container">
      <div className="docs-tabs-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTabId === tab.id}
            tabIndex={activeTabId === tab.id ? 0 : -1}
            onClick={() => handleTabChange(tab.id)}
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
            role="tabpanel"
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
