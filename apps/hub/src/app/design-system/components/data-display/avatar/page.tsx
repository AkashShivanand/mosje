import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Avatar } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Avatar — Design System",
  description:
    "A person's photograph, initials or a fallback glyph at one of four sizes, for account menus, officer lists and comment rows.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "partial",
    description:
      'A photograph renders as an <img> and takes its accessible name from `alt`, which defaults to the empty string — an avatar with a src and no alt is announced as nothing. A fallback avatar carries role="img" with `alt` or the initials as its name. Always pass `alt`; the component cannot supply a name it was not given.',
    evidence: "avatar.tsx lines 46 and 89–90: alt defaults to \"\"; role=\"img\" and aria-label apply only on the fallback path.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    description:
      "The initials and the glyph are aria-hidden, so a screen reader hears the person's name rather than two letters spelled out.",
    evidence: "avatar.tsx lines 66, 72 and 78.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    description:
      "An avatar is not interactive and takes no tab stop of its own. Where the whole thing should be pressable, wrap it in a real button or link — that control is the focusable element, not this.",
    evidence: "avatar.tsx renders a <span> with no tabIndex and no handlers.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    status: "untested",
    description:
      "Fallback initials are drawn in the ink token over the surface token. No measurement has been recorded at the 24px size, where the text is smallest.",
  },
];

export default function AvatarPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Avatar"
      status="Stable"
      summary="Shows who someone is at a glance — their photograph if there is one, their initials if not, and a neutral glyph if neither. It comes at four fixed sizes and two shapes."
      figma={{ node: "avatars" }}
      specimen={
        <div className="cdp-stack">
          <div className="cdp__specimen-row">
            <Avatar size={24} initials="AS" alt="Akash Shivanand" />
            <Avatar size={32} initials="AS" alt="Akash Shivanand" />
            <Avatar size={40} initials="AS" alt="Akash Shivanand" />
            <Avatar size={48} initials="AS" alt="Akash Shivanand" />
          </div>
          <div className="cdp__specimen-row">
            <Avatar size={48} shape="rounded" initials="RS" alt="R. Sharma" />
            <Avatar size={48} alt="Officer with no photograph on file" />
          </div>
        </div>
      }
      propsFrom="AvatarProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A row, a menu or a comment identifies a person and their name is already written beside it.",
          "An account menu needs a compact, recognisable target for the signed-in user.",
          "A list of officers or approvers reads faster with a face or a set of initials against each name.",
        ],
        avoid: [
          "The mark stands for an organisation rather than a person — use Org Logo, which holds the departmental crests at their published resolution.",
          "The avatar is the only identification. A circle of initials is not a name; put the name beside it.",
          "A photograph is being shown for its own sake rather than as an identifier — use a Profile Card, which is built to carry a portrait and a designation.",
          "The image needs to be larger than 48px. The scale stops there deliberately; beyond it a portrait is content, not an identifier.",
        ],
      }}
      related={[
        { label: "Profile Card", href: "/design-system/components/data-display/profile-card", reason: "when the portrait and the designation are the content" },
        { label: "Account Menu", href: "/design-system/components/navigation/account-menu", reason: "the avatar's most common home" },
        { label: "Org Logo", href: "/design-system/components/brand/org-logo", reason: "when the mark stands for an organisation" },
        { label: "Badge", href: "/design-system/components/feedback/badge", reason: "for a status beside the person rather than the person" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-fallback">
            <h2 id="cdp-fallback" className="cdp__h2">
              The Fallback Order
            </h2>
            <p>
              The avatar renders, in priority: the image at <code>src</code>, then{" "}
              <code>initials</code>, then a supplied <code>icon</code>, then the default user glyph. So
              a list where only some people have a photograph still reads as one list rather than as a
              row of holes.
            </p>
            <p>
              The order is fixed and the component never renders empty. What it cannot supply is the
              name — see the accessibility tab, which is where the one real trap on this component
              lives.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-size">
            <h2 id="cdp-size" className="cdp__h2">
              Four Sizes, Two Shapes
            </h2>
            <ul>
              <li>
                <strong>24</strong> — inside a dense table row, beside 14px text.
              </li>
              <li>
                <strong>32</strong> — a list row or a comment.
              </li>
              <li>
                <strong>40</strong> — the default, and the account menu&apos;s size.
              </li>
              <li>
                <strong>48</strong> — a header or a card where the person is the subject.
              </li>
            </ul>
            <p>
              <code>shape</code> is <code>circular</code> by default. Use <code>rounded</code> only
              where the avatar sits in a run of square-cornered thumbnails and a circle would be the
              odd one out.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Avatar } from "@mosje/design-system";

// A photograph. alt is the accessible name — never leave it out.
<Avatar src="/officers/r-sharma.jpg" alt="Dr. R. Sharma" size={40} />

// No photograph on file. Initials, still named.
<Avatar initials="RS" alt="Dr. R. Sharma" size={40} />`}</CodeBlock>
          <p>
            Making the whole avatar pressable is the wrapper&apos;s job. The avatar itself is a{" "}
            <code>span</code> with no handlers, so an <code>onClick</code> put on it would produce a
            control a keyboard cannot reach.
          </p>
          <CodeBlock>{`<button type="button" className="…" aria-label="Open account menu">
  <Avatar src={user.photo} alt="" size={40} />
</button>`}</CodeBlock>
          <p>
            Note the empty <code>alt</code> there: the button already carries the name, and repeating it
            on the image would announce the same person twice.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-name">
          <h2 id="cdp-name" className="cdp__h2">
            The Name Is Not Automatic
          </h2>
          <p>
            <code>alt</code> defaults to the empty string, which is the correct default for a
            decorative image and the wrong one for an identifier. An avatar given a{" "}
            <code>src</code> and no <code>alt</code> is announced as nothing at all — the single most
            likely defect on this component, and one nothing in the type system prevents.
          </p>
          <p>
            The fallback path is more forgiving: it carries <code>role=&quot;img&quot;</code> and falls
            back to the initials for its name, so an unnamed initials avatar at least announces
            &ldquo;AS&rdquo;. Two letters are still not a person, so pass <code>alt</code> there too.
          </p>
          <p>
            The two exceptions are worth stating plainly. Pass <code>alt=&quot;&quot;</code>{" "}
            deliberately where the person&apos;s name is already the accessible name of the control
            around the avatar, or is written immediately beside it — announcing it twice is noise, not
            access.
          </p>
        </section>
      }
    />
  );
}
