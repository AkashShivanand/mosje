"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, FormField, Input, PasswordInput, PortalLoginShell, useToast } from "@mosje/design-system";
import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

const BASE = "/portals/e-anudaan";

/* The live portal shows a "Login with DARPAN ID" tab beside this one. DARPAN is a real
   external identity provider that cannot be mocked honestly, so the demo offers only
   credentials — recorded as a deliberate divergence in the INVENTORY. */
const TABS = [{ label: "Login with Credentials", href: "#", active: true }];

/**
 * NGO applicant login.
 *
 * The live NGO portal guards this surface with a CAPTCHA and offers a "Login with DARPAN ID"
 * tab alongside credentials. Neither is reproduced: a CAPTCHA on a demo portal is friction with
 * no threat to mitigate, and DARPAN is a real external identity provider that cannot be mocked
 * honestly. Both are recorded in the INVENTORY as deliberate divergences.
 */
export default function EAnudaanNgoSignInPage() {
  const router = useRouter();
  const { login } = useEAnudaan();
  const { toast } = useToast();
  const [loginId, setLoginId] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw } = (e as CustomEvent<{ id: string; password: string }>).detail;
      setLoginId(id);
      setPassword(pw);
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId.trim().toUpperCase() !== ROLES.ngo.loginId) {
      toast("Unknown login ID for this demo.", "error");
      return;
    }
    login("ngo");
    router.push(ROLES.ngo.home);
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
      <h2 className="mb-1 text-xl font-bold text-ink">Sign in to your organisation</h2>
      <p className="mb-6 text-sm text-ink-muted">Enter the login ID issued to your NGO / VO</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField label="Login ID" id="login_id">
          {(control) => (
            <Input
              {...control}
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="e.g. LGN3712"
            />
          )}
        </FormField>

        <FormField label="Password" id="ngo_password">
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
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-xs text-ink-muted">
        Demonstration portal on mock data. No real application is filed and no funds move.
      </p>
    </PortalLoginShell>
  );
}
