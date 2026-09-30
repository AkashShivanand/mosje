import type * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { dbimHref, type DbimLink } from "@/lib/website-dbim/nav";
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
  /**
   * A photograph OF this page's subject — the organisation's building, the scheme's own
   * picture — at 1920×280. Omit it and the banner is the plain primary band (the DBIM
   * Toolkit's banner colour). A stock photograph that says nothing about the page is not
   * a hero: the reference template's laptops and server rooms were removed on 30 Sep 2026
   * for exactly that reason (DBIM 3.0 §6.2.6 subject and story, §6.1.3 usage rights).
   */
  hero?: string;
  /**
   * A FIXED banner height in px. The reference draws most banners at 1920:280, but
   * Archives is a 250px box (`style="height: 250px"`) — pass 250 there. Omit everywhere else.
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
  /** The current page's path inside the DBIM tree, e.g. "/ministry/our-team" — drives the active tab. */
  path: string;
  children: React.ReactNode;
}


/**
 * Every DBIM inner page: the banner (the primary band, or the subject's own photograph
 * under a primary gradient; breadcrumb; h1), the dark rounded sub-tab bar overlapping
 * its foot, and the page container.
 *
 * The breadcrumb is "Home / …crumbs"; the page itself is not repeated in it — the h1
 * says it — and the LAST crumb is underlined, as the reference marks it.
 */
export function DbimPage({ title, crumbs, hero, heroHeight, spacing = "default", tabs, activeTab, path, children }: DbimPageProps) {
  const trail: DbimCrumb[] = [{ label: "Home", path: "/" }, ...crumbs];
  // (the reference marks Home active too, so Home alone is underlined on a page with no crumbs)
  const hasTabs = Boolean(tabs && tabs.length > 0);

  return (
    <>
      <section className={`db-hero${hasTabs ? " db-hero--tabs" : ""}`} aria-labelledby="db-page-title">
        <div
          className={`db-hero__banner${hero ? "" : " db-hero__banner--band"}${hero || heroHeight ? "" : " db-hero__banner--ratio"}`}
          style={heroHeight ? { height: heroHeight } : undefined}
        >
          {!hero ? null : heroHeight ? (
            // A fixed-height banner is a frame the photograph fills; sizing it as an
            // intrinsic image with only its height overridden tripped Next's aspect check.
            <Image src={hero} alt="" fill sizes="100vw" priority className="db-hero__img db-hero__img--fill" />
          ) : (
            <Image src={hero} alt="" width={1920} height={280} sizes="100vw" priority className="db-hero__img" />
          )}
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
