/** @type {import('stylelint').Config} */
module.exports = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    "scale-unlimited/declaration-strict-value": [
      ["/color/", "background-color", "fill", "stroke", "border-color"],
      {
        /**
         * The `/color/` matcher is a substring match, so it also catches two
         * properties that do not take a colour at all:
         *
         *   color-scheme: light        a KEYWORD declaring which schemes a page
         *                              supports. There is no token for it and
         *                              there should not be.
         *   color: CanvasText          a SYSTEM colour, the only correct value
         *                              inside forced-colors mode — the whole
         *                              point is to defer to the user's own
         *                              palette, which a token would override.
         *
         * Both were being silenced one line at a time with
         * `stylelint-disable-next-line`, which reads like a violation someone
         * gave up on rather than a value that is correct.
         */
        ignoreValues: [
          "currentColor",
          "transparent",
          "inherit",
          "none",
          "light",
          "dark",
          "light dark",
          "Canvas",
          "CanvasText",
          "LinkText",
          "ButtonText",
          /*
           * `ButtonText`'s own pair, and it was missing while `ButtonText` was
           * allowed — so the one control the system reserves these two keywords FOR
           * could name its ink and not its ground. In forced-colors mode a filled
           * button has to invert the pair to stay distinguishable from an outlined
           * one, because the colour that used to distinguish them no longer exists;
           * without `ButtonFace` there is no way to write that.
           */
          "ButtonFace",
          "Highlight",
          "HighlightText",
          /*
           * The system colour for de-emphasised content, and the only correct
           * value for a "this is absent / not yet" mark in forced-colors mode.
           * Without it the illustration language's `ghost` layer had to collapse
           * into `ink` — making the drawing that says "nothing has been reported"
           * identical to the one that says "here are your figures", for exactly
           * the readers that mode exists to serve.
           */
          "GrayText",
        ],
        message:
          "SAMAVESH Design System: Hardcoded colors are blocked. You must use a semantic token (var(--sa-*)).",
      },
    ],

    /**
     * OFF, deliberately — this rule is about SOURCE ORDER, not correctness.
     *
     * It fires when a low-specificity selector appears after a higher-specificity
     * one that could match the same element, on the theory that the author may
     * not have meant the later rule to lose. In a component library that is the
     * normal shape: a base rule, then `.is-selected`, then a container override.
     * Satisfying it means reordering rules by specificity rather than by what
     * the file is about, which makes stylesheets harder to read to silence a
     * warning that has never corresponded to a real defect here.
     *
     * It was 142 of the 387 real findings — the single largest reason this gate
     * was never run. Cascade correctness is governed by the LAYER contract in
     * .claude/rules/design-system-architecture.md §2a, which is a real rule with
     * a real failure mode, and by review.
     */
    /**
     * OFF, deliberately — this one is about FILE ORGANISATION, not correctness.
     *
     * It fires when a selector appears in two rules in the same file, on the
     * theory that they were meant to be one. In this library they are usually
     * two decisions with two explanations: `.ds-tabs--overflow` is written once
     * to hide the scrollbar and again to set scroll-snap, each under a comment
     * explaining why, including a WCAG 2.4.11 constraint. Merging them to
     * satisfy the rule would fuse two paragraphs of reasoning into one block.
     *
     * The genuinely dangerous version of this — the same CUSTOM PROPERTY
     * declared twice so one silently wins — is caught by
     * `declaration-block-no-duplicate-custom-properties`, which stays on and
     * which found a real defect in website.css during this pass.
     */
    "no-duplicate-selectors": null,

    "no-descending-specificity": null,

    /**
     * OFF, deliberately — the prefixed declarations here are load-bearing.
     *
     * `--fix` does not add a prefix, it DELETES one, so obeying this rule strips
     * `-webkit-mask-image` from the tab-overflow fades and `-webkit-` from the
     * scroll and font-smoothing declarations. Those are the fallback for older
     * Safari and for iOS, which is a large share of the citizens these portals
     * are built for. Autoprefixer is not in this pipeline, so nothing puts them
     * back.
     */
    "property-no-vendor-prefix": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "config",
          "theme",
          "plugin",
          // Tailwind v4. `@reference` pulls the theme into a CSS file that is
          // compiled outside the app's entry — required by any DS stylesheet
          // that uses `@apply`, and unknown to stylelint-config-standard.
          "reference",
          "source",
          "utility",
          "custom-variant",
        ],
      },
    ],
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme"],
      },
    ],
    /**
     * LONG, not the default short.
     *
     * The brand is documented in six digits everywhere it is written down —
     * CLAUDE.md, the token descriptions, the DBIM audit, the Figma variables:
     * `#0373DF` gov-blue, `#003366` navy, `#F97316` saffron, `#FFD323` yellow.
     * The default `short` rewrites `#003366` to `#036`, which is the same colour
     * and a different string, so grepping the documented value stops finding the
     * code that uses it. For a design system that is a real cost and there is no
     * benefit on the other side.
     */
    "color-hex-length": ["long"],

    "selector-class-pattern": null,
    "media-feature-range-notation": null,
    "declaration-block-single-line-max-declarations": null,
    "rule-empty-line-before": null,
    "at-rule-empty-line-before": null,
    "comment-empty-line-before": null,
    "declaration-empty-line-before": null,
    "custom-property-pattern": null,
    "import-notation": null,
    "value-keyword-case": null,
    "alpha-value-notation": null,
    "color-function-notation": null
  },
  /**
   * What stylelint is NOT allowed to look at.
   *
   * The two Storybook entries matter more than they look. `lint:css` globs
   * `**\/*.css`, which swept up Storybook's COMPILED bundles — minified CSS
   * emitted by Vite, checked in so /storybook can be served statically. Linting
   * a bundler's output is meaningless (it is not hand-written and cannot be
   * hand-fixed), and it accounted for 796 of the 1183 errors this config
   * reported: shortened hexes, unquoted attribute selectors and vendor prefixes
   * that Vite itself produced. That noise is why nobody ran the gate.
   *
   * Generated token files are excluded for the same reason: they come from
   * Style Dictionary, and the fix for anything wrong in them is in the
   * generator, never the output.
   */
  ignoreFiles: [
    "**/node_modules/**",
    "**/.next/**",
    "**/dist/**",
    "**/storybook-static/**",
    "apps/hub/public/storybook/**",
    "packages/tokens/tokens.css",
    "packages/design-system/tokens.css",
    "packages/design-system/ux4g.css",
    // A NEGATIVE fixture. It violates the token rules on purpose, to prove the
    // token-lint gate catches them; `--fix` cheerfully "corrected" it, which
    // would have quietly disarmed the test it exists to be.
    "packages/tokens/test/lint-fixture.css",
  ],
};
