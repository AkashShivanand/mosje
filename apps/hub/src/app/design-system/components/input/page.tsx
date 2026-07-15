import type { Metadata } from "next";
import * as React from "react";
import { buttonClasses } from "@mosje/design-system";
import { PropsTable, Callout, A11yChecklist } from "@/components/design-system/docs-kit/index";
import { Playground } from "@/components/design-system/playground/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Input & FormField",
  description:
    "Text Input, Textarea, Select controls and the FormField molecule that wires labels, hints, and errors together accessibly.",
};

// ---------------------------------------------------------------------------
// Playground examples
// ---------------------------------------------------------------------------

const INPUT_EXAMPLE = `<Input placeholder="Enter your full name" />`;

const TEXTAREA_EXAMPLE = `<Textarea
  rows={4}
  placeholder="Tell us a little about your grievance…"
/>`;

const SELECT_EXAMPLE = `<Select
  placeholder="Select your state"
  options={[
    { label: "Maharashtra", value: "mh" },
    { label: "Karnataka", value: "ka" },
    { label: "Tamil Nadu", value: "tn" },
    { label: "Uttar Pradesh", value: "up" },
  ]}
/>`;

const FORM_EXAMPLE = `<FormField
  label="Full name"
  hint="As shown on your Aadhaar card"
  required
>
  {(ctrl) => (
    <Input
      {...ctrl}
      placeholder="Enter your full name"
    />
  )}
</FormField>`;

const FORM_ERROR_EXAMPLE = `<FormField label="Email address" error="Please enter a valid email address.">
  {(ctrl) => <Input {...ctrl} type="email" placeholder="you@example.com" />}
</FormField>`;

const FORM_SECTION_EXAMPLE = `<FormSection
  title="Personal Details"
  description="Enter your legal name as on Aadhaar."
  columns={2}
>
  <FormField label="Full name" required>
    {(ctrl) => <Input {...ctrl} placeholder="Full name" />}
  </FormField>
  <FormField label="Date of Birth">
    {(ctrl) => <Input {...ctrl} type="date" />}
  </FormField>
</FormSection>`;

const FORM_CARD_EXAMPLE = `<FormCard
  title="Drug Use Details"
  description="Each substance gets its own card — add as many as needed."
  required
>
  <p style={{ margin: 0, color: "var(--ds-ink-muted)" }}>
    Custom body content goes here — a repeatable card list, a data table, or
    any layout that is not a simple field grid.
  </p>
</FormCard>`;

const WIZARD_EXAMPLE = `<Wizard
  steps={[
    { label: "Personal", description: "Your details" },
    { label: "Address", description: "Where you live" },
    { label: "Review", description: "Confirm & submit" },
  ]}
  current={0}
  onBack={() => {}}
  onNext={() => {}}
  onSubmit={() => {}}
>
  <FormSection title="Personal Details" columns={2}>
    <FormField label="Full name" required>
      {(ctrl) => <Input {...ctrl} placeholder="Full name" />}
    </FormField>
    <FormField label="Date of Birth">
      {(ctrl) => <Input {...ctrl} type="date" />}
    </FormField>
  </FormSection>
</Wizard>`;

