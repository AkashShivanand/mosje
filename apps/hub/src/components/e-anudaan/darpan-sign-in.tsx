"use client";

/**
 * Sign in with NGO-DARPAN — every screen of the relying-party half, and the provider stand-in.
 *
 * DS Audit: PortalLoginShell ✅ · AuthFormCard ✅ · AuthResult ✅ (`warning` and `error` statuses ➕
 * added for these return states) · AuthHelpLine ✅ · Button ✅ · DescriptionList ✅ · Card ✅ ·
 * Badge ✅ · Alert ✅ · FormField ✅ · Select ✅ · Icon ✅. `PortalRoleTab.identityProvider` ➕ added
 * so the login page draws the NGO-DARPAN card through the same `SSOButton` as DigiLocker.
 *
 * The decisions live in `lib/e-anudaan/darpan-sign-in.ts`, which is pure and tested. These views
 * only read storage, call it, and render the answer — one resolved outcome, rendered once.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  AuthFormCard,
  AuthHelpLine,
  AuthResult,
  Badge,
  Button,
  Card,
  CardBody,
  DescriptionList,
  FormField,
  Icon,
  PortalLoginShell,
  Select,
} from "@mosje/design-system";
import { ROLES } from "@/lib/e-anudaan/roles";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import {
  DARPAN_ATTRIBUTES,
  DARPAN_ROUTES,
  attributeValue,
  authorizeUrl,
  beginRequest,
  callbackUrl,
  clearRequest,
  darpanDirectory,
  exchangeDarpanCode,
  newState,
  normaliseDarpanId,
  readLinks,
  readReceived,
  readRequest,
  readSimulation,
  resolveDarpanReturn,
  simulatedCode,
  writeLinks,
  writeReceived,
  writeSimulation,
  type DarpanAccount,
  type DarpanProfile,
  type DarpanReturn,
} from "@/lib/e-anudaan/darpan-sign-in";
import { EANUDAAN_LOGIN_CHROME } from "./login-chrome";
import Link from "next/link";

/* ── Shared ────────────────────────────────────────────────────────────────── */

function sessionStore(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function localStore(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** The login page's own chrome, with no role tabs: each of these screens is one route. */
export function EAnudaanAuthShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  const c = EANUDAAN_LOGIN_CHROME;
  return (
    <PortalLoginShell
      emblemSrc={c.brandAssets.emblemSrc}
      digitalIndiaSrc={c.brandAssets.digitalIndiaSrc}
      samaveshLogoSrc={c.brandAssets.samaveshLogoSrc}
      heroImageSrc={c.brandAssets.heroImageSrc}
      signingInto={c.portalName}
      changeHref={c.changeHref}
      tabs={[]}
    >
      {children}
    </PortalLoginShell>
  );
}

function profileItems(profile: DarpanProfile) {
  return DARPAN_ATTRIBUTES.map((a) => ({ term: a.label, value: attributeValue(profile, a.key) }));
}

const CREDENTIALS_LABEL = "Sign In with Username and Password";

/* ── Start: record the request, then hand off ──────────────────────────────── */

export function DarpanStartView(): React.JSX.Element {
  const router = useRouter();
  const [blocked, setBlocked] = React.useState(false);
  // Once per mount. Strict Mode runs effects twice in development, and a second request would
  // overwrite the first while the first redirect is already under way — the return would then
  // fail the state check for a reason the applicant had nothing to do with.
  const started = React.useRef(false);

  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    const session = sessionStore();
    const req = session ? beginRequest(session, newState(), Date.now()) : null;
    // Without a stored request the return cannot be checked, so the sign-in does not start.
    if (!req || readRequest(session)?.state !== req.state) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the browser's storage is the external system being read
      setBlocked(true);
      return;
    }
    router.replace(authorizeUrl(req.state));
  }, [router]);

  return (
    <EAnudaanAuthShell>
      {blocked ? (
        <AuthResult
          headingLevel={1}
          status="warning"
          announce
          heading="Sign-In Could Not Start"
          description="This browser is not allowing the portal to store the sign-in request. Allow site data for this portal and try again, or sign in with your username and password."
          action={
            <>
              <Button linkAs={Link} href={DARPAN_ROUTES.start} fullWidth>
                Try Again
              </Button>
              <Button linkAs={Link} href={DARPAN_ROUTES.login} appearance="outlined" fullWidth>
                {CREDENTIALS_LABEL}
              </Button>
            </>
          }
        />
      ) : (
        <AuthResult
          headingLevel={1}
          status="notice"
          icon="sync"
          announce
          heading="Connecting to NGO-DARPAN"
          description="You will be asked to confirm the organisation's details on NGO-DARPAN."
        />
      )}
    </EAnudaanAuthShell>
  );
}

