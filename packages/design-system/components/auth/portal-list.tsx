"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
// DS Audit: Chip ✅ · PortalCard ✅ · both already in the barrel. Nothing here is
// hand-rolled: the chips are the DS Chip and every row is the DS Portal Card in
// its Compact variant, which is what the Figma `Auth / PortalList` instances are.
import { Chip } from "../forms/chip";
import { PortalCard } from "../navigation/portal-card";
import {
  DEFAULT_APPS,
  PORTAL_CATEGORIES,
  isLiveEntry,
  portalCategoriesIn,
  portalLabel,
  type AppEntry,
  type PortalCategory,
} from "../navigation/app-switcher-utils";
import "./portal-list.css";

/** "All" is not a category — it is the absence of a filter. */
const ALL = "All" as const;
type Filter = typeof ALL | PortalCategory;

export interface PortalListProps {
  /**
   * The portals to offer. Defaults to the estate registry.
   *
   * **Do not pass a hand-written list.** `DEFAULT_APPS` owns whether a portal
   * EXISTS, and a hand-kept copy of it once shipped a 404. Pass a filtered
   * `DEFAULT_APPS` if a surface genuinely offers fewer.
   */
  apps?: AppEntry[];
  /**
   * The portal the reader is already in — drawn as the selected card, with
   * `aria-current`. Pass the path, e.g. `/portals/e-anudaan`.
   */
  activePath?: string;
  /**
   * Called with the chosen entry. Provide it when the list is a PICKER — the
   * card becomes a button-like link the surface handles.
   *
   * Omit it and each card is a plain link to its portal, which is what the
   * `/portals` directory wants.
   */
  onSelect?: (entry: AppEntry) => void;
  /**
   * Show the category filter row. @default true
   *
   * Off for a short list: six chips above five portals is chrome, not help.
   */
  filterable?: boolean;
  /**
   * Offer portals that are not live yet, drawn as disabled cards. @default false
   *
   * On, a reader sees the whole estate and which parts of it are not open yet;
   * off, they see only what they can actually enter. Off is the default because
   * this list is usually a way IN, and a way in that mostly cannot be taken is
   * a worse list.
   */
  includePlanned?: boolean;
  className?: string;
}

/**
 * The scrollable list of portals inside the picker — filters over cards.
 *
 * Mirrors `Auth / PortalList` (`55444:709`), which drops into `SideSheet`'s
 * Content slot. There is deliberately **no `PortalPicker` component**: the
 * picker is `SideSheet` + this, and inventing a third component to say so would
 * add a name without adding a decision.
 *
 * **The labels come from `PORTAL_LABELS`, never from this file.** That map exists
 * because two surfaces needed the same answer and disagreed — the banner showed
 * "PM-AJAY / Pradhan Mantri Anusuchit Jaati Abhyuday Yojana" while `/portals`
 * showed "PM / PM-AJAY", leaking an internal admin label to citizens. A third
 * copy here would re-open exactly that.
 *
 * **Every state the list can be in is drawn** (`data-state-completeness.md`):
 * populated, filtered-to-nothing, and empty. The middle one is worded
 * differently from the last on purpose — "no portal is in this category" and
 * "there are no portals" are different sentences with different remedies, and a
 * component that renders one for both is lying about one of them.
 */
export function PortalList({
  apps = DEFAULT_APPS,
  activePath,
  onSelect,
  filterable = true,
  includePlanned = false,
  className,
}: PortalListProps): React.JSX.Element {
  const [filter, setFilter] = React.useState<Filter>(ALL);

  /*
   * ONE resolved list, and everything below reads it. Counting from a different
   * expression than the one the grid renders is how a key and a map came to
   * disagree on this estate before.
   */
  const portals = React.useMemo(
    () =>
      apps.filter(
        (a) => a.group === "Portals" && (includePlanned || isLiveEntry(a)),
      ),
    [apps, includePlanned],
  );

  const categories = React.useMemo(() => portalCategoriesIn(portals), [portals]);

  const shown = React.useMemo(
    () => (filter === ALL ? portals : portals.filter((p) => p.category === filter)),
    [portals, filter],
  );

  const countFor = React.useCallback(
    (f: Filter) => (f === ALL ? portals.length : portals.filter((p) => p.category === f).length),
    [portals],
  );

  const filters: Filter[] = React.useMemo(
    () => [ALL, ...categories.filter((c) => PORTAL_CATEGORIES.includes(c))],
    [categories],
  );

  return (
    <div className={cn("ds-portal-list", className)}>
      {/* A filter row needs something to choose BETWEEN. With every live portal in
          one category the row is "All (8)" beside "Scheme Portals (8)" — two
          controls that do the same thing. Same rule as a one-tab tablist. */}
      {filterable && filters.length > 2 && (
        <div className="ds-portal-list__filters" role="group" aria-label="Filter portals by category">
          {filters.map((f) => (
            <Chip
              key={f}
              selected={filter === f}
              count={countFor(f)}
              countLabel={`${countFor(f)} portals`}
              onSelectedChange={() => setFilter(f)}
            >
              {f}
            </Chip>
          ))}
        </div>
      )}

      {shown.length > 0 ? (
        <ul className="ds-portal-list__grid">
          {shown.map((entry) => {
            const { short, full } = portalLabel(entry);
            const live = isLiveEntry(entry);
            return (
              <li key={entry.path} className="ds-portal-list__item">
                <PortalCard
                  code={short}
                  name={full}
                  href={entry.path}
                  path={entry.path}
                  selected={entry.path === activePath}
                  disabled={!live}
                  onClick={
                    onSelect && live
                      ? (event) => {
                          event.preventDefault();
                          onSelect(entry);
                        }
                      : undefined
                  }
                />
              </li>
            );
          })}
        </ul>
      ) : portals.length === 0 ? (
        /* EMPTY — the register itself has nothing to offer. */
        <p className="ds-portal-list__note">No portals are available to sign in to.</p>
      ) : (
        /* FILTERED TO NOTHING — the reader caused this and can undo it, so the
           sentence names the filter and offers the way back. */
        <p className="ds-portal-list__note">
          No portal is listed under {filter}.{" "}
          <button type="button" className="ds-portal-list__clear" onClick={() => setFilter(ALL)}>
            Show all portals
          </button>
        </p>
      )}
    </div>
  );
}
