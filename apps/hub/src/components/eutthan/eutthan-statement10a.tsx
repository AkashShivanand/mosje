"use client";

import { useState } from "react";
import { ChevronDown, Download, FileText, LayoutList } from "lucide-react";
import { tableScreens } from "@/lib/eutthan/portal-data";
import { Pagination } from "./eutthan-cells";

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
                margin: "4px 0 0",
                color: "var(--text-muted)",
                fontSize: 14,
              }}
            >
              {screen.subtitle}
            </p>
          )}
        </div>
        <div className="export-buttons">
          <button type="button" className="icon-button">
            <Download size={14} /> Export CSV
          </button>
          <button type="button" className="icon-button">
            <FileText size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="panel" style={{ padding: "16px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-muted)",
              }}
            >
              Financial Year
            </label>
            <button type="button" className="filter-button">
              2025-2026 <ChevronDown size={14} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "var(--text-muted)",
              }}
            >
              Ministry/Department
            </label>
            <button type="button" className="filter-button">
              -- All Ministries -- <ChevronDown size={14} />
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
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
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
            padding: 48,
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <LayoutList
            size={40}
            style={{
              opacity: 0.35,
              display: "block",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ margin: 0 }}>
            Select a Financial Year and click <strong>View</strong> to load
            data.
          </p>
        </div>
      )}
    </div>
  );
}
