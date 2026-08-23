// url=<SAMAVESH>?node-id=55826-37003
// source=packages/design-system/components/feedback/chatbot.tsx
// component=Chatbot
//
// ─────────────────────────────────────────────────────────────────────────────
// Promoted into the SAMAVESH library on 2026-08-23. It used to live only in
// MoSJE (WIP) (file SVMfm1KApR7KYHSbwNBnOM) as a loose set of 475x852 screen
// mockups, which the publishing token could not write:
//
//     Failed to upload to Figma (400): 400 Insufficient permissions for SVMfm1KApR7KYHSbwNBnOM
//
// `code connect publish` uploads every template in ONE request, so that single
// file took all 19 templates down with it and this one had to be excluded.
// It now targets <SAMAVESH> like every other template and the exclude is gone.
//
// The promoted master is a NEW component with a NEW key. Any mapping ever
// attached to the WIP node must be disconnected in the Figma UI rather than
// edited in place.
// ─────────────────────────────────────────────────────────────────────────────
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `State` → `defaultOpen`. Exhaustive: all 4 values mapped.
 *
 * The four values are NOT four configurations — they are four moments of the
 * widget's own lifecycle, drawn as separate frames because a static file cannot
 * show motion. The order is the one `chatbot.tsx` actually runs:
 *
 *   Closed     → launcher only, panel shut
 *   Typing     → the bot is composing; nothing said yet
 *   Greeting   → the opening line has landed, suggestions cascade in 320ms later
 *   Transcript → turns have accumulated
 *
 * TYPING COMES BEFORE GREETING, which is the opposite of how this was first
 * documented. The opening effect is `after(OPENING_BEAT_MS, typing on)` and then
 * `after(OPENING_BEAT_MS + typingDelayMs, typing off + greeting)` — so the dots
 * are what the greeting arrives *out of*, not something that follows it.
 *
 * Only the first distinction is a prop. Typing and Transcript are transient
 * internals `Chatbot` walks through on its own. Emitting them as props would
 * invent an API for something the component deliberately owns, and would let a
 * consumer freeze the widget in a state it is supposed to pass through.
 */
const defaultOpen = instance.getEnum("State", {
  Closed: false,
  Typing: true,
  Greeting: true,
  Transcript: true,
});

const title = instance.getString("Title");
const note = instance.getString("Note");
const placeholder = instance.getString("Placeholder");
const composer = instance.getBoolean("Show composer");

// The code has no `showSubtitle` flag — passing an empty string is how you
// suppress it. The Figma boolean is that same decision, made switchable.
const subtitle = instance.getBoolean("Show subtitle") ? instance.getString("Subtitle") : "";

export default {
  example: figma.code`
    <Chatbot
      ${defaultOpen ? "defaultOpen" : ""}
      title="${title}"
      subtitle="${subtitle}"
      note="${note}"
      composerPlaceholder="${placeholder}"
      composer={${composer}}
      greeting="This is an assistant for the Ministry of Social Justice. How can I help you?"
      quickReplies={[
        { id: "scheme", label: "Find a scheme" },
        { id: "status", label: "Check application status" },
        { id: "otp", label: "I'm not receiving OTP" },
      ]}
      onQuickReply={(reply) => ({ text: answerFor(reply.id) })}
    />
  `,
  imports: ['import { Chatbot } from "@mosje/design-system"'],
  id: "chatbot",
  // Not nestable: it is a viewport-level widget, mounted once per surface.
  metadata: { nestable: false },
};
