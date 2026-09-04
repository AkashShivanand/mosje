import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, FormField, Icon, Radio, Textarea, Toggle } from "@mosje/design-system";

/**
 * **Checkbox · Radio · Toggle · Textarea** — the selection and long-text
 * controls, shown together because their behaviour only makes sense in
 * contrast.
 *
 * The distinction that actually matters: a **Toggle** applies immediately, a
 * **Checkbox** is a value you submit with the rest of the form. If flipping it
 * needs a Save button afterwards, it is a checkbox. Lifecycle: **Stable**.
 *
 * `Checkbox` and `Radio` share one API. `checked` + `onChange` make it controlled;
 * omit them and `defaultChecked` seeds an uncontrolled control that a plain form can
 * post. `onCheckedChange` hands over the next boolean. `size` is `sm` 16 · `md` 20 ·
 * `lg` 24 — the HIT AREA is 24 / 44 / 48, so the default is already a comfortable
 * touch target. `description` is a second line linked through `aria-describedby`,
 * never part of the name. `error` (Checkbox only) renders an alert under the box
 * and sets `aria-invalid`; `invalid` paints the state without a message, for a group
 * that owns the message. `readOnly` keeps the tab stop and refuses the change; it is
 * NOT `disabled`. `required` draws the marker and sets the native attribute.
 * `labelPlacement="start"` puts the label first; `hideLabel` keeps the name and
 * hides the text. `variant="card"` turns the option into a tile with room for an
 * `icon` and a description, and the whole tile is the target. Never pre-check a
 * consent box — `defaultChecked` on a declaration is prohibited (UX4G §7).
 *
 * `indeterminate` is the mixed state of a "select all" parent; a click on it
 * yields `true`, as the native control does.
 *
 * `Toggle` takes a `size`; use `"small"` in a dense settings table and
 * `"default"` everywhere else.
 *
 * @covers Checkbox, Radio, Toggle, Textarea
 */
const meta = {
  title: "Components/Controls",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkboxes: Story = {
  render: function Render() {
    const [checked, setChecked] = React.useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          label="I agree to the declaration"
        />
        <Checkbox label="Unchecked, uncontrolled" />
        <Checkbox indeterminate label="Some districts selected" />
        <Checkbox defaultChecked disabled label="Locked after approval" />
      </div>
    );
  },
};

/** `sm` for dense tables, `md` (default) beside body text, `lg` where the box must meet 24×24 alone. */
export const CheckboxSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Checkbox size="sm" defaultChecked label="Small — 16px box, 24px target" />
      <Checkbox size="md" defaultChecked label="Medium — 20px box, 44px target" />
      <Checkbox size="lg" defaultChecked label="Large — 24px box, 48px target" />
    </div>
  ),
};

/**
 * Every state the control can be in. `readOnly` keeps its tab stop; `disabled` leaves the
 * form. `error` announces; `invalid` only paints.
 */
export const CheckboxStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
      <Checkbox label="Hostel accommodation" description="Available only to students living away from the district of domicile." />
      <Checkbox label="I have read the scheme guidelines" required />
      <Checkbox label="I have read the scheme guidelines" error="Confirm you have read the guidelines to continue" />
      <Checkbox label="Aadhaar seeded to the bank account" invalid defaultChecked />
      <Checkbox label="Verified by the district officer" readOnly defaultChecked />
      <Checkbox label="Verified by the district officer" disabled />
      <Checkbox label="Send updates by SMS" labelPlacement="start" defaultChecked />
      <Checkbox label="Select row 4" hideLabel size="sm" />
    </div>
  ),
};

/** `variant="card"` — the whole tile is the target, with room for an icon and a description. */
export const CheckboxCards: Story = {
  render: function Render() {
    const [claims, setClaims] = React.useState<string[]>(["hostel"]);
    const toggle = (v: string) => (on: boolean) =>
      setClaims((c) => (on ? [...c, v] : c.filter((x) => x !== v)));
    return (
      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        <Checkbox
          variant="card"
          icon={<Icon name="apartment" />}
          label="Hostel Accommodation"
          description="Babu Jagjivan Ram Chhatrawas Yojana. Apply through the institution."
          checked={claims.includes("hostel")}
          onCheckedChange={toggle("hostel")}
        />
        <Checkbox
          variant="card"
          icon={<Icon name="school" />}
          label="Post-Matric Scholarship"
          description="Class XI upwards, including degree and professional courses."
          checked={claims.includes("scholarship")}
          onCheckedChange={toggle("scholarship")}
        />
      </div>
    );
  },
};

/**
 * `cardLayout="detailed"` — the scheme tile: a tinted 64px icon tile, a title, a fuller
 * description and a `meta` fact to choose by, with the control trailing on the right. This
 * is the Figma `Layout=Detailed` variant; use it for schemes and service pathways, and the
 * compact card for a short list whose names say enough.
 */
