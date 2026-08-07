import { createRequire } from "node:module";
import path from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

/**
 * npm nests @storybook/react-vite under apps/storybook rather than hoisting it,
 * while the CLI that loads presets lives in the ROOT node_modules. From there
 * the bare specifier "@storybook/react-vite" does not resolve and the build
 * dies with CriticalPresetLoadError.
 *
 * Resolving from this file finds the nested copy. It has to be the package
 * DIRECTORY, not the entry file: Storybook appends "/preset" to the name, so
 * a file path yields ".../dist/index.js/preset", which does not exist.
 */
const require_ = createRequire(import.meta.url);
const pkgDir = (id: string) => path.dirname(require_.resolve(`${id}/package.json`));

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: [pkgDir("@storybook/addon-essentials"), pkgDir("@storybook/addon-a11y")],
  framework: { name: pkgDir("@storybook/react-vite"), options: {} },
  core: { disableTelemetry: true },
};

export default config;
