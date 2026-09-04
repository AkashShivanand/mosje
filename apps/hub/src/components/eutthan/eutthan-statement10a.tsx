"use client";

import { useState } from "react";
import { tableScreens } from "@/lib/eutthan/portal-data";
import { Pagination } from "./eutthan-cells";
import { Icon } from "@mosje/design-system";

export function Statement10APage() {
  const screen = tableScreens["/reports/statement-10a"]!;
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <div>
          <h2 className="page-title">{screen.title}</h2>
          {screen.subtitle && (
            <p
              style={{
                margin: "var(--sa-stack-4) 0 0",
                color: "var(--text-muted)",
                fontSize: "var(--sa-type-body-2-size)", lineHeight: "var(--sa-type-body-2-lh)",
              }}
            >
              {screen.subtitle}
            </p>
          )}
        </div>
        <div className="export-buttons">
          <button type="button" className="icon-button">
            <Icon name="download" size={14} /> Export CSV
          </button>
          <button type="button" className="icon-button">
            <Icon name="description" size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="panel" style={{ padding: "var(--sa-padding-16) var(--sa-padding-24)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "var(--sa-inline-12)",
            flexWrap: "wrap",
          }}
        >
          <div
            role="group"
            aria-labelledby="s10a-fy-label"
            style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-6)" }}
          >
            <span
              id="s10a-fy-label"
              style={{
                fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
                fontWeight: 700,
                color: "var(--text-muted)",
              }}
            >
              Financial Year
            </span>
            <button type="button" className="filter-button" aria-labelledby="s10a-fy-label">
              2025-2026 <Icon name="keyboard_arrow_down" size={14} />
            </button>
          </div>
          <div
            role="group"
            aria-labelledby="s10a-ministry-label"
            style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-6)" }}
          >
            <span
              id="s10a-ministry-label"
              style={{
                fontSize: "var(--sa-type-label-2-size)", lineHeight: "var(--sa-type-label-2-lh)",
                fontWeight: 700,
                color: "var(--text-muted)",
              }}
            >
              Ministry/Department
            </span>
            <button type="button" className="filter-button" aria-labelledby="s10a-ministry-label">
              -- All Ministries -- <Icon name="keyboard_arrow_down" size={14} />
            </button>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => setLoaded(true)}
          >
            View
          </button>
        </div>
      </div>

      {loaded ? (
        <div className="data-card">
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
                {screen.rows.map((row, i) => (
                  <tr key={`${row[0] ?? ""}-${i}`}>
                    {row.map((cell, j) => (
                      <td key={`${screen.columns[j] ?? j}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination total={screen.totalItems} />
        </div>
      ) : (
        <div
          className="panel"
          style={{
            padding: "var(--sa-padding-48)",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <Icon name="view_list" size={40} style={{ opacity: 0.35, display: "block", margin: "0 auto var(--sa-stack-16)", }} />
          <p style={{ margin: 0 }}>
            Select a Financial Year and click <strong>View</strong> to load
            data.
          </p>
        </div>
      )}
    </div>
  );
}
