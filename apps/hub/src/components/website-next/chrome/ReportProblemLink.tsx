"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * "Report a problem with this page" (issue MAN-11). Opens the feedback form with
 * the page address already filled in, so the reader does not have to describe
 * where they were.
 */
export function ReportProblemLink() {
  const pathname = usePathname() ?? "/website";
  return (
    <Link className="wn-report" href={`/website/feedback?page=${encodeURIComponent(pathname)}`}>
      Report a problem with this page
    </Link>
  );
}
