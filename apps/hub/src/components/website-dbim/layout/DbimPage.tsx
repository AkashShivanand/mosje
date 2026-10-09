import type * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { dbimHeroFor, dbimHref, type DbimLink } from "@/lib/website-dbim/nav";
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
   * A photograph for this page at 1920×280, overriding the page-by-page table in
   * `dbimHeroFor` (lib/website-dbim/nav.ts). Where neither gives one, the banner is the
   * plain primary band, the DBIM Toolkit's banner colour. A photograph that says nothing
   * about its page is not a hero — the office laptop over a drug-demand-reduction scheme
   * was the case named on 30 Sep 2026 (DBIM 3.0 §6.2.6, subject and story).
   */
  hero?: string;
  /**
   * A FIXED banner height in px. The reference draws most banners at 1920:280, but
   * Archives is a 250px box (`style="height: 250px"`) — pass 250 there. Omit everywhere else.
   */
  heroHeight?: number;
  /**
   * A photograph of any shape — an organisation's own banner, usually 4:3 — cropped
   * to the section banners' 1920:280 band rather than drawn at its own aspect, which
   * would make the band as tall as the photograph. Phones already fill the band.
   */
  heroCrop?: boolean;
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
  /**
   * The page's own action, on the title's line at the banner's trailing edge — the Beneficiary
   * Dashboard's Officer Login (8 Oct 2026). At most one: a banner is not a toolbar.
   */
  action?: React.ReactNode;
}


/**
 * Every DBIM inner page: the banner (the primary band, or the subject's own photograph
 * under a primary gradient; breadcrumb; h1), the dark rounded sub-tab bar overlapping
 * its foot, and the page container.
 *
 * The breadcrumb is "Home / …crumbs"; the page itself is not repeated in it — the h1
 * says it — and the LAST crumb is underlined, as the reference marks it.
 */
export function DbimPage({ title, crumbs, hero: heroProp, heroHeight, heroCrop, spacing = "default", tabs, activeTab, path, children, action }: DbimPageProps) {
  const hero = heroProp ?? dbimHeroFor(path);
  const trail: DbimCrumb[] = [{ label: "Home", path: "/" }, ...crumbs];
  // (the reference marks Home active too, so Home alone is underlined on a page with no crumbs)
  const hasTabs = Boolean(tabs && tabs.length > 0);

  return (
    <>
      <section className={`db-hero${hasTabs ? " db-hero--tabs" : ""}`} aria-labelledby="db-page-title">
        <div
          className={`db-hero__banner${hero ? "" : " db-hero__banner--band"}${hero || heroHeight ? "" : " db-hero__banner--ratio"}${hero && heroCrop && !heroHeight ? " db-hero__banner--crop" : ""}`}
          style={heroHeight ? { height: heroHeight } : undefined}
        >
          {!hero ? null : heroCrop && !heroHeight ? (
            // A photograph of any shape sits in a frame of its own — the band's right
            // half from 768 — which it fills; the frame, not the image, is placed.
            <div className="db-hero__photo">
              <Image src={hero} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" priority className="db-hero__img db-hero__img--fill" />
            </div>
          ) : heroHeight ? (
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
              {action ? (
                <div className="db-hero__titlerow">
                  <h1 id="db-page-title" className="db-hero__title">
                    {title}
                  </h1>
                  <div className="db-hero__action">{action}</div>
                </div>
              ) : (
                <h1 id="db-page-title" className="db-hero__title">
                  {title}
                </h1>
              )}
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
