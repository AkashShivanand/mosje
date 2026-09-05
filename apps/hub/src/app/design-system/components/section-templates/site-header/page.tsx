import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import {
  SiteHeaderCompactPreview,
  SiteHeaderNavyPreview,
  SiteHeaderPreview,
} from "./header-preview";
import { SiteHeaderArrangementsPreview } from "./header-arrangements";

export const metadata: Metadata = {
  title: "Navbar (Header) — Design System",
  description:
    "The SAMAVESH Navbar — one component, three variants. Three tiers: accessibility bar, brand row, navigation row, with a scroll condense that keeps the emblem on the same left edge.",
};

/*
 * The props table is now generated from `SiteHeaderProps` by the type checker,
 * which closes a documented gap. The hand-written table this page carried until
 * 2026-09-02:
 *
 *   - INVENTED `tone` ("blue" | "navy"), which is `UtilityTone` on the
 *     accessibility bar and has never been a prop of this component;
 *   - published `beta` as defaulting to false, against a real default of true;
 *   - published `maxWidth` as defaulting to 1320, against a real default of
 *     undefined — the point of which is that it falls through to
 *     `--sa-container-page` and stays aligned with the page below it;
 *   - narrowed `search` to `{ placeholder?, onSearch? }`, hiding the three
 *     autocomplete fields `HeaderSearchConfig` actually carries;
 *   - omitted `emblemAlt` and `className` entirely, and folded five more props
 *     into three shared rows, so `skipTo`, `onAccessibility`,
 *     `accessibilityHref`, `account` and `accountMenu` had no row of their own.
 *
 * The companion shapes below are hand-written because the extractor reads
 * exported `*Props` interfaces, and these are the objects those props carry.
 */
