"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { DbimPager } from "@/components/website-dbim/connect/ListStates";

/**
 * The pager for a list cut on the SERVER (`?page=`), as Connect › Events pages its
 * past events: the page lives in the URL, so a page of an organisation's register is
 * shareable, and only ten rows reach the browser.
 */
export function DbimOrgUrlPager({ page, pageCount, children }: { page: number; pageCount: number; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const top = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={top}>
      {children}
      <DbimPager
        page={page}
        pageCount={pageCount}
        onChange={(p) => router.push(p === 1 ? pathname : `${pathname}?page=${p}`, { scroll: false })}
        target={top}
      />
    </div>
  );
}
