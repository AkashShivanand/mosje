import { expect, test } from "@playwright/test";

/**
 * Pins for the three defects the 2026-08-25 Button audit measured, plus the one it
 * got wrong.
 *
 * Every assertion here was watched to FAIL against the unfixed component before the
 * fix landed — `.claude/rules` says a check nobody has seen fail is not a check, and
 * this estate has been bitten by that four separate times.
 *
 * The audit is `docs/design-system/components/button-audit.md`; the remediation brief
 * is `button-cleanup-prompt.md`. Two of its three P0s are pinned below. The third
 * (P0-3, "five WCAG 1.4.11 non-text-contrast failures") is pinned in
 * `packages/tokens/test/action-nontext-contrast.test.mjs` instead, because it is a
 * property of the token values and needs no browser — and because measuring it showed
 * the audit had counted one failure that the code does not render. See that file.
 */

const PAGE = "/design-system/components/actions/button";

/**
 * The docs page is tabbed, and every panel is in the DOM with `hidden` on the
 * inactive ones. A locator therefore RESOLVES inside a closed tab but reports
 * `hidden`, which reads like a missing element and is not one. Activate the tab
 * that owns the specimen before asserting anything about it.
 */
async function openTab(page: import("@playwright/test").Page, name: string) {
  await page.goto(PAGE);
  await page.getByRole("tab", { name, exact: true }).click();
  await expect(page.getByRole("tab", { name, exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
}

test.describe("Button — audited defects", () => {

  /**
   * P0-1. `<Button href disabled>` used to emit `<a disabled>`. `disabled` is not a
   * valid attribute on an anchor, so the browser ignored it completely: the control
   * stayed focusable, clickable and opaque, and matched none of the CSS disabled rules.
   * Measured on 2026-08-25 as pointer-events:auto, opacity:1, cursor:pointer,
   * aria-disabled:null, keyboard-focusable:true.
   *
   * The fix drops `href` rather than swallowing events. An anchor without `href` is
   * not focusable and not activatable by the browser's own rules, so there is no
   * handler to get wrong and no tabIndex to maintain.
   */
  test("a disabled link-button is inert, not merely styled as inert", async ({ page }) => {
    await openTab(page, "Meta");
    const link = page.getByTestId("btn-disabled-link");
    await expect(link).toBeVisible();

    // It is still an anchor — the semantics of the control do not change.
    await expect(link).toHaveJSProperty("tagName", "A");

    // ...but it carries no href, which is what makes it genuinely inert.
    await expect(link).not.toHaveAttribute("href", /.*/);

    // State is exposed to assistive tech, since there is no native disabled to read.
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).toHaveAttribute("role", "link");

    // The CSS disabled block matches [aria-disabled="true"], so it renders as disabled.
    await expect(link).toHaveCSS("cursor", "not-allowed");
    expect(Number(await link.evaluate((el) => getComputedStyle(el).opacity))).toBeLessThan(1);

    // And it is out of the keyboard path. Focus is asserted, never assumed.
    const focusable = await link.evaluate((el) => {
      (el as HTMLElement).focus();
      return document.activeElement === el;
    });
    expect(focusable).toBe(false);
  });

  /**
   * P0-2, WCAG 1.4.4 Resize Text (AA). The sizes set a hard `height`, so the box could
   * not grow when the user scaled text. Measured at 200%: an `md` button held 40px
   * while its content needed 41, clipping the label against a 38px client box.
   *
   * 200% is the criterion's own threshold, so that is what this drives — not a
   * comfortable 120%.
   */
  test("labels are not clipped when text is scaled to 200%", async ({ page }) => {
    await openTab(page, "Design");
    await page.addStyleTag({ content: "html { font-size: 32px !important; }" });

    const buttons = page.locator('[role="tabpanel"]:not([hidden]) .ds-btn');
    const count = await buttons.count();
    // Enough to prove the panel is really rendering the specimen, not so many that
    // adding or removing one demo breaks the pin.
    expect(count).toBeGreaterThanOrEqual(3);

    const clipped = await buttons.evaluateAll((els) =>
      els
        .filter((el) => el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth)
        .map((el) => ({
          label: (el.textContent || "").trim().slice(0, 40),
          cls: el.className,
          scrollH: el.scrollHeight,
          clientH: el.clientHeight,
        })),
    );

    expect(clipped, `clipped at 200% text:\n${JSON.stringify(clipped, null, 2)}`).toEqual([]);
  });

  /**
   * The same criterion from the other direction: the size ladder must still be a
   * ladder at 100%. A `min-height` fix that let every button collapse to its content
   * would satisfy the test above and destroy the sizes, so both halves are pinned.
   */
  test("the size ladder still measures 32 / 40 / 48 at 100% text", async ({ page }) => {
    await openTab(page, "Design");
    for (const [cls, expected] of [
      ["ds-btn--sm", 32],
      ["ds-btn--md", 40],
      ["ds-btn--lg", 48],
    ] as const) {
      const box = await page
        .locator(`[role="tabpanel"]:not([hidden]) .${cls}`)
        .first()
        .boundingBox();
      expect(box, `${cls} should render`).not.toBeNull();
      expect(Math.round(box!.height), `${cls} height`).toBe(expected);
    }
  });

  /**
   * `loading` landed 2026-08-27. Before it, the docs told consumers to pass `aria-busy`
   * and `disabled` themselves, which meant every consumer could forget half of it — and
   * a button that says "Submitting…" while still accepting clicks is the double
   * submission the prop exists to prevent.
   */
  test("a loading button is busy AND disabled, not merely busy", async ({ page }) => {
    await openTab(page, "Meta");
    const btn = page.getByTestId("btn-loading");
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("aria-busy", "true");
    await expect(btn).toBeDisabled();
    // The label survives. A spinner that replaces the name leaves a screen reader with
    // an unnamed control at the exact moment the user needs to know what is happening.
    await expect(btn).toHaveText(/Submitting/);
  });

  /**
   * The audit's finding #8: `inverseOutlined` rendered identically for all four variants,
   * so `danger` silently lost its signal. That was a TOKEN fact as much as a CSS one —
   * every intent resolved the same `rgba(255,255,255,0.4)`.
   *
   * Asserted on the rendered border, not on the token, because the token was already
   * fully modelled while nothing read it.
   */
  test("on a brand surface each variant paints its own border", async ({ page }) => {
    await openTab(page, "Meta");
    await expect(page.getByTestId("inverse-strip")).toBeVisible();

    // Distinctness ALONE is not enough, and this test learned that the hard way: reverting
    // a SINGLE variant back to the old flat white-alpha still leaves four different
    // colours, so a `new Set(...).size === 4` check passed against the very bug it was
    // written to catch. Each border is therefore compared to ITS OWN intent token.
    const INTENT_OF: Record<string, string> = {
      primary: "brand",
      success: "success",
      danger: "destructive",
      neutral: "neutral",
    };

    const rows = await Promise.all(
      Object.entries(INTENT_OF).map(async ([variant, intent]) => {
        const actual = await page
          .getByTestId(`inv-${variant}`)
          .evaluate((el) => getComputedStyle(el).borderTopColor);
        // Normalise through the SAME computed-style path. A custom property comes back as
        // its raw text (`#c0dbff`) while a border colour comes back resolved
        // (`rgb(192, 219, 255)`), and comparing those two spellings fails on formatting
        // rather than on colour.
        const expected = await page
          .getByTestId(`inv-${variant}`)
          .evaluate((el, token) => {
            const raw = getComputedStyle(el).getPropertyValue(token).trim();
            if (!raw) return "";
            const probe = document.createElement("span");
            probe.style.color = raw;
            document.body.appendChild(probe);
            const resolved = getComputedStyle(probe).color;
            probe.remove();
            return resolved;
          }, `--sa-cmp-action-${intent}-secondary-inverse-default-border`);
        return { variant, actual, expected };
      }),
    );

    for (const { variant, actual, expected } of rows) {
      expect(expected, `${variant}'s inverse border token must resolve`).not.toBe("");
      expect(
        actual,
        `${variant} paints ${actual} but its own intent token is ${expected}`,
      ).toBe(expected);
    }

    // ...and they must still all differ, which is what "carries the intent" means.
    const unique = new Set(rows.map((r) => r.actual));
    expect(
      unique.size,
      `all four inverse outlined borders should differ, got ${JSON.stringify(rows.map((r) => r.actual))}`,
    ).toBe(4);
  });
});
