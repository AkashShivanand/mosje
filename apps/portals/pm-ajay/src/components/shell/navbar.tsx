"use client";

/* PM-AJAY Dashboard — MoSJE portal chrome.
   Faithful recreation of the MoSJE Portal figma navbar: navy utility bar +
   white brand row with the National Emblem lockup and Digital India / SAMAVESH
   marks. Uses authentic Government of India assets. */

import Image from "next/image";
import Link from "next/link";

// next/image does NOT auto-prepend the basePath, so public-asset srcs must
// include it explicitly (Link below stays basePath-relative — Next adds it).
const IMG_BASE = "/portals/pm-ajay";

export function Navbar() {
  return (
    <header>
      {/* Government of India utility bar */}
      <div className="pm-nav-utility">
        <div className="pm-nav-utility-in">
          <a href="https://india.gov.in/" target="_blank" rel="noreferrer">
            <Image src={`${IMG_BASE}/images/Indian-Flag.svg`} alt="Indian Flag" width={33} height={22} style={{ height: 15, width: "auto" }} />
            <span>Government of India</span>
          </a>
          <div className="grp">
            <a href="#pm-main">Skip to Main Content</a>
            <button type="button" className="ico-btn" aria-label="Accessibility options">
              <span className="material-symbols-rounded" aria-hidden="true">
                accessibility_new
              </span>
            </button>
            <button type="button" className="ico-btn" aria-label="Select language">
              <span className="material-symbols-rounded" aria-hidden="true">
                language
              </span>
              English
            </button>
          </div>
        </div>
      </div>

      {/* Brand row */}
      <div className="pm-nav-brand">
        <div className="pm-nav-brand-in">
          <Link className="pm-nav-lock" href="/" aria-label="Department of Social Justice & Empowerment — Home">
            <Image
              src={`${IMG_BASE}/images/National-Emblem-logo.svg`}
              alt="National Emblem of India"
              width={32}
              height={52}
              className="emblem"
              style={{ height: 56, width: "auto" }}
            />
            <span className="lines">
              <span className="l-top">
                <span className="l-min">Government of India</span>
                <span className="beta">Beta</span>
              </span>
              <span className="l-min2">Ministry of Social Justice &amp; Empowerment</span>
              <span className="l-dept">Department of Social Justice &amp; Empowerment</span>
            </span>
          </Link>
          <div className="pm-nav-logos">
            <Image src={`${IMG_BASE}/images/digital-india-logo.svg`} alt="Digital India — Power To Empower" width={105} height={41} style={{ height: 44, width: "auto" }} />
            <span className="vline" aria-hidden="true" />
            <Image src={`${IMG_BASE}/images/samavesh.png`} alt="SAMAVESH" width={120} height={120} style={{ height: 46, width: "auto" }} />
          </div>
        </div>
      </div>
    </header>
  );
}
