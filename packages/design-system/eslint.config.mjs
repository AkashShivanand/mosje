/**
 * THE PACKAGE HAD NO ESLINT CONFIG AT ALL.
 *
 * `npm run lint` resolves to `lint:hub`, and `apps/hub/eslint.config.mjs` scopes
 * to the hub — so 117 component files and ~29,700 lines have never been linted.
 * No `react-hooks/exhaustive-deps`, in a package with 88 `"use client"` files
 * full of effects. No `jsx-a11y`, on a government design system whose entire
 * value proposition is WCAG 2.2 AA. CI ran `npm run lint` and inspected zero
 * lines of it.
 *
 * Started at the two rule sets that would have caught the defects this estate
 * has actually shipped — a stale effect dependency and an ARIA attribute on an
 * element that cannot carry one (`aria-label` on a roleless `<div>`, which axe
 * found in `VisitorCounter` the day it first ran).
 */
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  { ignores: ["**/*.figma.ts", "dist/**", "node_modules/**", "tokens.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
    {
    // Build-time generators are Node scripts, not browser code. Without this the
    // shared browser globals block below leaves `process` and `console` undefined
    // in them — which is a config gap, not a defect in the script.
    files: ["**/*.mjs"],
    languageOptions: {
      globals: { process: "readonly", console: "readonly", URL: "readonly", Buffer: "readonly" },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      /*
       * A NO-OP `@next/next`, declared so fifteen inline
       * `eslint-disable @next/next/no-img-element` comments in this package
       * RESOLVE instead of reporting "definition for rule was not found".
       *
       * They are there because the estate's `<img>` policy is written for the
       * hub. This package imports nothing from `next/*` — that decoupling is
       * deliberate and is one of the few things an architecture audit found
       * nothing to fault — so the rule cannot apply here, and the directives
       * are correct to exist for whoever lints these files WITH Next's config.
       * Declaring it off is how both stay true.
       */
      "@next/next": { rules: { "no-img-element": { create: () => ({}) } } },
    },
    languageOptions: {
      globals: { window: "readonly", document: "readonly", console: "readonly", setTimeout: "readonly", clearTimeout: "readonly", setInterval: "readonly", clearInterval: "readonly", requestAnimationFrame: "readonly", cancelAnimationFrame: "readonly", navigator: "readonly", localStorage: "readonly", HTMLElement: "readonly", SVGSVGElement: "readonly", HTMLInputElement: "readonly", HTMLDivElement: "readonly", MutationObserver: "readonly", ResizeObserver: "readonly", IntersectionObserver: "readonly", getComputedStyle: "readonly", CustomEvent: "readonly", Event: "readonly", KeyboardEvent: "readonly", fetch: "readonly", URL: "readonly", Blob: "readonly", File: "readonly", FileReader: "readonly", Image: "readonly", performance: "readonly", crypto: "readonly", process: "readonly" },
    },
    rules: {
      /*
       * Every rule is NAMED rather than spread from `configs.recommended.rules`,
       * because that set is not stable across the plugin's majors and this config
       * had no way to notice when it changed. It changed on the v5 → v7 bump:
       * `recommended` silently picked up the React Compiler rules and put 54
       * findings into a gate that had 2. Naming them means the next major cannot
       * add or drop enforcement here without someone editing this list.
       *
       * This IS v7's full `recommended` set, transcribed. The compiler rules were
       * adopted deliberately and their 54 findings fixed; see the commit that did
       * it for what each class of finding turned out to be.
       */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // React Compiler rules — the compiler assumes these hold, so a violation
      // is a correctness risk once it is switched on, not a style preference.
      "react-hooks/config": "error",
      "react-hooks/error-boundaries": "error",
      "react-hooks/gating": "error",
      "react-hooks/globals": "error",
      "react-hooks/immutability": "error",
      "react-hooks/incompatible-library": "warn",
      "react-hooks/preserve-manual-memoization": "error",
      "react-hooks/purity": "error",
      "react-hooks/refs": "error",
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/set-state-in-render": "error",
      "react-hooks/static-components": "error",
      "react-hooks/unsupported-syntax": "warn",
      "react-hooks/use-memo": "error",
      ...jsxA11y.flatConfigs.recommended.rules,
      // The package is strict TypeScript; `any` is already absent and the type
      // checker is the authority on types. These would only add noise.
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "off",
      /*
       * Inherited from the hub's config, and wrong here: this package is
       * framework-agnostic by design and imports nothing from `next/*` — that
       * decoupling is one of the few things an architecture audit found nothing
       * to fault. Judging it by `next/image` would force a dependency the
       * package deliberately does not have.
       */
      "@next/next/no-img-element": "off",
    },
  },
);
