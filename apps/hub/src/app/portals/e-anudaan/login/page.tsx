"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, PasswordInput, PortalLoginShell, useToast } from "@mosje/design-system";
import { roleByLoginId } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

const BASE = "/portals/e-anudaan";

const PORTALS_GRID = [
  {
    code: "E-ANUDAAN",
    title: "E-Anudaan",
    subtitle: "Grant-in-Aid Management Portal",
    href: "/portals/e-anudaan/login",
    active: true,
  },
  {
    code: "SCW",
    title: "SCW",
    subtitle: "Senior Citizens Welfare",
    href: "/portals/scw",
    active: false,
  },
  {
    code: "TG",
    title: "SMILE - Transgender",
    subtitle: "National Portal for Transgender Persons",
    href: "/portals/tg",
    active: false,
  },
  {
    code: "NOS",
    title: "NOS",
    subtitle: "National Overseas Scholarship",
    href: "/portals/nos",
    active: false,
  },
  {
    code: "NMBA",
    title: "NMBA",
    subtitle: "Nasha Mukt Bharat Abhiyaan",
    href: "/portals/nmba",
    active: false,
  },
  {
    code: "SMILE",
    title: "SMILE - Beggary",
    subtitle: "National Portal for Persons Engaged in Begging",
    href: "/portals/smile-admin",
    active: false,
  },
  {
    code: "E-UTTHAAN",
    title: "E-Utthaan",
    subtitle: "Development Action Plan for Scheduled Castes",
    href: "/portals/eutthan-admin",
    active: false,
  },
  {
    code: "PM-AJAY",
    title: "PM-AJAY",
    subtitle: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojna",
    href: "/portals/pm-ajay",
    active: false,
  },
];

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

  const portalGridContent = (
    <div className="mt-4 border-t border-border pt-6">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
        CHOOSE A PORTAL TO LOGIN
      </h3>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {PORTALS_GRID.map((p) => (
          <Link
            key={p.code}
            href={p.href}
            className={`flex flex-col justify-between rounded-lg border p-3 text-left transition-all ${
              p.active
                ? "border-primary bg-primary-tonal text-primary font-semibold shadow-xs"
                : "border-border bg-surface text-ink hover:border-border-strong hover:bg-surface-muted"
            }`}
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                {p.code}
              </span>
              <h4 className="mt-0.5 text-xs font-semibold leading-tight text-ink line-clamp-1">
                {p.title}
              </h4>
            </div>
            <p className="mt-2 text-[11px] leading-tight text-ink-muted line-clamp-2">
              {p.subtitle}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <PortalLoginShell
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      digitalIndiaSrc={`${BASE}/brand/digital-india.svg`}
      samaveshLogoSrc={`${BASE}/brand/samavesh-logo.svg`}
      signingInto="E-Anudaan"
      changeHref="/portals"
      tabs={[]}
      extraContent={portalGridContent}
    >
      <h2 className="mb-6 text-2xl font-bold text-ink">Log in to your account</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="mobile_number" className="mb-1.5 block text-sm font-semibold text-ink">
            Mobile Number
          </label>
          <Input
            id="mobile_number"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            required
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-semibold text-ink">
              Password
            </label>
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                toast("Please contact system admin to reset officer password.", "info");
              }}
              className="text-xs font-semibold text-primary hover:underline"
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

      <p className="mt-4 text-xs text-ink-muted">
        Demonstration portal on mock data. Open the demo console (bottom-left) to fill an officer role.
      </p>
    </PortalLoginShell>
  );
}
