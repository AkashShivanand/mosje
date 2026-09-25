import type * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { DBIM_HEROES, dbimHref, dbimMenuFor, type DbimLink } from "@/lib/website-dbim/nav";
import { DbimTabBar } from "./DbimTabBar";
import "./page.css";

export interface DbimCrumb {
  label: string;
  /** Path inside the DBIM tree; omit for the current page's own parent when it has no page. */
  path?: string;
  /**
   * Whether this crumb is the section link the reference marks `active`. The reference
   * underlines the LAST crumb only when it is marked, so a series page whose trail ends
   * in a tab ("Home / Documents / Reports") shows no underline. Defaults to true.
   */
  active?: boolean;
}

export interface DbimPageProps {
  /** The page name — the banner's h1. */
  title: string;
  /** Breadcrumb trail AFTER "Home" and BEFORE the page itself, e.g. [{ label: "Ministry", path: "/ministry" }]. */
  crumbs: DbimCrumb[];
  /** Banner photograph. Defaults to the menu section's (DBIM_MENU[].hero), else DBIM_HEROES.default. */
  hero?: string;
  /**
   * A FIXED banner height in px, the photograph covering it. The reference draws most
   * banners at the photograph's own aspect, but Archives is a 250px box
   * (`style="height: 250px"`) — pass 250 there. Omit everywhere else.
   */
  heroHeight?: number;
  /**
   * The container's vertical margin, as the reference's templates differ:
   * "default" — `.container.mt-5`, 30px above (13 of 21 captured pages: the ministry,
   * offerings, documents, media, archives and policy templates);
   * "block" — `.container.my-5`, 30px above and below (ministry About Us, contact, RTI,
   * feedback); "flush" — plain `.container`, none (search, persona, related links, what's
   * new, important links, sitemap, help, cookies).
   */
  spacing?: "default" | "block" | "flush";
  /** The rounded dark sub-tab bar under the banner. Omit for pages that have none. */
  tabs?: DbimLink[];
  /** Path of the active tab; defaults to the current page's path. */
  activeTab?: string;
  /** The current page's path inside the DBIM tree, e.g. "/ministry/our-team" — drives the menu's active state and the default hero. */
  path: string;
  children: React.ReactNode;
}

/**
 * Intrinsic sizes of the banner photographs. The reference draws the banner at the
 * photograph's own aspect (`img.w-100`), so the band is 210px tall at 1440 for the
 * 1920×280 section photographs and 245px for the 1440×245 default.
 */
function heroSize(src: string): { width: number; height: number } {
  return src.endsWith("/default.png") ? { width: 1440, height: 245 } : { width: 1920, height: 280 };
}

/**
 * Every DBIM inner page: the banner (photograph under a primary gradient, breadcrumb,
 * h1), the dark rounded sub-tab bar overlapping its foot, and the page container.
 *
 * The breadcrumb is "Home / …crumbs"; the page itself is not repeated in it — the h1
 * says it — and the LAST crumb is underlined, as the reference marks it.
 */
export function DbimPage({ title, crumbs, hero, heroHeight, spacing = "default", tabs, activeTab, path, children }: DbimPageProps) {
  const src = hero ?? dbimMenuFor(path)?.hero ?? DBIM_HEROES.default;
  const size = heroSize(src);
  const trail: DbimCrumb[] = [{ label: "Home", path: "/" }, ...crumbs];
  // (the reference marks Home active too, so Home alone is underlined on a page with no crumbs)
  const hasTabs = Boolean(tabs && tabs.length > 0);

  return (
    <>
      <section className={`db-hero${hasTabs ? " db-hero--tabs" : ""}`} aria-labelledby="db-page-title">
        <div className="db-hero__banner" style={heroHeight ? { height: heroHeight } : undefined}>
          <Image
            src={src}
            alt=""
            width={size.width}
            height={size.height}
            sizes="100vw"
            priority
            className={heroHeight ? "db-hero__img db-hero__img--fill" : "db-hero__img"}
          />
          <div className="db-container db-hero__container">
            <div className="db-hero__text">
              <nav aria-label="Breadcrumb">
                <ol className="db-crumbs">
                  {trail.map((c, i) => {
                    const last = i === trail.length - 1;
                    const cls = last && c.active !== false ? "is-last" : undefined;
                    return (
                      <li key={`${c.label}-${i}`}>
                        {c.path ? (
                          <Link href={dbimHref(c.path)} className={cls}>
                            {c.label}
                          </Link>
                        ) : (
                          <span className={cls}>{c.label}</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
              <h1 id="db-page-title" className="db-hero__title">
                {title}
              </h1>
            </div>
          </div>
        </div>
        {hasTabs && tabs && <DbimTabBar tabs={tabs} active={activeTab ?? path} />}
      </section>
      <section className="db-page">
        <div className={`db-container db-page__container db-page__container--${spacing}`}>{children}</div>
      </section>
    </>
  );
}
