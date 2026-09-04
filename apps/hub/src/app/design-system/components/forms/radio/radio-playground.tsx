"use client";
import * as React from "react";
import { Icon, Radio } from "@mosje/design-system";

const panel: React.CSSProperties = {
  padding: "var(--sa-padding-32)",
  background: "var(--sa-bg-neutral-subtler)",
  borderRadius: "var(--sa-shape-8)",
  display: "grid",
  gap: "var(--sa-stack-32)",
  maxWidth: 640,
  margin: "0 auto",
};
const stack: React.CSSProperties = { display: "grid", gap: "var(--sa-stack-12)" };
const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--sa-type-label-3-size)",
  lineHeight: "var(--sa-type-label-3-lh)",
  letterSpacing: "var(--sa-type-label-tracking)",
  textTransform: "uppercase",
  color: "var(--sa-text-neutral-subtle)",
};

/** Every state the control can be in, running — never a screenshot. */
export function RadioPlayground(): React.JSX.Element {
  const [contact, setContact] = React.useState("email");
  const [plan, setPlan] = React.useState("standard");

  return (
    <div style={panel}>
      <div style={stack}>
        <p style={eyebrow}>Sizes — the circle is 16 · 20 · 24; the hit area is 24 · 44 · 48</p>
        <Radio name="ds-size" value="sm" size="sm" defaultChecked label="Small" />
        <Radio name="ds-size-md" value="md" size="md" defaultChecked label="Medium (default)" />
        <Radio name="ds-size-lg" value="lg" size="lg" defaultChecked label="Large" />
      </div>

      <div style={stack}>
        <p style={eyebrow}>A set — one tab stop, arrow keys between options</p>
        <Radio name="ds-contact" value="email" checked={contact === "email"} onChange={() => setContact("email")} label="Email" />
        <Radio
          name="ds-contact"
          value="sms"
          checked={contact === "sms"}
          onChange={() => setContact("sms")}
          label="SMS"
          description="A text message to the mobile number on the application."
        />
        <Radio name="ds-contact" value="post" checked={contact === "post"} onChange={() => setContact("post")} label="Post" />
      </div>

      <div style={stack}>
        <p style={eyebrow}>States</p>
        <Radio name="ds-req" value="a" required label="Required" />
        <Radio name="ds-inv" value="b" invalid label="Invalid — painted by the group that owns the message" />
        <Radio name="ds-ro" value="c" readOnly defaultChecked label="Read-only" />
        <Radio name="ds-dis" value="d" disabled defaultChecked label="Disabled" />
        <Radio name="ds-start" value="e" labelPlacement="start" label="Label first" />
      </div>

      <div style={stack}>
        <p style={eyebrow}>Card variant</p>
        <Radio
          variant="card"
          icon={<Icon name="schedule" />}
          name="ds-plan"
          value="standard"
          checked={plan === "standard"}
          onChange={() => setPlan("standard")}
          label="Standard Application"
          description="Processed within 15 to 20 working days. Free of charge."
        />
        <Radio
          variant="card"
          icon={<Icon name="bolt" />}
          name="ds-plan"
          value="tatkal"
          checked={plan === "tatkal"}
          onChange={() => setPlan("tatkal")}
          label="Tatkal (Expedited)"
          description="Processed within 3 to 5 working days. A premium processing fee applies."
        />
      </div>
    </div>
  );
}