/* ── The provider stand-in ─────────────────────────────────────────────────── */

const ACCOUNT_OPTIONS: { value: DarpanAccount; label: string }[] = [
  { value: "registered", label: "Registered on E-Anudaan" },
  { value: "unregistered", label: "Not Registered on E-Anudaan" },
  { value: "inactive", label: "Inactive Registration" },
  { value: "suspended", label: "Suspended Registration" },
];

interface AuthorizeParams {
  state: string;
  valid: boolean;
}

function readAuthorizeParams(): AuthorizeParams {
  const q = new URLSearchParams(window.location.search);
  const state = q.get("state") ?? "";
  return {
    state,
    valid:
      state !== "" &&
      q.get("client_id") === "e-anudaan" &&
      q.get("response_type") === "code" &&
      q.get("redirect_uri") === DARPAN_ROUTES.callback,
  };
}

/**
 * NGO-DARPAN's consent step, simulated. **It is deliberately not dressed as the real service**: no
 * NITI Aayog mark, no DARPAN logo, a plain wordmark and a standing prototype label. What it keeps
 * is the substance a real consent screen owes the applicant — who is asking, which named
 * attributes, and a Cancel that is as easy as Allow.
 */
export function DarpanConsentView(): React.JSX.Element {
  const { state: store } = useEAnudaan();
  const [params, setParams] = React.useState<AuthorizeParams | null>(null);
  const [account, setAccount] = React.useState<DarpanAccount>("registered");

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the address bar and storage are read once on arrival
    setParams(readAuthorizeParams());
    setAccount(readSimulation(sessionStore()).account);
  }, []);

  const directory = darpanDirectory(store.ngos[0]);
  const profile = directory[account];

  const answer = (reply: { code: string } | { error: "access_denied" }) => {
    if (!params) return;
    window.location.assign(callbackUrl(params.state, reply));
  };

  return (
    <div className="min-h-screen bg-[var(--sa-bg-neutral-subtler)]">
      <header className="border-b border-line bg-[var(--sa-bg-neutral-base)]">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="inline-flex items-center gap-2 text-label-2 font-semibold text-ink">
            <Icon name="shield_person" size={24} aria-hidden />
            NGO-DARPAN
          </span>
          <Badge status="warning">Prototype Stand-In</Badge>
        </div>
      </header>

      <main id="main-content" className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
        <Alert status="info" title="This Is Not the NGO-DARPAN Website">
          This screen stands in for the NGO-DARPAN consent step. Nothing on it leaves this prototype.
        </Alert>

        {params === null ? null : !params.valid ? (
          <Card>
            <CardBody>
              <AuthResult
                headingLevel={1}
                status="error"
                heading="This Request Cannot Be Completed"
                description="The link that opened this page is incomplete or has been altered. Return to E-Anudaan and start the sign-in again."
                action={<AuthHelpLine href={DARPAN_ROUTES.login}>Back to E-Anudaan</AuthHelpLine>}
              />
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="m-0 text-headline-4 text-ink">Share Your Organisation&rsquo;s Details with E-Anudaan</h1>
                  <p className="m-0 text-body-2 text-ink-muted">
                    E-Anudaan, the grant-in-aid portal of the Department of Social Justice and
                    Empowerment, is requesting the details below to sign you in.
                  </p>
                </div>

                <FormField label="Signed In As">
                  {(control) => (
                    <Select
                      {...control}
                      value={account}
                      onChange={(e) => {
                        const next = e.target.value as DarpanAccount;
                        setAccount(next);
                        writeSimulation(sessionStore(), { account: next });
                      }}
                      options={ACCOUNT_OPTIONS.map((o) => ({
                        value: o.value,
                        label: `${directory[o.value].organisationName} — ${o.label}`,
                      }))}
                    />
                  )}
                </FormField>

                <section aria-labelledby="darpan-consent-list" className="flex flex-col gap-3">
                  <h2 id="darpan-consent-list" className="m-0 text-label-2 font-semibold text-ink">
                    Details to Be Shared
                  </h2>
                  <DescriptionList items={profileItems(profile)} columns={1} layout="inline" size="sm" divided />
                </section>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => answer({ code: simulatedCode(account) })}>Allow</Button>
                  <Button appearance="outlined" onClick={() => answer({ error: "access_denied" })}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </main>
    </div>
  );
}

/* ── The return ────────────────────────────────────────────────────────────── */

