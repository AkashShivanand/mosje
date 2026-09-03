import type { Meta, StoryObj } from "@storybook/react";
import {
  FieldPolicyProvider,
  FormField,
  Input,
  RequiredFieldsLegend,
} from "@mosje/design-system";

/**
 * **FieldPolicyProvider** — sets, for every field beneath it, whether the form
 * marks its mandatory fields or its optional ones, and what words the field
 * stack uses.
 *
 * **Necessity is a form-level decision.** Systems that put it on the field let
 * one form mark half its fields required and the other half optional, which
 * reads as though the unmarked ones are a third category. One provider per form
 * removes the possibility, and `RequiredFieldsLegend` reads the same setting so
 * the key and the marks can never disagree.
 *
 * **Mark the minority.** A form where two fields of forty are optional should
 * mark those two. Most scheme applications on this estate are almost entirely
 * mandatory, so `necessity="optional"` is usually the right choice — asterisking
 * forty of forty-two fields marks nothing.
 *
 * **Copy is an app-level decision.** Put one provider at the root of a portal to
 * translate the whole field stack at once. Overrides merge over the English
 * defaults and are inherited by nested providers, so a form that changes only
 * `necessity` inside a Hindi portal stays in Hindi.
 */
const meta = {
  title: "Components/FieldPolicyProvider",
  component: FieldPolicyProvider,
  args: { necessity: "optional", children: null },
} satisfies Meta<typeof FieldPolicyProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Fields() {
  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      <RequiredFieldsLegend />
      <FormField label="Full Name" required>
        {(c) => <Input {...c} autoComplete="name" />}
      </FormField>
      <FormField label="Mobile Number" required>
        {(c) => <Input {...c} type="tel" autoComplete="tel" />}
      </FormField>
      <FormField label="Alternate Email">
        {(c) => <Input {...c} type="email" autoComplete="email" />}
      </FormField>
    </div>
  );
}

/** Almost everything is mandatory, so the two optional fields carry the mark. */
export const MarkTheOptional: Story = {
  render: () => (
    <FieldPolicyProvider necessity="optional">
      <Fields />
    </FieldPolicyProvider>
  ),
};

/** Most fields can be skipped, so the mandatory ones carry the asterisk. */
export const MarkTheMandatory: Story = {
  render: () => (
    <FieldPolicyProvider necessity="required">
      <Fields />
    </FieldPolicyProvider>
  ),
};

/** Neither marked — only defensible when the form says so in prose above the fields. */
export const MarkNeither: Story = {
  render: () => (
    <FieldPolicyProvider necessity="none">
      <Fields />
    </FieldPolicyProvider>
  ),
};

/** The whole stack in Hindi, from one provider at the root of a portal. */
export const Localised: Story = {
  render: () => (
    <FieldPolicyProvider
      necessity="optional"
      copy={{
        optionalSuffix: " (वैकल्पिक)",
        necessityLegend: {
          optional: "जब तक वैकल्पिक न लिखा हो, सभी फ़ील्ड अनिवार्य हैं।",
        },
      }}
    >
      <div lang="hi" style={{ display: "grid", gap: 16, maxWidth: 420 }}>
        <RequiredFieldsLegend />
        <FormField label="पूरा नाम" required>
          {(c) => <Input {...c} autoComplete="name" />}
        </FormField>
        <FormField label="वैकल्पिक ईमेल">
          {(c) => <Input {...c} type="email" autoComplete="email" />}
        </FormField>
      </div>
    </FieldPolicyProvider>
  ),
};
