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
/**
 * TABS ARE `Design` / `Code` / `Accessibility`. Three tests here asked for a tab called
 * "Meta", which the page stopped having when it moved onto `ComponentDocPage` — so they
 * had been failing on `main`, silently, because CI's two jobs do not run Playwright. The
 * specimens themselves never moved; only the tab that holds them was renamed.
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
    await openTab(page, "Design");
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
    await openTab(page, "Design");
    const btn = page.getByTestId("btn-loading");
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("aria-busy", "true");
    await expect(btn).toBeDisabled();
    // The label survives. A spinner that replaces the name leaves a screen reader with
    // an unnamed control at the exact moment the user needs to know what is happening.
    await expect(btn).toHaveText(/Submitting/);

    // AND IT IS VISIBLE. `loading` first shipped setting aria-busy and disabling the
    // control and nothing else, so the state existed only for screen readers: a sighted
    // user saw a greyed-out button indistinguishable from one they were never allowed to
    // press. Half an accessible state is not an accessible state.
    const spinner = btn.locator(".ds-btn__spinner");
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute("aria-hidden", "true");

    // A busy button must not wear the disabled 50% wash — that says "forbidden" when the
    // truth is "working". It stays unclickable regardless, which the assertion above pins.
    expect(Number(await btn.evaluate((el) => getComputedStyle(el).opacity))).toBe(1);
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
    await openTab(page, "Design");
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

/* ===========================================================================
 * The 2026-09-03 "world class" pass — docs/plans/2026-09-03-button-world-class.md
 *
 * Each of these was watched to FAIL against the component as it stood before its
 * fix. The bar set in that plan was: a criterion is met when a test fails without
 * the fix, and anything that cannot be made to fail is not claimed.
 * ========================================================================= */

test.describe("Button — width, wrapping and rhythm", () => {
  /**
   * S1. `white-space: nowrap` meant a label did not shrink, it OVERFLOWED — and took
   * the page's horizontal scrollbar with it. Before the fix this specimen, in a 180px
   * container, measured a scrollWidth well past its clientWidth on one line.
   */
  test("a long label wraps inside its container instead of overflowing", async ({ page }) => {
    await openTab(page, "Design");
    const btn = page.getByTestId("btn-wrap");
    await expect(btn).toBeVisible();

    const box = await btn.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      height: el.getBoundingClientRect().height,
      whiteSpace: getComputedStyle(el).whiteSpace,
    }));

    expect(box.whiteSpace).not.toBe("nowrap");
    // The label fits the box it was given.
    expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth + 1);
    // And it fits by WRAPPING — a single 40px line would mean it had not.
    expect(box.height).toBeGreaterThan(40);

    // The page itself must not have gained a horizontal scrollbar.
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    expect(overflows).toBe(false);
  });

  /** S1. `fullWidth` fills its container rather than needing a wrapper class. */
  test("fullWidth stretches to the container", async ({ page }) => {
    await openTab(page, "Design");
    const btn = page.getByTestId("btn-full");
    await expect(btn).toBeVisible();
    const { btnW, parentW } = await btn.evaluate((el) => ({
      btnW: el.getBoundingClientRect().width,
      parentW: (el.parentElement as HTMLElement).getBoundingClientRect().width,
    }));
    expect(Math.abs(btnW - parentW)).toBeLessThanOrEqual(1);
  });

  /**
   * S4. A one-word action beside a two-word one drew two visibly different weights.
   * The floor is 64px and applies to every ordinary button on the page.
   */
  test("no ordinary button renders below the rhythm minimum", async ({ page }) => {
    await openTab(page, "Design");

    /*
     * MEASURE THE SHORTEST LABEL ON THE PAGE, NOT THE PAGE'S AVERAGE.
     *
     * The first version of this only swept every visible button and passed with
     * `min-width` removed entirely. Measured: an `md` button carries 24px of padding a
     * side, so "OK" already renders at 72.86px — the floor never binds there and the
     * test was measuring padding. `btn-short` is `sm` (16px a side), where the label
     * genuinely cannot reach 64px on its own.
     */
    const short = page.getByTestId("btn-short");
    await expect(short).toBeVisible();
    expect(await short.evaluate((el) => el.getBoundingClientRect().width)).toBeGreaterThanOrEqual(64);

    const widths = await page.evaluate(() =>
      [...document.querySelectorAll(".ds-btn")]
        .filter((el) => !el.classList.contains("ds-icon-btn") && !el.classList.contains("ds-btn--full"))
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .map((el) => el.getBoundingClientRect().width),
    );
    expect(widths.length).toBeGreaterThan(0);
    expect(Math.min(...widths)).toBeGreaterThanOrEqual(64);
  });
});

