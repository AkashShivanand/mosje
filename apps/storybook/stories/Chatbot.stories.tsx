import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Chatbot,
  ChatbotMascot,
  type ChatbotMessage,
  type ChatbotQuickReply,
} from "@mosje/design-system";

/**
 * @covers Chatbot, ChatbotMascot
 *
 * **Chatbot** — Samajik Sahayak (सामाजिक सहायक), the SAMAVESH assistant surface. A launcher that folds
 * open into a conversation panel, for the help-of-last-resort a citizen reaches
 * for when a scheme page has not answered their question.
 *
 * **When to use it:** a portal or public page where a citizen may get stuck and
 * there is a scripted set of answers worth offering. **When not to:** as a
 * substitute for making the page clear. A chatbot in the corner is not a fix
 * for a form nobody can complete — and every one of these on screen is a
 * permanent 84px occupation of the viewport, on every page, for every visitor.
 *
 * ### Two modes, and they do not mix
 *
 * - **Uncontrolled** (`Playground`, `WithAnswers`) — give it a `greeting` and
 *   `quickReplies` and it runs the whole opening on its own: the panel, then the
 *   bot typing, then the greeting, then the suggestions cascading in. Return a
 *   `ChatbotReply` from `onQuickReply` and it types out an answer too, so a
 *   review build needs no backend.
 * - **Controlled** (`ControlledTranscript`) — pass `messages` and `typing` and it
 *   renders exactly that, skipping the scripted sequence entirely. Use this once
 *   a real service owns the conversation; two things writing one transcript is
 *   how a chat surface starts double-posting.
 *
 * ### The composer, and why it is honest
 *
 * `composer` (default on) shows a free-text field, because the live assistant
 * on dosje.gov.in has one and a citizen arriving from there expects it.
 * `composerPlaceholder` sets its placeholder. What it does NOT do is pretend to
 * be a language model: `onSubmit` handles a typed question, and with no handler
 * the bot says plainly that it can only help with a few things and re-offers
 * the suggestions. Silence, or a fake answer, would both be worse. Set
 * `composer={false}` for a strictly scripted surface.
 *
 * ### Identity stays on screen
 *
 * `title` and `subtitle` are the assistant's name in both scripts — Samajik
 * Sahayak / सामाजिक सहायक — and they live in the header rather than only in the
 * greeting, because the greeting scrolls away. `note` is the honest statement
 * of what the assistant is not; it sits under the composer where the live panel
 * puts its disclaimer, and it deliberately does not copy live's "can make
 * mistakes" wording, which describes a generative model this is not.
 *
 * ### Closing and clearing are two controls, and neither does the other's job
 *
 * `launcherLabel` is the launcher's accessible name — it carries the assistant's
 * name, because "open chat" tells a screen-reader user nothing about which
 * assistant they are opening on a page that may also have a demo dock and an
 * accessibility widget in the same corner.
 *
 * The header's ✕ ("Minimise chat") closes and KEEPS the conversation.
 * `endChatLabel` names the footer control — **"Start over"** — which clears the
 * transcript, greets again, and leaves the panel open. It used to be called
 * "End chat" and used to close the panel too, which made it a second way to
 * close sitting beside a ✕, and made the label untrue whichever of its two
 * words you trusted. Clearing stays out of the top-right because that is where
 * every user expects a harmless dismiss.
 *
 * It is the design system's `Button` at `variant="neutral" appearance="text"`.
 * Hand-rolled, it drifted into the estate's rejection red for an action that is
 * housekeeping — see the Button story for what `neutral` is for.
 *
 * ### Accessibility
 *
 * The panel is a **non-modal** dialog: focus is never trapped and the page
 * behind stays operable, because a help widget that hostages the keyboard is
 * worse than no help widget. Escape closes it and returns focus to the
 * launcher. Messages are announced through a polite live region. Under
 * `prefers-reduced-motion` every animation is skipped and only opacity remains.
 *
 * ### Placement
 *
 * `placement="fixed"` (the default) pins it bottom-right and marks itself
 * `data-sa-wall-occupant`, so the demo dock's rail measures around it instead
 * of landing on top of it. Every story here uses `placement="inline"` so the
 * widget sits in the canvas where it can be read.
 */
