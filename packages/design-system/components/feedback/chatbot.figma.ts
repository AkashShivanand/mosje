// url=https://www.figma.com/design/SVMfm1KApR7KYHSbwNBnOM/MoSJE--WIP-?node-id=2175-79096
// source=packages/design-system/components/feedback/chatbot.tsx
// component=Chatbot
//
// NOTE ON THE URL. Every other template in this package points at `<SAMAVESH>`
// (the published library). This one cannot: the chatbot exists only in the
// **MoSJE (WIP)** file as a loose component set, and has not been promoted into
// the SAMAVESH library. When it is, swap this line for
// `// url=<SAMAVESH>?node-id=<new-id>` — and remember a promoted component gets
// a NEW key, so the mapping has to be disconnected in the Figma UI and
// reconnected rather than edited in place.
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma `Property 1` → `defaultOpen`. Exhaustive: all 4 values mapped.
 *
 * The four values are NOT four configurations — they are four moments of the
 * widget's own opening sequence, drawn as separate frames because a static file
 * cannot show motion:
 *
 *   Open → launcher only, panel shut   (the name is misleading; it means closed)
 *   1    → panel open, bot typing, no messages yet
 *   2    → greeting has landed, bot still typing
 *   3    → suggestions have cascaded in
 *
 * Only the first distinction is a prop. States 1–3 are transient internals that
 * `Chatbot` walks through on its own — roughly 260ms, 1160ms and 1480ms after
 * opening. Emitting them as props would invent an API for something the
 * component deliberately owns, and would let a consumer freeze the widget in a
 * state it is supposed to pass through.
 */
const defaultOpen = instance.getEnum("Property 1", {
  Open: false,
  "1": true,
  "2": true,
  "3": true,
});

export default {
  example: figma.code`
    <Chatbot
      ${defaultOpen ? "defaultOpen" : ""}
      greeting="Hey, I am Noddy. How Can I help you?"
      quickReplies={[
        { id: "otp", label: "I'm not receiving OTP." },
        { id: "docs", label: "Didn't find API documentation" },
        { id: "register", label: "How to register as a developer." },
        { id: "navigate", label: "Portal navigation help" },
        { id: "other", label: "Others" },
      ]}
      onQuickReply={(reply) => ({ text: answerFor(reply.id) })}
    />
  `,
  imports: ['import { Chatbot } from "@mosje/design-system"'],
  id: "chatbot",
  // Not nestable: it is a viewport-level widget, mounted once per surface.
  metadata: { nestable: false },
};