test.describe("Button — the link form", () => {
  /**
   * S5. `target="_blank"` hands the opened page a `window.opener` back to this one.
   * Before the fix the anchor attributes were not even assignable, so this specimen
   * could not be written — the typechecker found that while the default was added.
   */
  test("a new-tab link carries rel=noopener noreferrer", async ({ page }) => {
    await openTab(page, "Accessibility");
    const link = page.getByTestId("btn-external");
    await expect(link).toBeVisible();
    await expect(link).toHaveJSProperty("tagName", "A");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  /**
   * GIGW 3.0 requires telling the reader when a link opens a new window. Before
   * `external`, every one of the twenty-two external links on the website said nothing
   * — no glyph and no announcement — because the requirement had no component behind it
   * and each call site was left to remember it. None did.
   *
   * The warning is asserted INSIDE the anchor, not merely present on the page: rendered
   * outside it, it would be a separate node the reader may never reach, and would pass a
   * DOM-presence check while failing the person it exists for.
   */
  test("external announces the new tab to both audiences", async ({ page }) => {
    await openTab(page, "Accessibility");
    const link = page.getByTestId("btn-external-shorthand");
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");

    // The people who cannot see the glyph — carried by the anchor's own text.
    await expect(link).toContainText("(opens in a new tab)");

    // …and hidden visually rather than merely made small.
    const warning = link.locator(".ds-sr-only");
    const box = await warning.boundingBox();
    expect(box?.width ?? 99).toBeLessThanOrEqual(1);

    // The people who can: a trailing glyph is drawn without the caller asking for one.
    await expect(link.locator(".ds-btn__icon--end")).toBeVisible();
  });
});

test.describe("Button — a disabled control that stays findable", () => {
  /**
   * S6. A natively disabled button leaves the tab order, so a keyboard reader never
   * learns it exists. `preserveFocus` keeps it reachable without making it operable.
   */
  test("preserveFocus is focusable, announced disabled, and still inert", async ({ page }) => {
    await openTab(page, "Accessibility");
    const soft = page.getByTestId("btn-soft-disabled");
    const hard = page.getByTestId("btn-hard-disabled");
    await expect(soft).toBeVisible();

    // The default is unchanged: natively disabled, out of the tab order.
    await expect(hard).toBeDisabled();
    await expect(hard).not.toHaveAttribute("aria-disabled", "true");

    /*
     * The opt-in is reachable and announced. Assert the NATIVE property, not
     * `toBeDisabled()` — Playwright resolves that through ARIA, so it reports this
     * control as disabled, which is exactly what it should be telling a screen reader.
     * The distinction under test is "not natively disabled, therefore still in the tab
     * order", and only the DOM property says that.
     */
    await expect(soft).toHaveJSProperty("disabled", false);
    await expect(soft).toHaveAttribute("aria-disabled", "true");
    await soft.focus();
    await expect(soft).toBeFocused();

    /*
     * Reachable is not pressable.
     *
     * The first version of this attached a native `click` listener and force-clicked.
     * That always fires: `stopPropagation` on React's synthetic event cannot unregister
     * a listener sitting on the same element, and `force: true` deliberately bypasses
     * the very pointer-blocking under test. It was measuring the test's own listener.
     *
     * What actually has to hold is that the POINTER cannot reach it and the KEYBOARD
     * cannot activate it.
     */
    await expect(soft).toHaveCSS("pointer-events", "none");

    await soft.evaluate((el) => {
      (el as HTMLElement).dataset.fired = "no";
      el.addEventListener("click", () => ((el as HTMLElement).dataset.fired = "yes"));
    });
    await soft.press("Enter");
    await soft.press(" ");
    await expect(soft).toHaveAttribute("data-fired", "no");

    // And it can never submit a form implicitly.
    await expect(soft).toHaveJSProperty("type", "button");
  });
});

test.describe("Button — Windows High Contrast Mode", () => {
  /**
   * `test.use({ forcedColors: "active" })` DID NOT REACH THE PAGE. Measured:
   * `matchMedia("(forced-colors: active)").matches` was `false` inside a describe that
   * declared it, so the CSS under test was never selected and the assertions were
   * measuring ordinary mode. `page.emulateMedia` sets it at runtime and demonstrably
   * works — and every test below asserts the mode is ON before asserting anything else,
   * so this can never again pass by testing the wrong thing.
   */
  async function forceColors(page: import("@playwright/test").Page) {
    await page.emulateMedia({ forcedColors: "active" });
    expect(
      await page.evaluate(() => matchMedia("(forced-colors: active)").matches),
      "forced-colors emulation is not active — the assertions below would measure ordinary mode",
    ).toBe(true);
  }

  /**
   * S2. THIS GUARDS THE OUTCOME, NOT THE MECHANISM — and the distinction was measured
   * rather than assumed.
   *
   * Removing the component's whole `forced-colors` block and re-running this cold still
   * passed: Chromium's own forced-colors UA styles already give a `<button>` a border,
   * overriding the author's `transparent`. So this test does not prove that block is
   * load-bearing in Chromium, and it is not claimed to.
   *
   * It is still worth having. It fails the moment anyone reaches for
   * `forced-color-adjust: none`, paints a background the forced palette cannot override,
   * or removes the border box — the three ways this control could stop announcing itself
   * as pressable, against WCAG 2.2 §1.4.11. The block itself earns its place on engines
   * and real Windows palettes that are not this emulation, and for the filled/outlined
   * distinction and the GrayText disabled treatment the UA does not supply.
   */
  test("every appearance keeps a visible boundary", async ({ page }) => {
    await openTab(page, "Design");
    await forceColors(page);
    const borders = await page.evaluate(() =>
      [...document.querySelectorAll(".ds-btn")]
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .map((el) => {
          const cs = getComputedStyle(el);
          return { cls: el.className, color: cs.borderTopColor, width: cs.borderTopWidth };
        }),
    );
    expect(borders.length).toBeGreaterThan(0);
    for (const b of borders) {
      expect(b.color, `${b.cls} has no border colour`).not.toMatch(/transparent|rgba\(0, 0, 0, 0\)/);
      expect(parseFloat(b.width), `${b.cls} has no border width`).toBeGreaterThan(0);
    }
  });

  /** S2. The focus ring is the one thing that must never be lost. */
  test("the focus ring survives, in the system's own focus colour", async ({ page }) => {
    await openTab(page, "Design");
    await forceColors(page);
    const btn = page.getByTestId("btn-wrap");
    /*
     * Focus it BY KEYBOARD. `:focus-visible` is modality-dependent — a programmatic
     * `.focus()` does not set the keyboard flag in Chromium, so the ring computed as
     * `outline-style: none` and the first version of this test read that as a missing
     * focus ring rather than as a focus state it had never entered. Tabbing away and
     * back is what makes the state real.
     */
    /*
     * `:focus-visible` IS MODALITY-DEPENDENT, AND THE MODALITY IS SET BY A REAL KEY.
     *
     * Chromium only treats focus as "visible" once the last interaction was the
     * keyboard. A bare `.focus()` therefore left the element focused but NOT
     * focus-visible, so the ring computed as `outline-style: none` and the first version
     * of this test read that as a missing focus ring. A Tab/Shift+Tab round trip was the
     * second attempt and simply lost focus to a neighbour.
     *
     * One Tab press anywhere flips the modality flag; from then on a programmatic focus
     * is focus-visible too. That is deterministic, unlike counting Tab stops.
     */
    await page.keyboard.press("Tab");
    await btn.focus();
    await expect(btn).toBeFocused();
    expect(
      await btn.evaluate((el) => el.matches(":focus-visible")),
      "the button is focused but not focus-visible, so no ring is expected to be drawn",
    ).toBe(true);
    const ring = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { width: cs.outlineWidth, style: cs.outlineStyle, offset: cs.outlineOffset };
    });
    expect(ring.style).toBe("solid");
    expect(parseFloat(ring.width)).toBeGreaterThan(0);
    expect(parseFloat(ring.offset)).toBeGreaterThan(0);
  });
});