const meta = {
  title: "Feedback/Chatbot",
  component: Chatbot,
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System?node-id=55826-37003"
    }, layout: "centered" },
  args: {
    placement: "inline",
    defaultOpen: true,
    greeting:
      "This is an assistant for the Ministry of Social Justice. How can I help you?",
  },
  argTypes: {
    placement: { control: "inline-radio", options: ["fixed", "inline"] },
    typingDelayMs: { control: { type: "range", min: 200, max: 2500, step: 100 } },
  },
} satisfies Meta<typeof Chatbot>;

export default meta;
type Story = StoryObj<typeof meta>;

const SCHEME_REPLIES: ChatbotQuickReply[] = [
  { id: "schemes", label: "Which scheme applies to me?" },
  { id: "status", label: "Check my application status" },
  { id: "otp", label: "I'm not receiving OTP." },
  { id: "documents", label: "What documents do I need?" },
  { id: "grievance", label: "Raise a grievance" },
  { id: "other", label: "Others" },
];

/**
 * The full opening sequence, exactly as the design specifies it. Press **End
 * Chat** and then the launcher to watch it again from the start — the panel
 * grows out of the launcher's corner, the bot types, the greeting lands, then
 * the suggestions cascade.
 */
export const Playground: Story = {
  args: { quickReplies: SCHEME_REPLIES },
};

/**
 * Closed, which is how a citizen meets it on every page. Hover the launcher to
 * see the bilingual "Samajik Sahayak · सामाजिक सहायक" seal turn — it is static
 * at rest on purpose, because a mark on every page of the estate that spins all
 * day is the most-seen and least-useful animation we could ship.
 */
export const Closed: Story = {
  args: { defaultOpen: false, quickReplies: SCHEME_REPLIES },
};

/**
 * A conversation that answers back. `onQuickReply` returns a `ChatbotReply`, so
 * pressing a suggestion echoes it as the citizen's message, the bot types for a
 * beat, and the answer lands with a fresh set of follow-ups. No backend — the
 * same handler shape calls a real service later.
 */
export const WithAnswers: Story = {
  args: {
    quickReplies: SCHEME_REPLIES,
    onQuickReply: (reply) => {
      switch (reply.id) {
        case "otp":
          return {
            text:
              "OTPs are sent to the mobile number seeded with your Aadhaar. Wait 90 seconds before requesting another, and check that DND is not blocking messages from AM-MOSJE.",
            quickReplies: [
              { id: "otp-update", label: "Update my mobile number" },
              { id: "otp-agent", label: "Talk to a person" },
            ],
          };
        case "register":
          return {
            text:
              "Developer registration runs through the MoSJE API gateway. You'll need your organisation's PAN and an authorised signatory's Aadhaar.",
            quickReplies: [{ id: "other", label: "Something else" }],
          };
        default:
          return {
            text: "Let me find someone who can help with that. What is the best number to reach you on?",
            quickReplies: [{ id: "otp", label: "Actually, my OTP isn't arriving" }],
          };
      }
    },
  },
};

/**
 * **Controlled.** `messages` and `typing` come from the consumer, so the widget
 * renders that transcript and runs no sequence of its own. This is the mode a
 * real deployment uses. Note the user's turn: a bubble mirrored to the right,
 * its square corner pointing at the edge it came from, so the two speakers are
 * distinguishable without reading a word.
 */
