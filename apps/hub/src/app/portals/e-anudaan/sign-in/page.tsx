"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, FormField, Icon, Input, PasswordInput, PortalLoginShell, useToast } from "@mosje/design-system";
import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";

const BASE = "/portals/e-anudaan";

function generateCaptcha(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";
  let str = "";
  for (let i = 0; i < 6; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

export default function EAnudaanNgoSignInPage() {
  const router = useRouter();
  const { login } = useEAnudaan();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = React.useState<"credentials" | "darpan">("credentials");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [captchaInput, setCaptchaInput] = React.useState("");
  // Client-only by necessity: generateCaptcha() is random, so producing it during
  // SSR (or in a lazy useState initialiser, which also runs on the server) yields a
  // different string on each side and fails hydration. It starts empty and is filled
  // on mount — the one case where setting state in an effect is the correct answer
  // rather than a smell.
  const [captchaCode, setCaptchaCode] = React.useState("");
  const [darpanId, setDarpanId] = React.useState("");

  const refreshCaptcha = React.useCallback(() => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput("");
  }, []);

  // Fill the captcha once we are on the client. See the note on captchaCode: a random
  // value produced during render (or in a lazy useState initialiser, which also runs on
  // the server) differs between server and client and fails hydration. This is the
  // narrow case the rule below is warning about but which genuinely needs an effect —
  // it runs once, with an empty dep array, so there is no cascading-render risk.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCaptchaCode(generateCaptcha());
  }, []);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw } = (e as CustomEvent<{ id: string; password: string }>).detail;
      setUsername(id);
      setPassword(pw);
      setCaptchaInput(captchaCode);
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, [captchaCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "credentials") {
      if (username.trim().toUpperCase() !== ROLES.ngo.loginId) {
        toast("Unknown username / login ID for this demo.", "error");
        return;
      }
      if (captchaInput.trim() && captchaInput.trim() !== captchaCode) {
        toast("Invalid Captcha code.", "error");
        refreshCaptcha();
        return;
      }
      login("ngo");
      router.push(ROLES.ngo.home);
    } else {
      if (!darpanId.trim()) {
        toast("Please enter your NGO DARPAN ID.", "error");
        return;
      }
      login("ngo");
      router.push(ROLES.ngo.home);
    }
  };

  const tabs = [
    {
      label: "Login with Credentials",
      href: "#credentials",
      active: activeTab === "credentials",
    },
    {
      label: "Login with DARPAN ID",
      href: "#darpan",
      active: activeTab === "darpan",
    },
  ];

  return (
    <PortalLoginShell
      emblemSrc={`${BASE}/brand/national-emblem.svg`}
      digitalIndiaSrc={`${BASE}/brand/digital-india.svg`}
      samaveshLogoSrc={`${BASE}/brand/samavesh-logo.svg`}
      signingInto="E-Anudaan"
      changeHref="/portals"
      tabs={tabs.map(t => ({
        ...t,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          setActiveTab(t.href === "#credentials" ? "credentials" : "darpan");
        }
      }))}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-ink">
          {activeTab === "credentials" ? "Login with Credentials" : "Login with DARPAN ID"}
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          {activeTab === "credentials"
            ? "Enter your issued username and password"
            : "Enter your NITI Aayog NGO DARPAN Portal ID"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {activeTab === "credentials" ? (
          <>
            <FormField label="Username *" id="username">
              {(control) => (
                <Input
                  {...control}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              )}
            </FormField>

            <FormField label="Password *" id="password">
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

            <FormField label="Captcha *" id="captcha">
              {(control) => (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-full select-none items-center justify-center rounded border border-border bg-surface-muted px-3 font-mono text-xl font-bold italic tracking-widest text-ink shadow-inner"
                      style={{
                        backgroundImage: "radial-gradient(var(--sa-border-neutral-subtle) 1px, transparent 1px)",
                        backgroundSize: "6px 6px",
                      }}
                      aria-label={`Captcha code: ${captchaCode}`}
                    >
                      {captchaCode}
                    </div>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-surface text-ink transition hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary"
                      title="Refresh Captcha"
                      aria-label="Refresh Captcha"
                    >
                      <Icon name="refresh" size={20} />
                    </button>
                  </div>
                  <Input
                    {...control}
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Enter the code shown above"
                  />
                </div>
              )}
            </FormField>
          </>
        ) : (
          <FormField label="NGO DARPAN ID *" id="darpan_id">
            {(control) => (
              <Input
                {...control}
                required
                value={darpanId}
                onChange={(e) => setDarpanId(e.target.value)}
                placeholder="Enter NGO DARPAN ID (e.g. DL/2023/0345678)"
              />
            )}
          </FormField>
        )}

        <Button type="submit" className="mt-2 w-full">
          Sign In
        </Button>

        <div className="flex justify-end pt-1">
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              toast("Please contact your district nodal officer to reset credentials.", "info");
            }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      </form>

      <p className="mt-6 text-xs text-ink-muted">
        Demonstration portal on mock data. Open the demo console (bottom-left) for quick sign-in.
      </p>
    </PortalLoginShell>
  );
}
