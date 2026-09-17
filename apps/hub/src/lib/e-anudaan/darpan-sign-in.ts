/**
 * Sign in with NGO-DARPAN — the relying-party half of a redirect sign-in, and the stand-in for
 * the provider's half.
 *
 * The shape is the authorization-code flow every government identity provider on the estate
 * uses (DigiLocker, Parichay, e-Pramaan):
 *
 *   1. e-Anudaan records a request — a random `state` and the moment it began — and sends the
 *      applicant to the provider with it.
 *   2. The provider signs the applicant in and asks their consent to share named attributes.
 *   3. It sends them back to e-Anudaan with `?code=…&state=…`, or `?error=…&state=…`.
 *   4. e-Anudaan checks `state` against the request it recorded, exchanges the code for the
 *      organisation's attributes, and decides what the return means for this applicant.
 *
 * Step 4 is `resolveDarpanReturn`, and it is pure so every return state is testable without a
 * browser. **Nothing here talks to NGO-DARPAN.** The provider is simulated by
 * `/portals/e-anudaan/login/darpan` and by `exchangeDarpanCode` below; replacing those two with the
 * real endpoints is the whole of the integration work, and nothing else in the flow changes.
 *
 * Every organisation, identifier, name and contact detail in this file is fictional, except the
 * registered demo organisation, which is derived from the portal's own seeded NGO so that signing
 * in lands on the same organisation the rest of the prototype shows.
 */

/* ── Storage keys ──────────────────────────────────────────────────────────── */

/** sessionStorage — the pending request. Tab-scoped, as a sign-in in progress should be. */
export const DARPAN_REQUEST_KEY = "e-anudaan.darpan.request.v1";
/** localStorage — DARPAN IDs already linked to an e-Anudaan account on this device's prototype. */
export const DARPAN_LINKS_KEY = "e-anudaan.darpan.links.v1";
/** sessionStorage — which organisation and condition the provider stand-in simulates. */
export const DARPAN_SIMULATION_KEY = "e-anudaan.darpan.simulation.v1";
/** sessionStorage — the attributes received on the last return, for confirmation and registration. */
export const DARPAN_RECEIVED_KEY = "e-anudaan.darpan.received.v1";

/** How long a request stays valid. A provider's own session outlives this; ours should not. */
export const DARPAN_REQUEST_TTL_MS = 10 * 60 * 1000;

/* ── Routes ────────────────────────────────────────────────────────────────── */

const BASE = "/portals/e-anudaan";
export const DARPAN_ROUTES = {
  login: `${BASE}/login?role=ngo`,
  /** Records the request, then redirects to the provider. The card on the login page links here. */
  start: `${BASE}/login/darpan-start`,
  /** The provider stand-in — consent. */
  provider: `${BASE}/login/darpan`,
  /** Where the provider sends the applicant back. */
  callback: `${BASE}/login/darpan-return`,
  register: `${BASE}/register`,
} as const;

/** Any route in this flow, for the demo dock's tab. */
export function isDarpanDemoRoute(pathname: string | null): boolean {
  const p = pathname ?? "";
  return p === `${BASE}/login` || p.startsWith(`${BASE}/login/`) || p === DARPAN_ROUTES.register;
}

/* ── The attributes ────────────────────────────────────────────────────────── */

export type DarpanStatus = "Active" | "Inactive" | "Suspended";

/** What NGO-DARPAN holds about an organisation, as far as e-Anudaan asks for it. */
export interface DarpanProfile {
  darpanId: string;
  organisationName: string;
  registrationNo: string;
  registeredAddress: string;
  /** Whether a PAN is on record. The number itself is not requested. */
  panOnRecord: boolean;
  authorisedPerson: string;
  mobile: string;
  email: string;
  status: DarpanStatus;
}

export type DarpanAttributeKey =
  | "organisationName"
  | "darpanId"
  | "registrationNo"
  | "registeredAddress"
  | "panOnRecord"
  | "authorisedPerson"
  | "contact";

