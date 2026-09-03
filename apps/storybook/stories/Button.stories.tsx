import type { Meta, StoryObj } from "@storybook/react";
import { Button, Icon } from "@mosje/design-system";

/**
 * **Button** — the primary action atom. Variants encode intent
 * (primary/success/danger/neutral), appearances encode prominence
 * (filled/outlined/text), and `tone` says which ground it sits on
 * (default/inverse). Lifecycle: **Stable**.
 *
 * `tone="inverse"` is for a solid brand surface — a navy header, the ticker bar. It
 * CROSSES `appearance`, which is the point: as two appearance words
 * (`inverse`/`inverseOutlined`) it could only have one look, so all four variants painted
 * the same white-alpha border and `danger` silently lost its signal. Those two words
 * still work as deprecated aliases.
 *
 * `variant="neutral"` is for an action with **no semantic charge** — a dismiss,
 * a reset, a "start over". Reach for it whenever you catch yourself wanting a
 * control to look different from the paragraph beside it: before it existed the
 * only way to do that was to borrow a signal colour, and the chatbot's reset
 * duly shipped outlined in the estate's *rejection* red for what is
 * housekeeping. On a portal where red means "your application was rejected",
 * spending it on a reset devalues the signal. Pair it with `appearance="text"`
 * for the quietest register the system has.
 *
 * `href` turns it into an `<a>`. Use it when the control **navigates** — a link
 * that merely looks like a button is still a link, and a keyboard user expects
 * Enter to follow it and the browser to offer "open in new tab". Do not reach
 * for it to style a form submit.
 *
 * `iconLeft` and `iconRight` are decoration and carry no accessible name; the
 * label does. For an icon-only button, put `aria-label` on the button and
 * `aria-hidden` on the glyph.
 */
const meta = {
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=609-283111"
    }
  },
  title: "Components/Button",
  component: Button,
  args: { children: "Submit application", variant: "primary", appearance: "filled", size: "md" },
  argTypes: {
    variant: { control: "inline-radio", options: ["primary", "success", "danger", "neutral"] },
    appearance: {
      control: "inline-radio",
      options: ["filled", "outlined", "text"],
    },
    tone: { control: "inline-radio", options: ["default", "inverse"] },
    loading: { control: "boolean" },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    href: { control: "text" },
    iconLeft: { control: false },
    iconRight: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="success">Success</Button>
      <Button {...args} variant="danger">Danger</Button>
      <Button {...args} variant="neutral">Neutral</Button>
    </div>
  ),
};

/**
 * **The quiet register, and the mistake it exists to prevent.**
 *
 * Top is what a reset should look like. Below it is what it looked like before
 * `neutral` existed — the only way to make a control read as a control was to
 * borrow `danger`, so a routine "clear this and start again" ended up wearing
 * the colour reserved for a rejected application.
 */
export const NeutralVsBorrowedSignal: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button {...args} variant="neutral" appearance="text" size="sm">Start over</Button>
        <span style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)" }}>
          right — no signal, still unmistakably a control
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <Button {...args} variant="danger" appearance="outlined" size="sm">Start over</Button>
        <span style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)" }}>
          wrong — the rejection colour, spent on housekeeping
        </span>
      </div>
    </div>
  ),
};

export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button {...args} appearance="filled">Filled</Button>
      <Button {...args} appearance="outlined">Outlined</Button>
      <Button {...args} appearance="text">Text</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * Icons are decoration — the label is the accessible name. A leading glyph
 * reinforces the verb; a trailing one implies movement onward.
 */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button {...args} iconLeft={<Icon name="download" size={18} aria-hidden />}>
        Export roll-up
      </Button>
      <Button {...args} appearance="outlined" iconRight={<Icon name="arrow_forward" size={18} aria-hidden />}>
        Continue
      </Button>
      <Button
        {...args}
        appearance="text"
        iconLeft={<Icon name="add" size={18} aria-hidden />}
        iconRight={<Icon name="expand_more" size={18} aria-hidden />}
      >
        Add a report
      </Button>
      {/* Icon-only: the BUTTON carries the name, the glyph stays hidden. */}
      <Button {...args} appearance="outlined" aria-label="Refresh figures">
        <Icon name="refresh" size={20} aria-hidden />
      </Button>
    </div>
  ),
};

/**
 * `href` renders an `<a>`. Reach for it only when the control navigates — a
 * link styled as a button is still a link, and users expect it to behave like
 * one.
 */
export const AsALink: Story = {
  args: { href: "/schemes/pm-ajay", children: "Read the PM-AJAY guidelines" },
};

