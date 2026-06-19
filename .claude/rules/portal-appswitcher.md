# Portal shell — AppSwitcher (MANDATORY)

Every portal and every app in the MoSJE estate (except hub home `/`) MUST render the SAMAVESH **AppSwitcher** FAB so users can jump between portals without going back to the hub.

## Rule

1. Every portal's root layout (`src/app/layout.tsx`) wraps the body in `<ColorModeProvider>` from `@mosje/design-system`.
2. `<AppSwitcher devMode={process.env.NODE_ENV === "development"} />` is rendered as the last child of `<ColorModeProvider>`, after all page content and providers.
3. The AppSwitcher must NOT be hidden on any portal page (it is hidden only on the hub root `/` via `ConditionalAppSwitcher`).
4. All portal packages already declare `"@mosje/design-system": "file:../../../packages/design-system"` — never add Tailwind config or CSS to toggle AppSwitcher visibility.

## Pattern (root layout template)

```tsx
// apps/portals/<slug>/src/app/layout.tsx
import { AppSwitcher, ColorModeProvider } from "@mosje/design-system";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ColorModeProvider>
          {/* all providers, toast, etc. */}
          {children}
          <AppSwitcher devMode={process.env.NODE_ENV === "development"} />
        </ColorModeProvider>
      </body>
    </html>
  );
}
```

## Status per portal

| Portal | AppSwitcher added? |
|--------|-------------------|
| `apps/dosje` (website) | ✅ Yes |
| `apps/hub` | ✅ Yes (hidden on `/` via ConditionalAppSwitcher) |
| `apps/portals/nmba` | ✅ Yes |
| `apps/portals/scw` | ✅ Yes |
| `apps/portals/smile-admin` | ❌ Pending |
| `apps/portals/pm-ajay` | ❌ Pending |

## Checklist when building a new portal

- [ ] `@mosje/design-system` is in `package.json` dependencies
- [ ] Root layout wraps body in `<ColorModeProvider>`
- [ ] `<AppSwitcher devMode={...} />` is the last child of `<ColorModeProvider>`
- [ ] Verify the FAB appears in the bottom-left on all pages after `npm run dev`
