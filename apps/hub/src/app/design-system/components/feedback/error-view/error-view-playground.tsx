"use client";

import * as React from "react";
import { ErrorView, type ErrorViewKind } from "@mosje/design-system";

export function ErrorViewPlayground() {
  const [kind, setKind] = React.useState<ErrorViewKind>("404");
  const [showSearch, setShowSearch] = React.useState(true);
  const [showDiagnostics, setShowDiagnostics] = React.useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-surface-subtle border border-neutral-subtle text-body-2">
        <div className="flex items-center gap-2">
          <label htmlFor="preset-select" className="font-semibold text-ink">
            Preset Kind:
          </label>
          <select
            id="preset-select"
            value={kind}
            onChange={(e) => setKind(e.target.value as ErrorViewKind)}
            className="px-3 py-1.5 rounded-lg border border-neutral-subtle bg-surface text-ink text-label-1"
          >
            <option value="404">404 · Page Not Found</option>
            <option value="500">500 · Server Error</option>
            <option value="403">403 · Access Restricted</option>
            <option value="maintenance">maintenance · System Update</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-ink">
          <input
            type="checkbox"
            checked={showSearch}
            onChange={(e) => setShowSearch(e.target.checked)}
            className="rounded border-neutral-subtle"
          />
          <span>Include Search Bar</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-ink">
          <input
            type="checkbox"
            checked={showDiagnostics}
            onChange={(e) => setShowDiagnostics(e.target.checked)}
            className="rounded border-neutral-subtle"
          />
          <span>Include Error Diagnostics</span>
        </label>
      </div>

      {/* Live Preview Container */}
      <div className="border border-neutral-subtle rounded-2xl bg-surface overflow-hidden shadow-sm">
        <ErrorView
          kind={kind}
          searchUrl={showSearch ? "/website/search?q=" : null}
          errorDetails={
            showDiagnostics
              ? "Error: Failed to fetch data from remote microservice endpoint.\nStatus: HTTP 500 Internal Server Error\nDigest: 8943289042\nRoute: /website/organisation/national-commission-for-safai-karamcharis"
              : undefined
          }
        />
      </div>
    </div>
  );
}