const REVIEW_EXAMPLE = `<ReviewSection title="Personal Details">
  <ReviewItem label="Full name" value="Ramesh Kumar" />
  <ReviewItem label="Date of Birth" value="1990-04-12" />
  <ReviewItem label="Contact Number" value="9876543210" />
  <ReviewItem label="Email" value="" />
</ReviewSection>`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InputPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <header style={{ marginBottom: "var(--ds-spacing-3xl)" }}>
        <h1>Input &amp; FormField</h1>
        <p style={{ color: "var(--ds-ink-muted)", marginTop: "var(--ds-spacing-md)", maxWidth: "60ch" }}>
          The form layer of the design system. Three native, token-styled controls — <code>Input</code>,{" "}
          <code>Textarea</code>, and <code>Select</code> — paired with the <code>FormField</code> molecule that
          wires labels, hints, and errors together so every field is accessible by default.
        </p>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.inputs)} target="_blank" rel="noopener noreferrer">
            View in Figma <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* INPUT                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h2 id="input">Input</h2>
        <p>
          A single-line text field built on the native <code>&lt;input&gt;</code> element, styled on the token
          contract. It accepts every native input attribute (<code>type</code>, <code>placeholder</code>,{" "}
          <code>disabled</code>, <code>maxLength</code>, …) and adds a single <code>invalid</code> prop for the
          error state. Its minimum height is 44px to satisfy the WCAG 2.2 target-size guideline. In practice you
          rarely use <code>Input</code> on its own — wrap it in a <a href="#form-field">FormField</a> so the label
          and accessibility wiring come for free.
        </p>

        <Playground code={INPUT_EXAMPLE} />

        <h3 id="input-props">Props</h3>
        <PropsTable
          props={[
            {
              name: "invalid",
              type: "boolean",
              default: "false",
              description: "Renders the error state and sets aria-invalid on the input.",
            },
            {
              name: "type",
              type: "string",
              default: '"text"',
              description: "Native input type — text, email, tel, number, password, search, etc.",
            },
            {
              name: "placeholder",
              type: "string",
              description: "Hint text shown when the field is empty. Never a substitute for a label.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description: "Disables the field and removes it from the tab order.",
            },
            {
              name: "...native",
              type: "InputHTMLAttributes",
              description:
                "Any native input prop (value, defaultValue, onChange, name, required, maxLength, ref, …) is forwarded to the underlying element.",
            },
          ]}
        />

        <h3 id="input-a11y">Accessibility</h3>
        <A11yChecklist
          items={[
            {
              criterion: "Every input has a label",
              level: "A",
              description:
                "Wrap the input in FormField (or supply your own <label htmlFor>). Placeholder text is not a label — it disappears on focus and fails contrast.",
            },
            {
              criterion: "Errors set aria-invalid",
              level: "AA",
              description:
                "Pass invalid (or let FormField set it via error) so assistive tech announces the field as invalid.",
            },
            {
              criterion: "Hints linked with aria-describedby",
              level: "AA",
              description:
                "Help text and error messages are connected to the input through aria-describedby so screen readers read them with the field.",
            },
            {
              criterion: "Target size at least 44px",
              level: "AAA",
              description: "The input enforces a 44px minimum height for comfortable touch and pointer use.",
            },
          ]}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* TEXTAREA                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section style={{ marginTop: "var(--ds-spacing-5xl)" }}>
        <h2 id="textarea">Textarea</h2>
        <p>
          A multi-line text field for longer free-form input — grievance descriptions, remarks, addresses. It is a
          native <code>&lt;textarea&gt;</code>, vertically resizable, and shares the same <code>invalid</code> prop
          and token styling as <code>Input</code>. Default height is four rows; adjust with <code>rows</code>.
        </p>

        <Playground code={TEXTAREA_EXAMPLE} />

        <h3 id="textarea-props">Props</h3>
        <PropsTable
          props={[
            {
              name: "invalid",
              type: "boolean",
              default: "false",
              description: "Renders the error state and sets aria-invalid on the textarea.",
            },
            {
              name: "rows",
              type: "number",
              default: "4",
              description: "Number of visible text rows (initial height).",
            },
            {
              name: "placeholder",
              type: "string",
              description: "Hint text shown when empty. Not a replacement for a label.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description: "Disables the field and removes it from the tab order.",
            },
            {
              name: "...native",
              type: "TextareaHTMLAttributes",
              description:
                "Any native textarea prop (value, onChange, name, maxLength, required, ref, …) is forwarded to the underlying element.",
            },
          ]}
        />

        <h3 id="textarea-a11y">Accessibility</h3>
        <A11yChecklist
          items={[
            {
              criterion: "Required visible label",
              level: "A",
              description:
                "Pair with FormField so the label is programmatically associated with the textarea via htmlFor / id.",
            },
            {
              criterion: "aria-invalid on error",
              level: "AA",
              description: "Set invalid (or use FormField's error prop) to flag invalid content to assistive tech.",
            },
            {
              criterion: "aria-describedby for hints",
              level: "AA",
              description: "Character limits and guidance are linked to the field so they are announced together.",
            },
          ]}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SELECT                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section style={{ marginTop: "var(--ds-spacing-5xl)" }}>
        <h2 id="select">Select</h2>
        <p>
          A dropdown built on the native <code>&lt;select&gt;</code> element, so it keeps full keyboard and
          screen-reader behaviour and the platform&apos;s native option list on mobile. A custom chevron is layered on
          top for visual consistency. Pass an <code>options</code> array for convenience, or render your own{" "}
          <code>&lt;option&gt;</code> children. Use <code>placeholder</code> to render a disabled first option.
        </p>

        <Playground code={SELECT_EXAMPLE} />

        <Callout type="tip" title="Native by design">
          We deliberately use the native <code>&lt;select&gt;</code> rather than a custom dropdown widget. It is the
          most reliable, accessible, and familiar pattern across devices — especially on government services used on
          low-end phones. Reach for a custom combobox only when you genuinely need search-as-you-type or multi-select.
        </Callout>

        <h3 id="select-props">Props</h3>
        <PropsTable
          props={[
            {
              name: "options",
              type: "SelectOption[]",
              description:
                "Convenience list of { label, value, disabled? } items. Omit and pass <option> children instead if preferred.",
            },
            {
              name: "placeholder",
              type: "string",
              description: "Disabled first option shown when no value is selected (e.g. “Select your state”).",
            },
            {
              name: "invalid",
              type: "boolean",
              default: "false",
              description: "Renders the error state and sets aria-invalid on the select.",
            },
            {
              name: "disabled",
              type: "boolean",
              default: "false",
              description: "Disables the control and removes it from the tab order.",
            },
            {
              name: "...native",
              type: "SelectHTMLAttributes",
              description:
                "Any native select prop (value, defaultValue, onChange, name, required, ref, …) is forwarded to the underlying element.",
            },
          ]}
        />

        <h3 id="select-a11y">Accessibility</h3>
        <A11yChecklist
          items={[
            {
              criterion: "Required visible label",
              level: "A",
              description:
                "Wrap in FormField so the label is associated with the select. A placeholder option is not a label.",
            },
            {
              criterion: "aria-invalid on error",
              level: "AA",
              description: "Set invalid (or use FormField's error prop) so the invalid state is exposed.",
            },
            {
              criterion: "Native keyboard support",
              level: "A",
              description:
                "Because it is a real <select>, arrow keys, typeahead, and the platform option list all work out of the box.",
            },
          ]}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FORM FIELD                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section style={{ marginTop: "var(--ds-spacing-5xl)" }}>
        <h2 id="form-field">FormField</h2>
        <p>
          <code>FormField</code> is the molecule that ties a control together with its label, optional hint, and
          optional error message — and wires up every accessibility attribute for you.
        </p>

        <Callout type="info" title="The render-prop pattern, in plain English">
          FormField takes a function as its child. That function receives the <code>id</code>, <code>invalid</code>{" "}
          state, and <code>aria-describedby</code> wiring — you spread it onto your control. This ensures the label is
          always connected to the input, error messages are announced by screen readers, and you never forget to wire
          up accessibility attributes.
        </Callout>

        <Playground code={FORM_EXAMPLE} />

        <h3 id="form-field-error">Error state</h3>
        <p>
          Pass an <code>error</code> message and FormField does the rest: it sets <code>invalid</code> on the control,
          links the message via <code>aria-describedby</code>, and gives the message <code>role=&quot;alert&quot;</code>{" "}
          so screen readers announce it the moment it appears.
        </p>

        <Playground code={FORM_ERROR_EXAMPLE} />

        <h3 id="form-field-props">Props</h3>
        <PropsTable
          props={[
            {
              name: "label",
              type: "ReactNode",
              required: true,
              description: "Visible field label, associated with the control through htmlFor / id.",
            },
            {
              name: "id",
              type: "string",
              description: "Control id. Auto-generated with React.useId() when omitted.",
            },
            {
              name: "hint",
              type: "ReactNode",
              description: "Helper text rendered below the label and linked to the control via aria-describedby.",
            },
            {
              name: "error",
              type: "ReactNode",
              description:
                "Error message. When set, the field renders the error state (invalid) and the message gets role=\"alert\".",
            },
            {
              name: "required",
              type: "boolean",
              default: "false",
              description: "Marks the field as required — adds a visible marker and required to the control wiring.",
            },
            {
              name: "children",
              type: "(control) => ReactNode",
              required: true,
              description:
                "Render-prop receiving { id, invalid, \"aria-describedby\" }. Spread it onto Input, Textarea, or Select.",
            },
          ]}
        />

        <h3 id="form-field-a11y">Accessibility</h3>
        <p>
          FormField exists precisely so accessibility is automatic. When you spread the control wiring, you get all of
          the following for free:
        </p>
        <A11yChecklist
          items={[
            {
              criterion: "Label always connected (required label)",
              level: "A",
              description:
                "The <label> htmlFor matches the control id, so clicking the label focuses the field and screen readers read the right name.",
            },
            {
              criterion: "Errors announced via aria-invalid",
              level: "AA",
              description:
                "When error is set, the control receives invalid → aria-invalid=\"true\" and the message uses role=\"alert\" to announce immediately.",
            },
            {
              criterion: "Hints linked with aria-describedby",
              level: "AA",
              description:
                "Both the hint and the error message are referenced by aria-describedby so screen readers read them as part of the field.",
            },
            {
              criterion: "Required communicated, not just coloured",
              level: "A",
              description:
                "The required marker is paired with the required attribute on the control, so the requirement is conveyed programmatically, not by colour alone.",
            },
          ]}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FORM SECTION                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section style={{ marginTop: "var(--ds-spacing-5xl)" }}>
        <h2 id="form-section">FormSection</h2>
        <p>
          <code>FormSection</code> is the form-layout primitive: a titled surface card wrapping a responsive 1/2/3-column
          field grid. Use one per logical group of fields within a larger form (e.g. &quot;Personal Details&quot;,
          &quot;Address&quot;) so related inputs read as a unit and never spill into one undifferentiated wall of fields.
        </p>

        <Playground code={FORM_SECTION_EXAMPLE} />

        <h3 id="form-section-props">Props</h3>
        <PropsTable
          props={[
            {
              name: "title",
              type: "ReactNode",
              required: true,
              description: "Left-aligned section heading rendered above the field grid.",
            },
            {
              name: "description",
              type: "ReactNode",
              description: "Optional sub-heading rendered below the title.",
            },
            {
              name: "columns",
              type: "1 | 2 | 3",
              default: "3",
              description: "Responsive field-grid columns. Collapses to a single column on smaller screens.",
            },
            {
              name: "children",
              type: "ReactNode",
              required: true,
              description: "FormFields laid out across the responsive grid.",
            },
            {
              name: "className",
              type: "string",
              description: "Optional extra classes merged onto the section card.",
            },
          ]}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FORM CARD                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section style={{ marginTop: "var(--ds-spacing-5xl)" }}>
        <h2 id="form-card">FormCard</h2>
        <p>
          <code>FormCard</code> is the sibling of <code>FormSection</code>: it has the <strong>same card chrome and
          section-title styling</strong>, but its body is arbitrary children instead of a field grid. Reach for it when a
          section&apos;s content is not a simple 1/2/3-column grid — a repeatable card list, a data table, or any mixed
          layout — so every section header across the estate stays visually identical.
        </p>

        <Callout type="warning" title="Don't hand-roll section cards">
          Never build a bare <code>&lt;section&gt;</code> with its own heading classes for a custom-layout group — the
          heading will drift from <code>FormSection</code> (wrong size or colour). Use <code>FormCard</code> so the two
          stay in lockstep. Pass <code>headingId</code> when a child needs <code>aria-labelledby</code> (for example, a
          data table that should be labelled by the section heading).
        </Callout>

        <Playground code={FORM_CARD_EXAMPLE} />

        <h3 id="form-card-props">Props</h3>
        <PropsTable
          props={[
            {
              name: "title",
              type: "ReactNode",
              required: true,
              description: "Section heading — styled identically to FormSection's title.",
            },
            {
              name: "description",
              type: "ReactNode",
              description: "Optional sub-heading rendered below the title.",
            },
            {
              name: "required",
              type: "boolean",
              default: "false",
              description: "Appends the accessible required marker (*) to the title.",
            },
            {
              name: "headingId",
              type: "string",
              description:
                "Explicit heading id. Pass this when a child needs aria-labelledby (e.g. a data table). Auto-generated when omitted.",
            },
            {
              name: "actions",
              type: "ReactNode",
              description: "Optional right-aligned controls in the header row (e.g. a small action button).",
            },
            {
              name: "children",
              type: "ReactNode",
              required: true,
              description: "Custom (non-grid) body content rendered below the header.",
            },
            {
              name: "className",
              type: "string",
              description: "Optional extra classes merged onto the section card.",
            },
          ]}
        />
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* WIZARD                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section style={{ marginTop: "var(--ds-spacing-5xl)" }}>
        <h2 id="wizard">Wizard</h2>
        <p>
          <code>Wizard</code> is the shared multi-step form shell. It renders the <code>Stepper</code>, the current
          step&apos;s body, an optional focusable error summary, and the Back / Continue / Submit controls. The parent
          owns all field state, the step index, and validation — the Wizard is presentational and tells you when the
          user wants to move.
        </p>

        <Callout type="info" title="The parent owns the state">
          Keep <code>current</code> (the step index) and every field value in your page&apos;s state. Validate inside{" "}
          <code>onNext</code> / <code>onSubmit</code> and only advance when the step is valid. On step change the Wizard
          moves focus to the step body and announces the step to screen readers (WCAG 4.1.3), so you get accessible
          navigation for free.
        </Callout>

        <Playground code={WIZARD_EXAMPLE} />

        <h3 id="wizard-props">Props</h3>
        <PropsTable
          props={[
            {
              name: "steps",
              type: "StepperStep[]",
              required: true,
              description: "Step definitions ({ label, description? }) shown in the Stepper.",
            },
            {
              name: "current",
              type: "number",
              required: true,
              description: "0-based index of the active step. Owned by the parent form.",
            },
            {
              name: "onBack / onNext / onSubmit",
              type: "() => void",
              required: true,
              description: "Fired when the user requests the previous step, the next step, or final submit.",
            },
            {
              name: "submitLabel",
              type: "string",
              default: '"Submit"',
              description: "Label for the final-step submit button.",
            },
            {
              name: "nextLabel",
              type: "string",
              default: '"Continue"',
              description: "Label for the advance button on non-final steps.",
            },
            {
              name: "error",
              type: "string",
              description: "Error-summary message rendered in a focusable alert above the actions.",
            },
            {
              name: "errorRef",
              type: "Ref<HTMLDivElement>",
              description: "Ref to the error summary so the parent can move focus to it on a failed step.",
            },
            {
              name: "children",
              type: "ReactNode",
              required: true,
              description: "The current step's body — typically FormSection / FormCard groups.",
            },
          ]}
        />

        <h3 id="review-section">ReviewSection &amp; ReviewItem</h3>
        <p>
          The final wizard step should always be a read-only summary. <code>ReviewSection</code> is a titled card that
          lays out <code>ReviewItem</code> label/value pairs in a responsive grid — empty values render as an em dash
          (—) so a missing answer is obvious before submit.
        </p>

        <Playground code={REVIEW_EXAMPLE} />

        <h3 id="wizard-a11y">Accessibility</h3>
        <A11yChecklist
          items={[
            {
              criterion: "Active step announced on change",
              level: "AA",
              description:
                "A polite live region announces \"Step N of M: <label>\" whenever current changes, so screen-reader users hear the move.",
            },
            {
              criterion: "Focus moves to the step body",
              level: "A",
              description:
                "On step change focus is sent to the step container, so keyboard users land on the new content instead of being stranded at the bottom.",
            },
            {
              criterion: "Errors are focusable and announced",
              level: "AA",
              description:
                "Pass error + errorRef and move focus to the summary on a failed step; the alert announces the problems immediately.",
            },
          ]}
        />
      </section>
    </article>
  );
}
