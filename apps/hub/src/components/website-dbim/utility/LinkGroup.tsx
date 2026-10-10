import { Icon } from "@mosje/design-system";
import type { DbimLinkRow as Row } from "@/lib/website-dbim/utility";
import { DbimLinkRow } from "./LinkRow";

export interface DbimLinkGroupProps {
  label: string;
  links: Row[];
  /** Open on arrival — while a search is narrowing the list, so a match is visible. */
  open?: boolean;
}

/**
 * A division in Important Links: its name, in the same row as every other link, and
 * under it the division's own links — the live sites' arrangement, where a division is
 * a heading over its pages rather than a page of its own. A native disclosure, so it
 * opens from the keyboard and is announced as expandable with nothing added.
 */
export function DbimLinkGroup({ label, links, open }: DbimLinkGroupProps) {
  return (
    <li className="db-u-group">
      <details open={open}>
        <summary className="db-u-row db-u-group__summary">
          <span className="db-u-row__text">
            <span className="db-u-row__title">{label}</span>
          </span>
          <span className="db-u-row__action">
            <span className="db-u-pill">
              <Icon name="expand_more" size={24} weight={400} aria-hidden className="db-u-group__chev" />
              <span aria-hidden="true">{links.length === 1 ? "1 Link" : `${links.length} Links`}</span>
              <span className="sr-only">{`, ${links.length} ${links.length === 1 ? "link" : "links"}`}</span>
            </span>
          </span>
        </summary>
        <ul className="db-u-rows db-u-group__links" aria-label={label}>
          {links.map((l) => (
            <DbimLinkRow key={l.label} label={l.label} path={l.path} href={l.href} />
          ))}
        </ul>
      </details>
    </li>
  );
}
