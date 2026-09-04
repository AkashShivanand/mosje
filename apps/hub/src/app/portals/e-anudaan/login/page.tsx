"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, FormField, Input, PasswordInput, PortalLoginShell, useToast, type DemoFillDetail } from "@mosje/design-system";
import { roleByLoginId } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

const BASE = "/portals/e-anudaan";

export default function EAnudaanOfficerLoginPage() {
  const router = useRouter();
  const { login } = useEAnudaan();
  const { toast } = useToast();
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw } = (e as CustomEvent<DemoFillDetail>).detail;
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
      tabs={[]}
      onFooterLinkClick={(link) => {
        toast(`Viewing ${link} policy.`, "info");
      }}
    >
      <h1 className="mb-6 text-headline-3 text-ink">Log in to your account</h1>

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
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter your mobile number"
            />
          )}
        </FormField>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-label-1 text-ink">
              Password
            </label>
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                toast("Please contact system admin to reset officer password.", "info");
              }}
              className="text-label-2 font-semibold text-primary hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <PasswordInput
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <Button type="submit" className="mt-2 w-full">
          Log In
        </Button>
      </form>

      <p className="mt-4 text-body-3 text-ink-muted">
        Demonstration portal on mock data. Open the demo console (bottom-left) to fill an officer role.
      </p>
    </PortalLoginShell>
  );
}
