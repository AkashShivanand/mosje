"use client";

import * as React from "react";
import { Button, FormField, Input, PortalLoginShell } from "@mosje/design-system";

/**
 * The shell, running, with a minimal form slotted into it.
 *
 * It is a FULL-PAGE layout, so the specimen is full-page too — there is no
 * smaller honest version of it. What the reader is meant to see is what the
 * shell provides and what it leaves to the caller: everything outside the
 * middle column is the shell's, and everything inside it arrived as `children`.
 *
 * The tab hrefs are `#` so the specimen cannot navigate away from this page.
 */
export function PortalLoginShellSpecimen(): React.JSX.Element {
  const [tab, setTab] = React.useState("citizen");

  const tabs = [
    { id: "citizen", label: "Citizen" },
    { id: "officer", label: "Officer" },
  ].map((t) => ({
    label: t.label,
    href: "#",
    active: t.id === tab,
    onClick: (event: React.MouseEvent) => {
      event.preventDefault();
      setTab(t.id);
    },
  }));

  return (
    <PortalLoginShell
      emblemSrc="/design-system/national-emblem.svg"
      digitalIndiaSrc="/website/images/digital-india-logo.svg"
      // org-logo-exempt(specimen): `samaveshLogoSrc` is a REQUIRED prop that takes an
      // explicit path — a portal passes its own copy — so a specimen has to pass one.
      // The SAMAVESH wordmark is not an organisation mark and is not in the registry.
      samaveshLogoSrc="/design-system/samavesh-logo.svg"
      signingInto="Nasha Mukt Bharat Abhiyaan"
      changeHref="#"
      tabs={tabs}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <FormField label="Username" hint="Your registered mobile number or email address">
          {(control) => <Input {...control} autoComplete="username" />}
        </FormField>
        <FormField label="Password">
          {(control) => <Input {...control} type="password" autoComplete="current-password" />}
        </FormField>
        <Button variant="primary" appearance="filled" type="submit">
          Sign In
        </Button>
      </form>
    </PortalLoginShell>
  );
}
