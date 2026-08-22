# SAMAVESH Design System Architecture (For AI Agents & Developers)

> **Context:** This rule file governs how UI components are built and maintained across the `@mosje/design-system` package and downstream applications. It merges the best principles of Atomic Design (composability, reusability, separation of concerns) with the SAMAVESH functional token-driven architecture.

## 1. Core Principles (The "Atomic-Functional" Hybrid)
We do not use strict Atomic nomenclature (Atoms, Molecules, Organisms) in our folder structure because functional grouping (`actions`, `forms`, `data-display`) scales better for large enterprise systems. However, we *strictly* follow Atomic principles in how components are constructed:

- **Single Responsibility (Atoms):** Primitive components like `Button`, `Input`, and `Badge` must be extremely dumb. They accept props, read tokens, and emit events. They do not fetch data.
- **Slot-based Composability (Molecules/Organisms):** Never build "God Components" with dozens of configuration props (e.g., `<Card title="..." subtitle="..." footer="..." />`). Use a slot-based architecture using React children.
  - *Correct:* `<Card><CardHeader><CardTitle>...</CardTitle></CardHeader><CardContent>...</CardContent></Card>`
- **Headless UI Foundation:** Complex interactive components (`Select`, `Modal`, `Tabs`, `Combobox`) must separate accessibility logic from visual styling. Use robust headless primitives (like Radix UI) where possible, skinning them with SAMAVESH tokens. Do not hand-roll complex focus traps or ARIA state machines.

## 2. Token Strictness (The White-label Mandate)
SAMAVESH is a white-label government design system. A component must work flawlessly whether the portal uses the `blue`, `navy`, or custom `dbim-*` brand pack.
- **NEVER use raw hex codes, `rgb()`, or arbitrary colors** in CSS, Tailwind classes, or React styles.
- **ALWAYS use `--ds-*` semantic tokens.**
- Stylelint (`npm run lint:css`) actively enforces this and will block commits with hardcoded colors.
- Spacing and Typography must use the fluid scales (`--ds-spacing-*`, `--ds-type-*`).

## 3. Visual Regression & Quality Assurance
- **Playwright VRT:** Components and internal pages are verified using Playwright. When altering a core component, ensure you run the visual suite (`npm run test:e2e`) to catch unintended drifts across the estate.
- **Figma Code Connect:** We use `@figma/code-connect`. When building a new component that has a Figma counterpart, you MUST create a `.figma.ts` file in the component's directory to map the React props to the Figma component properties. This ensures the "Source of Truth" between Figma and Code remains unbroken.

## 4. Agent Instructions
When an AI agent (Claude, Antigravity, or other) is tasked with creating or modifying UI:
1. Check `INFORMATION-ARCHITECTURE.md` to find the correct functional group for the component.
2. Read the `tokens.css` or run token commands to find the precise semantic token needed.
3. Use composition (sub-components) rather than bloated prop interfaces.
4. Ensure the component passes `npm run lint:css`.
5. Ensure `Code Connect` mappings are updated if applicable.
