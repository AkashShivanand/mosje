"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button, Field, Select, TextInput } from "@/components/ui";
import { INDIAN_STATES } from "@/lib/states";

const ROLES = ["Nodal Officer", "Admin"];

export function AddUserDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add User
      </Button>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <button
            aria-label="Close drawer"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Drawer */}
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[600px] flex-col bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="text-lg font-bold text-ink">Add User</h2>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-ink-muted hover:bg-black/5"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
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
                <Select options={INDIAN_STATES} placeholder="Select State" />
              </Field>
              <Field label="Select District">
                <Select options={[]} placeholder="Select District" />
              </Field>
              <Field label="Select Role">
                <Select options={ROLES} placeholder="Select Role" />
              </Field>
            </div>

            <footer className="border-t border-line px-6 py-4">
              <Button variant="primary" className="w-full">
                Add User
              </Button>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
