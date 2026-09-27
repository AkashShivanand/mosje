import Link from "next/link";
import { Icon } from "@mosje/design-system";

import { dbimHref } from "@/lib/website-dbim/nav";
import "./ui.css";

export interface DbimViewMoreProps {
  /** Path inside the DBIM tree. */
  path: string;
  /** Visible label; the reference prints "View More" in uppercase. */
  label?: string;
  /** Accessible name when the visible label alone is ambiguous, e.g. "View more key offerings". */
  ariaLabel?: string;
  /** "sm" is the smaller button under Recent Documents; "md" everywhere else. */
  size?: "sm" | "md";
  className?: string;
}

/** The reference's outlined "VIEW MORE ›" link: 36 tall, 1px primary-800, radius 4. */
export function DbimViewMore({ path, label = "View More", ariaLabel, size = "md", className }: DbimViewMoreProps) {
  const cls = ["db-viewmore", size === "sm" && "db-viewmore--sm", className].filter(Boolean).join(" ");
  return (
    <Link href={dbimHref(path)} aria-label={ariaLabel} className={cls}>
      <span>{label}</span>
      <Icon name="chevron_right" size={24} />
    </Link>
  );
}
