"use client";

import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { tableScreens } from "@/lib/eutthan/portal-data";
import { CellContent, Pagination } from "./eutthan-cells";
import { Icon } from "@mosje/design-system";

export function TablePage({ path }: { path: string }) {
  const screen = tableScreens[path];
  if (!screen) {
    return (
      <div className="page-stack">
        <h2 className="page-title">Page Not Found</h2>
        <p style={{ color: "var(--text-muted)" }}>
          No screen configured for <code>{path}</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        {screen.addLabel && screen.addLabel !== "Export" && (
          <Link
            href={portalLink(`${path}/add`)}
            className="primary-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sa-inline-8)",
              textDecoration: "none",
            }}
          >
            <Icon name="add" size={16} /> {screen.addLabel}
          </Link>
        )}
      </div>
      <div className="data-card">
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          <div className="search-field">
            <Icon name="search" size={16} aria-hidden="true" />
            <input placeholder={screen.searchPlaceholder} aria-label="Search records" />
          </div>
          {screen.filters?.map((f) => (
            <button key={f} type="button" className="filter-button">
              {f} <Icon name="keyboard_arrow_down" size={14} />
            </button>
          ))}
        </div>
        <div className="table-wrap table-wrap--wide">
          <table>
            <thead>
              <tr>
                {screen.columns.map((c) => (
                  <th key={c} scope="col">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screen.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={screen.columns.length}
                    style={{
                      textAlign: "center",
                      color: "var(--text-muted)",
                      padding: "var(--sa-padding-48)",
                    }}
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                screen.rows.map((row, i) => (
                  <tr key={`${row[0] ?? ""}-${i}`}>
                    {row.map((cell, j) => (
                      <td key={`${screen.columns[j] ?? j}`}>
                        <CellContent
                          col={screen.columns[j] ?? ""}
                          val={cell}
                          basePath={path}
                          rowLabel={row[0] ?? ""}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination total={screen.totalItems} />
      </div>
    </div>
  );
}
