"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { useCornerRailOffset } from "../../foundations/corner-rail";
import { Button } from "../actions/button";
import { Icon } from "../utilities/icon";
import { ChatbotMascot } from "./chatbot-mascot";
import "./chatbot.css";

/* ---------------------------------------------------------------------------
   Types
   ------------------------------------------------------------------------- */

export interface ChatbotMessage {
  id: string;
  /** Who said it. Drives side, bubble shape and whether an avatar is shown. */
  from: "bot" | "user";
  text: string;
}

export interface ChatbotQuickReply {
  id: string;
  label: string;
}

/** What `onQuickReply` may hand back so the bot can answer without a backend. */
export interface ChatbotReply {
  text: string;
  /** Replaces the offered quick replies. Omit to keep the current set; pass `[]` to clear. */
  quickReplies?: readonly ChatbotQuickReply[];
}

// `onSubmit` is omitted alongside `onSelect` because both collide with a DOM
// handler of the same name on the root div, and ours take different arguments.
export interface ChatbotProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "onSubmit"> {
  /** Controlled open state. Omit to let the widget own it. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /**
   * Panel header. Defaults to the assistant's own name, which is what the seal
   * on the launcher says — see CHATBOT_NAME below for why it is not an
   * invitation like "Chat with us".
   *
   * @default "Samajik Sahayak"
   */
  title?: string;
  /** Devanagari name under the title. Pass "" to suppress it. */
  subtitle?: string;
  /**
   * Label for the footer's reset button.
   *
   * "Start over", not "End chat". The control clears the transcript and returns
   * the assistant to its greeting — it does NOT close the panel, and it never
   * ends anything. It used to close the panel too, which made "End chat" half
   * true and made the control redundant with the header's ✕. The prop keeps its
   * name because two consumers pass it; only the default and the behaviour moved.
   *
   * @default "Start over"
   */
  endChatLabel?: string;
  /**
   * The honest statement of what this assistant is not. Shown under the
   * composer, where the live panel puts its own disclaimer.
   */
  note?: string;
  /**
   * Show a free-text composer.
   *
   * The live assistant has one because it is a generative model. Ours runs a
   * fixed script, so this defaults ON only to match the affordance a citizen
   * arriving from dosje.gov.in already expects — and `onSubmit` decides what
   * happens. With no handler, an unrecognised question gets an honest
   * "I can't answer that, but here is what I can do" rather than silence.
   * @default true
   */
  composer?: boolean;
  /** @default "Type something…" */
  composerPlaceholder?: string;
  /**
   * Handle a typed question. Return a `ChatbotReply` to answer it. Omit, and
   * the widget falls back to re-offering the suggestions.
   */
  onSubmit?: (text: string) => ChatbotReply | Promise<ChatbotReply | void> | void;
  /** Accessible name of the launcher. @default "Samajik Sahayak, chat assistant" */
  launcherLabel?: string;

  /** The bot's opening line, typed out on first open. */
  greeting?: string;
  /** Suggestions offered under the greeting. */
  quickReplies?: readonly ChatbotQuickReply[];

  /**
   * Controlled transcript. When provided the widget renders exactly this and
   * runs no scripted sequence of its own — the consumer owns the conversation.
   */
  messages?: readonly ChatbotMessage[];
  /** Show the bot's typing indicator. Only meaningful alongside `messages`. */
  typing?: boolean;

  /**
   * Called when a suggestion is pressed. Return a `ChatbotReply` (or a promise
   * of one) and the widget will show the user's message, type for a beat, then
   * render the answer. Return nothing and only the user's message is appended.
   */
  onQuickReply?: (reply: ChatbotQuickReply) => ChatbotReply | Promise<ChatbotReply | void> | void;
  /** Called when "Start over" is pressed, after the transcript is cleared. */
  onEndChat?: () => void;

  /**
   * How long the typing indicator runs before a bot message lands.
   * @default 900
   */
  typingDelayMs?: number;

  /**
   * `fixed` pins the widget to the bottom-right of the viewport (its home).
   * `inline` drops the positioning so a docs page or a story can place it.
   * @default "fixed"
   */
  placement?: "fixed" | "inline";
}

