# Portal login pages — demo credentials (MANDATORY)

Every login page in every portal MUST be reachable by demo credentials so
reviewers, stakeholders, and developers can test all roles without needing a
real account.

## Source of truth: the registry, not this file

**`packages/design-system/demo/demo-accounts.ts`** (`DEMO_ACCOUNTS`,
`findDemoAccounts`) is the source of truth for every demo credential in the
estate. The table further down this file is a **human-readable index** kept
in sync with it, nothing more — **when the two disagree, the registry wins.**
Never transcribe a "corrected" credential into this table without updating
the registry to match; do it the other way around.

This changed because presentation moved: credentials used to be declared
per-page (first as a local `DEMO_ACCOUNTS` const feeding `DemoFab`, mounted in
each portal's own layout). Now `DemoDock` is mounted **once**, in the hub's
root layout, above every page — see `.claude/rules/portal-appswitcher.md`.
Something mounted once above the whole tree cannot read a per-page prop, so
the accounts had to move into a registry the dock can query by pathname
instead. `findDemoAccounts(pathname)` does a longest-prefix match against
`DEMO_ACCOUNTS[].path`, so a nested login surface (e.g.
`/portals/nmba/treatment-centre`, a Project-Id + OTP flow) can win over a
broader one (`/portals/nmba`, mobile-number + password) that would otherwise
also match.

## Rule

1. Every login surface's credentials live in `DEMO_ACCOUNTS` in
   `packages/design-system/demo/demo-accounts.ts`, keyed by the hub-origin
   path prefix that reaches it (`path`), with an optional `idLabel` for
   portals that don't sign in by mobile number.
2. The login page itself owns **only** a `demo:fill` `CustomEvent` listener —
   no local accounts const, no mounted `DemoFab` or `DemoDock`. `DemoDock`'s
   **Sign in** tab (`DemoAccountsPanel`) dispatches `demo:fill` with
   `{ id, password, extra }` when a row's **Use** button is pressed; the
   listener sets the corresponding controlled fields and, if the form has
   role tabs, switches to the tab named in `extra.tab`.
3. Where a path has no entry in `DEMO_ACCOUNTS`, `findDemoAccounts` returns
   `null` and the dock's Sign in tab is **absent**, not shown empty — so a
   page with real credentials only (none, currently) simply isn't offered one.
4. Credentials use a consistent demo password where the portal allows it:
   **`Demo@123`**. Portals with their own auth stub carry whatever value that
   stub actually checks (see the table) — never invent a nicer-looking one.
5. Never invent an account. Transcribe it from the registry, or — for a login
   surface not yet in the registry — from the portal's own login page source,
   then add it to the registry so `DemoDock` can find it.

## Listener pattern (what a login page actually implements)

```tsx
React.useEffect(() => {
  const handler = (e: Event) => {
    const { id, password, extra } = (e as CustomEvent<DemoFillDetail>).detail;
    setMobile(id);
    setPassword(password);
    if (extra?.tab) setActiveTab(extra.tab as string);
  };
  window.addEventListener("demo:fill", handler);
  return () => window.removeEventListener("demo:fill", handler);
}, []);
```

## UI pattern — superseded

The `<details>` disclosure panel below described the pattern before `DemoFab`
and then `DemoDock` existed. No current login page renders one; keep reading
only for the shape a bespoke, non-hub page might still choose to hand-roll.

```tsx
<details className="group mt-4 rounded-lg border border-dashed border-navy/25 bg-surface-muted">
  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-xs font-semibold text-navy/60 hover:text-navy">
    <span>Demo credentials</span>
    <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
  </summary>
  <div className="border-t border-navy/10 px-4 pb-3 pt-2">
    <table className="w-full text-xs">
      <thead>
        <tr className="text-ink-hint">
          <th className="pb-1.5 text-left font-medium">Role</th>
          <th className="pb-1.5 text-left font-medium">Mobile / ID</th>
          <th className="pb-1.5 text-left font-medium">Password</th>
          <th className="pb-1.5" />
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {DEMO_ACCOUNTS.map(({ role, id, password, ...rest }) => (
          <tr key={id}>
            <td className="py-1.5 font-medium text-ink">{role}</td>
            <td className="py-1.5 font-mono text-ink">{id}</td>
            <td className="py-1.5 text-ink-muted">{password}</td>
            <td className="py-1.5 text-right">
              <button
                type="button"
                onClick={() => fill(id, password, rest)}
                className="rounded px-2 py-0.5 text-xs font-semibold text-navy hover:bg-navy/10"
              >
                Use
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</details>
```

## Portals and their demo accounts

| Portal | Role | Mobile / ID | Password |
|--------|------|-------------|----------|
| **NMBA** (portal login) | Admin | 9999999999 | Demo@123 (any works) |
| **NMBA** (portal login) | State Nodal Officer (Maharashtra) | 9890123456 | Demo@123 (any works) |
| **NMBA** (portal login) | District Nodal Officer (Maharashtra / Pune) | 9890001234 | Demo@123 (any works) |
| **SCW** | Volunteer (Citizen) | 9800000001 | Demo@123 |
| **SCW** | SAGE Organisation | 9800000002 | Demo@123 |
| **SCW** | Nodal Officer | 9810000001 | Demo@123 |
| **SMILE Admin** | Super Admin | 9000000900 | Password@123 |
| **SMILE Admin** | State Nodal Officer | 9000000901 | Password@123 |
| **SMILE Admin** | District Nodal Officer | 9000000902 | Password@123 |
| **NMBA — Mass Pledge** | Block Nodal Officer (Haveli, Pune, Maharashtra) | 9890005678 | Demo@123 |
| **NMBA — Mass Pledge** | Line Ministry (Ministry of Education) | 9810007001 | Demo@123 |
| **NMBA — Mass Pledge** | Spiritual Organisation (Brahma Kumaris) | 9810007002 | Demo@123 |
| **NMBA — Mass Pledge** | Higher Education Institution (Delhi University) | 9810007003 | Demo@123 |
| **NMBA — Mass Pledge** | GIA (Muktangan Rehabilitation Centre) | 9810007004 | Demo@123 |
| **NMBA — Mass Pledge** *(spare, can file)* | Block Nodal Officer (Maval, Pune, Maharashtra) | 9890005679 | Demo@123 |
| **NMBA — Mass Pledge** *(spare, can file)* | District Nodal Officer (Nashik, Maharashtra) | 9890001299 | Demo@123 |
| **NMBA — Mass Pledge** *(spare, can file)* | Line Ministry (Youth Affairs & Sports) | 9810007011 | Demo@123 |
| **NMBA — Mass Pledge** *(spare, can file)* | Spiritual Organisation (Ramakrishna Mission) | 9810007012 | Demo@123 |
| **NMBA — Mass Pledge** *(spare, can file)* | Higher Education Institution (BHU) | 9810007013 | Demo@123 |
| **NMBA — Mass Pledge** *(spare, can file)* | GIA (Navjeevan Rehabilitation Centre) | 9810007014 | Demo@123 |
| **PM-AJAY** | Joint Secretary | JS001 | Password@123 |
| **PM-AJAY** | District Secretary | DS002 | Password@123 |
| **PM-AJAY** | State Officer | SO003 | Password@123 |
| **PM-AJAY** | District Officer | DO005 | Password@123 |

The four sets below don't sign in by mobile number, so they're kept separate
rather than forced into the table above's "Mobile / ID" column.

| Portal | Role | ID | Password |
|--------|------|----|---------|
| **NMBA — Treatment Centre** (Project Id) | IRCA | IRCA001 | 123456 |
| **NMBA — Treatment Centre** (Project Id) | ODIC | ODIC001 | 123456 |
| **NMBA — Treatment Centre** (Project Id) | CPLI | CPLI001 | 123456 |
| **NMBA — Treatment Centre** (Project Id) | DDAC | DDAC001 | 123456 |
| **NMBA — Treatment Centre** (Project Id) | US | US001 | 123456 |
| **TG Admin** (Email) | Central Admin | central.admin@mosje.in | 123456 |
| **TG Admin** (Email) | Examining Officer | examining.officer@mosje.in | 123456 |
| **TG Admin** (Email) | Checker | checker@mosje.in | 123456 |
| **TG Admin** (Email) | District Magistrate | district.magistrate@mosje.in | 123456 |
| **TG Citizen** (Email) | Citizen (Applicant) | anshul@example.com | 123456 |
| **NHAPOA** (Username) | District Officer | ba.districtofficer | Demo@123 |
| **NHAPOA** (Username) | Station House Officer | so_govindnagar_kn | Demo@123 |
| **NHAPOA** (Username) | State Authority | ba.stateauthority | Demo@123 |
| **NHAPOA** (Username) | Finance Officer | ba.financeofficer | Demo@123 |
| **NHAPOA** (Username) | Central Authority | ba.centralauthority | Demo@123 |
| **NHAPOA** (Username) | System Administrator | nhapoa_sysadmin | Demo@123 |
| **NHAPOA** (Username) | Call Centre Operator | ankitSharma | Demo@123 |

> **NMBA — Treatment Centre** is a distinct login surface from the NMBA admin
> login above — a Project Id + OTP flow, not mobile number + password — so it
> gets its own entry in `DEMO_ACCOUNTS` (`path: "/portals/nmba/treatment-centre"`)
> that wins the longest-prefix match over the broader `/portals/nmba` entry.

> **NMBA Mass Pledge (18 August 2026)** is a flow inside the **existing** NMBA portal (no separate
> login/portal). The five documented reporting forms share one form component; the reporter's
> identity and which form they see are resolved from the login. The five accounts above are new;
> the existing Admin / State / District accounts are unchanged and also reach the flow. Block and
> organisation logins deliberately see **only** the Mass Pledge section in the sidebar — they have
> no NAPDDR committee jurisdiction. Admin oversees the rollup and cannot file a report.
> Note the reporting window: the form is gated to 18–25 August 2026 **in IST**, and a dev-only
> control on `/portals/nmba/admin/mass-pledge/new` switches between the before / open / closed states.
>
> **Why there are "spare" logins.** One report per account per event date (A9) is enforced on the
> authenticated account, not on the organisation name typed into the form — keying it on the name
> was exploitable, because an account that could pick a different name produced a different key
> every time and could file without limit. The consequence is that the seeded accounts above
> (which already own a submission) correctly refuse a second one, so the reporting form itself
> could not be demonstrated from them. The spares own no seeded submission and exist purely to
> demo the form. The Block spare sits in **Pune** deliberately: a report filed from it can be
> approved by the existing Pune DNO (9890001234) and then by the Maharashtra SNO (9890123456),
> demonstrating the full three-tier chain live rather than reading it off the seed data.

> **NMBA NAPDDR Three-Tier Committee** is a flow inside the **existing** NMBA portal (no separate login/portal). The single portal login (`/portals/nmba/admin/login`) resolves the role (Admin / State Nodal Officer / District Nodal Officer) from the mobile number and lands each in the sidebar's "NAPDDR Three-Tier Committee" flow, scoped to their state/district. Admin sees all; State officer sees/manages its state (State, District & Block committees); District officer sees/manages its district (District & Block committees). Reached via the shared `DemoDock`, mounted once in the hub root layout.

## Checklist when adding a new login page

- [ ] Login form uses controlled state (React `useState`) for all credential fields
- [ ] A `demo:fill` listener is wired (see the pattern above) — this is the
      whole integration; there is nothing else for the page to render
- [ ] The page's accounts are added to `DEMO_ACCOUNTS` in
      `packages/design-system/demo/demo-accounts.ts`, keyed by the page's
      hub-origin path prefix, **not** declared locally in the page
- [ ] If the form has role tabs, the listener switches to the tab named in
      `extra.tab` for accounts that need it (see SCW's accounts for the pattern)
- [ ] Demo password is `Demo@123` where the portal's stub accepts it — otherwise
      whatever value the stub actually checks, transcribed into the registry
- [ ] The table in this file is updated to match — a human-readable copy of
      the same accounts, kept only for a reviewer who doesn't want to open
      `demo-accounts.ts`
