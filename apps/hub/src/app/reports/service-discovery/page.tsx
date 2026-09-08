"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SectionTitle, Tabs, Badge, Button } from "@mosje/design-system";
import "./service-discovery.css";

/**
 * The six service-discovery options, running live, so they can be shown in a room
 * rather than described. Each panel embeds the prototype it names — the same build
 * the walkthroughs in the deck were recorded from.
 *
 * DS Audit: SectionTitle ✅ existing · Tabs ✅ existing · Badge ✅ existing ·
 * Button ✅ existing · the 1440-wide stage is page-local layout, not a new component.
 */

type Option = {
  id: string;
  label: string;
  surface: string;
  title: string;
  status: "live" | "new";
  recommended?: boolean;
  what: string;
  file: string;
};

const OPTIONS: Option[] = [
  {
    id: "home-a", label: "Home · A", surface: "The Home Page · Option A of 3",
    title: "Explore User Personas", status: "live",
    what: "The panel already on the home page. One group at a time, behind arrows. Choosing a group would open the Schemes page already filtered to it — which today it does not do.",
    file: "home-a.html",
  },
  {
    id: "home-b", label: "Home · B", surface: "The Home Page · Option B of 3",
    title: "Find support for you", status: "new", recommended: true,
    what: "Five short questions, any of which may be skipped. Watch the count fall as the answers narrow, and note that choosing “Person with disability” routes to DEPwD rather than returning nothing.",
    file: "home-b.html",
  },
  {
    id: "home-c", label: "Home · C", surface: "The Home Page · Option C of 3",
    title: "Find offerings for you", status: "new",
    what: "One tap, no questions. Each group returns its portal, a scheme and the complaint route, on the home page itself.",
    file: "home-c.html",
  },
  {
    id: "scheme-a", label: "Schemes · A", surface: "The Schemes Page · Option A of 2",
    title: "Pictures of the nine groups, with cards", status: "new",
    what: "All nine groups visible at once. Welcoming, but a card has little room for who runs a scheme or where it applies.",
    file: "scheme-a.html",
  },
  {
    id: "scheme-b", label: "Schemes · B", surface: "The Schemes Page · Option B of 2",
    title: "Filter panel with a table of schemes", status: "new", recommended: true,
    what: "Filters combine — group and stage of life and kind of help together. The count beside each filter warns before an empty result rather than after it.",
    file: "scheme-b.html",
  },
  {
    id: "chatbot", label: "Assistant", surface: "The Assistant · Option A of 1",
    title: "Samajik Sahayak — the same five questions, in chat", status: "live", recommended: true,
    what: "Open it from the corner of an ordinary page. The same five questions, one per screen, on a surface that is already built.",
    file: "chatbot.html",
  },
];

const BASE = "/prototypes/service-discovery";

const CANVAS_W = 1440;
const CANVAS_H = 900;

export default function ServiceDiscoveryPrototypes() {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  /* The prototypes are drawn on a 1440 canvas. Scale the whole frame to whatever
     width the room's screen gives us, rather than reflowing a design at a width it
     was never drawn for. CSS alone cannot do this — scale() needs a unitless ratio. */
  const measure = useCallback(() => {
    const el = stageRef.current;
    // A zero width means the stage is not laid out yet (a hidden pane, a collapsed
    // parent). Scaling by it would flatten the frame to nothing, so keep the last
    // good scale and wait for the observer to fire again with a real width.
    if (el && el.clientWidth > 0) setScale(el.clientWidth / CANVAS_W);
  }, []);
  useEffect(() => {
    measure();
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  // `noUncheckedIndexedAccess` — every hook has run by here, so an early return is safe.
  const o = OPTIONS[active];
  if (!o) return null;

  return (
    <main className="sa-container sd-page">
      <SectionTitle
        eyebrow="Service Discovery"
        title="How Citizens Find Schemes — the Six Options, Running"
        description="Each option below is a working prototype, not a picture. Open one and use it: the questions answer, the filters combine, the assistant replies. These are the same builds the walkthroughs in the deck were recorded from."
        as={2}
      />

      <Tabs
        tabs={OPTIONS.map((x) => ({ id: x.id, label: x.label }))}
        active={active}
        onChange={setActive}
        idBase="sd-option"
        ariaLabel="Service discovery options"
        indicator="underline"
        size="m"
      />

      <div className="sd-head" id={`sd-option-panel-${o.id}`} role="tabpanel" aria-labelledby={`sd-option-tab-${o.id}`}>
        <div className="sd-head__text">
          <p className="sd-head__surface">{o.surface}</p>
          <h3 className="sd-head__title">{o.title}</h3>
          <p className="sd-head__what">{o.what}</p>
        </div>
        <div className="sd-head__meta">
          <Badge status={o.status === "live" ? "neutral" : "info"} emphasis="subtle">
            {o.status === "live" ? "Already on the site" : "To be built"}
          </Badge>
          {o.recommended ? <Badge status="primary" emphasis="solid">Recommended</Badge> : null}
          <Button href={`${BASE}/${o.file}`} target="_blank" rel="noreferrer" variant="neutral" size="sm">
            Open full screen
          </Button>
        </div>
      </div>

      {/* The prototypes are built for a 1440 canvas; the stage scales that down to fit
          whatever width the room's screen gives us, rather than reflowing the design. */}
      <div className="sd-stage" ref={stageRef} style={{ height: CANVAS_H * scale }}>
        <iframe
          key={o.id}
          className="sd-stage__frame"
          src={`${BASE}/${o.file}`}
          title={`${o.title} — interactive prototype`}
          loading="lazy"
          style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})` }}
        />
      </div>

      <p className="sd-note">
        Schemes shown are the Department&rsquo;s own, tagged as they would be once the scheme records
        carry a group. Listing is not a decision on any application — the sanctioning authority decides that.
      </p>
    </main>
  );
}
