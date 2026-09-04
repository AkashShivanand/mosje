import { defineConfig } from "vitest/config";

/**
 * Vitest runs ONLY the React render specs (`*.spec.tsx`). Everything else in this package
 * is `node:test` (`*.test.ts`), run by `node --test`, which cannot strip JSX — so the two
 * runners split by extension rather than by directory.
 */
export default defineConfig({
  esbuild: { jsx: "automatic" },
  test: {
    include: ["components/**/*.spec.tsx"],
    environment: "node",
  },
});