export const ControlledTranscript: Story = {
  render: (args) => {
    const messages: ChatbotMessage[] = [
      { id: "1", from: "bot", text: "This is an assistant for the Ministry of Social Justice. How can I help you?" },
      { id: "2", from: "user", text: "I'm not receiving OTP." },
      {
        id: "3",
        from: "bot",
        text: "Which portal are you signing in to? PM-AJAY and SMILE send OTPs from different gateways.",
      },
    ];
    return (
      <Chatbot
        {...args}
        messages={messages}
        typing
        quickReplies={[
          { id: "pmajay", label: "PM-AJAY" },
          { id: "smile", label: "SMILE" },
        ]}
      />
    );
  },
};

/**
 * **The empty opening.** No suggestions offered, so the bot greets and stops.
 * Worth looking at because it is the state a misconfigured deployment lands in
 * — a greeting with nothing to press is a dead end, and if you see this in a
 * portal the `quickReplies` prop was forgotten.
 */
export const GreetingOnly: Story = {
  args: { quickReplies: [] },
};

/**
 * A longer transcript, to check that the log scrolls and stays pinned to the
 * newest message, and that a run of consecutive bot turns shows **one** avatar
 * rather than one per bubble.
 */
export const LongConversation: Story = {
  render: (args) => (
    <Chatbot
      {...args}
      messages={[
        { id: "1", from: "bot", text: "This is an assistant for the Ministry of Social Justice. How can I help you?" },
        { id: "2", from: "user", text: "How to register as a developer." },
        { id: "3", from: "bot", text: "Registration runs through the MoSJE API gateway." },
        { id: "4", from: "bot", text: "You'll need your organisation's PAN to begin." },
        { id: "5", from: "bot", text: "And an authorised signatory's Aadhaar for e-sign." },
        { id: "6", from: "user", text: "Portal navigation help" },
        {
          id: "7",
          from: "bot",
          text: "Every portal is reachable from the SAMAVESH hub. Which one were you looking for?",
        },
      ]}
      quickReplies={[
        { id: "nmba", label: "NMBA" },
        { id: "scw", label: "SCW" },
        { id: "nos", label: "National Overseas Scholarship" },
      ]}
    />
  ),
};

/**
 * **Controlled open state.** `open` + `onOpenChange` hand the panel's visibility
 * to the consumer — needed when something else on the page must open the chat
 * (a "still stuck?" prompt after a failed submit, say).
 */
export const ControlledOpenState: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
        <button type="button" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Open"} the assistant from outside
        </button>
        <Chatbot
          {...args}
          open={open}
          onOpenChange={setOpen}
          quickReplies={SCHEME_REPLIES}
          // A CONTROLLED consumer owns its transcript, so it must clear it here
          // AND re-seed its greeting: the panel no longer closes on Start over,
          // so nothing else will start the conversation again. This story has no
          // transcript of its own to clear, so it only has to keep the panel open.
          onEndChat={() => setOpen(true)}
        />
      </div>
    );
  },
};

/**
 * **ChatbotMascot** on its own — the mark the launcher and every bot message
 * are built from.
 *
 * `size` is the rendered diameter; every inner measurement is a share of it, so
 * the mark scales cleanly between the two sizes the design actually uses.
 * `ring` adds the white band carrying the circular bilingual wordmark — true at
 * 84px, false at 37px, because at avatar size the wordmark is unreadable and
 * only muddies the silhouette. `spin` turns the wordmark's rotation on
 * independently of the launcher's hover, for the rare case a consumer wants a
 * standalone mark to be alive; it is inert under `prefers-reduced-motion`.
 *
 * The artwork is exported from Figma, never redrawn: the wordmark is 56 glyph
 * outlines merged into one path (so it can rotate as a rigid body), and the
 * robot is a WebP because it is a 3D render with no vector original.
 */
export const Mascot: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <ChatbotMascot size={84} ring aria-label="Samajik Sahayak, the SAMAVESH assistant" />
      <ChatbotMascot size={84} ring spin />
      <ChatbotMascot size={56} />
      <ChatbotMascot size={37} />
    </div>
  ),
};
