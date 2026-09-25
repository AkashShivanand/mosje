import Image from "next/image";
import Link from "next/link";
import { Icon, IconButton, Input } from "@mosje/design-system";

import { DBIM_BRAND } from "@/lib/website-dbim/assets";
import { dbimHref } from "@/lib/website-dbim/nav";
import { DbimEmblem, DbimIcon } from "../ui/icons";
import { DbimHeaderTools } from "./HeaderTools";
import { DbimMainNav } from "./MainNav";
import { DbimMobileMenu } from "./MobileMenu";
import "./chrome.css";

/**
 * DBIM Header 1 — emblem and names, site search, Digital India, and the three
 * statutory controls — followed by the menu row.
 *
 * The header and the menu row are SIBLINGS inside `.db-top`, not one element, because
 * the reference pins them differently: from 1537px the whole block is sticky, below it
 * only the menu row is (`.db-top` becomes `display: contents` there so the row's sticky
 * box is the page, not the header). On a phone neither is pinned.
 *
 * The tool cluster comes FIRST in the source and is placed last by `order`, as the
 * reference does, so "Skip to main content" is the first thing a keyboard reaches.
 * Its icons are rendered here, on the server, and handed to the client leaf — the icon
 * set is 48 KB of path data that has no business in the browser bundle.
 */
export function DbimHeader() {
  return (
    <div className="db-top">
      <header className="db-header">
        <div className="db-header__row">
          <DbimHeaderTools
            skipIcon={<DbimIcon name="skip-to-content" className="db-tools__glyph" />}
            languageIcon={<DbimIcon name="language" className="db-tools__glyph" />}
            accessibilityIcon={<DbimIcon name="accessibility" className="db-tools__glyph" />}
          />

          <div className="db-header__main">
            <div className="db-header__brand">
              <Link href={dbimHref("/")} className="db-logo">
                <DbimEmblem className="db-logo__emblem" />
                <span className="db-logo__text">
                  <span className="db-logo__gov">
                    Government of India
                    <br />
                    Ministry of Social Justice and Empowerment
                  </span>
                  <span className="db-logo__dept">Department of Social Justice and Empowerment</span>
                </span>
              </Link>
            </div>

            {/* Below 992px Digital India sits between the names and the search row. */}
            <div className="db-header__di db-header__di--mobile">
              <DigitalIndia />
            </div>

            <div className="db-header__search">
              <form role="search" action={dbimHref("/search")} method="get" className="db-search">
                <Input
                  type="search"
                  name="q"
                  placeholder="Search..."
                  aria-label="Search this website"
                  className="db-search__input"
                  autoComplete="off"
                />
                <IconButton
                  type="submit"
                  variant="neutral"
                  appearance="text"
                  aria-label="Search"
                  className="db-search__btn"
                  icon={<Icon name="search" size={24} />}
                />
              </form>
              <DbimMobileMenu />
            </div>
          </div>

          <div className="db-header__di db-header__di--desktop">
            <DigitalIndia />
          </div>
        </div>
      </header>
      <DbimMainNav />
    </div>
  );
}

function DigitalIndia() {
  const di = DBIM_BRAND.digitalIndia;
  return (
    <a
      href="https://www.digitalindia.gov.in/"
      target="_blank"
      rel="noopener noreferrer"
      className="db-di"
      aria-label="Digital India (opens in a new tab)"
    >
      <Image src={di.src} alt="" width={di.width} height={di.height} priority />
    </a>
  );
}
