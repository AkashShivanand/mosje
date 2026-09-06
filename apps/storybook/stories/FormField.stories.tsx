import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  FieldPolicyProvider,
  FormField,
  Input,
  PasswordInput,
  RequiredFieldsLegend,
  Select,
  Textarea,
} from "@mosje/design-system";

/**
 * **FormField** — accessibly wires a label, hint, and error to any control via
 * `htmlFor` + `aria-describedby` + `aria-invalid` (+ `role="alert"` on errors).
 * Spread the render-prop wiring onto Input / Textarea / Select. Lifecycle: **Alpha**.
 *
 * `children` is a **render prop**, not a node: it receives the wiring object and
 * you spread it onto the control. That is the whole design — the ids have to be
 * generated before the control exists, so the field hands them to you rather
 * than guessing at what you rendered.
 *
 * `id` is generated for you. Pass one only when something outside the field
 * needs to point at the control — a "jump to the first error" link in an error
 * summary, say. Two fields sharing an `id` silently mislabel one of them.
 */
const meta = {
  title: "Components/FormField",
  component: FormField,
  // `label` and `children` are required, and `children` is the render prop —
  // so the default has to BE a function, not a node. Supplying both here keeps
  // every story below free to compose its own field through `render`.
  args: {
    label: "Full name",
    children: (c) => <Input {...c} placeholder="As printed on your Aadhaar" />,
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField label="Aadhaar number" hint="12-digit number on your Aadhaar card" required>
        {(c) => <Input {...c} inputMode="numeric" placeholder="XXXX XXXX XXXX" />}
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField
        label="Email address"
        error="Enter a valid email address."
        required
      >
        {(c) => <Input {...c} type="email" defaultValue="not-an-email" />}
      </FormField>
    </div>
  ),
};

export const SelectField: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField label="State / UT" hint="Select your state of residence">
        {(c) => (
          <Select
            {...c}
            placeholder="Choose a state"
            options={[
              { label: "Maharashtra", value: "MH" },
              { label: "Karnataka", value: "KA" },
              { label: "Tamil Nadu", value: "TN" },
              { label: "Uttar Pradesh", value: "UP" },
            ]}
          />
        )}
      </FormField>
    </div>
  ),
};

export const TextareaField: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField label="Grievance details" hint="Describe your issue in plain language">
        {(c) => <Textarea {...c} rows={4} placeholder="Type here…" />}
      </FormField>
    </div>
  ),
};

/**
 * **Three message channels, one at a time.** `error` blocks and sets `aria-invalid`; `warning`
 * flags an anomaly without blocking; `success` reports that a real check passed. Precedence is
 * fixed — error, then warning, then success — because showing an error and a success at once
 * has no reading. `messageIcon` replaces the glyph; `null` drops it.
 */
export const MessageChannels: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <FormField label="Mobile number" error="Enter a valid 10-digit mobile number">
        {(c) => <Input {...c} defaultValue="98765" />}
      </FormField>
      <FormField label="Mobile number" warning="This number is registered to another applicant">
        {(c) => <Input {...c} defaultValue="9876543210" />}
      </FormField>
      <FormField label="Name" success="Verified against the UIDAI record">
        {(c) => <Input {...c} defaultValue="Ramesh Kumar" />}
      </FormField>
      <FormField label="Name" success="Verified" messageIcon={null}>
        {(c) => <Input {...c} defaultValue="Ramesh Kumar" />}
      </FormField>
    </div>
  ),
};

/**
 * **Contextual help** — `labelHelp` puts a small button beside the label that reveals a
 * paragraph. A disclosure, not a tooltip: a tooltip cannot be opened by touch, cannot be read
 * at leisure, and vanishes the moment the reader moves to answer the question it was
 * explaining. Pass `labelText` when the label is not a plain string, so the button still gets a
 * sensible accessible name.
 */
export const ContextualHelp: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <FormField
        label={<span>Applicant&rsquo;s name</span>}
        labelText="Applicant's name"
        labelHelp="Give the name exactly as it appears on your caste certificate, including any initials. If the two differ, the application is returned at scrutiny."
      >
        {(c) => <Input {...c} autoComplete="name" />}
      </FormField>
    </div>
  ),
};

/**
 * **`readOnly` is a real `readonly`, `disabled` is not the same thing.** A read-only field
 * keeps its tab stop and its value stays selectable, so a citizen can copy an application
 * number out of it; a disabled one is out of the tab order and out of the submitted form.
 * Rendering pre-filled data as `disabled` — which is what most systems do — tells the reader
 * they got something wrong.
 */
export const ReadOnlyAndDisabled: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <FormField label="Application number" readOnly hint="Copied from your DigiLocker record.">
        {(c) => <Input {...c} defaultValue="APL/2026/001982" />}
      </FormField>
      <FormField label="Scheme" disabled hint="Not available on this form.">
        {(c) => <Input {...c} defaultValue="Not editable" />}
      </FormField>
    </div>
  ),
};

