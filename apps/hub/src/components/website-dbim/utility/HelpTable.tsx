"use client";

import { DbimFilterBar } from "@/components/website-dbim/ui/FilterBar";
import { useListing } from "@/components/website-dbim/ui/useListing";
import { DBIM_HELP_INTRO, DBIM_HELP_PLUGINS } from "@/lib/website-dbim/utility";
import { DbimFilteredEmpty } from "./FilteredEmpty";

type Plugin = (typeof DBIM_HELP_PLUGINS)[number];

/**
 * The Help page's search and the file-format table it searches. The reference draws
 * a search field above its help text; here it narrows the table to the formats (or
 * programs) the reader names.
 */
export function DbimHelpTable() {
  const list = useListing<Plugin>(DBIM_HELP_PLUGINS, { searchText: (x) => `${x.type} ${x.label}`, perPage: 20 });

  return (
    <>
      <DbimFilterBar search={{ value: list.query, onChange: list.setQuery, placeholder: "Search...", label: "Search file formats" }} />
      <h2 className="db-u-help__heading">Help</h2>
      <div className="db-u-prose">
        <h3 className="db-u-help__sub">Viewing Information in Various File Formats</h3>
        <p>{DBIM_HELP_INTRO}</p>
        {list.total === 0 ? (
          <DbimFilteredEmpty query={list.query} noun="file formats" onClear={list.clear} />
        ) : (
          <div className="db-u-table-wrap" role="region" aria-label="Software for each file format" tabIndex={0}>
            <table className="db-u-table">
              <caption className="sr-only">File formats used on this website and the software needed to open them</caption>
              <thead>
                <tr>
                  <th scope="col">Document Type</th>
                  <th scope="col">Plug-in for Download</th>
                </tr>
              </thead>
              <tbody>
                {list.visible.map((x) => (
                  <tr key={x.type}>
                    <th scope="row">{x.type}</th>
                    <td>
                      <a href={x.href} target="_blank" rel="noopener noreferrer">
                        {x.label}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
