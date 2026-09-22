"use client";

import { tableScreens } from "@/lib/eutthan/portal-data";
import { StaticPager } from "./eutthan-cells";
import { Button, Icon, Select } from "@mosje/design-system";

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
            gap: "var(--sa-inline-8)",
            flexWrap: "wrap",
          }}
        >
          <Select appearance="filter" aria-label={`Filter: ${screen.filters?.[0] ?? ""}`} options={[{ value: screen.filters?.[0] ?? "", label: screen.filters?.[0] ?? "" }]} defaultValue={screen.filters?.[0]} />
          <div className="export-buttons">
            <Button variant="neutral" appearance="outlined" size="sm" iconLeft={<Icon name="download" size={16} />}>
              Export CSV
            </Button>
            <Button variant="neutral" appearance="outlined" size="sm" iconLeft={<Icon name="description" size={16} />}>
              Export PDF
            </Button>
          </div>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar">
          <div className="search-field">
            <Icon name="search" size={16} aria-hidden="true" />
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
        <StaticPager total={screen.totalItems} />
      </div>
    </div>
  );
}