test.describe("Button — pointer targets on touch", () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

  /**
   * S3. `sm` is drawn at 32px and `md` at 40px. Both clear WCAG 2.2 §2.5.8 (24x24 at
   * AA), but UX4G 3.0 asks for 44x44 on mobile. An invisible centred pseudo-element
   * raises the TARGET without moving the drawn button — and its first draft carried
   * `pointer-events: none`, which made it invisible to the pointer and left the target
   * exactly 32px: a comment claiming a fix over a rule that did nothing.
   */
  test("every size presents at least a 44x44 target without growing its drawn box", async ({ page }) => {
    await openTab(page, "Design");
    const measured = await page.evaluate(() =>
      [...document.querySelectorAll(".ds-btn")]
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .filter((el) => !el.closest(".ds-btn-group--attached"))
        // A disabled control has no target by design — `[aria-disabled]` sets
        // `pointer-events: none`, which the pseudo-element inherits. Asserting an
        // active target on it would be asserting that a disabled button is pressable.
        .filter((el) => !(el as HTMLButtonElement).disabled && el.getAttribute("aria-disabled") !== "true")
        .map((el) => {
          const after = getComputedStyle(el, "::after");
          return {
            cls: el.className,
            drawnHeight: el.getBoundingClientRect().height,
            targetMinH: parseFloat(after.minHeight) || 0,
            targetMinW: parseFloat(after.minWidth) || 0,
            events: after.pointerEvents,
          };
        }),
    );
    expect(measured.length).toBeGreaterThan(0);
    for (const m of measured) {
      expect(m.targetMinH, `${m.cls} target height`).toBeGreaterThanOrEqual(44);
      expect(m.targetMinW, `${m.cls} target width`).toBeGreaterThanOrEqual(44);
      // The target must actually RECEIVE the press, or it is decoration.
      expect(m.events, `${m.cls} target is inert`).not.toBe("none");
    }
    // The drawn buttons are untouched — `sm` is still 32.
    expect(Math.min(...measured.map((m) => m.drawnHeight))).toBeLessThan(44);
  });
});


