import * as React from "react";
import type { Metadata } from "next";

import { Illustration, SCENE_NAMES, illustrationAlt, type IllustrationTier } from "@mosje/design-system";

import "./illustration.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Illustration",
  description:
    "The SAMAVESH drawn language — one geometry at three sizes, four tokenised ink layers, and the reason no illustration in this estate depicts a person.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅ · Illustration ✅
 * The scenes are rendered live from scenes.tsx and their alt text read from the same
 * file, so the sheet cannot show a drawing the package does not ship. The language is
 * stated in components/brand/illustration/language.ts; the numbers below are read
 * from the exported set where the barrel exposes them and typed against its types
 * where it does not.
 */

/** The three rendered boxes. Typed against the component's own tier union, so a fourth tier cannot be added here without being added there. */
const TIERS: Record<IllustrationTier, { name: string; size: string; use: string }> = {
  spot: { name: "Spot", size: "32 × 24", use: "Beside a line of text, in a chip, in a dense table row." },
  scene: { name: "Scene", size: "192 × 144", use: "An empty state, a card that cannot draw, a step in a flow." },
  hero: { name: "Hero", size: "384 × 288", use: "A page-level statement. Steps down to Scene on a narrow viewport." },
};
const TIER_KEYS = Object.keys(TIERS) as IllustrationTier[];

/** The authored coordinate space and the floor every grounded mark meets — language.ts §1–2. */
const VIEWBOX = { w: 64, h: 48 };
const FLOOR = { y: 40, x1: 8, x2: 56 };

/** The four ink layers and the colour role each binds — language.ts §3, illustration.css. */
const INKS: { layer: "ground" | "ghost" | "ink" | "accent"; name: string; token: string; use: string }[] = [
  { layer: "ground", name: "Ground", token: "border/neutral/base", use: "The floor and any structural rule." },
  { layer: "ghost", name: "Ghost", token: "border/neutral/subtle", use: "What is absent, inactive, or not yet." },
  { layer: "ink", name: "Ink", token: "text/neutral/subtle", use: "What is present and true." },
  { layer: "accent", name: "Accent", token: "bg/brand/primary/bolder", use: "The one element carrying the meaning. At most one per drawing." },
];

/** The only stroke weights in the system — language.ts §4. */
const STROKES: { key: "hairline" | "ink" | "mass"; units: number; use: string }[] = [
  { key: "hairline", units: 2, use: "The floor, a rule, a guide." },
  { key: "ink", units: 3, use: "A line that is the subject." },
  { key: "mass", units: 4, use: "A bar, a block, a body." },
];

/** The primitives a scene is assembled from — primitives.tsx. Deliberately not exported from the package barrel. */
const PRIMITIVES = ["Bars", "Ground", "Lens", "Ring", "Seat", "Series", "Sheet", "Shut", "Signal"];