export function DarpanReturnView(): React.JSX.Element {
  const router = useRouter();
  const { state: store, hydrated, login } = useEAnudaan();
  const [outcome, setOutcome] = React.useState<DarpanReturn | null>(null);
  const [linking, setLinking] = React.useState(false);
  const resolved = React.useRef(false);

  React.useEffect(() => {
    // After hydration, so a sign-in is written over the stored session rather than under it.
    if (!hydrated || resolved.current) return;
    resolved.current = true;

    const session = sessionStore();
    const q = new URLSearchParams(window.location.search);
    const directory = darpanDirectory(store.ngos[0]);
    const result = resolveDarpanReturn({
      params: { code: q.get("code"), state: q.get("state"), error: q.get("error") },
      pending: readRequest(session),
      now: Date.now(),
      exchange: (code) => exchangeDarpanCode(code, directory),
      ngos: store.ngos,
      linkedDarpanIds: readLinks(localStore()),
    });

    // The request and the code are single-use: forget the one, and take the other out of history.
    clearRequest(session);
    writeReceived(session, "profile" in result ? result.profile : null);

    if (result.kind === "linked") {
      login("ngo");
    } else {
      window.history.replaceState(window.history.state, "", DARPAN_ROUTES.callback);
    }
    setOutcome(result);
  }, [hydrated, store.ngos, login]);

  /*
   * Leave only once the session is COMMITTED. Navigating in the same effect that signs in let the
   * dashboard's guard render against the session as it was — null — and bounce the applicant back
   * to the login page with the sign-in already stored. `replace`, so the address that carried the
   * code does not stay in history.
   */
  const signedIn = store.session === "ngo";
  React.useEffect(() => {
    if ((outcome?.kind === "linked" || linking) && signedIn) router.replace(ROLES.ngo.home);
  }, [outcome, linking, signedIn, router]);

  return <EAnudaanAuthShell>{renderReturn(outcome, linking, confirmLink)}</EAnudaanAuthShell>;

  function confirmLink(profile: DarpanProfile) {
    setLinking(true);
    const local = localStore();
    writeLinks(local, [...readLinks(local), profile.darpanId]);
    login("ngo");
  }
}

function renderReturn(
  outcome: DarpanReturn | null,
  linking: boolean,
  confirmLink: (profile: DarpanProfile) => void,
): React.ReactNode {
  const retry = (label: string) => (
    <Button linkAs={Link} href={DARPAN_ROUTES.start} fullWidth>
      {label}
    </Button>
  );
  const credentials = (
    <Button linkAs={Link} href={DARPAN_ROUTES.login} appearance="outlined" fullWidth>
      {CREDENTIALS_LABEL}
    </Button>
  );

  if (outcome === null || outcome.kind === "linked") {
    return (
      <AuthResult
        headingLevel={1}
        status="notice"
        icon="sync"
        announce
        heading="Signing You In"
        description={
          outcome ? `Signed in as ${outcome.profile.organisationName}. Opening the dashboard.` : "Checking the response from NGO-DARPAN."
        }
      />
    );
  }

  switch (outcome.kind) {
    case "first-link":
      return (
        <AuthFormCard
          headingLevel={1}
          heading="Link Your NGO-DARPAN Registration"
          description="NGO-DARPAN has shared the details below, and they match an e-Anudaan account. Confirm to link the two; the organisation will then sign in with NGO-DARPAN."
          onSubmit={(e) => {
            e.preventDefault();
            confirmLink(outcome.profile);
          }}
          credentialFields={
            <DescriptionList items={profileItems(outcome.profile)} columns={1} layout="inline" size="sm" divided />
          }
          primaryAction={
            <Button type="submit" loading={linking} fullWidth>
              Confirm and Link Account
            </Button>
          }
          footer={<AuthHelpLine href={DARPAN_ROUTES.login}>These Are Not My Organisation&rsquo;s Details</AuthHelpLine>}
        />
      );

    case "not-registered":
      return (
        <AuthResult
          headingLevel={1}
          status="notice"
          icon="domain_add"
          heading="Organisation Not Registered on E-Anudaan"
          description={`${outcome.profile.organisationName} (NGO-DARPAN Unique ID ${outcome.profile.darpanId}) does not have an e-Anudaan account. Register the organisation to apply for grant-in-aid.`}
          action={
            <>
              <Button linkAs={Link} href={DARPAN_ROUTES.register} fullWidth>
                Register the Organisation
              </Button>
              <AuthHelpLine href={DARPAN_ROUTES.login}>Back to Login</AuthHelpLine>
            </>
          }
        />
      );

    case "inactive": {
      const suspended = outcome.status === "Suspended";
      return (
        <AuthResult
          headingLevel={1}
          status="error"
          heading={suspended ? "NGO-DARPAN Registration Suspended" : "NGO-DARPAN Registration Inactive"}
          description={`The NGO-DARPAN registration of ${outcome.profile.organisationName} is ${suspended ? "suspended" : "inactive"}. E-Anudaan accepts sign-in only from organisations with an active registration. ${suspended ? "Resolve the suspension with NGO-DARPAN" : "Renew the registration on NGO-DARPAN"}, then sign in again.`}
          action={
            <Button linkAs={Link} href={DARPAN_ROUTES.login} appearance="outlined" fullWidth>
              Back to Login
            </Button>
          }
        />
      );
    }

    case "refused":
      return (
        <AuthResult
          headingLevel={1}
          status="warning"
          heading="Sign-In Cancelled"
          description="The organisation's details were not shared from NGO-DARPAN, so you have not been signed in."
          action={
            <>
              {retry("Sign In with NGO-DARPAN")}
              {credentials}
            </>
          }
        />
      );

    case "unavailable":
      return (
        <AuthResult
          headingLevel={1}
          status="warning"
          heading="NGO-DARPAN Is Not Responding"
          description="The sign-in could not be completed because NGO-DARPAN did not respond. Try again in a few minutes, or sign in with your username and password."
          action={
            <>
              {retry("Try Again")}
              {credentials}
            </>
          }
        />
      );

    case "expired":
      return (
        <AuthResult
          headingLevel={1}
          status="notice"
          icon="schedule"
          heading="Sign-In Request Expired"
          description="This sign-in request is no longer valid. It may have been started more than 10 minutes ago, or in another tab. Start again to continue."
          action={
            <>
              {retry("Sign In with NGO-DARPAN")}
              <AuthHelpLine href={DARPAN_ROUTES.login}>Back to Login</AuthHelpLine>
            </>
          }
        />
      );
  }
}