test.describe("Button — the icon takes the button's ink", () => {
  /**
   * REPORTED FROM FIGMA, 2026-09-03: a filled button drew a WHITE label and a DARK icon.
   * The cause was in the Figma set — the swapped `Icon` instances kept that component's
   * own default ink (`icon/neutral/base`, #1e2124) instead of the button's, on all 720 of
   * them — and the code was never affected, because `Icon` sets no colour and
   * `.ds-btn__icon` sets none either, so the glyph inherits through `currentColor`.
   *
   * This pins the reason the code was safe. It fails the moment anyone gives the icon
   * slot or the Icon component a colour of its own, which is exactly the change that
   * would reintroduce the defect on this side.
   */
  test("a glyph computes the same colour as the label beside it", async ({ page }) => {
    await openTab(page, "Design");

    for (const id of ["icon-filled", "icon-outlined"]) {
      const btn = page.getByTestId(id).first();
      await expect(btn).toBeVisible();
      const { label, glyph } = await btn.evaluate((el) => {
        const g = el.querySelector(".ds-btn__icon") as HTMLElement;
        return { label: getComputedStyle(el).color, glyph: getComputedStyle(g).color };
      });
      expect(glyph, `${id}: the glyph does not match its label`).toBe(label);
    }

    // And the filled one is genuinely light-on-dark, so the assertion above is not
    // passing because both happen to be the default ink.
    const filled = await page.getByTestId("icon-filled").first().evaluate((el) => getComputedStyle(el).color);
    expect(filled).toBe("rgb(255, 255, 255)");
  });
});

