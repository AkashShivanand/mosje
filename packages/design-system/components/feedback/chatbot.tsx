"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
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

export interface ChatbotProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Controlled open state. Omit to let the widget own it. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Panel header. @default "Chat with us" */
  title?: string;
  /** Text of the dismiss action in the header. @default "End Chat" */
  endChatLabel?: string;
  /** Accessible name of the launcher. @default "Chat with us" */
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
  /** Called when "End Chat" is pressed, after the transcript is cleared. */
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

const DEFAULT_GREETING = "Hey, I am Noddy. How Can I help you?";

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
 * Motion is authored, not imported: the Figma node carries no keyframes
 * (`get_motion_context` returns an empty set), so every timing here is a
 * decision — documented, with its reasoning, at the top of `chatbot.css`.
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
    title = "Chat with us",
    endChatLabel = "End Chat",
    launcherLabel = "Chat with us",
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
  /** Bot messages that landed while the panel was shut. Drives the launcher's nudge. */
  const [unread, setUnread] = React.useState(0);

  const launcherRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const logRef = React.useRef<HTMLDivElement>(null);
  const timers = React.useRef<number[]>([]);
  const greeted = React.useRef(false);

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
  }, [open, controlledTranscript, greeting, typingDelayMs, after]);

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

  const handleEndChat = () => {
    clearTimers();
    setOpen(false);
    if (!controlledTranscript) {
      setOwnMessages([]);
      setOwnTyping(false);
      setRepliesShown(false);
      setOwnReplies(quickReplies ?? []);
      greeted.current = false;
    }
    onEndChat?.();
    launcherRef.current?.focus();
  };

  const handleQuickReply = async (reply: ChatbotQuickReply) => {
    if (controlledTranscript) {
      await onQuickReply?.(reply);
      return;
    }

    setOwnMessages((prev) => [...prev, { id: nextId(), from: "user", text: reply.label }]);
    setRepliesShown(false);

    const answer = await onQuickReply?.(reply);
    if (!answer) {
      setOwnReplies([]);
      return;
    }

    setOwnTyping(true);
    after(typingDelayMs, () => {
      setOwnTyping(false);
      setOwnMessages((prev) => [...prev, { id: nextId(), from: "bot", text: answer.text }]);
      if (answer.quickReplies !== undefined) setOwnReplies(answer.quickReplies);
      after(320, () => setRepliesShown(true));
    });
  };

  const showReplies = replies.length > 0 && (controlledTranscript ? true : repliesShown);
  const titleId = React.useId();

  return (
    <div
      ref={ref}
      className={cn("ds-chatbot", `ds-chatbot--${placement}`, className)}
      // The right wall is shared. One attribute is the whole contract: it tells
      // `useWallRailOffset` something is here, so the demo dock's rail places
      // itself clear of it instead of on top of it.
      // See .claude/rules/portal-appswitcher.md → Placement.
      data-sa-wall-occupant=""
      data-state={open ? "open" : "closed"}
      {...rest}
    >
      {mounted && (
        <div
          ref={panelRef}
          className="ds-chatbot__panel"
          data-state={open ? "open" : "closed"}
          role="dialog"
          // Non-modal on purpose: the page behind stays operable and focus is
          // never trapped. A help widget must not hold the keyboard hostage.
          aria-modal="false"
          aria-labelledby={titleId}
          tabIndex={-1}
        >
          <header className="ds-chatbot__header">
            <h2 className="ds-chatbot__title" id={titleId}>
              {title}
            </h2>
            <button type="button" className="ds-chatbot__end" onClick={handleEndChat}>
              {endChatLabel}
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
                      <ChatbotMascot className="ds-chatbot__avatar" size={37} />
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
                    <ChatbotMascot className="ds-chatbot__avatar" size={37} />
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
        </div>
      )}

      <button
        type="button"
        ref={launcherRef}
        className="ds-chatbot__launcher"
        data-state={open ? "open" : "closed"}
        aria-label={
          unread > 0 ? `${launcherLabel} — ${unread} new message` : launcherLabel
        }
        aria-expanded={open}
        onClick={handleLauncher}
      >
        <ChatbotMascot className="ds-chatbot__mark" size={84} ring />
        <span className="ds-chatbot__close" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" focusable="false">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </span>
        {unread > 0 && <span className="ds-chatbot__nudge" aria-hidden="true" />}
      </button>
    </div>
  );
});
