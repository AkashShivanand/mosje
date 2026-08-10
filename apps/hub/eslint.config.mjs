import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Storybook's compiled bundle, written here by the prebuild step so the hub
    // can serve it as static files. It is generated third-party output — linting
    // it produced ~11,900 problems and drowned the real ones.
    "public/storybook/**",
  ]),
]);

export default eslintConfig;
