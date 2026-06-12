"use client";

import { ChevronDown, Download, FileText, Search } from "lucide-react";
import { tableScreens } from "@/lib/eutthan/portal-data";
import { Pagination } from "./eutthan-cells";

export function FinancialSummaryPage() {
  const screen = tableScreens["/reports/financial-summary"]!;

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
          <button type="button" className="filter-button">
            {screen.filters?.[0]} <ChevronDown size={14} />
          </button>
          <div className="export-buttons">
            <button type="button" className="icon-button">
              <Download size={14} /> Export CSV
            </button>
            <button type="button" className="icon-button">
              <FileText size={14} /> Export PDF
            </button>
          </div>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar">
          <div className="search-field">
            <Search size={16} aria-hidden="true" />
            <input placeholder="Search for ministry..." aria-label="Search for ministry" />
          </div>
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
    </div>
  );
}