/**
 * The attributes e-Anudaan asks for, in the order the consent screen and the confirmation list
 * them. One list, so the two screens cannot disagree about what was shared.
 */
export const DARPAN_ATTRIBUTES: readonly { key: DarpanAttributeKey; label: string }[] = [
  { key: "organisationName", label: "Organisation Name" },
  { key: "darpanId", label: "NGO-DARPAN Unique ID" },
  { key: "registrationNo", label: "Registration Number" },
  { key: "registeredAddress", label: "Registered Address" },
  { key: "panOnRecord", label: "PAN on Record" },
  { key: "authorisedPerson", label: "Authorised Person" },
  { key: "contact", label: "Mobile Number and Email Address" },
];

/** `9441747200` → `+91 94417 •••00`. The consent screen shows the destination, not the number. */
export function maskMobile(mobile: string): string {
  const d = mobile.replace(/\D/g, "").slice(-10);
  if (d.length !== 10) return mobile;
  return `+91 ${d.slice(0, 5)} •••${d.slice(8)}`;
}

/** `sankalp@gmail.com` → `s•••••p@gmail.com`. */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0]}•@${domain}`;
  return `${local[0]}${"•".repeat(Math.min(local.length - 2, 5))}${local[local.length - 1]}@${domain}`;
}

/** Display value of one attribute. */
export function attributeValue(profile: DarpanProfile, key: DarpanAttributeKey): string {
  switch (key) {
    case "panOnRecord":
      return profile.panOnRecord ? "Yes" : "No";
    case "contact":
      return `${maskMobile(profile.mobile)} · ${maskEmail(profile.email)}`;
    default:
      return profile[key];
  }
}

/* ── The provider stand-in ─────────────────────────────────────────────────── */

/**
 * The organisations the stand-in can sign in as. `registered` is e-Anudaan's own demo NGO; the
 * other three are fictional organisations that exist only on the simulated NGO-DARPAN.
 */
export type DarpanAccount = "registered" | "unregistered" | "inactive" | "suspended";

/** Which organisation the stand-in signs in as. */
export interface DarpanSimulation {
  account: DarpanAccount;
}

export const DEFAULT_SIMULATION: DarpanSimulation = { account: "registered" };

/** The seeded NGO fields the registered organisation is derived from. */
export interface SeededNgo {
  id: string;
  name: string;
  darpanId: string;
  registrationNo: string;
  district: string;
  state: string;
  secretary?: string;
  mobile?: string;
  email?: string;
}

export function darpanDirectory(demoNgo: SeededNgo | undefined): Record<DarpanAccount, DarpanProfile> {
  return {
    registered: {
      darpanId: demoNgo?.darpanId ?? "MH/2016/100000",
      organisationName: demoNgo?.name ?? "Sankalp Seva Sansthan",
      registrationNo: demoNgo?.registrationNo ?? "81-51",
      registeredAddress: `14 Shivaji Nagar, ${demoNgo?.district ?? "Pune"}, ${demoNgo?.state ?? "Maharashtra"} 411005`,
      panOnRecord: true,
      authorisedPerson: `${demoNgo?.secretary ?? "Meenakshi Iyer"}, Secretary`,
      mobile: demoNgo?.mobile ?? "9441747200",
      email: demoNgo?.email ?? "sankalpsevasansthan@gmail.com",
      status: "Active",
    },
    unregistered: {
      darpanId: "RJ/2019/0241876",
      organisationName: "Nav Chetna Welfare Society",
      registrationNo: "COOP/2019/JPR/4412",
      registeredAddress: "22 Gopalpura Bypass, Jaipur, Rajasthan 302018",
      panOnRecord: true,
      authorisedPerson: "Ritu Sharma, President",
      mobile: "9828014410",
      email: "navchetnawelfare@gmail.com",
      status: "Active",
    },
    inactive: {
      darpanId: "BR/2014/0098312",
      organisationName: "Gramin Utthan Samiti",
      registrationNo: "S/PAT/1187/2014",
      registeredAddress: "Ward 7, Danapur, Patna, Bihar 801503",
      panOnRecord: false,
      authorisedPerson: "Anil Kumar Yadav, Secretary",
      mobile: "9431022871",
      email: "graminutthan.patna@gmail.com",
      status: "Inactive",
    },
    suspended: {
      darpanId: "KA/2012/0063457",
      organisationName: "Jeevan Jyoti Seva Trust",
      registrationNo: "BLR-IV-00219-2012",
      registeredAddress: "3rd Cross, Vijayanagar, Mysuru, Karnataka 570017",
      panOnRecord: true,
      authorisedPerson: "S. Lakshmi Narayan, Managing Trustee",
      mobile: "9845033126",
      email: "jeevanjyoti.mysuru@gmail.com",
      status: "Suspended",
    },
  };
}

const CODE_PREFIX = "sim.";

/** The authorization code the stand-in issues for an organisation. */
export function simulatedCode(account: DarpanAccount): string {
  return `${CODE_PREFIX}${account}`;
}

/**
 * The token exchange. A code the provider did not issue answers `null`; the real exchange is a
 * server-to-server call, and it is where "the provider is down" would also surface.
 */
export function exchangeDarpanCode(
  code: string,
  directory: Record<DarpanAccount, DarpanProfile>,
): DarpanProfile | null {
  if (!code.startsWith(CODE_PREFIX)) return null;
  const account = code.slice(CODE_PREFIX.length) as DarpanAccount;
  return Object.hasOwn(directory, account) ? directory[account] : null;
}

/* ── The request ───────────────────────────────────────────────────────────── */

export interface DarpanRequest {
  state: string;
  startedAt: number;
}

export function authorizeUrl(state: string): string {
  const q = new URLSearchParams({
    client_id: "e-anudaan",
    response_type: "code",
    redirect_uri: DARPAN_ROUTES.callback,
    scope: DARPAN_ATTRIBUTES.map((a) => a.key).join(" "),
    state,
  });
  return `${DARPAN_ROUTES.provider}?${q.toString()}`;
}

/** Where the provider sends the applicant back. Exactly one of `code` or `error`. */
export function callbackUrl(
  state: string,
  answer: { code: string } | { error: "access_denied" | "temporarily_unavailable" },
): string {
  const q = new URLSearchParams("code" in answer ? { code: answer.code, state } : { error: answer.error, state });
  return `${DARPAN_ROUTES.callback}?${q.toString()}`;
}

/* ── The return ────────────────────────────────────────────────────────────── */

export type DarpanReturn =
  /** Already linked — straight in. */
  | { kind: "linked"; profile: DarpanProfile; ngoId: string }
  /** Registered on e-Anudaan under this DARPAN ID, never signed in with it — confirm, then link. */
  | { kind: "first-link"; profile: DarpanProfile; ngoId: string }
  /** No e-Anudaan account holds this DARPAN ID — register. */
  | { kind: "not-registered"; profile: DarpanProfile }
  /** The DARPAN registration is not active — nothing to do here until it is. */
  | { kind: "inactive"; profile: DarpanProfile; status: Exclude<DarpanStatus, "Active"> }
  /** The applicant declined to share, or cancelled at the provider. */
  | { kind: "refused" }
  /** The provider answered with an error, or did not answer usefully. */
  | { kind: "unavailable" }
  /** No matching request: stale, already used, or not started here. */
  | { kind: "expired" };

export type DarpanReturnKind = DarpanReturn["kind"];

export interface DarpanReturnInput {
  params: { code?: string | null; state?: string | null; error?: string | null };
  pending: DarpanRequest | null;
  now: number;
  exchange: (code: string) => DarpanProfile | null;
  ngos: readonly { id: string; darpanId: string }[];
  linkedDarpanIds: readonly string[];
}

/** DARPAN IDs are compared the way the registry writes them — case and spacing aside. */
export function normaliseDarpanId(id: string): string {
  return id.replace(/\s+/g, "").toUpperCase();
}

/**
 * What a return from NGO-DARPAN means. The order is the security order:
 *
 *   1. `state` must match a request this tab made, and the request must be fresh — checked
 *      BEFORE anything the URL says is believed, errors included, so a forged link cannot put
 *      a reader on any screen but "start again".
 *   2. An `error` is the provider's answer; `access_denied` is the applicant's own decision.
 *   3. Only then is the code exchanged, and only a profile the exchange returns is trusted.
 *   4. An inactive registration stops the sign-in before any account is looked up.
 */
export function resolveDarpanReturn({
  params,
  pending,
  now,
  exchange,
  ngos,
  linkedDarpanIds,
}: DarpanReturnInput): DarpanReturn {
  if (!pending || !params.state || params.state !== pending.state) return { kind: "expired" };
  if (now - pending.startedAt > DARPAN_REQUEST_TTL_MS || now < pending.startedAt) return { kind: "expired" };

  if (params.error) return params.error === "access_denied" ? { kind: "refused" } : { kind: "unavailable" };
  if (!params.code) return { kind: "unavailable" };

  const profile = exchange(params.code);
  if (!profile) return { kind: "expired" };

  if (profile.status !== "Active") return { kind: "inactive", profile, status: profile.status };

  const id = normaliseDarpanId(profile.darpanId);
  const ngo = ngos.find((n) => normaliseDarpanId(n.darpanId) === id);
  if (!ngo) return { kind: "not-registered", profile };

  return linkedDarpanIds.some((l) => normaliseDarpanId(l) === id)
    ? { kind: "linked", profile, ngoId: ngo.id }
    : { kind: "first-link", profile, ngoId: ngo.id };
}

/* ── Storage helpers, tolerant of a blocked or corrupt store ───────────────── */

type KV = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function readJson<T>(store: KV | null, key: string): T | null {
  try {
    const raw = store?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(store: KV | null, key: string, value: unknown): void {
  try {
    store?.setItem(key, JSON.stringify(value));
  } catch {
    /* A blocked store degrades to "start again", which is a designed state. */
  }
}

function remove(store: KV | null, key: string): void {
  try {
    store?.removeItem(key);
  } catch {
    /* as above */
  }
}

export function beginRequest(session: KV | null, state: string, now: number): DarpanRequest {
  const req = { state, startedAt: now };
  writeJson(session, DARPAN_REQUEST_KEY, req);
  return req;
}

export function readRequest(session: KV | null): DarpanRequest | null {
  const r = readJson<DarpanRequest>(session, DARPAN_REQUEST_KEY);
  return r && typeof r.state === "string" && typeof r.startedAt === "number" ? r : null;
}

/** A request is used once. */
export function clearRequest(session: KV | null): void {
  remove(session, DARPAN_REQUEST_KEY);
}

export function readLinks(local: KV | null): string[] {
  const l = readJson<unknown>(local, DARPAN_LINKS_KEY);
  // Never written means the prototype's first run: the demo NGO starts linked, so the ordinary
  // sign-in is the one a reviewer meets first.
  if (l === null) return [darpanDirectory(undefined).registered.darpanId];
  return Array.isArray(l) ? l.filter((x): x is string => typeof x === "string") : [];
}

export function writeLinks(local: KV | null, ids: readonly string[]): void {
  writeJson(local, DARPAN_LINKS_KEY, [...new Set(ids)]);
}

export function readSimulation(session: KV | null): DarpanSimulation {
  const s = readJson<DarpanSimulation>(session, DARPAN_SIMULATION_KEY);
  return s && typeof s.account === "string" ? s : DEFAULT_SIMULATION;
}

export function writeSimulation(session: KV | null, sim: DarpanSimulation): void {
  writeJson(session, DARPAN_SIMULATION_KEY, sim);
}

export function readReceived(session: KV | null): DarpanProfile | null {
  return readJson<DarpanProfile>(session, DARPAN_RECEIVED_KEY);
}

export function writeReceived(session: KV | null, profile: DarpanProfile | null): void {
  if (profile) writeJson(session, DARPAN_RECEIVED_KEY, profile);
  else remove(session, DARPAN_RECEIVED_KEY);
}

/** A `state` value. `crypto.randomUUID` where it exists; the fallback is for old test runners. */
export function newState(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/* ── The demo dock's scenarios ─────────────────────────────────────────────── */

export type DarpanDemoScenario =
  | "consent"
  | "linked"
  | "first-link"
  | "not-registered"
  | "inactive"
  | "suspended"
  | "refused"
  | "unavailable"
  | "expired";

export interface DarpanDemoPlan {
  simulation: DarpanSimulation;
  /** What to do to the registered organisation's link before going. */
  link: "set" | "clear" | "keep";
  /** Where to go: the provider's consent screen, or straight back with this answer. */
  go:
    | { to: "provider" }
    | { to: "callback"; answer: { code: string } | { error: "access_denied" | "temporarily_unavailable" } }
    | { to: "callback-without-request" };
}

export const DARPAN_DEMO_SCENARIOS: readonly { id: DarpanDemoScenario; label: string; effect: string }[] = [
  { id: "consent", label: "Consent Screen", effect: "Opens the NGO-DARPAN stand-in as the registered organisation." },
  { id: "linked", label: "Already Linked", effect: "Returns signed in, straight to the dashboard." },
  { id: "first-link", label: "First Sign-In", effect: "Returns to confirm the details and link the account." },
  { id: "not-registered", label: "Not Registered on e-Anudaan", effect: "Returns with an organisation e-Anudaan does not hold." },
  { id: "inactive", label: "Registration Inactive", effect: "Returns with an inactive NGO-DARPAN registration." },
  { id: "suspended", label: "Registration Suspended", effect: "Returns with a suspended NGO-DARPAN registration." },
  { id: "refused", label: "Consent Refused", effect: "Returns as if the applicant chose Cancel." },
  { id: "unavailable", label: "NGO-DARPAN Unavailable", effect: "Returns with a provider error. Try Again then succeeds." },
  { id: "expired", label: "Request Expired", effect: "Returns with no matching request, as after a stale link." },
];

export function planDemoScenario(id: DarpanDemoScenario): DarpanDemoPlan {
  switch (id) {
    case "consent":
      return { simulation: DEFAULT_SIMULATION, link: "keep", go: { to: "provider" } };
    case "linked":
      return { simulation: DEFAULT_SIMULATION, link: "set", go: { to: "callback", answer: { code: simulatedCode("registered") } } };
    case "first-link":
      return { simulation: DEFAULT_SIMULATION, link: "clear", go: { to: "callback", answer: { code: simulatedCode("registered") } } };
    case "not-registered":
      return { simulation: { account: "unregistered" }, link: "keep", go: { to: "callback", answer: { code: simulatedCode("unregistered") } } };
    case "inactive":
      return { simulation: { account: "inactive" }, link: "keep", go: { to: "callback", answer: { code: simulatedCode("inactive") } } };
    case "suspended":
      return { simulation: { account: "suspended" }, link: "keep", go: { to: "callback", answer: { code: simulatedCode("suspended") } } };
    case "refused":
      return { simulation: DEFAULT_SIMULATION, link: "keep", go: { to: "callback", answer: { error: "access_denied" } } };
    case "unavailable":
      return { simulation: DEFAULT_SIMULATION, link: "keep", go: { to: "callback", answer: { error: "temporarily_unavailable" } } };
    case "expired":
      return { simulation: DEFAULT_SIMULATION, link: "keep", go: { to: "callback-without-request" } };
  }
}
