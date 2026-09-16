import { defineConfig, globalIgnores } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/*
 * ESLint 10 removed the context methods deprecated in 9 — `context.getFilename()`
 * and its siblings. eslint-plugin-react (7.37.x, pulled in by eslint-config-next)
 * still calls them while detecting the React version, so every lint run threw
 * "contextOrFilename.getFilename is not a function" before checking a single file.
 *
 * `fixupPluginRules` is ESLint's own shim for exactly this: it hands each rule a
 * context that has the old methods back. It is applied to EVERY plugin in Next's
 * config, not only react, because a plugin that still works is left unchanged by
 * the wrapper, while one that breaks later would otherwise fail the same way.
 *
 * One wrapped copy per plugin object, reused everywhere that plugin appears:
 * ESLint refuses two different objects registered under the same plugin name.
 *
 * Remove this when eslint-plugin-react ships ESLint 10 support.
 */
const fixed = new Map();
const withFixedPlugins = (configs) =>
  configs.map((config) => {
    if (!config.plugins) return config;
    const plugins = {};
    for (const [name, plugin] of Object.entries(config.plugins)) {
      if (!fixed.has(plugin)) fixed.set(plugin, fixupPluginRules(plugin));
      plugins[name] = fixed.get(plugin);
    }
    return { ...config, plugins };
  });

const eslintConfig = defineConfig([
  ...withFixedPlugins(nextVitals),
  ...withFixedPlugins(nextTs),
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Storybook's compiled bundle, written here by the prebuild step so the hub
    // can serve it as static files. It is generated third-party output — linting
    // it produced ~11,900 problems and drowned the real ones.
    "public/storybook/**",
    // Standalone prototypes served as static files. Their scripts are loaded by
    // <script> tags, so every top-level declaration reads as unused to a linter
    // that expects modules — they are browser globals by design, not dead code.
    "public/prototypes/**",
  ]),
]);

export default eslintConfig;