/* ── Registration, from the details NGO-DARPAN shared ──────────────────────── */

export function DarpanRegisterView(): React.JSX.Element {
  const { state: store } = useEAnudaan();
  const [profile, setProfile] = React.useState<DarpanProfile | null | undefined>(undefined);
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from session storage
    setProfile(readReceived(sessionStore()));
  }, []);

  const alreadyRegistered =
    profile != null && store.ngos.some((n) => normaliseDarpanId(n.darpanId) === normaliseDarpanId(profile.darpanId));

  let body: React.ReactNode;
  if (profile === undefined) {
    body = null;
  } else if (profile === null) {
    body = (
      <AuthResult
        headingLevel={1}
        status="notice"
        icon="domain_add"
        heading="Register Your Organisation"
        description="Registration on e-Anudaan uses the organisation's NGO-DARPAN details. Sign in with NGO-DARPAN to begin."
        action={
          <>
            <Button linkAs={Link} href={DARPAN_ROUTES.start} fullWidth>
              Sign In with NGO-DARPAN
            </Button>
            <AuthHelpLine href={DARPAN_ROUTES.login}>Back to Login</AuthHelpLine>
          </>
        }
      />
    );
  } else if (alreadyRegistered) {
    body = (
      <AuthResult
        headingLevel={1}
        status="notice"
        heading="Organisation Already Registered"
        description={`${profile.organisationName} already has an e-Anudaan account. Sign in with NGO-DARPAN to continue.`}
        action={
          <>
            <Button linkAs={Link} href={DARPAN_ROUTES.start} fullWidth>
              Sign In with NGO-DARPAN
            </Button>
            <AuthHelpLine href={DARPAN_ROUTES.login}>Back to Login</AuthHelpLine>
          </>
        }
      />
    );
  } else if (submitted) {
    body = (
      <AuthResult
        headingLevel={1}
        announce
        heading="Registration Request Submitted"
        description={`The registration request for ${profile.organisationName} has been received. The organisation can sign in with NGO-DARPAN once the request is approved.`}
        action={<AuthHelpLine href={DARPAN_ROUTES.login}>Back to Login</AuthHelpLine>}
      />
    );
  } else {
    body = (
      <AuthFormCard
        headingLevel={1}
        heading="Register Your Organisation"
        description="These details were shared by NGO-DARPAN. To correct any of them, update the registration on NGO-DARPAN first."
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        credentialFields={
          <DescriptionList items={profileItems(profile)} columns={1} layout="inline" size="sm" divided />
        }
        primaryAction={
          <Button type="submit" fullWidth>
            Submit Registration Request
          </Button>
        }
        footer={<AuthHelpLine href={DARPAN_ROUTES.login}>Back to Login</AuthHelpLine>}
      />
    );
  }

  return <EAnudaanAuthShell>{body}</EAnudaanAuthShell>;
}
