import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  FormCard,
  FormField,
  FormSection,
  Input,
  Select,
  Textarea,
} from "@mosje/design-system";

/**
 * **FormSection · FormCard** — the two titled surface cards every government
 * form on the estate is built from. Documented together because choosing
 * between them is the only decision they present.
 *
 * - **`FormSection`** owns a responsive 1/2/3-column **field grid**. Use it for
 *   the ordinary case: a run of labelled fields.
 * - **`FormCard`** is the same chrome with an **arbitrary body**. Use it when
 *   the content is not a grid of fields — a table, repeatable rows, a summary,
 *   an upload area — so the header still matches every other section on the
 *   page instead of being hand-rolled.
 *
 * Both render a real `<section aria-labelledby>` pointing at their `<h2>`, so
 * the page outline stays navigable by heading. Don't nest one inside the other.
 *
 * `FormCard` additionally takes `actions` for a right-aligned control in the
 * header row, and `headingId` when a child (a table, say) needs to point
 * `aria-labelledby` at the section title.
 *
 * Lifecycle: **Stable**.
 *
 * @covers FormSection, FormCard
 */
const meta = {
  title: "Components/Forms/Form layout",
  component: FormSection,
  args: {
    title: "Applicant details",
    description: "As printed on the supporting documents.",
    columns: 3,
    children: null,
  },
  argTypes: {
    columns: { control: "inline-radio", options: [1, 2, 3] },
    title: { control: "text" },
    description: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const applicantFields = (
  <>
    <FormField label="Full name" required>
      {(c) => <Input {...c} defaultValue="Sunita Deshmukh" />}
    </FormField>
    <FormField label="State / UT" required>
      {(c) => (
        <Select
          {...c}
          defaultValue="MH"
          options={[
            { label: "Maharashtra", value: "MH" },
            { label: "Karnataka", value: "KA" },
            { label: "Tamil Nadu", value: "TN" },
          ]}
        />
      )}
    </FormField>
    <FormField label="District" required>
      {(c) => <Input {...c} defaultValue="Pune" />}
    </FormField>
    <FormField label="Mobile number" hint="10 digits, no prefix">
      {(c) => <Input {...c} inputMode="numeric" defaultValue="9890001234" />}
    </FormField>
    <FormField label="Email address">
      {(c) => <Input {...c} type="email" placeholder="name@example.gov.in" />}
    </FormField>
    <FormField label="Category" required>
      {(c) => (
        <Select
          {...c}
          placeholder="Select a category"
          options={[
            { label: "Scheduled Caste", value: "sc" },
            { label: "Other Backward Class", value: "obc" },
            { label: "De-notified tribe", value: "dnt" },
          ]}
        />
      )}
    </FormField>
  </>
);

export const Playground: Story = {
  render: (args) => <FormSection {...args}>{applicantFields}</FormSection>,
};

/** One, two or three columns — the grid collapses on narrow screens regardless. */
export const Columns: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 24 }}>
      <FormSection {...args} title="Three columns (default)" columns={3}>
        {applicantFields}
      </FormSection>
      <FormSection {...args} title="Two columns" columns={2}>
        <FormField label="Sanction order number" required>
          {(c) => <Input {...c} defaultValue="MH/PUN/2026/004182" />}
        </FormField>
        <FormField label="Amount sanctioned (₹ lakh)" required>
          {(c) => <Input {...c} inputMode="decimal" defaultValue="18.40" />}
        </FormField>
      </FormSection>
      <FormSection {...args} title="One column" columns={1} description="For a single wide field.">
        <FormField label="Remarks for the district officer">
          {(c) => <Textarea {...c} rows={3} placeholder="Type here…" />}
        </FormField>
      </FormSection>
    </div>
  ),
};

/**
 * `FormCard` — the same header, a body that is not a field grid. Here it holds
 * a table, with `headingId` linking the table's accessible name to the title.
 */
export const CardWithATable: Story = {
  render: () => (
    <FormCard
      title="Instalments released"
      description="PM-AJAY · Adarsh Gram component · FY 2026–27"
      headingId="sb-instalments"
      required
      actions={
        <Button size="sm" appearance="outlined">
          Add instalment
        </Button>
      }
    >
      <table
        aria-labelledby="sb-instalments"
        style={{ width: "100%", borderCollapse: "collapse", color: "var(--ds-ink)" }}
      >
        <thead>
          <tr style={{ textAlign: "left", color: "var(--ds-ink-muted)" }}>
            <th style={{ padding: "8px 0" }}>Instalment</th>
            <th style={{ padding: "8px 0" }}>Released on</th>
            <th style={{ padding: "8px 0" }}>Amount (₹ lakh)</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["First", "12 May 2026", "9.20"],
            ["Second", "04 August 2026", "9.20"],
          ].map(([n, on, amt]) => (
            <tr key={n} style={{ borderTop: "1px solid var(--ds-border)" }}>
              <td style={{ padding: "8px 0" }}>{n}</td>
              <td style={{ padding: "8px 0" }}>{on}</td>
              <td style={{ padding: "8px 0" }}>{amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FormCard>
  ),
};

/** The two side by side, which is how a real page uses them. */
export const APageOfSections: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      <FormSection title="Applicant details" description="As printed on the supporting documents.">
        {applicantFields}
      </FormSection>
      <FormCard
        title="Supporting documents"
        description="Upload a scan or clear photograph of each."
      >
        <ul style={{ margin: 0, paddingLeft: "1.2em", color: "var(--ds-ink)" }}>
          <li>Aadhaar — received 04 August 2026</li>
          <li>Caste certificate — received 04 August 2026</li>
          <li>Income certificate — pending</li>
        </ul>
      </FormCard>
    </div>
  ),
};
