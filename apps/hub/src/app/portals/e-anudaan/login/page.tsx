"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, FormField, Input, PasswordInput, PortalLoginShell, useToast } from "@mosje/design-system";
import { roleByLoginId } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

const BASE = "/portals/e-anudaan";

/* The live portal shows a "Login with DARPAN ID" tab beside this one. DARPAN is a real
   external identity provider that cannot be mocked honestly, so the demo offers only
   credentials — recorded as a deliberate divergence in the INVENTORY. */
const TABS = [{ label: "Login with Credentials", href: "#", active: true }];

/**
 * Officer login. The live portal signs in by mobile number + password with no CAPTCHA
 * (the NGO surface has one; this one does not) — see the INVENTORY.
 *
 * Credentials live in DEMO_ACCOUNTS, not here. This page owns only the `demo:fill` listener,
 * per .claude/rules/portal-login-demos.md.
 */
export default function EAnudaanOfficerLoginPage() {
  const router = useRouter();
  const { login } = useEAnudaan();
  const { toast } = useToast();
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw } = (e as CustomEvent<{ id: string; password: string }>).detail;
      setMobile(id);
      setPassword(pw);
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = roleByLoginId(mobile);
    if (!role || role.id === "ngo") {
      toast("That mobile number is not a registered officer account.", "error");
      return;
    }
    login(role.id);
    router.push(role.home);
  };

  return (
    <PortalLoginShell
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      digitalIndiaSrc={`${BASE}/brand/digital-india.svg`}
      samaveshLogoSrc={`${BASE}/brand/samavesh-logo.svg`}
      signingInto="E-Anudaan"
      changeHref="/portals"
      tabs={TABS}
    >
      <h2 className="mb-1 text-xl font-bold text-ink">Log in to your account</h2>
      <p className="mb-6 text-sm text-ink-muted">Enter your registered mobile number and password</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField label="Mobile Number" id="mobile_number">
          {(control) => (
            <Input
              {...control}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter your mobile number"
            />
          )}
        </FormField>

        <FormField label="Password" id="password">
          {(control) => (
            <PasswordInput
              {...control}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          )}
        </FormField>

        <Button type="submit" className="mt-2 w-full">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-xs text-ink-muted">
        Demonstration portal on mock data. Open the demo console (bottom-left) to fill a role&apos;s
        credentials.
      </p>
    </PortalLoginShell>
  );
}
