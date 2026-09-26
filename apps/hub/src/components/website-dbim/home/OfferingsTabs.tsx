"use client";

import { useId, useRef, useState } from "react";
import type * as React from "react";
import { Button } from "@mosje/design-system";

export interface OfferingsTab {
  id: string;
  label: string;
  /** The panel, rendered on the server — this leaf only chooses which one shows. */
  panel: React.ReactNode;
}

/**
 * Key Offerings' two full-width tabs (Schemes and Services | Vacancies), as a real
 * tablist: roving tabindex, ←/→/Home/End move and select, each tab names its panel.
 */
export function OfferingsTabs({ tabs }: { tabs: OfferingsTab[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: tabs.length - 1 };
    const to = keys[e.key];
    if (to !== undefined) {
      e.preventDefault();
      select(to);
    }
  };

  return (
    <div className="db-hm-tabs">
      <div role="tablist" aria-label="Key Offerings" className="db-hm-tabs__list" onKeyDown={onKeyDown}>
        {tabs.map((t, i) => (
          <Button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            appearance="text"
            role="tab"
            id={`${base}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            className="db-hm-tab"
            onClick={() => setActive(i)}
          >
            {t.label}
          </Button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={i !== active}
          className="db-hm-tabs__panel"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
