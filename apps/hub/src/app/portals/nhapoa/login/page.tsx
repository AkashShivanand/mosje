"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon, type DemoFillDetail } from "@mosje/design-system";
import { Button, Field, TextInput } from "@/components/nhapoa/ui";
import { RenameNotice } from "@/components/nhapoa/rename-notice";
import { roleByUsername } from "@/lib/nhapoa/roles";
import { useNhapoa } from "@/lib/nhapoa/store/store";

/**
 * NHAPOA admin login (mock auth). Any password is accepted — the username
 * resolves the role, which is stored in the mock session and drives routing.
 * All 8 roles are one-click fillable from the DemoDock's Sign in tab (demo
 * password Demo@123).
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useNhapoa();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // DemoDock prefill via the design-system CustomEvent.
  React.useEffect(() => {
    const handler = (e: Event) => {
      const { id, password: pw } = (e as CustomEvent<DemoFillDetail>).detail;
      setUsername(id);
      setPassword(pw);
      setError(null);
    };
    window.addEventListener("demo:fill", handler);
    return () => window.removeEventListener("demo:fill", handler);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const role = roleByUsername(username);
    if (!role) {
      setError("Unknown username. Use the Demo credentials panel to pick a role.");
      return;
    }
    login(role.id);
    router.push(role.home);
  }

  // flex-1, not min-h-screen: the portal layout is already a full-height flex
  // column, so claiming a second full viewport here would overflow by the
  // campaign banner's height.
  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <a href="#login-main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-label-1 focus:font-semibold focus:text-white">
        Skip to login form
      </a>
      {/* Left hero panel */}
      <aside className="nha-login-panel relative hidden flex-col justify-center p-12 text-white md:flex md:w-1/2">
        <Image src="/portals/nhapoa/brand/samavesh-logo.svg" alt="SAMAVESH" width={40} height={40} className="h-16 w-16" />
        <h1 className="mt-6 flex items-baseline gap-3 text-headline-3">
          SAMBAL <span lang="hi" className="text-headline-3 text-white/80">संबल</span>
        </h1>
        <p className="mt-2 text-body-1 text-white/85">National Helpline Against Atrocities</p>
        <div className="my-6 h-1 w-64 rounded bg-saffron" />
        <p className="text-headline-4">Justice. Dignity. Protection.</p>
        <p className="mt-5 max-w-md text-body-1 text-white/75">
          Grievance redressal and relief disbursement under the Scheduled Castes and Scheduled
          Tribes (Prevention of Atrocities) Act — one accountable workflow from complaint to relief.
        </p>
        {/* bottom offset clears the fixed AppSwitcher FAB (bottom-left) */}
        <div className="absolute inset-x-12 bottom-[var(--cmp-appsw-safe-area)] border-t border-white/15 pt-6">
          <p className="text-label-3 uppercase text-white/55">Signing Into</p>
          <p className="text-title-3">SAMBAL Administration</p>
        </div>
      </aside>

      {/* Right form panel */}
      <main id="login-main" className="flex flex-1 items-center justify-center bg-surface-muted px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <h2 className="text-headline-3 text-ink">Officer / Admin Login</h2>
          <p className="mt-1 mb-6 text-body-2 text-ink-muted">Sign in to the SAMBAL administration portal.</p>

          <form className="space-y-5" onSubmit={onSubmit}>
            <Field label="Username" required>
              <TextInput
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Field>

            <Field label="Password" required>
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-hint hover:text-ink"
                >
                  {showPassword ? <Icon name="visibility_off" size={20} /> : <Icon name="visibility" size={20} />}
                </button>
              </div>
            </Field>

            {error && <p className="text-body-2 font-medium text-reject-fg">{error}</p>}

            <div className="text-right">
              <Link href="/portals/nhapoa/forgot-password" className="text-label-1 font-semibold text-navy hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Login
              <Icon name="arrow_forward" size={16} />
            </Button>
          </form>

          <p className="mt-8 text-center text-body-3 text-ink-hint">
            Ministry of Social Justice &amp; Empowerment, Government of India
          </p>
        </div>
      </main>

      <RenameNotice />
    </div>
  );
}
