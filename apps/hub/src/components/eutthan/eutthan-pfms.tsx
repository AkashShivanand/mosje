"use client";

import { tableScreens } from "@/lib/eutthan/portal-data";
import { CellContent, StaticPager } from "./eutthan-cells";
import { Button, Icon, Input, Select } from "@mosje/design-system";

export function PfmsLogsPage() {
  const screen = tableScreens["/pfms-logs"]!;

  return (
    <div className="page-stack">
      <div className="table-title-row">
        <h2 className="page-title">{screen.title}</h2>
        <div style={{ display: "flex", gap: "var(--sa-inline-8)" }}>
          <Button appearance="outlined" iconLeft={<Icon name="refresh" size={16} />}>
            Refresh
          </Button>
          <Button iconLeft={<Icon name="database" size={16} />}>
            Trigger PFMS Refresh
          </Button>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          {screen.filters?.map((f) => (
            <Select key={f} appearance="filter" aria-label={`Filter: ${f}`} options={[{ value: f, label: f }]} defaultValue={f} />
          ))}
          <div className="filter-date">
            <Input type="date" size="sm" aria-label="From date" />
          </div>
          <div className="filter-date">
            <Input type="date" size="sm" aria-label="To date" />
          </div>
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
        <StaticPager total={screen.totalItems} />
      </div>
    </div>
  );
}
