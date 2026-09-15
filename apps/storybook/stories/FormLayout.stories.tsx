import type { Meta, StoryObj } from "@storybook/react";
import {
  Badge,
  Button,
  FormCard,
  FormField,
  FormPanel,
  FormSection,
  Input,
  Select,
  Textarea,
} from "@mosje/design-system";

/**
 * **FormSection · FormCard** — the two sub-sections every government form on the
 * estate is built from. Documented together because choosing between them is the
 * only decision they present.
 *
 * **Neither is a card.** Both render the handoff's sub-section head — an uppercase
 * label and a hairline rule filling the row — and sit inside the one `FormPanel` of
 * the form or wizard step. The panel is the card; a card per sub-section is the drift
 * `docs/design-system/form-wizard-visual-language.md` exists to stop.
 *
 * - **`FormSection`** owns a responsive 1–4 column **field grid** (3 by default).
 *   Use it for the ordinary case: a run of labelled fields.
 * - **`FormCard`** is the same head with an **arbitrary body** — repeatable
 *   `FormInset` entries, a table, `DocumentTiles`. It keeps its historical name.
 *
 * Both take `badge` (between the label and the rule — "DigiLocker"), `actions` (at
 * the end of the row — "Edit") and `as`, the heading level: `<h3>` by default under
 * the panel's `<h2>`. `FormCard` also takes `required` and `headingId`, for a child
 * (a table, say) that points `aria-labelledby` at the title. Don't nest one inside
 * the other.
 *
 * Lifecycle: **Stable**.
 *
 * @covers FormSection, FormCard
 */
const meta = {
  title: "Components/Forms/Form layout",
  component: FormSection,
  args: {
    title: "Applicant Details",
    columns: 3,
    as: 3,
    children: null,
  },
  argTypes: {
    columns: { control: "inline-radio", options: [1, 2, 3, 4] },
    as: { control: "inline-radio", options: [2, 3, 4] },
    badge: { control: false },
    actions: { control: false },
    title: { control: "text" },
    description: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1040 }}>
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

/** One to four columns — three and four become two below 1280px, and every grid one below 768px. */
export const Columns: Story = {
  render: (args) => (
    <FormPanel title="Column Counts">
      <FormSection {...args} title="Three Columns (Default)" columns={3}>
        {applicantFields}
      </FormSection>
      <FormSection {...args} title="Two Columns" columns={2}>
        <FormField label="Sanction order number" required>
          {(c) => <Input {...c} defaultValue="MH/PUN/2026/004182" />}
        </FormField>
        <FormField label="Amount sanctioned (₹ lakh)" required>
          {(c) => <Input {...c} inputMode="decimal" defaultValue="18.40" />}
        </FormField>
      </FormSection>
      <FormSection {...args} title="One Column" columns={1}>
        <FormField label="Remarks for the District Officer">{(c) => <Textarea {...c} rows={3} />}</FormField>
      </FormSection>
    </FormPanel>
  ),
};

/**
 * The head's optional parts: a `badge` between the label and the rule, `actions` at the
 * end of the row, and a one-sentence `description` only where it changes what is entered.
 */
export const HeadWithBadgeAndAction: Story = {
  render: (args) => (
    <FormPanel title="Basic Identity Details">
      <FormSection
        {...args}
        title="Verified Identity"
        badge={<Badge status="success">DigiLocker</Badge>}
        actions={
          <Button appearance="text" size="sm">
            Edit
          </Button>
        }
        description="Fields fetched from DigiLocker cannot be changed on this form."
      >
        {applicantFields}
      </FormSection>
    </FormPanel>
  ),
};

/**
 * `FormCard` — the same head, a body that is not a field grid. Here it holds
 * a table, with `headingId` linking the table's accessible name to the title.
 */
export const CardWithATable: Story = {
  render: () => (
    <FormPanel title="Release of Funds">
      <FormCard
        as={3}
        badge={<Badge status="info">PFMS</Badge>}
        title="Instalments Released"
        description="PM-AJAY · Adarsh Gram component · FY 2026–27"
        headingId="sb-instalments"
        required
        actions={
          <Button size="sm" appearance="outlined">
            Add Instalment
          </Button>
        }
      >
        <table
          aria-labelledby="sb-instalments"
          style={{ width: "100%", borderCollapse: "collapse", color: "var(--sa-color-text-default)" }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "var(--sa-color-text-muted)" }}>
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
              <tr key={n} style={{ borderTop: "1px solid var(--sa-border-neutral-subtle)" }}>
                <td style={{ padding: "8px 0" }}>{n}</td>
                <td style={{ padding: "8px 0" }}>{on}</td>
                <td style={{ padding: "8px 0" }}>{amt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </FormCard>
    </FormPanel>
  ),
};

/** The two in one panel, which is how a real step uses them — sub-sections, not cards. */
export const APageOfSections: Story = {
  render: () => (
    <FormPanel
      title="Applicant Details"
      description="As printed on the supporting documents."
      footer={
        <>
          <Button appearance="outlined">Cancel</Button>
          <Button>Save and Continue</Button>
        </>
      }
    >
      <FormSection title="Personal Details">{applicantFields}</FormSection>
      <FormCard title="Supporting Documents">
        <ul style={{ margin: 0, paddingLeft: "1.2em", color: "var(--sa-color-text-default)" }}>
          <li>Aadhaar — received 04 August 2026</li>
          <li>Caste certificate — received 04 August 2026</li>
          <li>Income certificate — pending</li>
        </ul>
      </FormCard>
    </FormPanel>
  ),
};
