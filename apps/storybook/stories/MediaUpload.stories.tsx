import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormField, MediaUpload } from "@mosje/design-system";

/**
 * **MediaUpload** — a single-file drop zone with preview, replace and remove.
 *
 * It reads the chosen file to a **data-URL in the browser** and hands that to
 * `onChange`. Nothing is uploaded — the network call is yours. That is what
 * makes it usable inside a wizard where the applicant may go back and change
 * their mind before anything is submitted.
 *
 * Type and size are checked client-side, and the failure is shown in place.
 * Treat that as courtesy, not security: re-validate on the server.
 *
 * Use it for one document — a photograph, a signed certificate. For several
 * files use `MediaGalleryInput`; for evidence photographs that must carry
 * coordinates use `GeoPhotoInput`.
 *
 * Spread the `FormField` control props onto it (`id`, `invalid`,
 * `aria-describedby`) so the label and error are wired to the operable button.
 *
 * Lifecycle: **Stable**.
 */
const meta = {
  title: "Components/Forms/MediaUpload",
  component: MediaUpload,
  args: {
    onChange: () => {},
    onClear: () => {},
    accept: "image/*",
    maxSizeMb: 5,
    invalid: false,
    disabled: false,
  },
  argTypes: {
    accept: { control: "text" },
    maxSizeMb: { control: { type: "number", min: 1, max: 50 } },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    promptLabel: { control: "text" },
    hintLabel: { control: "text" },
    value: { control: false },
    fileName: { control: false },
    onChange: { control: false },
    onClear: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MediaUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drag an image in, or click to pick one — the preview and Remove appear. */
export const Playground: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState<string | undefined>();
    const [fileName, setFileName] = React.useState<string | undefined>();
    return (
      <MediaUpload
        {...args}
        value={value}
        fileName={fileName}
        onChange={(dataUrl, name) => {
          setValue(dataUrl);
          setFileName(name);
        }}
        onClear={() => {
          setValue(undefined);
          setFileName(undefined);
        }}
      />
    );
  },
};

/** Inside a `FormField`, which is how it should appear in a real form. */
export const InAForm: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState<string | undefined>();
    const [fileName, setFileName] = React.useState<string | undefined>();
    return (
      <FormField
        label="Passport-size photograph"
        required
        hint="JPG or PNG, taken within the last six months"
      >
        {(c) => (
          <MediaUpload
            {...args}
            {...c}
            value={value}
            fileName={fileName}
            onChange={(dataUrl, name) => {
              setValue(dataUrl);
              setFileName(name);
            }}
            onClear={() => {
              setValue(undefined);
              setFileName(undefined);
            }}
          />
        )}
      </FormField>
    );
  },
};

/** A non-image document, with the accepted types and size limit narrowed. */
export const PdfOnly: Story = {
  render: function Render(args) {
    const [value, setValue] = React.useState<string | undefined>();
    const [fileName, setFileName] = React.useState<string | undefined>();
    return (
      <FormField label="Sanction order" hint="Signed PDF issued by the state nodal officer">
        {(c) => (
          <MediaUpload
            {...args}
            {...c}
            accept="application/pdf"
            maxSizeMb={10}
            promptLabel="Click or drag the signed sanction order"
            value={value}
            fileName={fileName}
            onChange={(dataUrl, name) => {
              setValue(dataUrl);
              setFileName(name);
            }}
            onClear={() => {
              setValue(undefined);
              setFileName(undefined);
            }}
          />
        )}
      </FormField>
    );
  },
};

/** The error state, driven by the field rather than by a rejected file. */
export const Invalid: Story = {
  render: (args) => (
    <FormField label="Passport-size photograph" required error="A photograph is required.">
      {(c) => <MediaUpload {...args} {...c} />}
    </FormField>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    promptLabel: "Uploads are closed for this reporting window",
  },
};