export default function IllustrationPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Illustration"
      status="New"
      since="0.48.0"
      summary="One drawn language for the estate. Every illustration is authored in a single 64 × 48 coordinate space, stands on the same floor, and takes its colour from four tokenised ink layers — so a drawing is correct at every size and follows the brand it is rendered under. No drawing depicts a person, because the Department's subject is a process and an entitlement."
      figma={{
        absent:
          "No Figma page. The set lives in code as SVG — packages/design-system/components/brand/illustration, where language.ts states the rules, primitives.tsx holds the shapes and scenes.tsx assembles the drawings — and this page renders it live from that source.",
      }}
      glance={[
        { value: SCENE_NAMES.length, label: "scenes", note: "chosen from what the estate's workflows contain" },
        { value: TIER_KEYS.length, label: "tiers", note: `${TIERS.spot.size} · ${TIERS.scene.size} · ${TIERS.hero.size}` },
        { value: INKS.length, label: "ink layers", note: "each a colour role, none a hex" },
        { value: STROKES.length, label: "stroke weights", note: STROKES.map((s) => s.units).join(" · ") + " units" },
        { value: PRIMITIVES.length, label: "primitives", note: "a scene is assembled, never drawn" },
        { value: `${VIEWBOX.w} × ${VIEWBOX.h}`, label: "authored space", note: "one viewBox, three rendered boxes" },
      ]}
      sections={[
        {
          id: "geometry",
          keyword: "GEOMETRY",
          title: "One Geometry, Rendered at Three Tiers",
          description:
            "The authored geometry does not change between tiers; only the rendered box does. Strokes, corners and gaps scale together, so a drawing needs one definition rather than three. Every tier is 4:3 — a drawing that needs a different aspect is a different drawing, not a special case.",
          content: (
            <>
              <div className="ill-tiers">
                {TIER_KEYS.map((tier) => (
                  <div key={tier} className="ill-tiers__row">
                    <div className="ill-tiers__art">
                      <Illustration name="places-sanctioned" tier={tier} />
                    </div>
                    <div>
                      <h3 className="ill-tiers__name">{TIERS[tier].name}</h3>
                      <p className="ill-tiers__size">{TIERS[tier].size}</p>
                      <p className="ill-tiers__use">{TIERS[tier].use}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Callout type="info" title="The smallest tier drops texture">
                Spot renders the {VIEWBOX.w} × {VIEWBOX.h} space at half scale, where a two-unit hairline lands at one pixel and
                three sheet rules three units apart become a smudge. A drawing is correct at every size only if it sheds the
                detail it cannot carry: structure stays, texture goes, and a dash pattern becomes solid because at that scale a
                dashed mark reads as noise rather than as &ldquo;not yet&rdquo;.
              </Callout>
            </>
          ),
        },
        {
          id: "floor",
          keyword: "FLOOR",
          title: "An Object That Stands Meets the Floor; a Mark That Is Not an Object Does Not",
          description: `Every scene is drawn against the same baseline, at y = ${FLOOR.y}, running x = ${FLOOR.x1} → ${FLOOR.x2}. The charts are all grounded, so the illustrations are, and the family reads as one family from across a room. Bars, seats and sheets terminate exactly on the floor; a ring is a proportion and a lens is an instrument, and standing either on the ground would be a drawing about furniture.`,
          content: (
            <>
              <div className="ill-strokes" aria-label="The three stroke weights">
                {STROKES.map((s) => (
                  <div key={s.key} className="ill-stroke">
                    <span className={`ill-stroke__rule ill-stroke__rule--${s.key}`} aria-hidden="true" />
                    <span className="ill-stroke__name">
                      {s.key} · {s.units}
                    </span>
                    <p className="ill-stroke__use">{s.use}</p>
                  </div>
                ))}
              </div>
              <p>
                Round joins, always. Round caps except where a mark meets the floor: a round cap adds half the stroke width past
                the endpoint, so a grounded mark uses a butt cap or it hangs below the line it stands on. Three weights and no
                others.
              </p>
            </>
          ),
        },
        {
          id: "ink",
          keyword: "INK",
          title: "Four Ink Layers, and No Drawing Names a Colour",
          description:
            "A raw hex in an illustration is the same defect as a raw hex in a component, and worse: an illustration that does not follow data-brand is the one asset on the page that still says the old brand. Every stroke resolves through a token, which is what lets a drawing follow the brand instead of keeping the palette it was drawn in.",
          content: (
            <>
              <div className="ill-inks">
                {INKS.map((ink) => (
                  <div key={ink.layer} className="ill-ink">
                    <span className={`ill-ink__swatch ill-ink__swatch--${ink.layer}`} aria-hidden="true" />
                    <span className="ill-ink__name">{ink.name}</span>
                    <code className="ill-ink__token">{ink.token}</code>
                    <p className="ill-ink__use">{ink.use}</p>
                  </div>
                ))}
              </div>
              <DoDont
                cards={[
                  {
                    type: "do",
                    preview: <Illustration name="no-results" tier="spot" />,
                    label: "One accent — the lens — carries the meaning. Ghost bars say what was searched; the accent says what searched.",
                  },
                  {
                    type: "dont",
                    preview: <code>stroke=&quot;#0373DF&quot;</code>,
                    label: "A literal stroke keeps the brand it was drawn in after every other element on the page has moved.",
                  },
                  {
                    type: "dont",
                    preview: <code>accent + accent</code>,
                    label: "Two accents means the drawing has not decided what it is about.",
                  },
                ]}
              />
              <Callout type="info" title="Under forced colours the four layers keep their four meanings">
                Windows High Contrast does not repaint a stroke set from a custom property, so the component maps the layers onto
                system keywords instead: ground and ink take <code>CanvasText</code>, accent takes <code>Highlight</code>, and
                ghost takes <code>GrayText</code> — never <code>CanvasText</code>, because the drawing that says &ldquo;nothing
                has been reported&rdquo; must not become identical to the one that says &ldquo;here are your figures&rdquo; for
                exactly the readers that mode exists to serve.
              </Callout>
            </>
          ),
        },
        {
          id: "people",
          keyword: "PEOPLE",
          title: "No Illustration Here Depicts a Person",
          description:
            "The Department serves Scheduled Castes, Scheduled Tribes, Other Backward Classes, senior citizens, persons with disabilities, transgender persons, and people in situations of destitution. Any depicted person has a gender, an age, an apparent community and an apparent ability, and every citizen who is not that person is told the page is not for them.",
          content: (
            <>
              <p>
                So: no faces, no hair, no skin, no clothing that reads as a community, no gendered silhouettes. Where a drawing
                needs a human presence it uses the evidence of one — a seat, a form, a place in a queue — never a figure with
                attributes. This is a property of the language, not a limitation to work around: the Department&rsquo;s subject
                is a process and an entitlement, and those are what the drawings show. There is deliberately no success
                celebration, no team and no rocket — this is a department, not a product launch.
              </p>
              <Callout type="info" title="The National Emblem is never illustration">
                It is the estate&rsquo;s mark, it carries its own rules, and it does not appear inside a scene.
              </Callout>
            </>
          ),
        },
        {
          id: "set",
          keyword: "SET",
          title: `${SCENE_NAMES.length} Scenes, Chosen From What the Estate's Workflows Contain`,
          description:
            "An application is drafted, a document is outstanding, a place is sanctioned and not yet taken, a feed stops answering. Those are the pictures a citizen and an officer need. Each scene's written description is authored once, beside the drawing, so the same drawing is described the same way wherever it appears.",
          content: (
            <ul className="ill-sheet">
              {SCENE_NAMES.map((name) => (
                <li key={name} className="ill-sheet__cell">
                  <Illustration name={name} />
                  <p className="ill-sheet__name">{name}</p>
                  <p className="ill-sheet__alt">{illustrationAlt(name)}</p>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "assembly",
          keyword: "ASSEMBLY",
          title: "A Scene Is Assembled From Primitives, Never Drawn",
          description:
            "If a scene needs a shape the primitives do not provide, the primitive is added first and the scene is built from it — the same rule the components follow, for the same reason: a one-off drawn inside one scene is a shape the next scene will redraw slightly differently. A scene that reaches for a bespoke path is a primitive that has not been written yet.",
          content: (
            <>
              <ul className="ill-primitives" aria-label={`The ${PRIMITIVES.length} primitives`}>
                {PRIMITIVES.map((p) => (
                  <li key={p}>
                    <code>{p}</code>
                  </li>
                ))}
              </ul>
              <p>
                The primitives are deliberately not exported from the package: <code>Series</code> beside the charts&rsquo; own
                series vocabulary and <code>Sheet</code> beside <code>SideSheet</code> would be nine of the most generic nouns in
                the language dropped into the estate&rsquo;s global namespace. A new scene is added to <code>scenes.tsx</code>,
                which is where the primitives are in scope.
              </p>
              <p>
                Illustrations are decorative by default. Pass <code>alt</code> only where the drawing carries information the
                surrounding text does not, which on a well-written page is rare — a drawing beside a heading that already says
                &ldquo;No records found&rdquo; makes a screen reader announce the same thing twice. Prefer <code>EmptyState</code>{" "}
                or <code>CardState</code> where one fits; they place the drawing, the sentence and the action together.
              </p>
            </>
          ),
        },
      ]}
      tokens={[]}
      tokensIntro="Illustration has no token family of its own. The four ink layers bind existing colour roles — ground → border/neutral/base, ghost → border/neutral/subtle, ink → text/neutral/subtle, accent → bg/brand/primary/bolder — documented on the Colour foundation; the three tiers are SVG width and height attributes set from language.ts, not CSS; the three stroke weights are viewBox units, not stroke/* tokens. Nothing on this page binds anything the Colour and Sizing tables do not already list."
      tokensExtra={
        <table className="fdp__standards">
          <caption className="ds-sr-only">Ink layer to colour role</caption>
          <thead>
            <tr>
              <th scope="col">Layer</th>
              <th scope="col">Colour role</th>
              <th scope="col">CSS class</th>
              <th scope="col">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {INKS.map((ink) => (
              <tr key={ink.layer}>
                <td>{ink.name}</td>
                <td>
                  <code>{ink.token}</code>
                </td>
                <td>
                  <code>.sa-ill__{ink.layer}</code>
                </td>
                <td>{ink.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      a11y={[
        {
          criterion: "1.1.1 Non-text Content",
          level: "A",
          description:
            "A drawing is decorative by default and hidden from assistive technology; a drawing given alt is announced once, as an image, with the scene's own written description.",
          status: "partial",
          evidence:
            "illustration.tsx renders aria-hidden and focusable=\"false\" when no alt is passed, and role=\"img\" with a <title> when one is; the alt strings are authored once in scenes.tsx. Not yet asserted by an automated test.",
        },
        {
          criterion: "1.4.1 Use of Color",
          level: "A",
          description:
            "Meaning is carried by structure — which bars are ghosted, where a line breaks — and by the surrounding text, never by the accent colour alone.",
        },
        {
          criterion: "1.4.11 Non-text Contrast",
          level: "AA",
          description:
            "Decorative drawings are exempt; a drawing passed alt is informative and its ink and accent layers are expected to hold 3:1 against the surface. The ghost layer is below 3:1 by design, because it depicts absence.",
        },
        {
          criterion: "GIGW 3.0 — Colour and contrast",
          level: "GIGW",
          description:
            "Under forced colours the four layers map to CanvasText, GrayText and Highlight so the drawing stays readable in the reader's own palette.",
          status: "partial",
          evidence: "The forced-colors block in illustration.css; the GrayText mapping is what keeps ghost distinct from ink. Not yet screenshot-tested in Windows High Contrast.",
        },
      ]}
      related={[
        { label: "Color", href: "/design-system/foundations/color", reason: "the four roles the ink layers bind" },
        { label: "Stroke", href: "/design-system/foundations/stroke", reason: "the estate's stroke ladder, which these viewBox units are not" },
        { label: "Card State", href: "/design-system/components/dashboard/card-state", reason: "the six data states these drawings generalise from" },
        { label: "Empty State", href: "/design-system/components/feedback/empty-state", reason: "places a drawing, a sentence and an action together" },
      ]}
    />
  );
}