/**
 * `inverse` and `inverseOutlined` exist for a button sitting directly on a
 * solid brand surface, where the normal appearances disappear into it.
 */
export const OnABrandSurface: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: 24,
        borderRadius: "var(--sa-shape-8)",
        background: "var(--sa-bg-brand-primary-bolder)",
      }}
    >
      <Button {...args} appearance="inverse">
        Apply online
      </Button>
      <Button {...args} appearance="inverseOutlined">
        Learn more
      </Button>
    </div>
  ),
};

/**
 * **Known defects, rendered rather than described.**
 *
 * A design system that only demonstrates its happy path teaches the happy path.
 * Three were measured on 2026-08-25. **Two are now fixed** and are kept here rather
 * than deleted, because a fix is only convincing beside the thing it fixed — and
 * because both are the kind that look identical in a screenshot and differ entirely
 * under a keyboard or a zoom. One remains open.
 *
 * The audit also reported a fifth 1.4.11 failure, "neutral outlined 2.15:1". It does
 * not exist: that measured a token the component does not bind, and the border it
 * actually paints is 16.18:1. Corrected in `button-audit.md`; the boundaries are now
 * measured on every build by `packages/tokens/test/action-nontext-contrast.test.mjs`
 * rather than by hand.
 */
export const KnownDefects: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32, maxWidth: 720 }}>
      <section>
        <h3 style={{ margin: "0 0 4px", fontSize: 14 }}>
          FIXED 2026-08-27 · <code>disabled</code> on a link-button
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--sa-color-text-muted)" }}>
          Kept rendered rather than deleted, because the fix is only convincing beside
          the thing it fixes. The link-button now drops `href` entirely and carries
          `aria-disabled` + `role="link"` — so it is not focusable and not activatable,
          by the browser&rsquo;s own rules rather than by a handler. Tab through this row:
          focus should skip both. Until 2026-08-27 the second one took focus and followed
          its link.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button disabled>Disabled button</Button>
          <Button href="/nowhere" disabled>
            Disabled link
          </Button>
        </div>
      </section>

      <section>
        <h3 style={{ margin: "0 0 4px", fontSize: 14 }}>
          FIXED 2026-08-27 · text scaled to 200% (WCAG 1.4.4)
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--sa-color-text-muted)" }}>
          Sizes now set `min-height` plus vertical padding, so the box grows with the
          text. The right-hand button is at 200%; its label used to be clipped, 41px of
          content inside a 38px client box.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button>Apply now</Button>
          <Button style={{ fontSize: 32 }}>Apply now</Button>
        </div>
      </section>

      <section>
        <h3 style={{ margin: "0 0 4px", fontSize: 14 }}>
          RETIRED 2026-08-27 · Tonal had no perceivable edge (WCAG 1.4.11 needs 3:1)
        </h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--sa-color-text-muted)" }}>
          Boundary against the page was 1.21 to 1.52 across the four variants — you could
          not tell where the control was except by reading it. It could not be fixed by
          darkening the border without simply becoming `outlined`, and it had two
          consumers in 494 buttons, so it was removed rather than repaired. Nothing
          renders here because the appearance no longer exists; the two consumers are now
          `outlined`.
        </p>
      </section>
    </div>
  ),
};

/**
 * **FIXED 2026-08-27.** `inverseOutlined` used to render identically for all four
 * variants — white text, white border — so `variant="danger"` silently lost its signal.
 *
 * Two things were wrong and both were in the tokens, not just the CSS. Every intent
 * resolved the SAME `rgba(255,255,255,0.4)` border, and at 2.25:1 on this very
 * background it was not a findable edge either (WCAG 1.4.11 asks 3:1) — a failure the
 * 2026-08-25 audit missed because it measured every boundary against a WHITE page, and
 * `inverse` is never on white.
 *
 * Where it paints: the portal login shell's "Signing Into" bar, these docs and this
 * story. NOT the Ticker's route-out — `ticker.css` strips that border, so it renders as
 * a text link. The first write-up of this fix said otherwise, on the strength of the
 * token value alone, which is the same mistake in the opposite direction.
 *
 * Each intent now takes its own scale at rung 100, so the border carries the signal and
 * measures 4.14–4.72:1 on this bar. The label stays white deliberately: a 100-rung tint
 * as text measures 4.49:1 here, a hundredth short of 1.4.3's 4.5.
 *
 * Both rows below now differ per variant. Written with `tone` — the two old appearance
 * words still work as aliases.
 */
