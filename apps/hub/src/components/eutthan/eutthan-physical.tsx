"use client";

import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { tableScreens } from "@/lib/eutthan/portal-data";
import { StaticPager } from "./eutthan-cells";
import { Button, Icon, Select } from "@mosje/design-system";

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
          <Button variant="neutral" appearance="outlined" size="sm" iconLeft={<Icon name="download" size={16} />}>
              Download Sample Template
            </Button>
          <Button variant="neutral" appearance="outlined" size="sm" iconLeft={<Icon name="upload" size={16} />}>
              Import Achievements Data
            </Button>
          <Button href={portalLink("/ministry/physical-progress-data/add")} linkAs={Link} iconLeft={<Icon name="add" size={16} />}>
            Add Progress +
          </Button>
        </div>
      </div>
      <div className="data-card">
        <div className="toolbar" style={{ flexWrap: "wrap" }}>
          <div className="search-field">
            <Icon name="search" size={16} aria-hidden="true" />
            <input placeholder={screen.searchPlaceholder} aria-label="Search records" />
          </div>
          {screen.filters?.map((f) => (
            <Select key={f} appearance="filter" aria-label={`Filter: ${f}`} options={[{ value: f, label: f }]} defaultValue={f} />
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
