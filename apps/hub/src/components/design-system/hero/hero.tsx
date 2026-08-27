"use client";

import * as React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Badge,
  Chip,
  Checkbox,
  Radio,
  Toggle,
  Search,
  Alert,
  Avatar,
  Loader,
} from "@mosje/design-system";
import "./hero.css";

/* ── Self-stateful demo wrappers so the showcased controls render in real,
   varied states rather than frozen defaults. ── */

function DemoSearch(): React.JSX.Element {
  const [value, setValue] = React.useState("");
  return (
    <Search
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClear={() => setValue("")}
      placeholder="Search components…"
    />
  );
}

function DemoToggle({ label, initial = true }: { label: string; initial?: boolean }): React.JSX.Element {
  const [on, setOn] = React.useState(initial);
  return <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} label={label} />;
}

function DemoCheckbox({ label, initial = true }: { label: string; initial?: boolean }): React.JSX.Element {
  const [checked, setChecked] = React.useState(initial);
  return <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label={label} />;
}

function DemoChip({ label, initial = false }: { label: string; initial?: boolean }): React.JSX.Element {
  const [selected, setSelected] = React.useState(initial);
  return (
    <Chip selected={selected} onSelectedChange={setSelected}>
      {label}
    </Chip>
  );
}

function DemoRadios(): React.JSX.Element {
  const name = React.useId();
  const [value, setValue] = React.useState("email");
  return (
    <div className="hero-inline">
      <Radio name={name} value="email" checked={value === "email"} onChange={() => setValue("email")} label="Email" />
      <Radio name={name} value="sms" checked={value === "sms"} onChange={() => setValue("sms")} label="SMS" />
    </div>
  );
}

/* ── Two balanced columns of real @mosje/design-system components. ── */

const COLUMN_LEFT: React.ReactNode[] = [
  <DemoSearch key="search" />,
  <Button key="cta" variant="primary" appearance="filled">Get started</Button>,
  <Alert key="ok" status="success" title="Saved">Your changes are live.</Alert>,
  <div key="badges" className="hero-inline">
    <Badge status="success">Stable</Badge>
    <Badge status="neutral">v2.0</Badge>
    <Badge status="danger">3</Badge>
  </div>,
  <DemoToggle key="toggle" label="Dark mode" />,
  <div key="avatars" className="hero-inline">
    <Avatar initials="SA" />
    <Avatar initials="MJ" />
    <Avatar />
  </div>,
  <Alert key="err" status="error" title="Error">Please try again.</Alert>,
];

const COLUMN_RIGHT: React.ReactNode[] = [
  <div key="actions" className="hero-inline">
    <Button variant="success" appearance="filled">Approve</Button>
    <Button variant="danger" appearance="outlined">Reject</Button>
  </div>,
  <Card key="card" className="hero-card">
    <CardHeader>
      <CardTitle>Card</CardTitle>
    </CardHeader>
    <CardBody>Maps 1:1 to Figma.</CardBody>
  </Card>,
  <div key="chips" className="hero-inline">
    <DemoChip label="Filter" />
    <DemoChip label="Active" initial />
  </div>,
  <DemoCheckbox key="check" label="I agree to the terms" />,
  <DemoRadios key="radios" />,
  <Alert key="warn" status="warning" title="Heads up">Review before publishing.</Alert>,
  <div key="loader" className="hero-inline">
    <Loader />
    <span className="hero-muted">Loading…</span>
  </div>,
  <Button key="tonal" variant="primary" appearance="outlined">Learn more</Button>,
];

function Column({
  items,
  direction,
  speed,
}: {
  items: React.ReactNode[];
  direction: "up" | "down";
  speed: number;
}): React.JSX.Element {
  // Render the set twice so the vertical loop is seamless.
  const loop = [...items, ...items];
  return (
    <div
      className={`hero-col${direction === "down" ? " hero-col--down" : ""}`}
      style={{ ["--hero-speed" as string]: `${speed}s` }}
    >
      <div className="hero-col__track">
        {loop.map((node, i) => (
          <div className="hero-tile" key={i}>
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Animated landing hero for the SAMAVESH documentation portal.
 *
 * Left: the brand lockup (National Emblem + SAMAVESH seal + wordmark).
 * Right: an infinitely scrolling wall of real design-system components — the
 * cover, rebuilt in live code instead of a flat image.
 *
 * The wall is decorative: it carries `aria-hidden` + `inert` so its (otherwise
 * focusable) controls stay out of the tab order and the screen-reader tree,
 * while the heading + page content below convey the actual meaning. Motion
 * respects `prefers-reduced-motion`; hovering pauses the scroll.
 */
export function HeroShowcase(): React.JSX.Element {
  return (
    <section className="hero" aria-label="SAMAVESH Design System">
      <div className="hero-glow hero-glow--blue" aria-hidden="true" />
      <div className="hero-glow hero-glow--saffron" aria-hidden="true" />
      <div className="hero-brand">
        <div className="hero-lockup">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-emblem"
            src="/design-system/national-emblem.svg"
            alt="National Emblem of India"
            width={32}
            height={52}
          />
          <span className="hero-divider" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-seal"
            src="/design-system/samavesh-logo.svg"
            alt="SAMAVESH logo"
            width={512}
            height={514}
          />
        </div>

        <p className="hero-eyebrow">Ministry of Social Justice &amp; Empowerment</p>
        <div className="hero-title">
          <h1 className="hero-wordmark">SAMAVESH</h1>
          <p className="hero-devanagari" lang="hi">समावेश</p>
        </div>
        <p className="hero-subtitle">Components, Tokens &amp; Guidelines</p>
      </div>

      <div className="hero-panel">
        <span className="hero-panel__tag" aria-hidden="true">
          <span className="hero-panel__pulse" />
          Live components
        </span>
        {/* Decorative: inert keeps the controls out of tab order + a11y tree. */}
        <div className="hero-wall" aria-hidden="true" inert>
          <Column items={COLUMN_LEFT} direction="up" speed={34} />
          <Column items={COLUMN_RIGHT} direction="down" speed={40} />
        </div>
      </div>
    </section>
  );
}
