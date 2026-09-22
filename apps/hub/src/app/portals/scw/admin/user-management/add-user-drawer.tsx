"use client";

import { useState } from "react";
import { Field, TextInput } from "@/components/scw/ui";
import { INDIAN_STATES } from "@/lib/scw/states";
import { Icon, Select, Button, SideSheet } from "@mosje/design-system";

const ROLES = ["Nodal Officer", "Admin"];

export function AddUserDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button iconLeft={<Icon name="add" size={16} />} onClick={() => setOpen(true)}>
        Add User
      </Button>

      {/* The design system's SideSheet: it owns the backdrop, focus trap, Escape
          and scroll lock that the hand-built drawer here did not have. */}
      <SideSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Add User"
        size="md"
        footer={<Button fullWidth>Add User</Button>}
      >
        <div className="space-y-5">
          <Field label="First Name">
            <TextInput placeholder="First Name" />
          </Field>
          <Field label="Last Name">
            <TextInput placeholder="Last Name" />
          </Field>
          <Field label="Email ID">
            <TextInput type="email" placeholder="Email ID" />
          </Field>
          <Field label="Mobile Number">
            <TextInput type="tel" placeholder="Mobile Number" />
          </Field>
          <Field label="Select State">
            <Select options={[...INDIAN_STATES].map((value) => ({ value, label: value }))} placeholder="Select State" />
          </Field>
          <Field label="Select District">
            <Select options={[].map((value) => ({ value, label: value }))} placeholder="Select District" />
          </Field>
          <Field label="Select Role">
            <Select options={[...ROLES].map((value) => ({ value, label: value }))} placeholder="Select Role" />
          </Field>
        </div>
      </SideSheet>
    </>
  );
}
