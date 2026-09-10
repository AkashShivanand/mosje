"use client";

import * as React from "react";
import { Carousel, FactStrip, Icon } from "@mosje/design-system";
import "./counters.css";

/**
 * THREE TREATMENTS OF THE ABHIYAAN'S EIGHT PUBLISHED COUNTERS.
 *
 * The decision: eight is more than a fact strip was drawn for. Three or four
 * standing facts under a hero are a strip; eight are a grid, and a grid of
 * equal cells has no hierarchy to give the figures. So — does the component
 * scale UP to hold eight properly, or does it show four at a time?
 *
 * The figures are the Department's own, read on 7 September 2026, and they are
 * IDENTICAL in all three options. An option that changed the data would not be
 * a comparison.
 */

interface Counter {
  icon: string;
  value: string;
  label: string;
}

const COUNTERS: Counter[] = [
  { icon: "groups", value: "345,703,321", label: "People reached" },
  { icon: "school", value: "137,209,589", label: "Youth reached" },
  { icon: "woman", value: "106,563,417", label: "Women reached" },
  { icon: "menu_book", value: "3,726,319", label: "Activities in educational institutes" },
  { icon: "healing", value: "28,29,661+", label: "Persons treated and rehabilitated" },
  { icon: "local_hospital", value: "755+", label: "DoSJE-supported de-addiction centres" },
  { icon: "front_hand", value: "3,361,211", label: "Total pledges" },
  { icon: "volunteer_activism", value: "164,943", label: "Nasha Mukti Mitr registered" },
];

const AS_OF = "As published by the Department on 7 September 2026.";

/**
 * One cell, shared by the scaled grid and the carousel so the two options
 * differ only in what is being decided — how many figures are visible at once.
 *
 * `<dt>` before `<dd>` in the DOM and reordered visually, exactly as `FactStrip`
 * does it, so the pair is still announced "People reached: 345,703,321".
 */
function Cell({ item }: { item: Counter }) {
  return (
    <div className="kpix__item">
      <dt className="kpix__label">
        <Icon name={item.icon} size={20} className="kpix__icon" aria-hidden />
        {item.label}
      </dt>
      <dd className="kpix__value">{item.value}</dd>
    </div>
  );
}

function Stage({ children }: { children: React.ReactNode }) {
  return <div className="kpix__stage">{children}</div>;
}

/**
 * OPTION 1 — what the page renders today.
 *
 * `FactStrip` at `layout="inline"`, four across, figure at `headline-5` (20px)
 * over a `body-1` caption (16px).
 */
export function CountersAsShipped(): React.JSX.Element {
  return (
    <Stage>
      <FactStrip columns={4} layout="inline" ariaLabel="The Abhiyaan in numbers" items={COUNTERS} />
      <p className="kpix__asof">{AS_OF}</p>
    </Stage>
  );
}

/**
 * OPTION 2 — the same eight, scaled to read as figures.
 *
 * Every figure on the card at once, at 32px against a 14px caption. The mark
 * leaves its chip and joins the caption, because at this size the figure no
 * longer needs help being noticed and the chip would only compete.
 */
export function CountersScaledGrid(): React.JSX.Element {
  return (
    <Stage>
      <div className="kpix__card">
        <dl className="kpix__grid" aria-label="The Abhiyaan in numbers">
          {COUNTERS.map((c) => (
            <Cell key={c.label} item={c} />
          ))}
        </dl>
      </div>
      <p className="kpix__asof">{AS_OF}</p>
    </Stage>
  );
}

/**
 * OPTION 3 — four at a time, two pages.
 *
 * The DS `Carousel`, with `autoPlay` off. It must stay off: these are figures a
 * citizen reads, and a figure that leaves before it has been read is worse than
 * one that was never shown.
 *
 * WHAT A REVIEWER IS ACTUALLY BEING ASKED. This halves the card — one row
 * rather than two — and it is the only option in which four of the Department's
 * eight published statistics are not on the page. That is the trade, and it is
 * a policy question rather than a visual one.
 */
export function CountersCarousel(): React.JSX.Element {
  const pages = [COUNTERS.slice(0, 4), COUNTERS.slice(4)];
  return (
    <Stage>
      <div className="kpix__card">
        <Carousel label="The Abhiyaan in numbers">
          {pages.map((page, i) => (
            <dl className="kpix__page" key={i}>
              {page.map((c) => (
                <Cell key={c.label} item={c} />
              ))}
            </dl>
          ))}
        </Carousel>
      </div>
      <p className="kpix__asof">{AS_OF}</p>
    </Stage>
  );
}
