"use client";

import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { Icon } from "@mosje/design-system";

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
        <button
          type="button"
          className="text-action"
          style={{ background: "var(--primary-tonal)" }}
          aria-label="More options"
        >
          •••
        </button>
      </div>
    );
  }

  if (val === "role-actions") {
    return (
      <div className="row-actions">
        <button
          type="button"
          className="text-action"
          style={{ background: "var(--success-tonal)" }}
          aria-label="Toggle role"
        >
          <Icon name="toggle_on" size={18} style={{ color: "var(--success)" }} />
        </button>
        <button
          type="button"
          className="text-action"
          style={{
            background: "var(--primary-tonal)",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sa-inline-4)",
          }}
          aria-label="Edit role"
        >
          <Icon name="edit" size={14} /> Edit
        </button>
        <button
          type="button"
          className="text-action danger-action"
          style={{ display: "inline-flex", alignItems: "center", gap: "var(--sa-inline-4)" }}
          aria-label="Delete role"
        >
          <Icon name="delete" size={14} /> Delete
        </button>
      </div>
    );
  }

  if (val === "Unmap") {
    return (
      <button
        type="button"
        className="text-action text-action--danger"
        style={{ background: "var(--danger-tonal)" }}
        aria-label={rowLabel ? `Unmap ${rowLabel}` : "Unmap this entry"}
      >
        Unmap
      </button>
    );
  }

  if (val === "View") {
    return (
      <button
        type="button"
        className="text-action"
        style={{
          background: "var(--primary-tonal)",
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--sa-inline-6)",
        }}
        aria-label={rowLabel ? `View details for ${rowLabel}` : "View details"}
      >
        <Icon name="visibility" size={14} /> View
      </button>
    );
  }

  if (val === "Edit Delete") {
    return (
      <div className="row-actions">
        <Link
          href={portalLink(`${basePath}/edit`)}
          className="text-action"
          style={{
            background: "var(--primary-tonal)",
            minHeight: 36,
            padding: "var(--sa-padding-6) var(--sa-padding-12)",
            borderRadius: "var(--sa-shape-8)",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sa-inline-6)",
          }}
          aria-label="Edit this entry"
        >
          <Icon name="edit" size={14} /> Edit
        </Link>
        <button
          type="button"
          className="text-action danger-action"
          style={{ display: "inline-flex", alignItems: "center", gap: "var(--sa-inline-6)" }}
          aria-label="Delete this entry"
        >
          <Icon name="delete" size={14} /> Delete
        </button>
      </div>
    );
  }

  if (val === "Edit") {
    return (
      <div className="row-actions">
        <Link
          href={portalLink(`${basePath}/edit`)}
          className="text-action"
          style={{
            background: "var(--primary-tonal)",
            minHeight: 36,
            padding: "var(--sa-padding-6) var(--sa-padding-12)",
            borderRadius: "var(--sa-shape-8)",
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sa-inline-6)",
          }}
          aria-label="Edit this entry"
        >
          <Icon name="edit" size={14} /> Edit
        </Link>
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

export function Pagination({ total }: { total: number }) {
  return (
    <nav aria-label="Pagination" className="pagination">
      <div className="page-size">
        <span>Rows per page:</span>
        <button type="button">
          10 <Icon name="keyboard_arrow_down" size={12} />
        </button>
      </div>
      <div className="pages">
        <button type="button" aria-label="Previous page" disabled>&lsaquo;</button>
        <button type="button" className="current" aria-current="page">
          1
        </button>
        {total > 10 && <button type="button">2</button>}
        {total > 20 && <button type="button">3</button>}
        <button type="button" aria-label="Next page">&rsaquo;</button>
      </div>
      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
        {total} total
      </span>
    </nav>
  );
}
