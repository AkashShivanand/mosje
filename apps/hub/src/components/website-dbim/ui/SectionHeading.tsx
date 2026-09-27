import Link from "next/link";

import { dbimHref } from "@/lib/website-dbim/nav";
import { DbimIcon, type DbimIconName } from "./icons";
import "./ui.css";

export interface DbimSectionHeadingProps {
  icon: DbimIconName;
  title: string;
  /** Heading level; home sections are h2. */
  as?: "h2" | "h3";
  /** "inverse" is white on the dark social-media band. */
  tone?: "default" | "inverse";
  /** Makes the TITLE a link to this DBIM path (the icon stays outside it) — the reference's "About Us" links to /ministry. */
  path?: string;
  /** The icon drops to 32px below 992, as the reference's Recent Documents heading does. Default: 48 at every width. */
  compact?: boolean;
  id?: string;
  className?: string;
}

/**
 * A DBIM home-section heading: the template's own 48px icon and the title, bold
 * primary-800 — or white at weight 500 on the dark social band (its icon 32 below
 * 768), as the reference sets "In Social Media".
 */
export function DbimSectionHeading({ icon, title, as: H = "h2", tone = "default", path, compact, id, className }: DbimSectionHeadingProps) {
  const cls = ["db-heading", tone === "inverse" && "db-heading--inverse", compact && "db-heading--compact", className]
    .filter(Boolean)
    .join(" ");
  return (
    <H id={id} className={cls}>
      <DbimIcon name={icon} className="db-heading__icon" />
      {path ? (
        <Link href={dbimHref(path)} className="db-heading__link">
          {title}
        </Link>
      ) : (
        <span>{title}</span>
      )}
    </H>
  );
}
