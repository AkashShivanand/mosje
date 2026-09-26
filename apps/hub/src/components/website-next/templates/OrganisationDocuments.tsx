"use client";

import * as React from "react";
import { Icon, TabPanel, Tabs } from "@mosje/design-system";

export interface OrgDocument {
  id: string;
  title: string;
  href: string;
  /** "PDF", "Presentation", "Image", "Web page". */
  type: string;
  /** "10.62 MB", where the record states it. */
  size?: string;
  /** A date or source line the record prints, e.g. "05 Mar 2026". */
  meta?: string;
  external: boolean;
}

export interface OrgDocumentGroup {
  id: string;
  label: string;
  items: OrgDocument[];
  /** The shelf's own full listing, where the Department publishes one. */
  viewAllHref?: string;
}

function OrgDocumentRow({ doc }: { doc: OrgDocument }) {
  const isFile = doc.type !== "Web page";
  const facts = [doc.type, doc.size].filter(Boolean).join(", ");
  return (
    <li className="og-doc">
      <span className="og-doc__icon" aria-hidden="true">
        <Icon name={isFile ? "description" : "article"} size={24} />
      </span>
      <span className="og-doc__body">
        <a
          href={doc.href}
          className="og-doc__title"
          target={doc.external ? "_blank" : undefined}
          rel={doc.external ? "noopener noreferrer" : undefined}
        >
          {doc.title}
          <span className="sr-only">
            {` (${facts})`}
            {doc.external ? " (opens in a new window)" : ""}
          </span>
        </a>
        <span className="og-doc__meta">
          {[doc.meta, facts].filter(Boolean).join(" · ")}
        </span>
      </span>
      <span className="og-doc__action" aria-hidden="true">
        {isFile ? "View Document" : "View Details"}
        <Icon name={doc.external ? "open_in_new" : "arrow_forward"} size={16} />
      </span>
    </li>
  );
}

function Shelf({ group }: { group: OrgDocumentGroup }) {
  const ext = group.viewAllHref != null && /^https?:\/\//.test(group.viewAllHref);
  return (
    <>
      <ul className="og-docs">
        {group.items.map((d) => (
          <OrgDocumentRow key={d.id} doc={d} />
        ))}
      </ul>
      {group.viewAllHref != null && (
        <p className="og-docs__more">
          <a
            href={group.viewAllHref}
            className="og-link"
            target={ext ? "_blank" : undefined}
            rel={ext ? "noopener noreferrer" : undefined}
          >
            View All <span className="sr-only">{group.label}</span>
            {ext && (
              <>
                <Icon name="open_in_new" size={16} aria-hidden />
                <span className="sr-only"> (opens in a new window)</span>
              </>
            )}
          </a>
        </p>
      )}
    </>
  );
}

/**
 * One Documents section for an organisation, its shelves as tabs (issue LAY-13:
 * the classic page repeated near-identical sections, one per kind of file).
 *
 * The DS `Tabs` is the WAI-ARIA tab pattern with automatic activation; the active
 * shelf is not persisted, so a reader arriving from the page's own section nav
 * lands on the first shelf. A single shelf renders without a tablist, because a
 * tablist of one is a control with nothing to choose.
 */
export function OrganisationDocuments({ groups, label }: { groups: OrgDocumentGroup[]; label: string }) {
  const shelves = groups.filter((g) => g.items.length > 0);
  const [active, setActive] = React.useState(0);
  const idBase = React.useId();
  if (shelves.length === 0) return null;
  if (shelves.length === 1) return <Shelf group={shelves[0]!} />;
  const index = Math.min(active, shelves.length - 1);
  const current = shelves[index]!;
  return (
    <div className="og-tabs">
      <Tabs
        tabs={shelves.map((g) => ({ id: g.id, label: g.label }))}
        active={index}
        onChange={(i) => setActive(i)}
        idBase={idBase}
        ariaLabel={label}
        indicator="underline"
        track="none"
        overflow
      />
      <TabPanel idBase={idBase} tabId={current.id}>
        <Shelf group={current} />
      </TabPanel>
    </div>
  );
}
