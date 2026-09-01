import * as React from "react";

import { Bars, Ground, Lens, Ring, Seat, Series, Sheet, Shut, Signal } from "./primitives";

/**
 * THE SCENES.
 *
 * Each is ASSEMBLED from `primitives.tsx` — none draws its own geometry. Adding
 * a scene that needs a new shape means adding the shape to the primitives
 * first; see language.ts §6.
 *
 * The set is chosen from what this estate's workflows actually contain. A
 * grievance is lodged, a document is deficient, a place is sanctioned and not
 * yet taken, a feed stops answering. Those are the pictures a citizen and an
 * officer need. There is deliberately no "success celebration", no "team", no
 * "rocket" — this is a department, not a product launch.
 *
 * Every scene's `alt` is written here rather than at the call site, so the same
 * drawing is described the same way wherever it appears.
 */

export interface SceneDef {
  /** What the drawing shows, for a reader who cannot see it. */
  alt: string;
  draw: () => React.JSX.Element;
}

export const SCENES = {
  /* ── The data states, generalised from `CardState`'s six ──────────────── */

  empty: {
    alt: "A chart axis with nothing plotted on it.",
    draw: () => (
      <>
        <Ground />
        {/*
          NOT dashed bars — that is `not-published`, where the shape is known and
          the figures are not. These two shipped as the same composition
          separated only by a height array, and four EQUAL dashed bars read as
          four equal VALUES, which is the one thing an empty state must not say.
          Emptiness is drawn as the plot area with no mark in it at all: the
          floor, and the tick marks where a series would begin.
        */}
        <Bars heights={[3, 3, 3, 3]} layer="ghost" />
      </>
    ),
  },

  "no-results": {
    alt: "Three bars on an axis, with a magnifier finding none of them.",
    draw: () => (
      <>
        <Ground />
        <Bars heights={[12, 8, 18]} layer="ghost" x={12} />
        <Lens layer="accent" />
      </>
    ),
  },

  "not-published": {
    alt: "The outline of a bar chart, drawn as a dashed shape with no figures in it.",
    draw: () => (
      <>
        <Ground />
        <Bars heights={[16, 26, 20, 30]} ghosted layer="ghost" />
      </>
    ),
  },

  error: {
    alt: "A line of figures that begins, breaks, and resumes with a gap in the middle.",
    draw: () => (
      <>
        <Ground />
        <Series
          points={[
            [10, 32],
            [18, 23],
            [24, 29],
            [40, 26],
            [46, 19],
            [54, 24],
          ]}
          breakAfter={2}
        />
        <Signal kind="stopped" cx={32} cy={20} />
      </>
    ),
  },

  restricted: {
    alt: "A chart standing behind a closed padlock.",
    draw: () => (
      <>
        <Ground />
        <Bars heights={[14, 9]} layer="ghost" x={12} />
        <Shut layer="accent" />
      </>
    ),
  },

  offline: {
    alt: "A line of figures that stops part-way along the axis.",
    draw: () => (
      <>
        <Ground />
        <Series
          points={[
            [10, 33],
            [18, 26],
            [26, 30],
            [32, 22],
          ]}
        />
        <Signal kind="waiting" cx={46} cy={22} />
      </>
    ),
  },

  /* ── The workflow scenes — what this estate is actually for ───────────── */

  "application-draft": {
    alt: "A form with its corner turned, part-filled.",
    draw: () => (
      <>
        <Ground />
        <Sheet dogEar lines={2} />
        <Signal kind="waiting" cx={48} cy={18} layer="ghost" />
      </>
    ),
  },

  "application-submitted": {
    alt: "A completed form with a mark beside it.",
    draw: () => (
      <>
        <Ground />
        <Sheet lines={3} />
        <Signal kind="done" cx={48} cy={18} />
      </>
    ),
  },

  "awaiting-verification": {
    alt: "A form with a magnifier held over it.",
    draw: () => (
      <>
        <Ground />
        <Sheet x={16} w={18} lines={3} />
        <Lens cx={44} cy={20} r={8} layer="accent" />
      </>
    ),
  },

  "documents-required": {
    alt: "Two forms, one complete and one still an outline.",
    draw: () => (
      <>
        <Ground />
        <Sheet x={12} w={18} h={24} y={12} lines={3} />
        <Sheet x={36} w={18} h={24} y={12} lines={0} layer="ghost" dogEar />
        <Signal kind="waiting" cx={45} cy={26} layer="accent" />
      </>
    ),
  },

  "places-sanctioned": {
    alt: "A row of seats, some taken and some still empty.",
    draw: () => (
      <>
        <Ground />
        <Seat x={12} />
        <Seat x={26} />
        <Seat x={40} vacant />
      </>
    ),
  },

  "search-start": {
    alt: "A magnifier resting above an empty axis, before a search has been made.",
    draw: () => (
      <>
        <Ground />
        <Lens cx={32} cy={22} r={10} layer="ghost" />
      </>
    ),
  },

  complete: {
    alt: "A full ring with a mark at its centre.",
    draw: () => (
      <>
        <Ground />
        {/*
          ONE accent, not two. The filled ring and the tick were both drawn in
          the accent layer, which breaks the language's own rule (§3: at most one
          accent per drawing) on the very scene that means "finished". The ring
          being complete IS the message; the tick confirms it in ink.
        */}
        <Ring cx={32} cy={26} r={12} layer="ghost" filled={1} />
        <Signal kind="done" cx={32} cy={26} layer="ink" />
      </>
    ),
  },

  "in-progress": {
    alt: "A ring filled about two-thirds of the way round.",
    draw: () => (
      <>
        <Ground />
        <Ring cx={32} cy={26} r={12} layer="ghost" filled={0.66} />
      </>
    ),
  },
} as const satisfies Record<string, SceneDef>;

export type SceneName = keyof typeof SCENES;

/** Every scene's name, for a specimen sheet and for the gate that counts them. */
export const SCENE_NAMES = Object.keys(SCENES) as SceneName[];
