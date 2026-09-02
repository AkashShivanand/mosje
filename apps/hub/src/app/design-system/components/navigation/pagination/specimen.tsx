"use client";

import { Pagination } from "@mosje/design-system";
import * as React from "react";

export function PaginationSpecimen(): React.JSX.Element {
  const [page, setPage] = React.useState(3);
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-24)" }}>
      <Pagination page={page} totalPages={12} onPageChange={setPage} />
      <Pagination page={1} totalPages={4} hrefFor={(p) => `?page=${p}`} />
    </div>
  );
}