/* ---------------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------------- */

/**
 * The assistant's name, in both scripts.
 *
 * It is NOT a nickname, and the Figma mock's "Noddy" is gone. Three reasons,
 * and the first alone settles it:
 *
 *  1. The mark this component renders has the name written ON it — the seal
 *     reads "सामाजिक सहायक · Samajik Sahayak", twice around the ring. A widget
 *     that introduces itself as something other than the badge it is wearing
 *     is not a personality, it is a defect.
 *  2. The live assistant on dosje.gov.in is called Samajik Sahayak. A citizen
 *     who has used that one must not meet a differently-named bot here.
 *  3. "Noddy" is a British children's character. It is somebody else's
 *     property and it is the wrong register for a Government of India service.
 */
export const CHATBOT_NAME = "Samajik Sahayak";
export const CHATBOT_NAME_HI = "सामाजिक सहायक";

const DEFAULT_GREETING =
  "This is an assistant for the Ministry of Social Justice. How can I help you?";

/**
 * Panel exit duration. Must stay in step with `--ds-chatbot-exit` in
 * chatbot.css — the element is unmounted from JS, so if this were shorter than
 * the CSS the panel would vanish mid-animation.
 */
const EXIT_MS = 160;

/** Beat between the panel opening and the bot starting to type. */
const OPENING_BEAT_MS = 260;

let seq = 0;
const nextId = () => `m${++seq}`;

/* ---------------------------------------------------------------------------
   Component
   ------------------------------------------------------------------------- */

/**
 * **Chatbot** — the SAMAVESH assistant surface: a launcher that folds open
 * into a conversation panel.
 *
 * Two ways to use it, and they do not mix:
 *
 * - **Uncontrolled (the default).** Give it a `greeting` and `quickReplies`
 *   and it runs the whole scripted opening on its own — panel, then the bot
 *   typing, then the greeting, then the suggestions cascading in. Pressing a
 *   suggestion echoes it as the user's message and, if `onQuickReply` returns
 *   a `ChatbotReply`, types out the answer. No backend needed for a review
 *   build, and the same handler can call a real one later.
 * - **Controlled.** Pass `messages` (and `typing`) and the widget renders that
 *   and nothing else. The scripted sequence is skipped entirely, because two
 *   things writing the transcript is how a chat surface starts double-posting.
 *
 * Motion was authored here first and pushed to Figma second: every timing is a
 * decision, documented with its reasoning at the top of `chatbot.css`. The three
 * loops now exist on both sides — the typing wave is keyframed on the Figma
 * master's `State=Typing`, the mascot float on `Chatbot Mascot` — so an instance
 * dropped into any frame carries the same motion this stylesheet describes.
 *
 * Accessibility: the panel is a **non-modal** dialog — it never traps focus and
 * never blocks the page behind it, because a support widget that hostages the
 * keyboard is worse than no support widget. Escape closes it and focus returns
 * to the launcher. New messages are announced through a polite live region.
 */