test.describe("Button — optical padding on the icon side", () => {
  /**
   * A glyph is not ink to its own edge: Material Symbols draws inside a square em-box
   * with its own bearing, so equal geometric padding makes the icon side LOOK further in
   * than the label side. The side carrying a glyph therefore loses a step.
   */
  test("the side with a glyph is tighter than the side without", async ({ page }) => {
    await openTab(page, "Design");

    const lead = await page.getByTestId("icon-filled").first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { start: cs.paddingLeft, end: cs.paddingRight };
    });
    // Leading icon: the left is compensated, the right keeps the full step.
    expect(lead.start).toBe("16px");
    expect(lead.end).toBe("24px");

    const trail = await page.getByTestId("icon-outlined").first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return { start: cs.paddingLeft, end: cs.paddingRight };
    });
    // Trailing icon: the mirror image, so it is per side rather than blanket.
    expect(trail.start).toBe("24px");
    expect(trail.end).toBe("16px");

    // A button with no glyph at all keeps both sides full.
    const plain = await page.getByTestId("btn-wrap").evaluate((el) => {
      const cs = getComputedStyle(el);
      return { start: cs.paddingLeft, end: cs.paddingRight };
    });
    expect(plain.start).toBe("24px");
    expect(plain.end).toBe("24px");
  });

  /**
   * `loading` puts the spinner in the leading icon's PLACE precisely so the button does
   * not change width when pressed. If the compensation matched only `.ds-btn__icon`, a
   * button would jump 8px on going busy — reintroducing through the padding the exact
   * mis-click the icon slot was designed to avoid.
   */
  test("a busy button keeps the same leading padding as an iconed one", async ({ page }) => {
    await openTab(page, "Design");
    const busy = await page.getByTestId("btn-loading").first().evaluate((el) => getComputedStyle(el).paddingLeft);
    expect(busy).toBe("16px");
  });
});

test.describe("Button — the theming hooks reach every ground", () => {
  /**
   * The docs said a hook is "read by every state, so setting one is complete by
   * construction", and named the inverse ladder. It was not true: the inverse appearances
   * read `--_inv-*` straight from the variant block, so a portal setting `--sa-btn-fill`
   * was rethemed on a default ground and left on stock brand colours the moment the button
   * sat on a brand surface — the exact half-override the hooks exist to prevent, asserted
   * in writing.
   *
   * TWO METHODOLOGY LESSONS ARE BAKED IN HERE, both learned by getting them wrong:
   *
   * 1. It builds its OWN probe rather than picking a specimen with `.first()`. Selecting
   *    the first `.ds-btn--inverse` on the page returned a different button than expected
   *    and the test failed against `rgb(20, 21, 22)` — a real colour belonging to another
   *    specimen. The contract is about the CSS, so the element should be the test's.
   * 2. It waits for a style recalc. Reading `backgroundColor` in the same synchronous tick
   *    as `setProperty` returns the OLD value while the custom property already shows the
   *    new one — which reads as a code defect and is a test defect.
   */
  for (const [label, cls] of [
    ["default ground", "ds-btn ds-btn--primary ds-btn--filled ds-btn--md"],
    ["brand ground", "ds-btn ds-btn--primary ds-btn--inverse ds-btn--md"],
  ] as const) {
    test(`--sa-btn-fill reaches the ${label}`, async ({ page }) => {
      await openTab(page, "Design");
      const before = await page.evaluate((c) => {
        const el = document.createElement("button");
        el.className = c;
        el.id = "hook-probe";
        el.textContent = "probe";
        document.body.appendChild(el);
        return getComputedStyle(el).backgroundColor;
      }, cls);
      expect(before, "the resting fill must be a real colour, not an unresolved variable")
        .not.toMatch(/rgba\(0, 0, 0, 0\)/);

      await page.evaluate(() => {
        document.getElementById("hook-probe")!.style.setProperty("--sa-btn-fill", "rgb(1, 2, 3)");
      });
      await page.waitForTimeout(120);
      const after = await page.evaluate(
        () => getComputedStyle(document.getElementById("hook-probe")!).backgroundColor,
      );

      /*
       * Compared with a tolerance, not for equality. Injecting rgb(1, 2, 3) reads back as
       * rgb(1, 3, 4) — a one-per-channel round-trip artefact of the browser's colour
       * handling, not a failure of the hook. Exact equality here asserts the renderer's
       * arithmetic rather than the contract under test, which is: setting ONE hook must
       * change this ground's fill to the value asked for.
       */
      const ch = (v: string) => (v.match(/\d+/g) ?? []).slice(0, 3).map(Number);
      const got = ch(after);
      expect(after, `setting one hook must retheme the ${label}`).not.toBe(before);
      for (const [i, want] of [1, 2, 3].entries()) {
        expect(Math.abs(got[i] - want), `${label}: channel ${i} is ${got[i]}, expected ~${want}`)
          .toBeLessThanOrEqual(2);
      }
    });
  }
});
