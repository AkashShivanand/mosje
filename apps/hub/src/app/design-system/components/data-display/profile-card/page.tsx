import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { ProfileCard } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Profile Card — Design System",
  description:
    "A portrait, a name and an official designation, for the leadership and officer listings on the website.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "partial",
    description:
      "The portrait is whatever node the caller passes, so its alt text is the caller's responsibility and nothing here can enforce it. Pass a next/image or an <img> carrying the official's name and post; an unnamed portrait on a leadership page is a photograph of nobody.",
    evidence: "profile-card.tsx renders `image` verbatim inside the wrapper.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    status: "partial",
    description:
      "The name renders as an <h3> and the designation as a paragraph beneath it. The level is fixed, so place the card under an <h2> section heading or the document outline skips a level.",
    evidence: "profile-card.tsx hard-codes h3 for the title.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    description:
      "Name, designation and tag are real text in reading order, so the card reads correctly without its layout — the tag is a labelled span rather than a shape over the portrait.",
    evidence: "profile-card.tsx renders the tag as a span inside the image wrapper.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    description:
      "The card is not interactive and takes no tab stop. Where the whole card should navigate, wrap it in a real anchor so the surface becomes one focusable link.",
    evidence: "profile-card.tsx renders a div with no handlers and no tabIndex.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "untested",
    description:
      "The tag sits over the portrait, so its contrast depends on the photograph behind it. No measurement against a range of real departmental portraits has been recorded.",
  },
];

export default function ProfileCardPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Profile Card"
      status="New"
      summary="Carries an official's portrait, their name and the post they hold. It is the website's pattern for ministerial and senior-officer listings."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={
        <div className="cdp__specimen-row">
          <ProfileCard
            title="Dr. Virendra Kumar"
            subtitle="Hon'ble Union Minister · Ministry of Social Justice and Empowerment"
            tag="Minister"
            image={
              <div className="cdp-ground cdp-ground--brand">
                <span className="cdp-ground__label">Portrait</span>
              </div>
            }
          />
          <ProfileCard
            title="Smt. A. Srivastava"
            subtitle="Secretary, Department of Social Justice and Empowerment"
            image={
              <div className="cdp-ground">
                <span className="cdp-ground__label">Portrait</span>
              </div>
            }
          />
        </div>
      }
      propsFrom="ProfileCardProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page lists the Ministry's leadership or an organisation's senior officers, with their posts.",
          "The portrait is part of the content — a citizen expects to see who holds the office.",
          "A category or ministry label belongs over the portrait; `tag` carries it.",
        ],
        avoid: [
          "The person is being identified inside a list, a row or a menu — use an Avatar, which is built for that and stops at 48px.",
          "The subject is an organisation — use Org Logo and a Card, not a portrait frame.",
          "Personal contact details or an out-of-date designation would go on it. A departmental page carries the post, not the person's phone number.",
          "The card is one of many identical tiles with no portraits available — a Card with a title and subtitle reads better than a column of placeholder frames.",
        ],
      }}
      related={[
        { label: "Avatar", href: "/design-system/components/data-display/avatar", reason: "for identifying a person inside a row or a menu" },
        { label: "Card", href: "/design-system/components/data-display/card", reason: "for a surface with no portrait" },
        { label: "Org Logo", href: "/design-system/components/brand/org-logo", reason: "when the subject is an organisation" },
        { label: "Page Header", href: "/design-system/components/layout/page-header", reason: "the heading a listing of these sits under" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-image">
            <h2 id="cdp-image" className="cdp__h2">
              The Portrait Is Passed In
            </h2>
            <p>
              <code>image</code> takes a node rather than a URL, so the page decides how the photograph
              is loaded and optimised. Pass a <code>next/image</code> with <code>fill</code>, or an{" "}
              <code>img</code> sized to cover its wrapper; the frame supplies the aspect ratio and the
              crop, not the image element.
            </p>
            <p>
              That flexibility is also where the one accessibility obligation sits: the alt text is
              yours, and this component cannot supply it. See the accessibility tab.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-copy">
            <h2 id="cdp-copy" className="cdp__h2">
              What Goes on It
            </h2>
            <ul>
              <li>
                <strong>Title</strong> — the official&apos;s name with the honorific the department
                uses.
              </li>
              <li>
                <strong>Subtitle</strong> — the post, in the department&apos;s own words. A post
                outlives a person, and the post is what a citizen is looking for.
              </li>
              <li>
                <strong>Tag</strong> — optional, over the portrait. A category or a ministry, not a
                status.
              </li>
            </ul>
            <p>
              <strong>Never a personal contact number, and never a designation that has moved on.</strong>{" "}
              A leadership page is read as authoritative, so a stale post on it is a factual error
              rather than a cosmetic one.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ProfileCard } from "@mosje/design-system";
import Image from "next/image";

<ProfileCard
  title="Dr. Virendra Kumar"
  subtitle="Hon'ble Union Minister · Ministry of Social Justice and Empowerment"
  tag="Minister"
  image={
    <Image
      src="/leadership/virendra-kumar.jpg"
      alt="Dr. Virendra Kumar, Hon'ble Union Minister"
      fill
      style={{ objectFit: "cover" }}
    />
  }
/>`}</CodeBlock>
          <p>
            The card forwards its ref and passes native <code>div</code> attributes through, so a
            listing can give each card an <code>id</code> for a deep link without adding a wrapper.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-alt">
          <h2 id="cdp-alt" className="cdp__h2">
            The Alt Text Is Yours
          </h2>
          <p>
            Because <code>image</code> is a node, the component renders whatever it is given and cannot
            check that it carries a name. A portrait with no alt text on a leadership page announces as
            nothing, which on a departmental listing is a citizen being told there is an image and not
            who is in it.
          </p>
          <p>
            Write the alt as the name and the post together — &ldquo;Dr. Virendra Kumar, Hon&apos;ble
            Union Minister&rdquo; — rather than repeating only what the title already says. Do not pass
            an empty alt here: unlike an avatar in a menu, the portrait is the content.
          </p>
        </section>
      }
    />
  );
}
