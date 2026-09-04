import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import "./content-localisation.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { LANGUAGES, PROTOTYPE_MODE } from "@/lib/bhashini/languages";

export const metadata: Metadata = {
  title: "Content & Localisation",
  description:
    "How copy is written across the SAMAVESH estate — the Government of India register, Title Case, what never goes on a screen — and how Hindi is marked, faced and leaded by one attribute, with the parts of localisation that are not yet built stated plainly.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * A PROPOSED foundation. INFORMATION-ARCHITECTURE.md §"1. Foundations" planned
 * "Content & Localization (bilingual, en-IN formatting)" and no page was built. The
 * copy rules are a shipped contract (.claude/rules/ui-restraint-and-copy.md); the
 * localisation half is partly unbuilt, and §07 says so rather than implying otherwise.
 * Every figure is quoted from a file in the repository, cited beside it.
 */

/** The estate's language list, read from the module the picker reads — never retyped. */
const LIVE = LANGUAGES.filter((l) => l.prototype);
const RTL = LANGUAGES.filter((l) => l.dir === "rtl");

/**
 * What is banned from a screen, in the rule's own words and with the rule's own
 * examples (.claude/rules/ui-restraint-and-copy.md §1, "What this bans").
 */
const BANNED = [
  {
    cls: "Feed diagnostics",
    example: "“423 carry no usable coordinates and 70 are published at a point outside India…”",
    home: "docs/audit/*.md, the PR, the chat",
  },
  {
    cls: "Absence notes",
    example: "A greyed-out card for a component with no data, then a footnote saying the same.",
    home: "nowhere — scope the heading to what is shown",
  },
  {
    cls: "Instructions for reading a chart",
    example: "“Each cell shades by how many villages stand within a few kilometres of it…”",
    home: "the legend — a chart that needs instructions has a legend problem",
  },
  {
    cls: "Restatement",
    example: "The same total printed in a card, in the standfirst, and again in a footnote.",
    home: "once, in the one place it is the answer",
  },
] as const;

export default function ContentLocalisationPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Content & Localisation"
      status="Proposed"
      summary="Every string the estate authors is written in the register of a Government of India page: plain, formal and factual, in the Department's own words wherever it has published them, with every title in Title Case. Hindi is marked with one attribute, and that attribute switches the face and the leading. The parts of localisation that are not yet built — a message catalogue, locale routing, right-to-left layout — are listed here as open, not implied."
      figma={{
        absent:
          "No Figma page. The library holds no copy guidance and no Hindi text styles; the typography audit of 2026-09-04 lists Devanagari-specific sizes and Hindi text styles as open design work. This page is the contract until they exist.",
      }}
      glance={[
        { value: LANGUAGES.length, label: "languages listed", note: "the picker's own list, read from code" },
        { value: LIVE.length, label: "translate in prototype", note: LIVE.map((l) => l.english).join(" and ") },
        { value: 1, label: "surface mounts the runtime", note: "the website layout; no portal can import it" },
        { value: 2, label: "Devanagari tokens", note: "the face, and a 1.7 leading" },
        { value: 0, label: "unmarked Devanagari runs", note: "type-linkage baseline; was 16 of 20 files" },
        { value: RTL.length, label: "right-to-left language listed", note: "and two stylesheets with any RTL provision" },
      ]}
      sections={[
        {
          id: "register",
          keyword: "REGISTER",
          title: "Copy Is Written in the Register of a Government of India Page",
          description:
            "This binds every string the estate authors — headings, standfirsts, labels, empty states, button text, error messages, card descriptions. The interface speaks about the Department, never as a brand and never as “we”.",
          content: (
            <>
              <ul>
                <li>
                  <strong>Plain, formal, factual.</strong> State what the thing is and, where it matters, where the figure came from.
                </li>
                <li>
                  <strong>No product-marketing voice.</strong> No claims, no headlines, no second person selling.
                </li>
                <li>
                  <strong>No literary cadence, no casual verbs.</strong> A programme is &ldquo;merged into&rdquo; a component, never
                  &ldquo;folded into&rdquo; it.
                </li>
                <li>
                  <strong>Concise.</strong> A card gets what it does, then the one stated rule a reader most often needs. Two sentences
                  is usually the ceiling; everything beyond is the component&rsquo;s own page, one click away.
                </li>
              </ul>
              <DoDont
                cards={[
                  { type: "do", preview: <span>Scheme Coverage</span>, label: "A section is named for what it holds." },
                  { type: "dont", preview: <span>Where PM-AJAY works</span>, label: "A campaign line is not a section heading." },
                  {
                    type: "do",
                    preview: <span>Villages declared as Adarsh Gram and hostels sanctioned under the scheme, at the locations recorded in the PM-AJAY Management Information System.</span>,
                    label: "What it is, and where the figure came from.",
                  },
                  {
                    type: "dont",
                    preview: <span>&hellip;drawn where the department records it standing</span>,
                    label: "A writer enjoying themselves on a departmental page.",
                  },
                ]}
              />
              <Callout type="info" title="Sourcing">
                Prefer the Department&rsquo;s own words: where the live site states it, quote it. Anything the estate authors is its
                own to defend — a sentence not on the source site must be traceable to a published document, and the comment beside
                it says which. A figure with no source does not go on the page at all.
              </Callout>
            </>
          ),
        },
        {
          id: "restraint",
          keyword: "RESTRAINT",
          title: "Nothing on the Screen That the Screen Does Not Need",
          description:
            "The interface shows the citizen's information. It does not narrate its own construction. If a sentence exists to explain a limitation, justify a decision or report on the quality of a feed, it does not go in the interface. The test: would the Department print this sentence on a poster about the scheme?",
          content: (
            <>
              <ul className="cl-ban" aria-label="What is banned from a screen, and where it belongs">
                {BANNED.map((b) => (
                  <li key={b.cls} className="cl-ban__row">
                    <span className="cl-ban__class">{b.cls}</span>
                    <span className="cl-ban__example">{b.example}</span>
                    <span className="cl-ban__home">{b.home}</span>
                  </li>
                ))}
              </ul>
              <p>
                Three things are not banned. <strong>Provenance</strong> — a provenance chip and, where a whole section is mirrored,
                one banner sentence; a mark that only appears when something is wrong teaches people not to look for it.{" "}
                <strong>A real empty state</strong> — &ldquo;No documents published yet&rdquo; is the citizen&rsquo;s answer, not the
                pipeline&rsquo;s excuse. <strong>Statutory text</strong> — accessibility statements, disclaimers, the last-updated
                date.
              </p>
            </>
          ),
        },
        {
          id: "titles",
          keyword: "TITLES",
          title: "Every Title Is Title Case, Including the Department's Own",
          description:
            "Section headings, card titles, navigation labels, page titles and column headers. Small words inside a title stay lowercase — a, an, the, and, or, but, to, of, in, into, for, on, with — unless first or last.",
          content: (
            <>
              <DoDont
                cards={[
                  { type: "do", preview: <span>Documents &amp; Downloads</span>, label: "Every principal word capitalised." },
                  { type: "dont", preview: <span>Documents &amp; downloads</span>, label: "Sentence case is not the estate's title style." },
                  { type: "do", preview: <span>Grants-in-Aid to State/Districts</span>, label: "“to” stays lowercase inside the title." },
                ]}
              />
              <Callout type="warning" title="Decided 2026-09-01: this applies to titles taken from the Department's pages">
                Four PM-AJAY titles now differ in capitalisation from what dosje.gov.in publishes. That was an explicit instruction,
                and the divergence is recorded in <code>docs/audit/pm-ajay-content-audit.md</code> §34. A section heading is the
                design system&rsquo;s <code>SectionTitle</code>, never a hand-rolled one, so the case rule is applied in one place.
              </Callout>
            </>
          ),
        },
        {
          id: "script",
          keyword: "SCRIPT",
          title: "Hindi Is Marked, Faced and Leaded by One Attribute",
          description:
            "The root element carries lang=\"en-IN\" (apps/hub/src/app/layout.tsx). Every Devanagari run carries lang=\"hi\". That attribute is what a screen reader switches voice on, and it is what the stylesheet keys the Devanagari face and leading on; without it, Hindi is voiced by an English engine and set in whatever face the device has.",
          content: (
            <>
              <div className="cl-script">
                <div className="cl-script__card">
                  <p className="cl-script__label">block · lang=&quot;hi&quot; · face + leading</p>
                  <p className="cl-script__block" lang="hi">
                    सामाजिक न्याय और अधिकारिता मंत्रालय देश के वंचित और कमज़ोर वर्गों के कल्याण के लिए अनेक योजनाएँ संचालित करता है। आवेदक अपने सभी आवश्यक दस्तावेज़ों के साथ ऑनलाइन आवेदन जमा कर सकते हैं।
                  </p>
                  <p className="cl-script__note">
                    A Hindi block takes <code>--sa-font-devanagari</code> and <code>--sa-leading-devanagari</code> (1.7). The matras
                    sit above and below the base line, so the script needs more room between lines than Latin at the same size.
                  </p>
                </div>
                <div className="cl-script__card">
                  <p className="cl-script__label">inline · [lang=&quot;hi&quot;] · face only</p>
                  <p className="cl-script__block">
                    Ministry of Social Justice &amp; Empowerment (<span lang="hi">सामाजिक न्याय और अधिकारिता मंत्रालय</span>), Government
                    of India.
                  </p>
                  <p className="cl-script__note">
                    An inline run inside a Latin block takes the face only. Giving it the Devanagari leading too inflated the English
                    heading around it to 82px inside a 48px h1, so the block&rsquo;s own leading stands.
                  </p>
                </div>
              </div>
              <ul>
                <li>
                  <strong>The face is Noto Sans Devanagari</strong>, falling to Noto Sans and then the system. Never italic: the script
                  has no italic tradition and slanting degrades legibility.
                </li>
                <li>
                  <strong>The Display cut is Latin only.</strong> Noto Sans Display has no Devanagari subset and Noto Sans Devanagari has
                  no Display cut, so a Hindi heading in a display role falls through its stack to Noto Sans, by design.
                </li>
                <li>
                  <strong>Form fields set Hindi, Marathi, Nepali and Sanskrit at 1.8</strong> by redeclaring the body leading tokens
                  for the field subtree (<code>forms.css</code>), matched on <code>:lang</code>, so a bilingual form asks nothing of
                  the consumer.
                </li>
                <li>
                  <strong>The Devanagari subset is not preloaded.</strong> It is a second <code>next/font</code> loader with{" "}
                  <code>preload: false</code>, fetched through its <code>unicode-range</code> on the first paint of Hindi text. Measured
                  2026-09-04: the 99 KB file had been the largest asset preloaded on every English-only page; the English preload set
                  fell from 148 KB to 49 KB.
                </li>
              </ul>
              <Callout type="tip" title="The gate">
                <code>tools/type-linkage/check.mjs</code> reports <code>hindi-unmarked</code> for a file that writes Devanagari and
                never writes <code>lang=&quot;hi&quot;</code>; a file that centralises Hindi strings for consumers that mark them says
                so with <code>ds-exempt(hindi-source)</code>. The audit found 16 of 20 files unmarked; the baseline now holds zero.
              </Callout>
            </>
          ),
        },
        {
          id: "languages",
          keyword: "LANGUAGES",
          title: `${LANGUAGES.length} Languages Are Listed; ${LIVE.length} Translate, on One Surface`,
          description:
            "The list below is the picker's own. A Bhashini-backed translation runtime exists and is mounted in exactly one place — the informational website's layout. It is not exported from the design-system barrel, so no portal can import it, and the transactional surfaces are English-only.",
          content: (
            <>
              <ul className="cl-langs" aria-label="Languages in the estate's picker">
                {LANGUAGES.map((l) => (
                  <li key={l.code} className={`cl-lang ${l.prototype ? "cl-lang--live" : ""}`}>
                    <span className="cl-lang__native" lang={l.code} dir={l.dir}>
                      {l.native}
                    </span>
                    <span className="cl-lang__meta">
                      {l.code} · {l.dir}
                      {l.prototype ? " · prototype" : ""}
                    </span>
                  </li>
                ))}
              </ul>
              {PROTOTYPE_MODE ? (
                <p>
                  The picker runs in prototype mode: the {LIVE.length} highlighted entries translate, the rest are listed so the
                  selector is complete. The flag flips the day the deployment carries Bhashini credentials.
                </p>
              ) : null}
              <p>
                <strong>Numbers and dates.</strong> Where a component formats, it formats as <code>en-IN</code>: Indian digit grouping
                (1,23,456) is the default for every chart, with compact 1.2L / 3.4Cr notation beside it; the data table sorts strings
                with <code>en-IN</code> numeric collation so &ldquo;Block 2&rdquo; precedes &ldquo;Block 10&rdquo;; the visitor
                counter and the approval timeline format with <code>en-IN</code>. The ticker deliberately does not — locale and time
                zone are the site&rsquo;s policy, not the design system&rsquo;s, so a date it shows is the consumer&rsquo;s string over
                an ISO <code>dateTime</code>.
              </p>
            </>
          ),
        },
        {
          id: "open",
          keyword: "OPEN",
          title: "What Is Not Built, Stated Plainly",
          description:
            "The estate’s design-system audit (ds-world-class-audit.md) called the absence of internationalisation the largest thing in the document — an architectural gap, not a component one, that gets more expensive every week. This section is the roadmap. Nothing here is hidden behind a page that reads as finished.",
          content: (
            <>
              <ol>
                <li>
                  <strong>No internationalisation framework.</strong> Zero i18n dependencies in the root or hub <code>package.json</code>;
                  no message catalogue, no locale routing. Every string in the components is an English literal in a <code>.tsx</code>{" "}
                  file, and the root element hard-codes <code>lang=&quot;en-IN&quot;</code> estate-wide.
                </li>
                <li>
                  <strong>Hindi on the portals.</strong> The runtime is mounted on the website only. Grievance registration, pension
                  registration and certificate application — the surfaces where a non-English speaker most needs help — are the ones
                  without it.
                </li>
                <li>
                  <strong>Right-to-left layout.</strong> Exactly two component stylesheets carry any RTL provision. Urdu and Kashmiri are
                  scheduled languages written right-to-left. Logical properties are used in places, which is the right foundation, but
                  nothing tests a mirrored layout and no component declares RTL support.
                </li>
                <li>
                  <strong>Hindi text styles in Figma</strong>, and Devanagari-specific sizes — the script appears about one size smaller at
                  equal pixels. A research gap: verify with Hindi readers.
                </li>
                <li>
                  <strong>Reader research.</strong> Hindi legibility at 14 and 16px with 1.7 leading has not been tested; every claim
                  about readability above is otherwise untested.
                </li>
                <li>
                  <strong>A date picker.</strong> None exists; 42 portal fields fall back to <code>&lt;input type=&quot;date&quot;&gt;</code>,
                  which cannot express DD/MM/YYYY reliably, a financial year, a scheme&rsquo;s application window, or a Hindi month name.
                </li>
              </ol>
              <Callout type="info" title="What the standards require">
                GIGW 3.0 lists &ldquo;Website/app is bilingual with a prominent language selection link and uses Unicode
                characters&rdquo; as a checkpoint, and DBIM 3.0 §7.5.1 requires a language selection in the header and a{" "}
                <code>lang</code> attribute that specifies the language of the content. Unicode and <code>lang</code> are met; the
                bilingual delivery is met on the website and open on every portal.
              </Callout>
            </>
          ),
        },
      ]}
      tokens={[]}
      tokensIntro={
        <>
          No token family belongs to this foundation alone, so no table is printed. Two Tier-2 tokens carry the script rule:{" "}
          <code>--sa-font-devanagari</code> (the face, aliasing <code>font.family.devanagari</code>) and{" "}
          <code>--sa-leading-devanagari</code> (1.7, aliasing <code>font.lineHeight.devanagari</code> — the one leading primitive
          that is not a role). Both are documented, with the rest of the type system, on the{" "}
          <Link href="/design-system/foundations/typography">Typography page</Link>. Apps bind these two and never the{" "}
          <code>--sa-ref-font-*</code> primitives beneath them; the tier lint caught the typography page itself doing so, which is why
          the Tier-2 pair exists.
        </>
      }
      a11y={[
        {
          criterion: "3.1.1 Language of Page",
          level: "A",
          description: "The default human language of each page is programmatically determinable.",
          status: "partial",
          evidence:
            "lang=\"en-IN\" on <html> in apps/hub/src/app/layout.tsx. It is hard-coded estate-wide, so a page the website runtime translates keeps en-IN (ds-world-class-audit R10).",
        },
        {
          criterion: "3.1.2 Language of Parts",
          level: "AA",
          description: "Every passage in a language other than the page's carries its own lang attribute.",
          status: "partial",
          evidence:
            "The typography audit of 2026-09-04 found 20 files carrying Devanagari with 4 marked; the sweep since marks every run reachable from markup and tools/type-linkage/check.mjs holds hindi-unmarked at 0. No script other than Devanagari has been audited.",
        },
        {
          criterion: "1.3.2 Meaningful Sequence",
          level: "A",
          description: "Reading order survives a right-to-left layout.",
          status: "untested",
          evidence: "No mirrored layout is tested anywhere in the estate (ds-world-class-audit A2).",
        },
        {
          criterion: "1.4.12 Text Spacing",
          level: "AA",
          description: "Devanagari text survives user-set line height, paragraph, letter and word spacing without loss.",
          status: "untested",
        },
        {
          criterion: "GIGW 3.0 — bilingual with a prominent language selection link",
          level: "GIGW",
          description: "The site is bilingual, with a prominent language selection link and Unicode throughout.",
          status: "partial",
          evidence:
            "Unicode throughout. The language dialog is mounted on the website layout only, in prototype mode with English and Hindi; the portals are English-only (ds-world-class-audit R10).",
        },
        {
          criterion: "GIGW 3.0 — Hindi and regional fonts tested on popular browsers",
          level: "GIGW",
          description: "Hindi and regional-language fonts have been tested on multiple browsers for loss of layout.",
          status: "untested",
        },
      ]}
      standards={[
        {
          clause: "GIGW 3.0 — bilingual checkpoint",
          says: "The website or app is bilingual with a prominent language selection link and uses Unicode characters.",
          does: "Unicode throughout and a language dialog on the informational website, in prototype mode; the twenty portals are English-only.",
          why: "Not a quality decision — an open gap, recorded as R10 in the design-system audit. The runtime exists and is mounted in one place; exporting it and adding a message catalogue is architectural work, not a component.",
        },
        {
          clause: "DBIM 3.0 §7.5.1 ii — language metadata",
          says: "The lang attribute must specify the language of the content; multilingual pages use hreflang for their language versions.",
          does: "lang=\"en-IN\" on the root and lang=\"hi\" on every Devanagari run. No hreflang, because there are no per-language routes.",
          why: "hreflang describes alternate URLs, and the estate has none: the website translates in place. It follows the locale routing the framework gap above would introduce.",
        },
        {
          clause: "Source titles on dosje.gov.in",
          says: "The Department publishes some titles in sentence case.",
          does: "Every title is Title Case, including four PM-AJAY titles taken from the Department's own pages.",
          why: "A standing instruction of 2026-09-01, so that headings are consistent across the estate; the divergence is recorded in docs/audit/pm-ajay-content-audit.md §34 rather than left to be rediscovered.",
        },
      ]}
      related={[
        { label: "Typography", href: "/design-system/foundations/typography", reason: "the roles, the Devanagari face and the 1.7 leading, with every value" },
        { label: "Accessibility", href: "/design-system/foundations/accessibility", reason: "the language criteria in the estate's full checklist" },
        { label: "Brand & White-Labelling", href: "/design-system/foundations/brand", reason: "locale defaults are a brand asset, held by the app, not a token" },
      ]}
    />
  );
}
