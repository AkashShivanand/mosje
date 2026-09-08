"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./service-discovery-options.css";

/**
 * The six service-discovery options, as prototypes the explorations viewer can
 * mount one at a time.
 *
 * Each option is a page that already exists and already runs — five as static
 * files under /prototypes, the assistant as a route that renders the design
 * system's own Chatbot. This file only frames them, so there is one copy of each
 * prototype rather than a second one written to satisfy the register.
 *
 * They are drawn on a 1440 canvas, which is wider than the viewer's frame, so
 * the frame is scaled rather than reflowed: these are full-page layouts whose
 * whole question is how they sit across a desktop measure, and a reflowed
 * version answers a question nobody asked.
 */

const CANVAS_W = 1440;
const CANVAS_H = 900;

function Stage({ src, title, height = CANVAS_H }: { src: string; title: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  /* CSS cannot do this on its own — scale() needs a unitless ratio, and a length
     divided by a length is not one. So the width is measured. */
  const measure = useCallback(() => {
    const el = ref.current;
    if (el && el.clientWidth > 0) setScale(el.clientWidth / CANVAS_W);
  }, []);
  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div className="sdopt-stage" ref={ref} style={{ height: height * scale }}>
      <iframe
        className="sdopt-stage__frame"
        src={src}
        title={title}
        loading="lazy"
        style={{ width: CANVAS_W, height, transform: `scale(${scale})` }}
      />
    </div>
  );
}

const P = "/prototypes/service-discovery";

export const HomePersonas = () => (
  <Stage src={`${P}/home-a.html`} height={740} title="Explore User Personas — the panel already on the home page" />
);
export const HomeFiveQuestions = () => (
  <Stage src={`${P}/home-b.html`} title="Find support for you — five short questions" />
);
export const HomeOneTap = () => (
  <Stage src={`${P}/home-c.html`} title="Find Schemes for You — one tap, no questions" />
);
export const SchemesPictures = () => (
  <Stage src={`${P}/scheme-a.html`} title="Pictures of the nine groups, with cards" />
);
export const SchemesFilterTable = () => (
  <Stage src={`${P}/scheme-b.html`} title="Filter panel with a table of schemes" />
);
export const HomeTasks = () => (
  <Stage src={`${P}/home-d.html`} title="What You Need to Do — four tasks, in place of the Department's parts" />
);
export const HomeSearch = () => (
  <Stage src={`${P}/home-e.html`} title="Ask in Your Own Words — one field, read in plain language" />
);
export const HandOffInterstitial = () => (
  <Stage src={`${P}/handoff.html`} title="Before You Leave This Site — the hand-off screen" />
);
export const AssistantChat = () => (
  <Stage src="/prototypes/service-discovery/assistant" title="Samajik Sahayak — the same five questions, in chat" />
);
