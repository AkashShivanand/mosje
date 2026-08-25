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
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    pkgDir("@storybook/addon-essentials"),
    pkgDir("@storybook/addon-a11y"),
    pkgDir("@storybook/addon-designs")
  ],
  /*
   * NAMED SUBDIRECTORIES, never the whole `hub/public`.
   *
   * The hub serves Storybook from `apps/hub/public/storybook`, so that is where
   * this build's `--output-dir` points. Copying `hub/public` wholesale therefore
   * asks Node to copy a directory INTO ITSELF, and `cp` refuses:
   *
   *   ERR_FS_CP_EINVAL: cannot copy .../apps/hub/public to a subdirectory of
   *   self .../apps/hub/public/storybook/
   *
   * That made the build unrunnable. It went unnoticed for a while because it was
   * masked twice over: locally by an uninstalled addon that failed earlier, and
   * in the hub's `prebuild` by its `|| echo '::warning::'` fallback — and CI,
   * which would have hit it on a clean `npm ci`, is blocked on billing.
   *
   * These two roots are the ones stories and design-system components actually
   * reference — the National Emblem, and the 144 portal logos the app switcher
   * and login shells draw. Narrowing also drops ~59 MB of `reports/` and
   * `website/` content out of the static build, none of which any story touches.
   *
   * ADDING AN ASSET ROOT MEANS ADDING A LINE HERE. That is the cost of not being
   * able to map the parent, and it is cheaper than an unbuildable Storybook.
   */
  staticDirs: [
    { from: "../../hub/public/images", to: "/images" },
    { from: "../../hub/public/portals", to: "/portals" },
  ],
  framework: { name: pkgDir("@storybook/react-vite"), options: {} },
  core: { disableTelemetry: true },
  docs: { autodocs: true },

  /**
   * Rollup strips `"use client"` when it bundles for the browser and warns once
   * per file. That is 62 lines of noise in every hub build, because the hub's
   * `prebuild` runs this build. The directive is not addressed to Storybook:
   * Next compiles the design system from source (`transpilePackages` in
   * `apps/hub/next.config.ts`) and honours it there, so nothing is lost here.
   *
   * Two codes, because Rollup emits two warnings per file: the directive itself,
   * and a SOURCEMAP_ERROR raised while it tries to locate that warning in the
   * original source. Counts match 1:1 (62 and 62), and the second is a byproduct
   * of the first, not a defect in the emitted sourcemaps.
   *
   * Both filters are scoped by code AND message. Everything else Rollup raises
   * still reaches the log, including the two genuine EVAL warnings this build
   * produces.
   */
  viteFinal: async (viteConfig) => {
    const build = (viteConfig.build ??= {});
    const rollup = (build.rollupOptions ??= {});
    const previous = rollup.onwarn;
    rollup.onwarn = (warning, defaultHandler) => {
      const isStrippedClientDirective =
        warning.code === "MODULE_LEVEL_DIRECTIVE" &&
        warning.message.includes('"use client"');
      const isDirectiveSourcemapNoise =
        warning.code === "SOURCEMAP_ERROR" &&
        warning.message.includes("Can't resolve original location of error");
      if (isStrippedClientDirective || isDirectiveSourcemapNoise) {
        return;
      }
      if (previous) previous(warning, defaultHandler);
      else defaultHandler(warning);
    };
    return viteConfig;
  },
};

export default config;
