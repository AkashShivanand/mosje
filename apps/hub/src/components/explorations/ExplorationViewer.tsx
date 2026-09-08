"use client";

import * as React from "react";
import { Icon } from "@mosje/design-system";
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
  "service-discovery/schemes-page/pictures": SchemesPictures,
  "service-discovery/schemes-page/filter-table": SchemesFilterTable,
  "service-discovery/assistant/samajik-sahayak": AssistantChat,
};

const STATUS_WORD: Record<ExplorationOption["status"], string> = {
  chosen: "Chosen",
  proposed: "Awaiting a decision",
  superseded: "Not chosen",
  parked: "Parked",
};

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
}: {
  surfaceId: string;
  module: ExplorationModule;
}): React.JSX.Element {
  const [active, setActive] = React.useState(module.options[0]?.id ?? "");
  // Bumped by "Reset", and part of the frame's key. Switching options already
  // remounts; this is for the reviewer who wants to watch the same one twice.
  const [run, setRun] = React.useState(0);
  const option = module.options.find((o) => o.id === active) ?? module.options[0];
  // A module with no options is a registry defect, not a state to design for —
  // the register's own type says "two or more". Rendering nothing is the honest
  // response, and it fails loudly on the page rather than silently in a build.
  if (!option) return <p className="xpl-viewer">This decision has no options recorded.</p>;
  const Prototype = PROTOTYPES[`${surfaceId}/${module.id}/${option.id}`];

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
            onClick={() => setActive(o.id)}
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
              setActive(id);
              document.getElementById(`xpl-tab-${id}`)?.focus();
            }}
          >
            <span className="xpl-viewer__tab-title">{o.title}</span>
            <span className={`xpl-status xpl-status--${o.status}`}>{STATUS_WORD[o.status]}</span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`xpl-panel-${option.id}`}
        aria-labelledby={`xpl-tab-${option.id}`}
        className="xpl-viewer__panel"
      >
        <p className="xpl-viewer__summary">{option.summary}</p>

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
          <>
            <div className="xpl-frame" key={`${option.id}:${run}`}>
              <Prototype />
            </div>
            <p className="xpl-viewer__reset">
              <button type="button" className="xpl-viewer__reset-btn" onClick={() => setRun((n) => n + 1)}>
                <Icon name="refresh" size={16} aria-hidden />
                <span>Reset this prototype</span>
              </button>
            </p>
          </>
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
