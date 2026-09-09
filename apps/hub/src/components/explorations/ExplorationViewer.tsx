"use client";

import * as React from "react";
import { Icon, SectionTitle } from "@mosje/design-system";
import type { ExplorationModule, ExplorationOption } from "@/lib/explorations/registry";
import { OptionArrive, OptionFlight } from "./nmba/CampaignBandOptions";
import { OptionOneBand, OptionTwoBands } from "./nmba/TopBandsOptions";
import { HelplineRinging, HelplineStatic } from "./nmba/HelplineCardOptions";
import { LayoutCtasBelow, LayoutCtasRight, LayoutTwoZones } from "./nmba/BannerLayoutOptions";
import {
  HomePersonas,
  HomeFiveQuestions,
  HomeSchemeFinder,
  HomeOneTap,
  HomeTasks,
  HomeSearch,
  HandOffInterstitial,
  SchemesPictures,
  SchemesFilterTable,
  AssistantChat,
} from "./service-discovery/options";
import "./explorations.css";

/**
 * THE PROTOTYPE REGISTRY.
 *
 * Keyed `surface/module/option`, so a record in `registry.ts` that says
 * `live: true` and a component here that renders it are matched by one string
 * and nothing else. A `live: true` option with no entry here renders the
 * "no prototype" panel rather than a blank frame — the reviewer is told which,
 * because a missing prototype and a prototype that draws nothing look the same.
 */
const PROTOTYPES: Record<string, React.ComponentType> = {
  "nmba/campaign-band/flight": OptionFlight,
  "nmba/campaign-band/arrive": OptionArrive,
  "nmba/top-bands/two": OptionTwoBands,
  "nmba/top-bands/one": OptionOneBand,
  "nmba/helpline-card/current": HelplineStatic,
  "nmba/helpline-card/ringing": HelplineRinging,
  "nmba/banner-layout/ctas-right": LayoutCtasRight,
  "nmba/banner-layout/ctas-below": LayoutCtasBelow,
  "nmba/banner-layout/two-zones": LayoutTwoZones,
  "service-discovery/home-page/personas": HomePersonas,
  "service-discovery/home-page/five-questions": HomeFiveQuestions,
  "service-discovery/home-page/finder": HomeSchemeFinder,
  "service-discovery/home-page/one-tap": HomeOneTap,
  "service-discovery/home-page/tasks": HomeTasks,
  "service-discovery/home-page/search": HomeSearch,
  "service-discovery/schemes-page/pictures": SchemesPictures,
  "service-discovery/schemes-page/filter-table": SchemesFilterTable,
  "service-discovery/hand-off/interstitial": HandOffInterstitial,
  "service-discovery/assistant/samajik-sahayak": AssistantChat,
};

/**
 * THE OPTION A MODULE OPENS ON.
 *
 * It used to be `options[0]`, and the register is ordered CHRONOLOGICALLY — the
 * option drawn first, which on a settled decision is reliably the one that lost.
 * Measured across the register before this changed: all five settled decisions
 * opened on a rejected option, and four of those on an option that predates this
 * section and was therefore never built, so the page opened on a dashed empty
 * box. `/explorations/nmba/campaign-band` — the first card on the index — showed
 * a stakeholder "It goes with the band · Not chosen" and nothing else.
 *
 * The register's own order is the RECORD and is not touched. Only the landing
 * point moves, and it moves to the answer:
 *
 *   1. the chosen option — the decision, which is what the page is about
 *   2. failing that, the first option with a prototype to look at
 *   3. failing that, the first option, so the page always resolves
 *
 * A chosen option with no prototype still wins over a live rejected one: the
 * panel then says the prototype was the live estate itself, which is the truth
 * about the decision rather than a picture of the alternative.
 */
function defaultOptionId(module: ExplorationModule): string {
  const chosen = module.options.find((o) => o.status === "chosen");
  const live = module.options.find((o) => o.live);
  return (chosen ?? live ?? module.options[0])?.id ?? "";
}

const STATUS_WORD: Record<ExplorationOption["status"], string> = {
  chosen: "Chosen",
  proposed: "Awaiting a decision",
  superseded: "Not chosen",
  parked: "Parked",
};

/**
 * "Chosen" alone is a lie in `documents`, where two options won on different
 * surfaces. Where the register scopes a win, the scope is part of the word.
 */
function statusWord(option: ExplorationOption): string {
  const word = STATUS_WORD[option.status];
  return option.chosenFor ? `${word} · ${option.chosenFor}` : word;
}