export const DetailedCards: Story = {
  render: function Render() {
    const [scheme, setScheme] = React.useState("napddr");
    return (
      <div style={{ display: "grid", gap: 16, maxWidth: 760 }}>
        <Radio variant="card" cardLayout="detailed" icon={<Icon name="workspace_premium" size={40} />} name="scheme-detailed" value="napddr" checked={scheme === "napddr"} onChange={() => setScheme("napddr")} label="NAPDDR - National Action Plan for Drug Demand Reduction" description="Prevention, treatment, rehabilitation, social-reintegration and aftercare for persons affected by substance abuse across vulnerable districts." meta="Target: Persons affected by substance abuse" />
        <Radio variant="card" cardLayout="detailed" icon={<Icon name="workspace_premium" size={40} />} name="scheme-detailed" value="avyay" checked={scheme === "avyay"} onChange={() => setScheme("avyay")} label="AVYAY - Atal Vayo Abhyuday Yojana" description="An umbrella scheme covering Integrated Programme for Senior Citizens (IPSrC), maintenance of Old Age Homes / Continuous Care Homes, Rashtriya Vayoshri Yojana, and Silver Economy support." meta="Target: Senior citizens" />
      </div>
    );
  },
};

export const Radios: Story = {
  render: function Render() {
    const [value, setValue] = React.useState("sc");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { id: "sc", label: "Scheduled Caste" },
          { id: "obc", label: "Other Backward Class" },
          { id: "dnt", label: "De-notified tribe" },
        ].map((o) => (
          <Radio
            key={o.id}
            name="category"
            value={o.id}
            checked={value === o.id}
            onChange={() => setValue(o.id)}
            label={o.label}
          />
        ))}
      </div>
    );
  },
};

/** The same states as Checkbox, minus `error`: an error belongs to the QUESTION, i.e. the group. */
export const RadioStates: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 480 }}>
      <Radio name="rs" value="a" size="sm" label="Small" />
      <Radio name="rs" value="b" label="Medium with a description" description="Linked through aria-describedby." />
      <Radio name="rs" value="c" size="lg" label="Large" />
      <Radio name="rs2" value="d" invalid label="Invalid — painted by the group" />
      <Radio name="rs3" value="e" readOnly defaultChecked label="Read-only" />
      <Radio name="rs4" value="f" disabled defaultChecked label="Disabled" />
      <Radio name="rs5" value="g" labelPlacement="start" label="Label first" />
    </div>
  ),
};

/**
 * `variant="card"` — worth the space when the options need explaining. The
 * `description` is what the extra room buys you, and it is a description, not
 * part of the option's name.
 */
export const RadioCards: Story = {
  render: function Render() {
    const [scheme, setScheme] = React.useState("prematric");
    return (
      <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
        {[
          {
            id: "prematric",
            label: "Pre-Matric Scholarship (SC)",
            description: "Classes IX and X. Paid to the school; ₹12,500 a year.",
          },
          {
            id: "postmatric",
            label: "Post-Matric Scholarship (SC)",
            description:
              "Class XI upwards, including degree and professional courses. Amount varies by course.",
          },
          {
            id: "hostel",
            label: "Babu Jagjivan Ram Chhatrawas Yojana",
            description: "Hostel accommodation. Apply through the institution, not directly.",
          },
        ].map((o) => (
          <Radio
            key={o.id}
            variant="card"
            icon={<Icon name="verified" />}
            name="scheme"
            value={o.id}
            checked={scheme === o.id}
            onChange={() => setScheme(o.id)}
            label={o.label}
            description={o.description}
          />
        ))}
      </div>
    );
  },
};

export const Toggles: Story = {
  render: function Render() {
    const [on, setOn] = React.useState(true);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} label="Email notifications" />
        <Toggle checked={false} onChange={() => {}} label="SMS notifications" />
        <Toggle checked disabled onChange={() => {}} label="Audit logging (mandatory)" />
        <Toggle
          size="small"
          checked
          onChange={() => {}}
          label="Small — for a dense settings table"
        />
      </div>
    );
  },
};

export const Textareas: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      <Textarea placeholder="Remarks for the district officer…" rows={3} />
      <Textarea defaultValue="Address does not match the ration card." invalid rows={3} />
    </div>
  ),
};

/**
 * **Textarea `status`** — the same three conditions every control in the stack carries.
 * `error` blocks and sets `aria-invalid`; `warning` does not block; `success` reports a check
 * that passed.
 */
export const TextareaStatuses: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 460 }}>
      <FormField label="Grievance" error="Describe what happened in at least twenty words">
        {(c) => <Textarea {...c} defaultValue="Too short." />}
      </FormField>
      <FormField label="Remarks" warning="This will be visible to the district officer">
        {(c) => <Textarea {...c} status="warning" defaultValue="Warden was informed on 12 August." />}
      </FormField>
      <FormField label="Justification" success="Saved as a draft">
        {(c) => <Textarea {...c} defaultValue="The hostel has been without water since Monday." />}
      </FormField>
    </div>
  ),
};

/**
 * **`autoResize` and `maxRows`** — grow to fit the value, up to a ceiling, then scroll.
 *
 * Off by default, and that default is deliberate: a field that changes height under the
 * reader's cursor moves everything below it. Acceptable for a comment box at the end of a form;
 * not for a field in the middle of a long application, where the Submit button would walk down
 * the page as the reader types.
 */
export const TextareaAutoResize: Story = {
  render: () => {
    const [value, setValue] = React.useState("Type here and the field grows to fit, up to four rows.");
    return (
      <div style={{ maxWidth: 460 }}>
        <FormField label="Remarks" hint="Grows as you type, then scrolls past four rows.">
          {(c) => (
            <Textarea
              {...c}
              autoResize
              maxRows={4}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
        </FormField>
      </div>
    );
  },
};
