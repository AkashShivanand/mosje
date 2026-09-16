import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Button, DocumentTile, DocumentTiles, FormCard, Icon, IconButton } from "@mosje/design-system";

/**
 * **DocumentTile · DocumentTiles** — one document on an upload or review step: `title`
 * (with `required`), one line of `meta`, `actions` at the right, an optional leading
 * `icon`, and `children` for content that belongs to the document (an officer's remark).
 * `DocumentTiles` is the `<ul>` grid they sit in, two to a row from 768px; a tile outside
 * it takes `as="div"`.
 *
 * Four `state`s: **upcoming** (nothing chosen), **uploaded** (a file attached),
 * **verified** and **invalid** (needs correction). An upload is `uploaded`, **never**
 * `verified` — only an officer or DigiLocker verifies a document.
 *
 * Do not use it for an officer's checklist with findings and versions (ChecklistScreen)
 * or for a public download list (DocumentLibrary).
 *
 * Lifecycle: **New**.
 *
 * @covers DocumentTile, DocumentTiles
 */
const meta = {
  title: "Components/Forms/Document tile",
  component: DocumentTile,
  args: {
    title: "Income Certificate",
    required: true,
    state: "upcoming",
    meta: "PDF, JPG or PNG · up to 2 MB",
    as: "div",
  },
  argTypes: {
    state: { control: "inline-radio", options: ["upcoming", "uploaded", "verified", "invalid"] },
    as: { control: "inline-radio", options: ["li", "div"] },
    icon: { control: false },
    actions: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1040 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <DocumentTile
      {...args}
      actions={
        <Button appearance="outlined" size="sm">
          Browse File
        </Button>
      }
    />
  ),
};

/** Nothing chosen yet: formats and the size limit, and Browse File. */
export const Upcoming: Story = {
  render: () => (
    <DocumentTile
      as="div"
      title="Income Certificate"
      required
      state="upcoming"
      meta="PDF, JPG or PNG · up to 2 MB"
      actions={
        <Button appearance="outlined" size="sm">
          Browse File
        </Button>
      }
    />
  ),
};

/** A file is attached. It is not verified. */
export const Uploaded: Story = {
  render: () => (
    <DocumentTile
      as="div"
      title="Income Certificate"
      required
      state="uploaded"
      meta="income-certificate-2026.pdf · 184 KB"
      actions={
        <>
          <Button appearance="outlined" size="sm">
            Change
          </Button>
          <IconButton
            appearance="text"
            size="sm"
            icon={<Icon name="delete" size={20} />}
            aria-label="Remove Income Certificate"
          />
        </>
      }
    />
  ),
};

/** Verified by an officer or through DigiLocker — and only then. */
export const Verified: Story = {
  render: () => (
    <DocumentTile
      as="div"
      title="Aadhaar Card"
      required
      state="verified"
      meta="Linked via DigiLocker"
      actions={<Badge status="success">Verified</Badge>}
    />
  ),
};

/** Returned for correction, with the officer's reason as the meta line. */
export const NeedsCorrection: Story = {
  render: () => (
    <DocumentTile
      as="div"
      title="Caste Certificate"
      required
      state="invalid"
      meta="The certificate number does not match the issuing authority's register."
      actions={
        <Button appearance="outlined" size="sm">
          Replace File
        </Button>
      }
    >
      <p style={{ margin: 0, color: "var(--sa-text-neutral-subtle)" }}>
        Returned by the District Welfare Officer on 12 September 2026.
      </p>
    </DocumentTile>
  ),
};

/** The grid on an upload step, all four states together. */
export const UploadStep: Story = {
  render: () => (
    <FormCard title="Identity Documents">
      <DocumentTiles>
        <DocumentTile
          title="Income Certificate"
          required
          meta="PDF, JPG or PNG · up to 2 MB"
          actions={
            <Button appearance="outlined" size="sm">
              Browse File
            </Button>
          }
        />
        <DocumentTile
          title="Bank Passbook"
          state="uploaded"
          meta="passbook-front-page.jpg · 612 KB"
          actions={
            <Button appearance="outlined" size="sm">
              Change
            </Button>
          }
        />
        <DocumentTile
          title="Aadhaar Card"
          required
          state="verified"
          meta="Linked via DigiLocker"
          actions={<Badge status="success">Verified</Badge>}
        />
        <DocumentTile
          title="Caste Certificate"
          required
          state="invalid"
          meta="The certificate number does not match the register."
          actions={
            <Button appearance="outlined" size="sm">
              Replace File
            </Button>
          }
        />
      </DocumentTiles>
    </FormCard>
  ),
};

/** On a review step: a file glyph and View. */
export const ReviewStep: Story = {
  render: () => (
    <FormCard title="Documents">
      <DocumentTiles>
        <DocumentTile
          title="Income Certificate"
          state="uploaded"
          icon={<Icon name="description" size={24} />}
          meta="income-certificate-2026.pdf"
          actions={
            <Button appearance="text" size="sm" aria-label="View Income Certificate">
              View
            </Button>
          }
        />
        <DocumentTile
          title="Aadhaar Card"
          state="verified"
          icon={<Icon name="description" size={24} />}
          meta="Linked via DigiLocker"
          actions={
            <Button appearance="text" size="sm" aria-label="View Aadhaar Card">
              View
            </Button>
          }
        />
      </DocumentTiles>
    </FormCard>
  ),
};
