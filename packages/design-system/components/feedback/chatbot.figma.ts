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
 * show motion:
 *
 *   Closed     → launcher only, panel shut
 *   Greeting   → panel open, opening line landed, suggestions cascaded in
 *   Typing     → the bot is composing; nothing offered yet
 *   Transcript → turns have accumulated
 *
 * Only the first distinction is a prop. Typing and Transcript are transient
 * internals that `Chatbot` walks through on its own — roughly 260ms, 1160ms and
 * 1480ms after opening. Emitting them as props would invent an API for something
 * the component deliberately owns, and would let a consumer freeze the widget in
 * a state it is supposed to pass through.
 *
 * The old WIP set called this axis `Property 1` with values `Open | 1 | 2 | 3`,
 * where `Open` confusingly meant CLOSED. Renaming it was the point of the
 * promotion, not a side effect.
 */
const defaultOpen = instance.getEnum("State", {
  Closed: false,
  Greeting: true,
  Typing: true,
  Transcript: true,
});

export default {
  example: figma.code`
    <Chatbot
      ${defaultOpen ? "defaultOpen" : ""}
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
