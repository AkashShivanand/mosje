"use client";

import * as React from "react";
import {
  DocumentLibrary,
  Tabs,
  TabPanel,
  buttonClasses,
  type DocumentLibraryItem,
} from "@mosje/design-system";

export interface OrganisationDocumentTabGroup {
  /** Anchor-safe id — also the tab/panel id fragment. */
  id: string;
  /** The Department's own name for the shelf. Becomes the tab label. */
  heading: string;
  items: DocumentLibraryItem[];
  /** The shelf's own "View all", where the source publishes one. */
  viewAllHref?: string;
}

/**
 * THE DEPARTMENT'S OWN DOCUMENT SHELVES, AS TABS.
 *
 * NMBA publishes six separately titled document sections — IEC Materials,
 * Publications, Newsletter, Downloads, Circulars, Citizen Corner — each with its
 * own "View All" on dosje.gov.in. Two ways of rendering that were already in the
 * template and both were wrong for this page:
 *
 *   `library` merged the six into one filterable shelf. Every file survived and
 *   the Department's arrangement did not: a reader who came for the newsletter
 *   had to work out which chip it was behind.
 *
 *   `sections` gave each group a full-width band. The arrangement survived and
 *   the page did not — six headings, six count lines, six alternating grounds,
 *   and three of the six holding a SINGLE card in a three-column grid. Fifteen
 *   files took 2,400px, more than the whole of the rest of the page.
 *
 * Tabs keep the headings, keep the per-shelf route out, and cost the page one
 * band. Requested in the 07 Sep 2026 review in exactly those terms — categorise
 * the document types so the page stops scrolling.
 *
 * WHY THE TABS ARE BUTTONS, NOT LINKS. `TabDef.href` exists for a tablist whose
 * tabs are separate URLs. These are six panels on one page: there is no address
 * for "the newsletter shelf of the NMBA page", and inventing one would put six
 * near-identical routes into the sitemap for one band.
 *
 * The active tab is NOT persisted. A reader arriving from the page index's
 * "Documents & Downloads" link lands on the first shelf, which is the order the
 * Department publishes them in.
 */
export function OrganisationDocumentTabs({
  groups,
  ariaLabel,
}: {
  groups: OrganisationDocumentTabGroup[];
  /** Names the tablist — "NMBA document types". */
  ariaLabel: string;
}): React.JSX.Element | null {
  const shelves = groups.filter((g) => g.items.length > 0);
  const [active, setActive] = React.useState(0);
  const idBase = React.useId();

  if (shelves.length === 0) return null;

  const current = shelves[Math.min(active, shelves.length - 1)]!;
  const isExternal = current.viewAllHref?.startsWith("http") ?? false;

  return (
    <>
      <Tabs
        tabs={shelves.map((g) => ({ id: g.id, label: g.heading }))}
        active={Math.min(active, shelves.length - 1)}
        onChange={setActive}
        idBase={idBase}
        ariaLabel={ariaLabel}
        /* Six labels, several of them two words, will not fit a phone. The
           overflow menu is opt-in because it changes the rendered DOM, and this
           is the case it was added for. */
        overflow
      />
      <TabPanel idBase={idBase} tabId={current.id}>
        <DocumentLibrary
          /* One shelf per panel, so the chip row suppresses itself — the tab IS
             the filter, and a chip row repeating it would be two controls doing
             one job. */
          items={current.items}
          groupOrder={[current.heading]}
          /*
           * A RAIL, NOT A GRID. Asked for on 8 Sep 2026, and it finishes the job
           * the tabs started: the tabs stopped six shelves being six bands, and
           * the rail stops each shelf being two rows. Four files in a
           * three-column grid left a third of a row empty under every tab.
           *
           * The shelf's own "View All" below is what makes it safe — nothing
           * here is only reachable by dragging sideways.
           */
          layout="rail"
          railLabel={current.heading}
          viewAllSlot={
            current.viewAllHref != null ? (
              <a
                href={current.viewAllHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className={buttonClasses("primary", "outlined", "sm")}
              >
                {/*
                  * "View All", not "View all iec materials". Lower-casing the
                  * shelf name to fit it into a sentence broke the Title Case
                  * rule and produced "iec materials" and "citizen corner" on a
                  * departmental page. The tab directly above the button already
                  * names the shelf on screen, so the name is carried for screen
                  * readers only — where the button IS reached out of context.
                  */}
                View All
                <span className="sr-only"> {current.heading}</span>
                {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            ) : undefined
          }
        />
      </TabPanel>
    </>
  );
}
