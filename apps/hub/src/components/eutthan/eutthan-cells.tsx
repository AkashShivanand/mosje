"use client";

import {
  Check,
  ToggleRight,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { portalLink } from "./eutthan-shared";

export function CellContent({
  col,
  val,
  basePath,
}: {
  col: string;
  val: string;
  basePath: string;
}) {
  if (col === "Current Financial Year") {
    return val === "checked" ? (
      <span className="checkbox checked" aria-label="Current year">
        <Check size={10} />
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
          style={{ background: "rgba(0,51,102,0.08)" }}
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
          style={{ background: "rgba(39,104,42,0.1)" }}
          aria-label="Toggle role"
        >
          <ToggleRight size={18} style={{ color: "var(--success)" }} />
        </button>
        <button
          type="button"
          className="text-action"
          style={{
            background: "rgba(0,51,102,0.08)",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
          aria-label="Edit role"
        >
          <Edit size={14} /> Edit
        </button>
        <button
          type="button"
          className="text-action danger-action"
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          aria-label="Delete role"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    );
  }

  if (val === "Unmap") {
    return (
      <button
        type="button"
        className="text-action text-action--danger"
        style={{ background: "rgba(214,69,57,0.08)" }}
        aria-label="Unmap this entry"
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
          background: "rgba(0,51,102,0.08)",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
        aria-label="View details"
      >
        <Eye size={14} /> View
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
            background: "rgba(0,51,102,0.08)",
            minHeight: 36,
            padding: "6px 12px",
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
          aria-label="Edit this entry"
        >
          <Edit size={14} /> Edit
        </Link>
        <button
          type="button"
          className="text-action danger-action"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          aria-label="Delete this entry"
        >
          <Trash2 size={14} /> Delete
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
            background: "rgba(0,51,102,0.08)",
            minHeight: 36,
            padding: "6px 12px",
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
          aria-label="Edit this entry"
        >
          <Edit size={14} /> Edit
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
          10 <ChevronDown size={12} />
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