const SHAPES: PropDef[] = [
  {
    name: "BrandLines · department",
    type: "string",
    required: true,
    description: "The primary line, 20/24 SemiBold. The full official name, never an acronym.",
  },
  { name: "BrandLines · ministry", type: "string", description: "“Ministry of Social Justice & Empowerment”, 12/16, muted." },
  { name: "BrandLines · org", type: "string", description: "“Government of India”, 12/16, muted." },
  {
    name: "NavItem · label / href",
    type: "string",
    required: true,
    description: "A short Title Case noun phrase, and its destination. Keep labels to one or two words so the row does not wrap.",
  },
  { name: "NavItem · active", type: "boolean", description: "Marks the current page." },
  { name: "NavItem · external", type: "boolean", description: 'Opens in a new tab and adds rel="noreferrer".' },
  {
    name: "NavItem · disabled",
    type: "boolean",
    description:
      "The disabled treatment — muted, no href, aria-disabled. For a destination that exists in the information architecture but is not reachable yet; drop the entry if it never will be.",
  },
  { name: "NavItem · children", type: "NavLink[]", description: "A simple single-column dropdown." },
  {
    name: "NavItem · columns",
    type: "NavColumn[]",
    description:
      "A titled multi-column mega-menu — each column carries either rich organisation rows (items) or plain links. If both children and columns are given, columns wins.",
  },
  {
    name: "HeaderSearchConfig · placeholder",
    type: "string",
    description: "Hint at scope — “Search schemes, services, documents” — rather than a bare “Search”.",
  },
  { name: "HeaderSearchConfig · onSearch", type: "(query: string) => void", description: "The query was submitted — Enter, or the leading icon." },
  {
    name: "HeaderSearchConfig · onQueryChange",
    type: "(query: string) => void",
    description:
      "Every keystroke, so the owner can fetch autocomplete rows. DEBOUNCE ON THE OWNER'S SIDE — the masthead must not decide how often a consumer's index may be hit.",
  },
  { name: "HeaderSearchConfig · suggestions", type: "SearchSuggestion[]", description: "Autocomplete rows for the current query. Omit for no autocomplete." },
  { name: "HeaderSearchConfig · onSuggestionSelect", type: "(suggestion: SearchSuggestion) => void", description: "A suggestion was chosen, by click or by Enter on the highlighted row." },
  {
    name: "HeaderAccount · name / email / role",
    type: "string",
    description: "The signed-in officer. `name` is required; `role` appears in the account menu's header, not in the trigger.",
  },
  { name: "HeaderAccount · avatarSrc", type: "string", description: "Avatar image. Without one, initials are derived from the name." },
  { name: "AccountMenuItem · label / onSelect", type: "string / () => void", required: true, description: "A dropdown action and its handler." },
  { name: "AccountMenuItem · danger", type: "boolean", description: "The destructive treatment — Sign out." },
  {
    name: "BrandMark · src / alt / href / height",
    type: "string / string / string / number",
    description: "A co-branding mark in the trailing zone. `height` defaults to 44 and the width follows.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.1 Bypass Blocks",
    level: "A",
    description:
      "A skip link becomes visible on focus and targets `skipTo`. It must match the shell's `mainId` — the two defaults do NOT agree, so a page that leaves both alone has a skip link pointing at no element.",
    status: "partial",
    evidence: "Rendered by the component; the target is the caller's to align.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "The accessibility-statement and language icon buttons carry `aria-label` and a tooltip, so their purpose is never a guess. The emblem carries real alternative text rather than an empty alt.",
    status: "verified",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description:
      "Every interactive element — navigation links, dropdown and mega-menu links, search, both toggles, the account trigger — shows a 2px focus ring.",
    status: "verified",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "Navigation dropdowns and mega-menus open on Enter and close on Escape, on an outside click, or when focus leaves the navigation.",
    status: "verified",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The mobile menu is a real modal sheet, not a fake dialog. The two triggers are not interchangeable: MenuToggle drives a persistent sidebar and takes `navExpanded`, so it reports `aria-expanded`; SheetToggle opens an overlay dismissed by its own close button and has one glyph and no second state.",
    status: "verified",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description: "The scroll-condense transition is disabled under `prefers-reduced-motion`.",
    status: "verified",
  },
  {
    criterion: "2.4.11 Focus Not Obscured (Minimum)",
    level: "AA",
    description:
      "The masthead is sticky on every variant, so a focused control must never end up beneath it. The component measures itself and publishes `--sa-header-pinned`; read that rather than hardcoding an offset, and re-check whenever the header's height changes.",
    status: "partial",
    evidence: "Height varies with the lockup, the badge and the account block.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "The brand row hugs its content, so a two-line lockup at 200% zoom grows the row rather than clipping it — which is also why nothing may subtract a constant chrome height from the viewport.",
    status: "verified",
  },
  {
    criterion: "GIGW 3.0 — Accessibility statement",
    level: "GIGW",
    description:
      "The accessibility control links to `/accessibility-statement` unless an app overrides it. Text size, spacing, contrast and dark mode belong to the UX4G accessibility widget, rendered once in the root layout — the header no longer duplicates them.",
    status: "verified",
  },
];

