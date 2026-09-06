"use client";

import Link from "next/link";
import { portalLink } from "./eutthan-shared";
import { tableScreens } from "@/lib/eutthan/portal-data";
import { CellContent, StaticPager } from "./eutthan-cells";
import { Icon } from "@mosje/design-system";

export function MapPage({ path }: { path: string }) {
  const isSchemas = path === "/map-schema";
  const screen = tableScreens[path] ?? tableScreens["/map-ministry"]!;

  return (
    <div className="page-stack">
      <h2 className="page-title">Map Ministry/Schemes</h2>

      <div className="map-tabs" role="tablist" aria-label="Map view">
        <Link
          href={portalLink("/map-ministry")}
          className={`map-tab${!isSchemas ? " active" : ""}`}
          role="tab"
          aria-selected={!isSchemas}
          aria-current={!isSchemas ? "page" : undefined}
        >
          Ministry
        </Link>
        <Link
          href={portalLink("/map-schema")}
          className={`map-tab${isSchemas ? " active" : ""}`}
          role="tab"
          aria-selected={isSchemas}
          aria-current={isSchemas ? "page" : undefined}
        >
          Schemes
        </Link>
      </div>

      <div className="data-card">
        <div className="toolbar">
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
              {screen.rows.map((row, i) => (
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
              ))}
            </tbody>
          </table>
        </div>
        <StaticPager total={screen.totalItems} />
      </div>
    </div>
  );
}