/**
 * **`size` on the field, not on the control**, so one prop sets the height of whatever is
 * inside it. The scale is `sm` 40 · `md` 44 · `lg` 48 · `xl` 56. `md` is the default and is
 * 44px — WCAG 2.2's Level AAA target size (2.5.5), not merely the 24px Level AA minimum — so
 * the height a developer gets without choosing is the accessible one.
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      {(["sm", "md", "lg", "xl"] as const).map((s) => (
        <FormField key={s} label={`Size ${s}`} size={s}>
          {(c) => <Input {...c} placeholder={`size="${s}"`} />}
        </FormField>
      ))}
    </div>
  ),
};

/**
 * **`orientation="inline"`** puts the label beside its control, for the dense review tables and
 * settings panels where a stacked field wastes half the row. The label column is capped rather
 * than fluid, so a long label wraps instead of squeezing the control, and the whole thing folds
 * back to stacked below the tablet breakpoint — a label beside a field on a phone leaves
 * neither enough room.
 */
export const Inline: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 640 }}>
      <FormField label="Full name" orientation="inline">
        {(c) => <Input {...c} autoComplete="name" />}
      </FormField>
      <FormField
        label="Address line 1"
        orientation="inline"
        hint="House number and street."
        error="Enter the address as printed on your ration card"
      >
        {(c) => <Input {...c} autoComplete="address-line1" />}
      </FormField>
    </div>
  ),
};

/**
 * **A character count, a shared note, and a hidden label** — all three joining one composed
 * `aria-describedby`. `describedBy` merges ids from elsewhere on the page rather than replacing
 * what the field already says; `labelHidden` keeps the label for assistive tech and is only
 * correct when a nearby heading already asks the question. `footer` appends anything else the
 * field needs after the count.
 */
export const ComposedDescription: Story = {
  render: () => {
    const [value, setValue] = React.useState("The hostel warden was informed on 12 August.");
    return (
      <div style={{ maxWidth: 460 }}>
        <h3 id="grievance-heading">Your grievance</h3>
        <p id="grievance-note">This will be shared with the district officer.</p>
        <FormField
          label="Your grievance"
          labelHidden
          hint="Say what happened and when."
          describedBy="grievance-note"
          characterCount={{ value, maxLength: 120 }}
          footer={<p className="ds-field__hint">Drafts are saved automatically.</p>}
          required
        >
          {(c) => <Textarea {...c} value={value} onChange={(e) => setValue(e.target.value)} />}
        </FormField>
      </div>
    );
  },
};

/**
 * **`optional` and `classNames`.** Necessity marking comes from `FieldPolicyProvider`, and
 * `optional` marks a single field under an `optional` policy. `classNames` is the per-part
 * styling escape hatch — reach for it rather than writing a selector against a `.ds-field__*`
 * class, which is an implementation detail and will move. Every part also carries `data-part`,
 * `data-status` and `data-size` for a stylesheet that would rather not know any class name.
 */
export const NecessityAndStyling: Story = {
  render: () => (
    <FieldPolicyProvider necessity="optional">
      <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
        <RequiredFieldsLegend />
        <FormField label="Full name" required>
          {(c) => <Input {...c} autoComplete="name" />}
        </FormField>
        <FormField
          label="Alternate email"
          optional
          classNames={{ label: "sb-demo-label", hint: "sb-demo-hint" }}
          hint="The class names on this field's label and hint came from `classNames`."
        >
          {(c) => <Input {...c} type="email" autoComplete="email" />}
        </FormField>
      </div>
    </FieldPolicyProvider>
  ),
};

/**
 * `labelAction` puts a control at the FAR RIGHT of the label row — a recovery
 * route, most often. "Forgot Password?" beside the Password label is the case it
 * exists for: it is where a citizen looks BEFORE they have failed, not after.
 *
 * **Never put the link inside `label` instead.** An interactive element inside a
 * `<label>` means a click near it moves focus to the field rather than following
 * the link — and it does not even lay out correctly: `.ds-field__label-row` is a
 * flex row, so the `<label>` shrink-wraps to its own text (186px in a 340px
 * field) and a float has only that to reach across. That shipped on the portal
 * login pages as "Password *Forgot Password?", jammed together.
 *
 * The action is pushed right with `margin-left: auto`, NOT by making the label
 * fill the row — filling it would send a `labelHelp` toggle to the far right on
 * every field that has one, and a help disclosure belongs beside the thing it
 * explains. The second field below shows the two together.
 */
export const LabelAction: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <FormField label="Username / Email / Mobile" required>
        {(c) => <Input {...c} autoComplete="username" placeholder="Enter User ID" />}
      </FormField>
      <FormField
        label="Password"
        labelAction={<a href="#forgot">Forgot Password?</a>}
        required
      >
        {(c) => (
          <PasswordInput {...c} autoComplete="current-password" placeholder="Enter Password" />
        )}
      </FormField>
      <FormField
        label="Registration number"
        labelHelp="Printed on the top right of your registration certificate."
        labelAction={<a href="#lookup">Look it up</a>}
      >
        {(c) => <Input {...c} placeholder="e.g. DL/2018/0123456" />}
      </FormField>
    </div>
  ),
};