export default function SiteHeaderPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Navbar (Header)"
      status="Beta"
      summary="The masthead of every SAMAVESH property is one component. Three tiers — accessibility bar, brand row, navigation row — with three variants chosen by a single prop, and a scroll condense that keeps the National Emblem on the same left edge throughout."
      figma={{ node: "siteHeader" }}
      specimen={
        <div className="cdp-stack">
          <SiteHeaderPreview />
          <SiteHeaderArrangementsPreview />
        </div>
      }
      propsFrom="SiteHeaderProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Every public website page, with `variant=\"website\"` plus `search` and a single call to action.",
          "Every signed-in portal page, with `variant=\"portal\"` plus the sidebar toggle, co-branding and the account block.",
          "An internal index surface that is not a public government page — the hub landing, the portals directory, the reports index — with `variant=\"compact\"`.",
        ],
        avoid: [
          "Forking a per-app header. One definition is imported everywhere; each app supplies its own data and basePath-aware asset URLs.",
          "Stacking buttons in the brand row. The masthead is wayfinding, and it carries one primary action.",
          "Adding an eighth top-level navigation entry without deciding what gives way — at 1280px the row has 880px and seven entries measure 837.",
        ],
      }}
      related={[
        {
          label: "Sidebar Nav",
          href: "/design-system/components/section-templates/sidebar",
          reason: "the portal navigation that pairs with the portal variant",
        },
        {
          label: "Nav Sheet",
          href: "/design-system/components/navigation/nav-sheet",
          reason: "the overlay the masthead hands its navigation to below the desktop anchor",
        },
        {
          label: "Brand Lockup",
          href: "/design-system/components/navigation/brand-lockup",
          reason: "the emblem and text stack, exported on its own",
        },
        {
          label: "Accessibility Bar",
          href: "/design-system/components/utilities/accessibility-bar",
          reason: "the government utility strip that is the masthead's first tier",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <p>
              Every masthead stacks the same tiers in the same order. The brand row is always
              present; the accessibility bar and the navigation row are configurable, and the
              compact variant has neither.
            </p>
            <MatrixTable
              caption="The three tiers"
              columns={["Tier", "Carries", "Controlled by"]}
              rows={[
                [
                  "1 — Accessibility bar",
                  "Government of India link, accessibility statement, language",
                  "accessibilityToolbar",
                ],
                [
                  "2 — Brand row",
                  "Optional toggle, National Emblem and lockup, then search and the call to action, or co-branding and the account block",
                  "Always present",
                ],
                [
                  "3 — Navigation row",
                  "Primary navigation — simple dropdowns or multi-column mega-menus",
                  "nav",
                ],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-variants">
            <h2 id="cdp-variants" className="cdp__h2">
              Choosing a Variant
            </h2>
            <p>
              Set <code>variant</code> at the call site so intent is explicit and the right
              behavioural defaults apply. Explicit props always win over what a variant implies.
            </p>
            <MatrixTable
              caption="What each variant is for"
              columns={["Aspect", "website", "portal", "compact"]}
              rows={[
                ["Audience", "Anonymous public", "Authenticated officers", "Internal index surfaces"],
                ["Accessibility bar", "Yes", "Yes", "No — there is no government masthead to qualify"],
                [
                  "Brand-row trailing",
                  "Search and a Login call to action",
                  "Collapse toggle, co-branding, account",
                  "Navigation inline",
                ],
                ["Navigation row", "Its own tier", "Optional — usually a left sidebar instead", "Inline in the brand row"],
                ["Sticky", "On", "On", "On"],
                ["Scroll condense", "On", "On", "Never — it is one 64px tier already"],
                ["Used by", "The dosje website", "PM-AJAY, SMILE Admin, NMBA", "The hub landing, /portals, /reports"],
              ]}
            />
            <Callout type="tip" title="The BETA badge is a usage choice">
              Show it while a surface is genuinely pre-release; drop it on a production citizen
              portal, where it reads as &ldquo;this service is unfinished&rdquo;. Note that it
              defaults <strong>on</strong> — a production surface has to turn it off.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-portal">
            <h2 id="cdp-portal" className="cdp__h2">
              The Portal Variant
            </h2>
            <p>
              A collapse toggle, a gradient divider beside the emblem, co-branding marks, and an
              account block in place of the search field and call to action. The toggle below is
              live: press it and the glyph swaps between <code>menu_open</code> and{" "}
              <code>menu</code>, mirroring the sidebar it drives.
            </p>
            <SiteHeaderNavyPreview />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-compact">
            <h2 id="cdp-compact" className="cdp__h2">
              The Compact Variant
            </h2>
            <p>
              One 64px tier: a compact lockup, primary navigation inline in the brand row, and{" "}
              <strong>no accessibility bar</strong>, because these are internal wayfinding surfaces
              rather than public government pages. Everything else — dropdowns, the mobile sheet,
              focus treatment — is the same component. The page must supply its own skip link.
            </p>
            <SiteHeaderCompactPreview />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-menus">
            <h2 id="cdp-menus" className="cdp__h2">
              Dropdowns and Mega-Menus
            </h2>
            <p>
              A navigation entry opens a menu when it carries either <code>children</code> (a single
              column) or <code>columns</code> (a titled multi-column mega-menu). Use a mega-menu for
              organisation-heavy groupings — the department&apos;s Commissions, Corporations and
              Councils — where a single column would scroll awkwardly. On a phone the columns keep
              their headings, emblems and full names inside the sheet rather than flattening to
              abbreviations.
            </p>
            <CodeBlock>{`const NAV: NavItem[] = [
  { label: "Home", href: "/", active: true },
  // Simple dropdown
  { label: "Department", href: "/dept", children: [
    { label: "About Us", href: "/about" },
    { label: "Who's Who", href: "/whos-who" },
  ]},
  // Mega-menu — titled columns
  { label: "Associated Organisations", href: "/orgs", columns: [
    { heading: "Commissions",  items: [{ abbr: "NCSC", name: "National Commission for Scheduled Castes", href: "/ncsc" }] },
    { heading: "Corporations", items: [{ abbr: "NSFDC", name: "National Scheduled Castes Finance and Development Corporation", href: "/nsfdc" }] },
    { heading: "Councils & Institutes", items: [{ abbr: "NISD", name: "National Institute of Social Defence", href: "/nisd" }] },
  ]},
];`}</CodeBlock>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-condense">
            <h2 id="cdp-condense" className="cdp__h2">
              Scroll Condense
            </h2>
            <p>
              Past 120px of scroll the three tiers become one bar — 200px to 65 on a desktop, 258 to
              57 on a phone — carrying the emblem, the full navigation, a search icon and the call
              to action. It restores below 40px: two thresholds rather than one, because a single
              threshold on a state that changes document height is a latch waiting to oscillate.
            </p>
            <p>
              The accessibility bar is not condensed so much as left behind. The header pins at a
              negative offset equal to that bar&apos;s height, so tier 1 scrolls away on its own —
              it carries page-level preferences, not per-scroll chrome.
            </p>
            <Callout type="info" title="The emblem holds the same left edge in both states">
              It is also the go-home control, and an identity mark that crosses the screen on scroll
              reads as a different site. The department NAME is what is given up — one scroll back
              up, and still in the page title, the heading and the footer. Printing restores the
              full masthead, because on paper the name would be gone for good.
            </Callout>
            <p>
              This replaced an earlier state that dropped the lockup&apos;s ministry line to take the
              brand row from 100px to 88 — measured 146 to 134 on the live portal. Twelve pixels, in
              exchange for a class, a listener and a variant.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-room">
            <h2 id="cdp-room" className="cdp__h2">
              When the Navigation Runs Out of Room
            </h2>
            <p>
              At 1280px the content column is 1200; after its padding, the emblem, the search button
              and the call to action, the navigation has 880px. Seven entries measure 837 — 43px of
              slack against the roughly 96px an eighth needs. The component measures itself and
              hands the navigation to <code>NavSheet</code> rather than letting entries overlap, so
              a 1280px laptop trades the inline row for the sheet trigger while 1440 and up still
              fit eight.
            </p>
            <Callout type="warning" title="Adding a top-level entry is a design decision">
              It is not a bug to be discovered later. Decide what gives way in the same change.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-responsive">
            <h2 id="cdp-responsive" className="cdp__h2">
              Responsive
            </h2>
            <MatrixTable
              caption="What the masthead sheds, and where"
              columns={["Width", "Behaviour"]}
              rows={[
                ["1024 and up", "The navigation row is shown, with dropdowns and mega-menus"],
                ["Below 1024", "The navigation row collapses; a trigger in the brand row opens NavSheet"],
                ["Below 900", "The search field hides; the condensed bar keeps a search icon"],
                ["Below 768", "Co-branding marks hide; BETA moves onto the Government of India line; the account name, email and caret hide and the avatar steps to 40; on a portal every control on the row is 40; with a sidebar toggle the sheet trigger is not rendered and search lives at the head of the drawer (SidebarNav header); without one the search field waits behind a 40px button that opens it on its own row"],
                ["Below 768, accessibility bar", "Font size leaves for the sheet and the widget; accessibility and language stay as 44px icon controls; the skip link shows on the first Tab press"],
                [
                  "Below the tablet anchor",
                  "Text size, accessibility options and language move into the sheet's accessibility section",
                ],
              ]}
            />
            <p>
              The website header is contained: content is centred on <code>--sa-container-page</code>,
              the same variable the page content below the header uses. Leave <code>maxWidth</code>
              unset: passing a number re-introduces the misalignment the default exists to prevent,
              which put the National Emblem twenty pixels outside the content column on wide
              viewports until August 2026.
            </p>
            <p>
              The portal header is fluid: no cap, and every row pads with the page margin,
              <code>--sa-grid-margin-page</code> — 16, 24 from 768 and 32 from 1920 — so the
              masthead runs edge to edge with the portal beneath it. Figma draws both on a 1440
              frame: Navbar/Website caps each row at container/page and Navbar/Portal lets each row
              fill, and both bind their side padding to grid/margin/page. The accessibility bar,
              brand row, navigation row and condensed bar all read the same token, which is what
              keeps the flag, the emblem and the first navigation entry on one edge.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-voice">
            <h2 id="cdp-voice" className="cdp__h2">
              Content and Voice
            </h2>
            <ul>
              <li>
                <strong>Department line</strong> — the full official name. Never an acronym in the
                masthead.
              </li>
              <li>
                <strong>Navigation labels</strong> — short Title Case noun phrases. One or two words
                where possible, so the row does not wrap.
              </li>
              <li>
                <strong>Mega-menu headings</strong> — name the grouping, not the action:
                &ldquo;Commissions&rdquo;, &ldquo;Corporations&rdquo;.
              </li>
              <li>
                <strong>Search placeholder</strong> — hint at scope, not a bare &ldquo;Search&rdquo;.
              </li>
              <li>
                <strong>Call to action</strong> — one primary action only. The masthead is
                wayfinding, not a place to stack buttons.
              </li>
            </ul>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shapes">
            <h2 id="cdp-shapes" className="cdp__h2">
              The Shapes the Props Carry
            </h2>
            <PropsTable props={SHAPES} />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import { SiteHeader, SAMAVESH_COBRAND } from "@mosje/design-system";

// Website — search, a Login CTA, and mega-menu navigation
<SiteHeader
  variant="website"
  homeHref="/website"            // the zone root, NOT the hub root
  skipTo="#main"                 // must match AppShell/SiteLayout's mainId
  emblemSrc={emblem}
  brandLines={{ org: "Government of India", ministry: "…", department: "…" }}
  search={{ placeholder: "Search schemes and services", onSearch: runSearch }}
  cobranding={[{ src: digitalIndia, alt: "Digital India", href: "https://www.digitalindia.gov.in/", height: 40 }, SAMAVESH_COBRAND]}
  nav={NAV}
  actions={<a href="/login">Login</a>}
/>;

// Portal — collapse toggle, divider, co-branding, account
<SiteHeader
  variant="portal"
  homeHref="/portals/pm-ajay"
  emblemSrc={emblem}
  brandLines={BRAND}
  brandDivider
  onToggleNav={toggleSidebar}
  navExpanded={!sidebarCollapsed}   // menu_open when expanded, menu when collapsed
  navControlsId="portal-sidebar"    // the same id passed to SidebarNav
  account={{ name: "Asha Ramesh", email: "asha.ramesh@gov.in", role: "State Nodal Officer" }}
  accountMenu={[
    { label: "Profile", onSelect: openProfile },
    { label: "Sign Out", danger: true, onSelect: signOut },
  ]}
/>;

// Compact — internal index surfaces. One tier, navigation inline, no accessibility bar.
<SiteHeader
  variant="compact"
  homeHref="/"
  emblemSrc={emblem}
  brandLines={{ ministry: "Ministry of Social Justice & Empowerment", department: "Digital Estate" }}
  nav={[{ label: "Website", href: "/website" }, { label: "Portals", href: "/portals" }]}
/>;`}</CodeBlock>
            <Callout type="warning" title="Always pass homeHref">
              It defaults to <code>/</code>, which is the hub root — so a website page that omits it
              sends &ldquo;click the emblem to go home&rdquo; to the estate index instead of the site
              the reader is on.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-parts">
            <h2 id="cdp-parts" className="cdp__h2">
              The Parts, on Their Own
            </h2>
            <p>
              Every piece the Figma Navbar page names is an export:{" "}
              <code>MenuToggle</code>, <code>SheetToggle</code>, <code>NavItemLink</code>,{" "}
              <code>NavDropdown</code>, <code>DropdownItem</code>, <code>MegaMenu</code>,{" "}
              <code>MegaMenuItem</code>, <code>NavSheet</code>, <code>BrandLockup</code> and{" "}
              <code>AccountMenu</code>. Import one where a surface needs that piece{" "}
              <em>without</em> the masthead — until v0.31.0 they were inline markup, so the only way
              to reuse a mega-menu was to rebuild it.
            </p>
            <Callout type="warning" title="The two triggers are not interchangeable">
              <code>MenuToggle</code> drives a <em>persistent sidebar</em>: the sidebar is on screen
              either way, so the control shows which way it will go and takes{" "}
              <code>navExpanded</code>. <code>SheetToggle</code> opens <code>NavSheet</code>, an{" "}
              <em>overlay</em> dismissed by its own close button — one glyph, no state. A
              sidebar-shaped property on the overlay trigger describes something that does not
              exist.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-offsets">
            <h2 id="cdp-offsets" className="cdp__h2">
              Reading the Pinned Height
            </h2>
            <p>
              The component measures itself and publishes <code>--sa-header-pinned</code>. Anything
              that needs to sit clear of the masthead — an app-shell sidebar offset, an anchor
              scroll target — reads that variable. A hardcoded number is wrong by construction here,
              because the brand row hugs its content and a two-line lockup, a BETA badge or an
              account block all move it.
            </p>
          </section>
        </>
      }
      accessibility={
        <>
          <section className="cdp__section" aria-labelledby="cdp-keys">
            <h2 id="cdp-keys" className="cdp__h2">
              Keyboard
            </h2>
            <MatrixTable
              caption="Keys the masthead handles"
              columns={["Key", "Action"]}
              rows={[
                ["Tab / Shift+Tab", "Move through the accessibility bar, the brand-row controls and the navigation in DOM order"],
                ["Enter / Space", "Activate a control; on a navigation parent, open its dropdown or mega-menu"],
                ["Escape", "Close an open navigation menu, the account menu, or the mobile sheet"],
                ["Click outside, or focus leaving", "Dismisses any open menu"],
              ]}
            />
            <p>
              The account menu implements the full APG menu-button keyboard map on top of this —
              arrows, Home and End inside the open menu — and is documented on its own page.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-skip">
            <h2 id="cdp-skip" className="cdp__h2">
              The Skip Link Has Two Halves
            </h2>
            <p>
              The masthead renders the link, targeting <code>skipTo</code>. The shell renders the
              target: a <code>&lt;main&gt;</code> carrying <code>mainId</code> and{" "}
              <code>tabIndex=&#123;-1&#125;</code>, so focus can actually land in it. The two
              defaults do not match — <code>#main-content</code> here, <code>main</code> there — so
              a page that leaves both alone has a skip link pointing at no element.
            </p>
            <Callout type="warning" title="Test it with the keyboard, not by reading the code">
              Press Tab on a freshly loaded page, confirm the link appears, and confirm that
              activating it moves focus into the content rather than only scrolling to it. A skip
              link that resolves to nothing is invisible in review and fails only for the keyboard
              user it exists to serve.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-one-mechanism">
            <h2 id="cdp-one-mechanism" className="cdp__h2">
              One Accessibility Mechanism, Everywhere
            </h2>
            <p>
              Text size, spacing, contrast and dark mode live in the official UX4G accessibility
              widget, rendered once in the root layout — not in the header. The header used to carry
              its own text-size and contrast controls; they were retired because they duplicated the
              widget, and two controls advertising the same panel is worse than one.
            </p>
            <p>
              The accessibility bar keeps the statement link and the language selector, which are
              the two things the widget does not own. Below the tablet anchor the bar sheds all
              three, and <code>NavSheet</code> picks them up — until that section existed, a phone
              user had no route to any of them.
            </p>
          </section>
        </>
      }
    />
  );
}