export const Chatbot = React.forwardRef<HTMLDivElement, ChatbotProps>(function Chatbot(
  {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    title = CHATBOT_NAME,
    subtitle = CHATBOT_NAME_HI,
    endChatLabel = "Start over",
    note = "Samajik Sahayak points you to the right portal. It cannot decide or change an application.",
    composer = true,
    composerPlaceholder = "Type something…",
    onSubmit,
    launcherLabel = `${CHATBOT_NAME}, chat assistant`,
    greeting = DEFAULT_GREETING,
    quickReplies,
    messages: messagesProp,
    typing: typingProp,
    onQuickReply,
    onEndChat,
    typingDelayMs = 900,
    placement = "fixed",
    className,
    ...rest
  },
  ref,
) {
  const controlledOpen = openProp !== undefined;
  const controlledTranscript = messagesProp !== undefined;

  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = controlledOpen ? openProp : openState;

  /** Kept mounted through the exit transition, then dropped. */
  const [mounted, setMounted] = React.useState(open);
  const [ownMessages, setOwnMessages] = React.useState<readonly ChatbotMessage[]>([]);
  const [ownTyping, setOwnTyping] = React.useState(false);
  const [ownReplies, setOwnReplies] = React.useState<readonly ChatbotQuickReply[]>(
    quickReplies ?? [],
  );
  const [repliesShown, setRepliesShown] = React.useState(false);
  /**
   * Bumped by "Start over" to re-run the scripted opening.
   *
   * The opening effect guards on `greeted.current`, and resetting that ref
   * changes nothing on its own — a ref is not reactive, so React has no reason
   * to re-run anything. While Start over also closed the panel, `open` flipping
   * did the re-triggering by accident. It no longer closes, so the trigger has
   * to be explicit.
   */
  const [restartToken, setRestartToken] = React.useState(0);
  /** Bot messages that landed while the panel was shut. Drives the launcher's nudge. */
  const [unread, setUnread] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const draftId = React.useId();

  const launcherRef = React.useRef<HTMLButtonElement>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  /**
   * A stable stand-in so the corner rail can be switched off without breaking
   * the rules of hooks. `useCornerRailOffset` early-returns on a null
   * `.current`, so handing it this ref is a no-op — no observers, no polling.
   */
  const inertRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const logRef = React.useRef<HTMLDivElement>(null);
  const timers = React.useRef<number[]>([]);
  const greeted = React.useRef(false);

  /**
   * The bottom-right corner is shared, and the thing most likely to be sharing
   * it is the UX4G accessibility widget's floating button. That button is
   * `display: none` on every page carrying an `AccessibilityBar` and visible on
   * every page that is not — so the corner's occupancy genuinely differs by
   * route and cannot be written down. The rail measures it and lifts us clear;
   * where the corner is empty we sit at its 32px rest offset.
   *
   * Inline placement is not in the corner at all, so it gets the inert ref.
   */
  useCornerRailOffset(placement === "fixed" ? rootRef : inertRef);

  const messages = controlledTranscript ? messagesProp : ownMessages;
  const typing = controlledTranscript ? Boolean(typingProp) : ownTyping;
  const replies = controlledTranscript ? (quickReplies ?? []) : ownReplies;

  const after = React.useCallback((ms: number, fn: () => void) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  React.useEffect(() => clearTimers, [clearTimers]);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlledOpen) setOpenState(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  /* -- mount / unmount around the exit transition ------------------------- */
  React.useEffect(() => {
    if (open) {
      setMounted(true);
      setUnread(0);
      return;
    }
    if (!mounted) return;
    const t = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open, mounted]);

  /* -- the scripted opening, once, and only when we own the transcript ---- */
  React.useEffect(() => {
    if (!open || controlledTranscript || greeted.current) return;
    greeted.current = true;

    after(OPENING_BEAT_MS, () => setOwnTyping(true));
    after(OPENING_BEAT_MS + typingDelayMs, () => {
      setOwnTyping(false);
      setOwnMessages([{ id: nextId(), from: "bot", text: greeting }]);
    });
    // The suggestions land a beat after the message they belong to, so the
    // eye reads "here is the answer" before "here is what you can ask".
    after(OPENING_BEAT_MS + typingDelayMs + 320, () => setRepliesShown(true));
  }, [open, controlledTranscript, greeting, typingDelayMs, after, restartToken]);

  /* -- keep the suggestion set in step when the prop changes -------------- */
  React.useEffect(() => {
    if (!controlledTranscript) setOwnReplies(quickReplies ?? []);
  }, [quickReplies, controlledTranscript]);

  /* -- count what arrived while shut -------------------------------------- */
  const lastCount = React.useRef(messages.length);
  React.useEffect(() => {
    const grew = messages.length > lastCount.current;
    lastCount.current = messages.length;
    if (grew && !open && messages[messages.length - 1]?.from === "bot") {
      setUnread((n) => n + 1);
    }
  }, [messages, open]);

  /* -- follow the conversation -------------------------------------------- */
  React.useEffect(() => {
    const log = logRef.current;
    if (!log || !open) return;
    log.scrollTop = log.scrollHeight;
  }, [messages, typing, repliesShown, open]);

  /* -- Escape closes, focus goes home -------------------------------------- */
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setOpen(false);
      launcherRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  /* -- opening moves focus into the panel, not past it --------------------- */
  const wasOpen = React.useRef(open);
  React.useEffect(() => {
    if (open && !wasOpen.current) {
      // Next frame: the panel is mounted but not yet laid out on this one, and
      // focusing an element mid-transition scrolls the page to meet it.
      const raf = requestAnimationFrame(() => panelRef.current?.focus());
      wasOpen.current = open;
      return () => cancelAnimationFrame(raf);
    }
    wasOpen.current = open;
  }, [open]);

  const handleLauncher = () => {
    const next = !open;
    setOpen(next);
    if (!next) launcherRef.current?.focus();
  };

  /**
   * START OVER. It resets the conversation and LEAVES THE PANEL OPEN.
   *
   * It used to call `setOpen(false)` as well, which made it a second way to
   * close — and the header already has one, correctly labelled "Minimise chat".
   * Two controls that both close, one of which also destroys the transcript, is
   * how somebody loses a conversation reaching for the wrong one. It also meant
   * that starting fresh cost a reopen plus the whole scripted typing sequence
   * again, which is a strange price for "ask me something else".
   *
   * Staying open is also what lets the label be true. A control that closes the
   * panel cannot honestly be called "Start over", and a control that resets the
   * transcript cannot honestly be called "End chat" — the old pairing was wrong
   * whichever of the two words you trusted.
   */
  const handleEndChat = () => {
    clearTimers();
    if (!controlledTranscript) {
      setOwnMessages([]);
      setOwnTyping(false);
      setRepliesShown(false);
      setOwnReplies(quickReplies ?? []);
      greeted.current = false;
      // The scripted opening is keyed on `open` flipping. The panel is no
      // longer flipping, so nothing would re-run it and the citizen would be
      // left staring at an empty panel. This is the re-trigger.
      setRestartToken((n) => n + 1);
    }
    onEndChat?.();
    // The button unmounts the instant the transcript empties (`messages.length
    // > 0` guards it), so focus would otherwise fall to <body> and a keyboard
    // user would be dropped out of the dialog they are still inside. The panel
    // is `tabIndex={-1}` and labelled, so it is the correct landing place — and
    // the greeting that follows is announced by the log's live region.
    panelRef.current?.focus();
  };

  /**
   * A typed question.
   *
   * Shares one code path with a pressed suggestion, because to the transcript
   * they are the same event: the citizen said something, the bot answers. The
   * only difference is where the text came from.
   */
  const handleSubmitDraft = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await say(text, () => onSubmit?.(text));
  };

  /**
   * Append what the citizen said, then the answer — with the typing beat in
   * between, so the bot is never seen to answer instantly. An instant reply to
   * a typed question reads as a canned form response, which is exactly what it
   * is, and the beat is what stops it feeling like one.
   */
  const say = async (
    said: string,
    resolve: () => ChatbotReply | Promise<ChatbotReply | void> | void,
  ) => {
    setOwnMessages((prev) => [...prev, { id: nextId(), from: "user", text: said }]);
    setRepliesShown(false);

    const answer = await resolve();
    setOwnTyping(true);
    after(typingDelayMs, () => {
      setOwnTyping(false);
      setOwnMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          from: "bot",
          // No handler, or a handler that declined: say so plainly rather than
          // going quiet. A chat that swallows a question looks broken.
          text:
            answer?.text ??
            "I can only help with a few things at the moment. Try one of these:",
        },
      ]);
      if (answer?.quickReplies !== undefined) setOwnReplies(answer.quickReplies);
      after(320, () => setRepliesShown(true));
    });
  };

  const handleQuickReply = async (reply: ChatbotQuickReply) => {
    if (controlledTranscript) {
      await onQuickReply?.(reply);
      return;
    }
    await say(reply.label, () => onQuickReply?.(reply));
  };

  const showReplies = replies.length > 0 && (controlledTranscript ? true : repliesShown);
  /** Who owns the transcript decides who may wipe it. See the footer below. */
  const canEndChat = controlledTranscript ? Boolean(onEndChat) : true;
  const titleId = React.useId();

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn("ds-chatbot", `ds-chatbot--${placement}`, className)}
      // The right wall is shared. One attribute is the whole contract: it tells
      // `useWallRailOffset` something is here, so the demo dock's rail places
      // itself clear of it instead of on top of it.
      // See .claude/rules/portal-appswitcher.md → Placement.
      //
      // BOTH ARE GATED ON `fixed`, because an INLINE instance is not in the
      // corner and is not on the wall — it is a specimen sitting in the page
      // flow, and this docs page renders one. It claimed both anyway. Nothing
      // moved, because the rail's own guards rejected it twice over (outside
      // the corner zone, and 811px tall against a 200px ceiling) — but a widget
      // that has to be saved by someone else's guard is a defect waiting for
      // the day a specimen happens to be small and bottom-right.
      {...(placement === "fixed"
        ? { "data-sa-wall-occupant": "", "data-sa-corner-occupant": "" }
        : {})}
      data-state={open ? "open" : "closed"}
      // Kept as a state hook for consumers and end-to-end tests. Nothing in this
      // stylesheet reads it any more: it used to spin the seal, which turned out
      // to be invisible at exactly the moment it fired — see the note beside
      // `--spin` in chatbot.css.
      data-thinking={typing || undefined}
      {...rest}
    >
      {mounted && (
        <div
          ref={panelRef}
          className="ds-chatbot__panel"
          data-state={open ? "open" : "closed"}
          data-expanded={expanded || undefined}
          role="dialog"
          // Non-modal on purpose: the page behind stays operable and focus is
          // never trapped. A help widget must not hold the keyboard hostage.
          aria-modal="false"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          {/*
            IDENTITY STAYS PUT. The greeting scrolls away after two exchanges,
            and with it the only statement of who is answering — so the name
            lives in the header, where it cannot leave. This is also what the
            live assistant on dosje.gov.in does, and the reason is the same.

            The two controls are EXPAND and CLOSE, in that order, matching the
            live panel. What is deliberately NOT here is "Start over": it wipes
            the transcript, and the top-right of a panel is where every user on
            earth expects a harmless dismiss. Putting a clearing action in that
            slot means people will lose their conversation reaching for the
            close button. It sits in the footer instead, quietly.

            The two are now cleanly separated by outcome, which they were not
            before: ✕ closes and KEEPS the conversation, Start over keeps the
            panel and CLEARS it. Neither does both, so neither can be pressed
            for one effect and deliver the other.
          */}
          <header className="ds-chatbot__header">
            <ChatbotMascot className="ds-chatbot__brand-mark" size={40} />
            <span className="ds-chatbot__brand">
              <h2 className="ds-chatbot__title" id={titleId}>
                {title}
              </h2>
              {subtitle && (
                <span className="ds-chatbot__subtitle" lang="hi">
                  {subtitle}
                </span>
              )}
            </span>

            <button
              type="button"
              className="ds-chatbot__icon-btn"
              aria-label={expanded ? "Restore panel size" : "Expand panel"}
              aria-pressed={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              <Icon name={expanded ? "close_fullscreen" : "open_in_full"} size={20} />
            </button>
            <button
              type="button"
              className="ds-chatbot__icon-btn"
              aria-label="Minimise chat"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
            >
              <Icon name="close" size={20} />
            </button>
          </header>

          <div className="ds-chatbot__log" ref={logRef}>
            <div
              className="ds-chatbot__stream"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label={title}
            >
              {messages.map((m, i) => {
                // One avatar per run of bot messages, not one per bubble —
                // a column of identical avatars reads as noise.
                const leads = m.from === "bot" && messages[i - 1]?.from !== "bot";
                return (
                  <div
                    key={m.id}
                    className={cn("ds-chatbot__turn", `ds-chatbot__turn--${m.from}`)}
                  >
                    {leads && (
                      <ChatbotMascot className="ds-chatbot__avatar" size={40} />
                    )}
                    <p className={cn("ds-chatbot__bubble", `ds-chatbot__bubble--${m.from}`)}>
                      {m.text}
                    </p>
                  </div>
                );
              })}

              {typing && (
                <div className="ds-chatbot__turn ds-chatbot__turn--bot">
                  {messages[messages.length - 1]?.from !== "bot" && (
                    <ChatbotMascot className="ds-chatbot__avatar" size={40} />
                  )}
                  <span className="ds-chatbot__typing" aria-hidden="true">
                    <i /><i /><i /><i />
                  </span>
                  <span className="ds-chatbot__sr">Assistant is typing</span>
                </div>
              )}
            </div>

            {showReplies && (
              <ul className="ds-chatbot__replies" aria-label="Suggested questions">
                {replies.map((r, i) => (
                  <li
                    key={r.id}
                    className="ds-chatbot__reply-item"
                    // Stagger index is a paint concern, so it rides on the
                    // element rather than through a per-item class.
                    style={{ ["--ds-chatbot-i" as string]: i }}
                  >
                    <button
                      type="button"
                      className="ds-chatbot__reply"
                      onClick={() => void handleQuickReply(r)}
                    >
                      {r.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/*
            The footer carries the two things the live panel carries and this
            one was missing: a way to say something, and an honest statement of
            what the assistant is not.

            The note is NOT the live one's wording. Theirs says the assistant
            "can make mistakes" because it is a generative model. Ours is a
            fixed script, so claiming it might hallucinate would be false; what
            a citizen actually needs to know is that it routes and does not
            decide. Copying the sentence would have been cargo-culting the
            shape of a disclaimer without its meaning.
          */}
          <footer className="ds-chatbot__footer">
            {composer && (
              <form
                className="ds-chatbot__composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSubmitDraft();
                }}
              >
                <label className="ds-chatbot__sr" htmlFor={draftId}>
                  Type your question
                </label>
                <input
                  id={draftId}
                  className="ds-chatbot__input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder={composerPlaceholder}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="ds-chatbot__send"
                  aria-label="Send"
                  disabled={draft.trim().length === 0}
                >
                  <Icon name="send" size={16} />
                </button>
              </form>
            )}

            <div className="ds-chatbot__footer-row">
              <p className="ds-chatbot__note">{note}</p>
            {/*
              START OVER IS A SIBLING OF THE NOTE, NOT A WORD INSIDE IT. It used
              to live in the paragraph, separated by a space, which cost two
              things: the control stretched the note's last line box and broke
              the footer's rhythm, and — worse — it moved horizontally with the
              text wrap, so its position depended on how long the disclaimer
              happened to be. A control people reach for should be somewhere they
              can learn. It now shares a row with the note and sits hard right,
              which is a fixed place.

              IT IS A DS `Button`, NOT A HAND-ROLLED ONE, and the appearance is
              the whole reason the design-system-first rule exists. Written by
              hand it landed outlined in the estate's REJECTION red — the colour
              that means "your application failed" — for an action that is
              housekeeping, and became the loudest thing in a footer whose only
              filled control (Send) is disabled at rest. `variant="neutral"
              appearance="text"` is the register this always wanted: present,
              findable, and quieter than the disclaimer beside it.

              Shown when there is a conversation to end AND something can end
              it. Uncontrolled, that is always us. Controlled, the transcript
              is not ours to clear — so the button appears only where the
              consumer passed `onEndChat`, which is how it says it will.

              This used to read `!controlledTranscript`, which silently took
              the only way out of a conversation away from every controlled
              consumer. A widget that drops an affordance because of HOW it is
              driven, rather than whether the affordance can work, is making a
              decision that is not its to make.
            */}
              {canEndChat && messages.length > 0 && (
                <Button
                  type="button"
                  variant="neutral"
                  appearance="text"
                  size="sm"
                  className="ds-chatbot__end"
                  onClick={handleEndChat}
                >
                  {endChatLabel}
                </Button>
              )}
            </div>
          </footer>
        </div>
      )}

      <button
        type="button"
        ref={launcherRef}
        className="ds-chatbot__launcher"
        data-state={open ? "open" : "closed"}
        aria-label={
          unread > 0 ? `${launcherLabel}, ${unread} new message` : launcherLabel
        }
        aria-expanded={open}
        onClick={handleLauncher}
      >
        <ChatbotMascot className="ds-chatbot__mark" size={84} ring />
        <span className="ds-chatbot__close" aria-hidden="true">
          <Icon name="close" size={24} />
        </span>
        {unread > 0 && <span className="ds-chatbot__nudge" aria-hidden="true" />}
      </button>
    </div>
  );
});
