/** @type {import('stylelint').Config} */
module.exports = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    "scale-unlimited/declaration-strict-value": [
      ["/color/", "background-color", "fill", "stroke", "border-color"],
      {
        ignoreValues: ["currentColor", "transparent", "inherit", "none"],
        message:
          "SAMAVESH Design System: Hardcoded colors are blocked. You must use a semantic token (var(--ds-*)).",
      },
    ],
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
        ],
      },
    ],
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme"],
      },
    ],
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
  ignoreFiles: ["**/node_modules/**", "**/.next/**", "**/dist/**", "packages/tokens/tokens.css", "packages/design-system/tokens.css", "packages/design-system/ux4g.css"],
};
