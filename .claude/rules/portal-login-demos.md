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
| **NMBA** (admin login) | Admin | 9999999999 | Demo@123 (any works) |
| **SCW** | Volunteer (Citizen) | 9800000001 | Demo@123 |
| **SCW** | SAGE Organisation | 9800000002 | Demo@123 |
| **SCW** | Nodal Officer | 9810000001 | Demo@123 |
| **SMILE Admin** | Super Admin | 9000000900 | Password@123 |
| **SMILE Admin** | State Nodal Officer | 9000000901 | Password@123 |
| **SMILE Admin** | District Nodal Officer | 9000000902 | Password@123 |
| **PM-AJAY** | Joint Secretary | JS001 | Password@123 |
| **PM-AJAY** | District Secretary | DS002 | Password@123 |
| **PM-AJAY** | State Officer | SO003 | Password@123 |
| **PM-AJAY** | District Officer | DO005 | Password@123 |

## Checklist when adding a new login page

- [ ] Login form uses controlled state (React `useState`) for all credential fields
- [ ] Demo panel (`<details>`) added below the submit button  
- [ ] Each role has a **Use** button that fills fields and switches tabs if needed
- [ ] Demo password is `Demo@123` (or note in the table if mock-auth accepts any)
- [ ] Panel is closed by default
