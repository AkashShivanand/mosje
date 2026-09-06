"use client";

import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { tableScreens } from "@/lib/eutthan/portal-data";
import { StaticPager } from "./eutthan-cells";
import { Icon } from "@mosje/design-system";

export function PhysicalProgressPage() {
  const screen = tableScreens["/ministry/physical-progress-data"]!;

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sa-inline-8)",
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="icon-button">
            <Icon name="download" size={14} /> Download Sample Template
          </button>
          <button type="button" className="icon-button">
            <Icon name="upload" size={14} /> Import Achievements Data
          </button>
          <Link
            href={portalLink("/ministry/physical-progress-data/add")}
            className="primary-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sa-inline-8)",
              textDecoration: "none",
            }}
          >
            <Icon name="add" size={16} /> Add Progress +
          </Link>
        </div>
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
            </tbody>
          </table>
        </div>
        <StaticPager total={0} />
      </div>
    </div>
  );
}
