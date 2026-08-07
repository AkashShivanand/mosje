"use client";

import { tableScreens } from "@/lib/eutthan/portal-data";
import { CellContent, Pagination } from "./eutthan-cells";
import { Icon } from "@mosje/design-system";

export function PfmsLogsPage() {
  const screen = tableScreens["/pfms-logs"]!;

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="secondary-button">
            <Icon name="refresh" size={14} /> Refresh
          </button>
          <button type="button" className="primary-button">
            <Icon name="database" size={14} /> Trigger PFMS Refresh
          </button>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          {screen.filters?.map((f) => (
            <button key={f} type="button" className="filter-button">
              {f} <Icon name="keyboard_arrow_down" size={14} />
            </button>
          ))}
          <input
            type="date"
            className="filter-button"
            style={{ padding: "8px 12px" }}
            aria-label="From date"
          />
          <input
            type="date"
            className="filter-button"
            style={{ padding: "8px 12px" }}
            aria-label="To date"
          />
        </div>
        <div className="table-wrap table-wrap--wide">
          <table style={{ minWidth: 1500 }}>
            <thead>
              <tr>
                {screen.columns.map((c) => (
                  <th key={c} scope="col" style={{ whiteSpace: "nowrap" }}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {screen.rows.map((row, i) => (
                <tr key={`${row[0] ?? ""}-${i}`}>
                  {row.map((cell, j) => (
                    <td
                      key={`${screen.columns[j] ?? j}`}
                      style={{
                        whiteSpace:
                          j === 0 || j === 1 || j === 9 || j === 10
                            ? "nowrap"
                            : undefined,
                      }}
                    >
                      <CellContent
                        col={screen.columns[j] ?? ""}
                        val={cell}
                        basePath="/pfms-logs"
                      />
                    </td>
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
