"use client";

import { Download, Upload, Plus, ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { tableScreens } from "@/lib/eutthan/portal-data";
import { Pagination } from "./eutthan-cells";

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
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button type="button" className="icon-button">
            <Download size={14} /> Download Sample Template
          </button>
          <button type="button" className="icon-button">
            <Upload size={14} /> Import Achievements Data
          </button>
          <Link
            href={portalLink("/ministry/physical-progress-data/add")}
            className="primary-button"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <Plus size={16} /> Add Progress +
          </Link>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          <div className="search-field">
            <Search size={16} aria-hidden="true" />
            <input placeholder={screen.searchPlaceholder} aria-label="Search records" />
          </div>
          {screen.filters?.map((f) => (
            <button key={f} type="button" className="filter-button">
              {f} <ChevronDown size={14} />
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
                    padding: 48,
                  }}
                >
                  No records found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination total={0} />
      </div>
    </div>
  );
}
