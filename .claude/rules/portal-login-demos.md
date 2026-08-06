# Portal login pages — demo credentials (MANDATORY)

Every login page in every portal MUST include a **Demo Credentials** panel so reviewers, stakeholders, and developers can test all roles without needing real credentials.

## Rule

All portal login pages must render a collapsible `<details>` panel below the submit button that:

1. Lists every available demo role with mobile/ID, password, and a **Use** button.
2. The **Use** button fills the form fields (controlled state) and, if the form has role tabs, switches to the correct tab.
3. The panel is **closed by default** (`<details>` without `open`) so it doesn't distract logged-in users.
4. Credentials use a consistent demo password: **`Demo@123`** (or `any password` for mock-auth portals).

## UI pattern (copy-paste template)

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

> **NMBA NAPDDR Three-Tier Committee** is a flow inside the **existing** NMBA portal (no separate login/portal). The single portal login (`/portals/nmba/admin/login`) resolves the role (Admin / State Nodal Officer / District Nodal Officer) from the mobile number and lands each in the sidebar's "NAPDDR Three-Tier Committee" flow, scoped to their state/district. Admin sees all; State officer sees/manages its state (State, District & Block committees); District officer sees/manages its district (District & Block committees). Uses the shared `DemoFab`.

## Checklist when adding a new login page

- [ ] Login form uses controlled state (React `useState`) for all credential fields
- [ ] Demo panel (`<details>`) added below the submit button  
- [ ] Each role has a **Use** button that fills fields and switches tabs if needed
- [ ] Demo password is `Demo@123` (or note in the table if mock-auth accepts any)
- [ ] Panel is closed by default
