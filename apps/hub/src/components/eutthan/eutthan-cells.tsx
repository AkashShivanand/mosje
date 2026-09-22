"use client";

import * as React from "react";
import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { Button, Icon, IconButton, Toggle } from "@mosje/design-system";

export function CellContent({
  col,
  val,
  basePath,
  rowLabel = "",
}: {
  col: string;
  val: string;
  basePath: string;
  rowLabel?: string;
}) {
  if (col === "Current Financial Year") {
    return val === "checked" ? (
      <span className="checkbox checked" aria-label="Current year">
        <Icon name="check" size={10} />
      </span>
    ) : (
      <span className="checkbox" aria-label="Not current year" />
    );
  }

  if (val === "menu") {
    return (
      <div className="row-actions">
        <IconButton
          icon={<Icon name="more_horiz" size={16} />}
          aria-label="More options"
          tooltip
          variant="neutral"
          appearance="text"
          size="sm"
        />
      </div>
    );
  }

  if (val === "role-actions") {
    return (
      <div className="row-actions">
        <RoleActiveToggle />
        <Button appearance="outlined" size="sm" nowrap iconLeft={<Icon name="edit" size={16} />} aria-label="Edit role">
          Edit
        </Button>
        <Button variant="danger" appearance="text" size="sm" nowrap iconLeft={<Icon name="delete" size={16} />} aria-label="Delete role">
          Delete
        </Button>
      </div>
    );
  }

  if (val === "Unmap") {
    return (
      <Button
        variant="danger"
        appearance="outlined"
        size="sm" nowrap
        aria-label={rowLabel ? `Unmap ${rowLabel}` : "Unmap this entry"}
      >
        Unmap
      </Button>
    );
  }

  if (val === "View") {
    return (
      <Button
        appearance="outlined"
        size="sm" nowrap
        iconLeft={<Icon name="visibility" size={16} />}
        aria-label={rowLabel ? `View details for ${rowLabel}` : "View details"}
      >
        View
      </Button>
    );
  }

  if (val === "Edit Delete") {
    return (
      <div className="row-actions">
        <Button
          href={portalLink(`${basePath}/edit`)}
          linkAs={Link}
          appearance="outlined"
          size="sm" nowrap
          iconLeft={<Icon name="edit" size={16} />}
          aria-label="Edit this entry"
        >
          Edit
        </Button>
        <Button variant="danger" appearance="text" size="sm" nowrap iconLeft={<Icon name="delete" size={16} />} aria-label="Delete this entry">
          Delete
        </Button>
      </div>
    );
  }

  if (val === "Edit") {
    return (
      <div className="row-actions">
        <Button
          href={portalLink(`${basePath}/edit`)}
          linkAs={Link}
          appearance="outlined"
          size="sm" nowrap
          iconLeft={<Icon name="edit" size={16} />}
          aria-label="Edit this entry"
        >
          Edit
        </Button>
      </div>
    );
  }

  if (col === "Status" && (val === "success" || val === "failed")) {
    return (
      <span className={`badge ${val === "success" ? "success" : "danger"}`}>
        {val}
      </span>
    );
  }

  if (col === "Type" && val === "Mapped") {
    return <span className="badge success">{val}</span>;
  }

  return <>{val || "—"}</>;
}

/**
 * The pager drawn under a prototype table.
 *
 * It is NOT the design system's `Pagination`, and adopting that here would make
 * things worse rather than better: these screens hold one fixed page of mock
 * rows, so a real pager would render page numbers that go nowhere — a control
 * that looks like it works and does not. It becomes the system's `Pagination`
 * the day these screens page real rows, and not before.
 */
export function StaticPager({ total }: { total: number }) {
  /*
   * DRAWN, NOT OPERABLE — which is what the docstring above always claimed and
   * the markup did not deliver. It rendered real <button>s inside a named
   * <nav>, with aria-label="Next page" and aria-current="page": a keyboard
   * reader tabbed into five controls that announced themselves as working page
   * navigation and did nothing.
   *
   * Spans inside an aria-hidden wrapper instead. Identical to look at, out of
   * the tab order, silent to a screen reader. Honest for a screen holding one
   * fixed page of mock rows, and it becomes the design system's `Pagination`
   * the day these screens page real ones.
   */
  return (
    <div aria-hidden="true" className="pagination">
      <div className="page-size">
        <span>Rows per page:</span>
        <span className="page-size__value">
          10 <Icon name="keyboard_arrow_down" size={12} />
        </span>
      </div>
      <div className="pages">
        <span className="is-disabled">&lsaquo;</span>
        <span className="current">1</span>
        {total > 10 && <span>2</span>}
        {total > 20 && <span>3</span>}
        <span>&rsaquo;</span>
      </div>
      <span style={{ fontSize: "var(--sa-type-body-2-size)", lineHeight: "var(--sa-type-body-2-lh)", color: "var(--text-muted)" }}>
        {total} total
      </span>
    </div>
  );
}

/**
 * The role's active switch. Until 2026-09-22 this was a tinted button holding a
 * toggle_on glyph with no state at all — it looked like a switch and did nothing.
 * It is the design system's Toggle now, and it switches.
 */
function RoleActiveToggle() {
  const [active, setActive] = React.useState(true);
  return <Toggle size="small" checked={active} onChange={(e) => setActive(e.target.checked)} aria-label="Role active" />;
}
