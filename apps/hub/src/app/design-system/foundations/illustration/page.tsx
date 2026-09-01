import type { Metadata } from "next";
import * as React from "react";

import { Illustration, SCENE_NAMES, illustrationAlt } from "@mosje/design-system";
import { Callout } from "@/components/design-system/docs-kit/index";

export const metadata: Metadata = {
  title: "Illustration",
  description:
    "The SAMAVESH drawn language — one geometry at three sizes, four tokenised ink layers, and the reason no illustration in this estate depicts a person.",
};

const TIERS = [
  { tier: "spot" as const, name: "Spot", size: "32 × 24", use: "Beside a line of text, in a chip, in a dense table row." },
  { tier: "scene" as const, name: "Scene", size: "192 × 144", use: "An empty state, a card that cannot draw, a step in a flow." },
  { tier: "hero" as const, name: "Hero", size: "384 × 288", use: "A page-level statement. Steps down to Scene on a narrow viewport." },
];

export default function IllustrationPage(): React.JSX.Element {
  return (
    <article className="docs-article cdp">
      <header className="cdp__header">
        <div className="cdp__titlerow">
          <h1 className="cdp__title">Illustration</h1>
        </div>
        <p className="cdp__summary">
          One drawn language for the estate. Every illustration is authored in a single 64 × 48
          coordinate space, stands on the same floor, and takes its colour from four tokenised ink
          layers — so a drawing is correct at every size and follows the brand it is rendered under.
        </p>
      </header>

      <section className="cdp__section" aria-labelledby="ill-tiers">
        <h2 id="ill-tiers" className="cdp__h2">
          Three Tiers, One Geometry
        </h2>
        <p>
          The authored geometry does not change between tiers; only the rendered box does. Strokes,
          corners and gaps scale together, so a drawing needs one definition rather than three.
        </p>
        <div className="ill-tiers">
          {TIERS.map((t) => (
            <div key={t.tier} className="ill-tiers__row">
              <div className="ill-tiers__art">
                <Illustration name="places-sanctioned" tier={t.tier} />
              </div>
              <div>
                <h3 className="ill-tiers__name">{t.name}</h3>
                <p className="ill-tiers__size">{t.size}</p>
                <p>{t.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cdp__section" aria-labelledby="ill-people">
        <h2 id="ill-people" className="cdp__h2">
          Why No Illustration Here Depicts a Person
        </h2>
        <p>
          The Department serves Scheduled Castes, Scheduled Tribes, Other Backward Classes, senior
          citizens, persons with disabilities, transgender persons, and people in situations of
          destitution. Any depicted person has a gender, an age, an apparent community and an
          apparent ability, and every citizen who is not that person is told the page is not for
          them.
        </p>
        <p>
          Where a drawing needs a human presence it uses the evidence of one — a seat, a form, a
          place in a queue — never a figure with attributes. This is a property of the language, not
          a limitation to work around: the Department&rsquo;s subject is a process and an
          entitlement, and those are what the drawings show.
        </p>
        <Callout type="info" title="The National Emblem is never illustration">
          It is the estate&rsquo;s mark, it carries its own rules, and it does not appear inside a
          scene.
        </Callout>
      </section>

      <section className="cdp__section" aria-labelledby="ill-ink">
        <h2 id="ill-ink" className="cdp__h2">
          Four Ink Layers
        </h2>
        <p>
          No drawing names a colour. Every stroke resolves through a token, which is what lets an
          illustration follow <code>data-brand</code> instead of keeping the palette it was drawn
          in. At most one accent per drawing — two accents means the drawing has not decided what
          it is about.
        </p>
        <ul>
          <li>
            <strong>Ground</strong> — the floor and any structural rule.
          </li>
          <li>
            <strong>Ghost</strong> — what is absent, inactive, or not yet.
          </li>
          <li>
            <strong>Ink</strong> — what is present and true.
          </li>
          <li>
            <strong>Accent</strong> — the one element carrying the meaning.
          </li>
        </ul>
      </section>

      <section className="cdp__section" aria-labelledby="ill-set">
        <h2 id="ill-set" className="cdp__h2">
          The Set
        </h2>
        <p>
          Chosen from what this estate&rsquo;s workflows contain: an application is drafted, a
          document is outstanding, a place is sanctioned and not yet taken, a feed stops answering.
        </p>
        <ul className="ill-sheet">
          {SCENE_NAMES.map((name) => (
            <li key={name} className="ill-sheet__cell">
              <Illustration name={name} />
              <p className="ill-sheet__name">{name}</p>
              <p className="ill-sheet__alt">{illustrationAlt(name)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="cdp__section" aria-labelledby="ill-add">
        <h2 id="ill-add" className="cdp__h2">
          Adding a Scene
        </h2>
        <p>
          A scene is assembled from the primitives, never drawn. If it needs a shape the primitives
          do not provide, the primitive is added first and the scene is built from it — the same
          rule the components follow, for the same reason: a one-off drawn inside one scene is a
          shape the next scene will redraw slightly differently.
        </p>
        <p>
          Illustrations are decorative by default. Pass <code>alt</code> only where the drawing
          carries information the surrounding text does not, which on a well-written page is rare —
          a drawing beside a heading that already says &ldquo;No records found&rdquo; makes a screen
          reader announce the same thing twice.
        </p>
      </section>
    </article>
  );
}