export const InverseCarriesTheVariant: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 16,
        padding: 24,
        borderRadius: "var(--sa-shape-8)",
        background: "var(--sa-bg-brand-primary-bolder)",
      }}
    >
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "success", "danger", "neutral"] as const).map((v) => (
          <Button key={v} variant={v} tone="inverse" appearance="filled">
            {v}
          </Button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {(["primary", "success", "danger", "neutral"] as const).map((v) => (
          <Button key={v} variant={v} tone="inverse" appearance="outlined">
            {v}
          </Button>
        ))}
      </div>
    </div>
  ),
};

/**
 * **`loading` landed 2026-08-27.** It sets `aria-busy` and disables the control, so a
 * form cannot be submitted twice while the first submission is in flight.
 *
 * It deliberately does **not** swap the label for you. A control that loses its name
 * mid-action is unusable with a screen reader, so pass "Submitting…" yourself — the
 * third button shows what happens if you keep a stale label, which is worse than no
 * loading state at all.
 */
export const Loading: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button>Submit application</Button>
      <Button loading>Submitting…</Button>
      <Button loading>Submit application{" "}(stale label — do not do this)</Button>
    </div>
  ),
};

/**
 * **Labels wrap, as of 2026-09-03.** `white-space: nowrap` cannot fail safe: a button
 * that refuses to wrap does not shrink, it overflows its container and takes the page's
 * horizontal scrollbar with it. On a 320px bilingual government page that is the common
 * case, not the edge.
 *
 * `nowrap` is the opt-out, for a segmented control or a toolbar where one line is
 * structural — and there the label has to be short enough for every viewport it appears
 * on, because the overflow risk comes back with it.
 */
export const Wrapping: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 180, padding: 8, border: "1px solid #d0d5dd", borderRadius: 8 }}>
        <Button>Submit application for review</Button>
      </div>
      <div style={{ width: 180, padding: 8, border: "1px solid #d0d5dd", borderRadius: 8 }}>
        <Button nowrap>Submit application for review</Button>
      </div>
    </div>
  ),
};

/**
 * **`fullWidth` stretches to the container.** The older guidance was to wrap the button
 * in a full-width container instead. That is right in principle and was ignored
 * everywhere it mattered — consumers reached for `className` and got the behaviour
 * without the token discipline — so this is the supported spelling of what they were
 * already doing. It is the usual shape for a mobile form's submit.
 */
export const FullWidth: Story = {
  render: () => (
    <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 8 }}>
      <Button fullWidth>Continue</Button>
      <Button fullWidth appearance="outlined">
        Save draft
      </Button>
    </div>
  ),
};

/**
 * **`preserveFocus` keeps a disabled control findable.** A natively `disabled` button
 * leaves the tab order, so a reader navigating by keyboard never learns it is there —
 * the form does not appear to have a submit they may not press yet, it appears to have
 * no submit. This renders the state as `aria-disabled` instead.
 *
 * Reachable is not pressable: the pointer is blocked in CSS, Enter and Space are
 * suppressed, and `type` is forced to `"button"` so the browser's own implicit form
 * submission cannot fire either — the leak this pattern usually ships with.
 *
 * It is opt-in. Switching every disabled button in the estate into the tab order would
 * change tab order on pages nobody has re-tested, so reach for it where the control is
 * the point of the screen and leave the default alone for a row of table actions.
 *
 * Tab through these two: only the second one stops.
 */
export const FindableWhenDisabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button disabled>Disabled — out of the tab order</Button>
      <Button disabled preserveFocus>
        Disabled — still findable
      </Button>
    </div>
  ),
};

/**
 * **The link form.** Pass `href` and the component renders a real anchor, so a call to
 * action that navigates is a link rather than a button that lies about what it does.
 *
 * `target="_blank"` gets `rel="noopener noreferrer"` whether or not you remembered:
 * opening a new tab hands the opened page a reference back to this one, which lets it
 * navigate the original tab elsewhere. Browsers imply `noopener` now, but that word does
 * real work on an estate serving older Android WebViews, and `noreferrer` is implied
 * nowhere. An explicit `rel` wins — someone who wrote one meant it.
 */
export const LinkForm: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button href="#schemes" appearance="outlined">
        Browse schemes
      </Button>
      <Button href="https://www.india.gov.in" target="_blank" appearance="outlined">
        Open the National Portal
      </Button>
      <Button href="#unreachable" disabled appearance="outlined">
        Disabled link — genuinely inert
      </Button>
    </div>
  ),
};