/**
 * One decision, all its options, one at a time.
 *
 * ── WHY ONE AT A TIME AND NOT SIDE BY SIDE ──────────────────────────────────
 *
 * A side-by-side comparison halves the width of each option, and half a band is
 * not the band. These prototypes are full-width page furniture whose whole
 * question is how they sit across a 1,272px measure; showing two of them at
 * 620px each answers a question nobody asked. The switcher keeps the frame the
 * same size and swaps what is inside it, which is also how a stakeholder
 * actually compares — by flipping between two things in the same place.
 *
 * ── AND WHY THE PROTOTYPE IS REMOUNTED ON EVERY SWITCH ──────────────────────
 *
 * The `key` on the frame is the option id, so switching away and back gives a
 * fresh instance. Both campaign-band options are dismissable and neither can be
 * un-dismissed; without the remount, a reviewer who dismissed one and came back
 * would find it already gone and conclude the prototype was broken.
 */
export function ExplorationViewer({
  surfaceId,
  module,
  initialOptionId,
}: {
  surfaceId: string;
  module: ExplorationModule;
  /**
   * `?option=` READ ON THE SERVER, not here.
   *
   * The obvious client version — a mount effect that reads
   * `window.location.search` and calls `setActive` — is banned by
   * `react-hooks/set-state-in-effect`, and rightly: it renders the wrong option
   * first and corrects it a frame later. Reading the query in the page and
   * handing the answer down means the server and the client agree on the first
   * paint, so there is no flash and no hydration mismatch.
   *
   * What it costs is that these eleven pages now render per request rather than
   * at build. They are internal, `noindex`, behind the site gate, and their
   * params are still enumerated by `generateStaticParams`.
   */
  initialOptionId?: string;
}): React.JSX.Element {
  const [active, setActive] = React.useState(() =>
    initialOptionId && module.options.some((o) => o.id === initialOptionId)
      ? initialOptionId
      : defaultOptionId(module),
  );
  // Bumped by "Reset", and part of the frame's key. Switching options already
  // remounts; this is for the reviewer who wants to watch the same one twice.
  const [run, setRun] = React.useState(0);

  /**
   * SELECT, AND SAY SO IN THE URL.
   *
   * Every link to a module used to open that module's default, so "look at the
   * third one" could not be sent — the reader arrived somewhere else and had to
   * be told which pill to press. `replaceState` rather than a router push: this
   * is not a navigation, and pushing it would make Back walk through the options
   * a reviewer flipped between rather than leaving the page.
   */
  const select = React.useCallback((id: string) => {
    setActive(id);
    const url = new URL(window.location.href);
    url.searchParams.set("option", id);
    window.history.replaceState(null, "", url);
  }, []);

  const option = module.options.find((o) => o.id === active) ?? module.options[0];
  // A module with no options is a registry defect, not a state to design for —
  // the register's own type says "two or more". Rendering nothing is the honest
  // response, and it fails loudly on the page rather than silently in a build.
  if (!option) return <p className="xpl-viewer">This decision has no options recorded.</p>;
  const Prototype = PROTOTYPES[`${surfaceId}/${module.id}/${option.id}`];

  // The stepper WRAPS, like the tab row's own arrow keys already do. With two or
  // three options — which is most of the register — flipping is the whole point,
  // and a disabled end would make comparing the first against the last a
  // round trip through every one in between.
  const index = module.options.findIndex((o) => o.id === option.id);
  const stepTo = (delta: number): ExplorationOption | undefined =>
    module.options[(index + delta + module.options.length) % module.options.length];
  const previous = stepTo(-1);
  const following = stepTo(1);
  const many = module.options.length > 1;

  return (
    <div className="xpl-viewer">
      <div className="xpl-viewer__switch" role="tablist" aria-label={`Options for ${module.title}`}>
        {module.options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="tab"
            id={`xpl-tab-${o.id}`}
            aria-selected={o.id === active}
            aria-controls={`xpl-panel-${o.id}`}
            tabIndex={o.id === active ? 0 : -1}
            className="xpl-viewer__tab"
            onClick={() => select(o.id)}
            onKeyDown={(e) => {
              const i = module.options.findIndex((x) => x.id === o.id);
              const next =
                e.key === "ArrowRight"
                  ? (i + 1) % module.options.length
                  : e.key === "ArrowLeft"
                    ? (i - 1 + module.options.length) % module.options.length
                    : -1;
              if (next < 0) return;
              e.preventDefault();
              const id = module.options[next]?.id;
              if (!id) return;
              select(id);
              document.getElementById(`xpl-tab-${id}`)?.focus();
            }}
          >
            {/*
             * A DOT, NOT THE SENTENCE — and the sentence is still in the
             * accessible name, because a coloured mark on its own is status
             * conveyed by colour alone (WCAG 1.4.1). What decodes it for a
             * sighted reader is the legend in the module header directly above
             * this row, which is the same dot beside the same word.
             *
             * The word had to go: six tabs measured 222px each against a 1,272px
             * container, so the row wrapped to two lines even after the labels
             * were shortened — and "Awaiting a decision" appeared five times in
             * one row, saying nothing the header could not say once.
             */}
            <span className={`xpl-dot xpl-dot--${o.status}`} aria-hidden />
            <span className="xpl-viewer__tab-title">{o.label}</span>
            <span className="xpl-sr-only">{statusWord(o)}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`xpl-panel-${option.id}`}
        aria-labelledby={`xpl-tab-${option.id}`}
        className="xpl-viewer__panel"
      >
        {/*
         * ── THE OPTION BAR — pinned, because the name has to survive a scroll ──
         *
         * It sits INSIDE the panel and above the summary, so it belongs to the
         * option it names and leaves with it. The tab row stays above as the jump
         * list; this is the handle you hold while you are inside the prototype.
         *
         * The live region wraps the count, the name and the status together so a
         * step announces one sentence — "3 of 6, Two questions, awaiting a
         * decision" — rather than three separate updates a reader has to assemble.
         */}
        <div className="xpl-viewer__bar">
          {many && previous ? (
            <button
              type="button"
              className="xpl-viewer__step"
              onClick={() => select(previous.id)}
              /* The DESTINATION, not the direction. "Previous" alone tells a
                 screen-reader user which way the control goes and nothing about
                 where it lands, which is the thing they cannot see. */
              aria-label={`Previous option: ${previous.label}`}
            >
              <Icon name="chevron_left" size={20} aria-hidden />
            </button>
          ) : null}

          <p className="xpl-viewer__bar-now" aria-live="polite">
            {many ? (
              <span className="xpl-viewer__bar-count">
                {index + 1} / {module.options.length}
              </span>
            ) : null}
            <span className="xpl-viewer__bar-name">{option.label}</span>
            <span className={`xpl-dot xpl-dot--${option.status}`} aria-hidden />
            <span className="xpl-viewer__bar-status">{statusWord(option)}</span>
          </p>

          {Prototype ? (
            <button
              type="button"
              className="xpl-viewer__bar-reset"
              onClick={() => setRun((n) => n + 1)}
              /* Named on the button rather than by its span, because the span is
                 visually hidden below 640 and the glyph is decorative. */
              aria-label="Reset this prototype"
            >
              <Icon name="refresh" size={16} aria-hidden />
              <span className="xpl-viewer__bar-reset-label">Reset</span>
            </button>
          ) : null}

          {many && following ? (
            <button
              type="button"
              className="xpl-viewer__step"
              onClick={() => select(following.id)}
              aria-label={`Next option: ${following.label}`}
            >
              <Icon name="chevron_right" size={20} aria-hidden />
            </button>
          ) : null}
        </div>

        {/*
         * The FULL title, which the tab and the bar no longer carry — they hold
         * the short label now, and a name that exists only in a truncated pill is
         * a name nobody can read. `SectionTitle`, not a hand-rolled heading:
         * `ui-restraint-and-copy.md` §3 is explicit that a section heading is the
         * design system's, so section headers stay identical estate-wide.
         */}
        <SectionTitle
          as={2}
          title={option.title}
          description={option.summary}
          className="xpl-viewer__headline"
        />

        {option.lookAt?.length ? (
          <div className="xpl-viewer__look">
            <p className="xpl-viewer__look-title">What to look at</p>
            <ul>
              {option.lookAt.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {Prototype ? (
          /* Reset used to sit under here, below the fold of the thing it resets.
             It is in the bar now, where it is reachable at the moment a reviewer
             decides they want to watch the animation again. */
          <div className="xpl-frame" key={`${option.id}:${run}`}>
            <Prototype />
          </div>
        ) : (
          <div className="xpl-frame xpl-frame--none">
            <p>
              {option.status === "superseded" || option.status === "chosen"
                ? "This option predates the explorations section, so its prototype was the live estate itself. What it did, and what became of it, is recorded below."
                : "No prototype has been built for this option yet."}
            </p>
          </div>
        )}

        {option.landedIn ? (
          <p className="xpl-viewer__note">
            <Icon name="check_circle" size={16} aria-hidden />
            <span>Landed in {option.landedIn}.</span>
          </p>
        ) : null}

        {option.supersededBy ? (
          <p className="xpl-viewer__note">
            <Icon name="history" size={16} aria-hidden />
            <span>Not chosen. {option.supersededBy}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
