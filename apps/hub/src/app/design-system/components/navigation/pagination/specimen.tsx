"use client";

import { Pagination } from "@mosje/design-system";
import * as React from "react";

export function PaginationSpecimen(): React.JSX.Element {
  const [page, setPage] = React.useState(3);
  const [railPage, setRailPage] = React.useState(2);
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-24)" }}>
      <Pagination page={page} totalPages={12} onPageChange={setPage} />
      <Pagination page={1} totalPages={4} hrefFor={(p) => `?page=${p}`} />

      {/*
        `sm` is drawn, not only described. The accessibility checklist on this
        page certifies its 32px target and the arrangements rule asks every
        non-variant property to be shown — and `size` is the one a reader is
        most likely to choose wrongly, because the guidance for it was three
        paragraphs of docstring and no picture. The 19rem box is PM-AJAY's
        coverage rail, the constraint `sm` exists for.
      */}
      <div
        style={{
          width: "19rem",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sa-stack-12)",
          padding: "var(--sa-padding-16)",
          border: "var(--sa-stroke-1) solid var(--sa-border-neutral-subtle)",
          borderRadius: "var(--sa-shape-12)",
          background: "var(--sa-bg-neutral-base)",
        }}
      >
        <p style={{ margin: 0, color: "var(--sa-text-neutral-subtle)" }}>
          States and Union Territories reached
        </p>
        <Pagination
          page={railPage}
          totalPages={6}
          onPageChange={setRailPage}
          size="sm"
          siblings={0}
          label="States"
        />
      </div>
    </div>
  );
}
