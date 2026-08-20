"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Chatbot, type ChatbotQuickReply } from "@mosje/design-system";
import { chatbotEnabledAt } from "@/lib/chatbot/config";
import { CHATBOT_SCRIPT } from "@/lib/chatbot/content";
import {
  finderCurrent,
  finderEcho,
  finderSessionAnswer,
  finderSessionStart,
  finderSessionSubmit,
  type FinderFrame,
  type FinderSession,
} from "@/lib/chatbot/finder";

/**
 * Mounts the assistant on the surfaces an admin has switched it on for.
 *
 * Mounted ONCE, in the hub root layout, for the same reason `DemoDock` is: the
 * hub natively hosts every portal, so a per-portal mount would be something
 * each new portal has to remember, and would eventually be forgotten — or
 * doubled, which is the defect the old per-page `DemoFab` mounts produced.
 *
 * `enabledPaths` is resolved server-side (the settings store is server-only)
 * and carries only the surfaces that are ON, because absence already means off.
 * The decision itself is `chatbotEnabledAt`, shared with the server so the two
 * cannot drift apart about what a path means.
 *
 * CONTROLLED, since the scheme finder shipped. The widget's own scripted mode
 * appends to a transcript it owns, which has no way to take a message back —
 * and "go back" has to. So the session in `lib/chatbot/finder.ts` owns the
 * transcript as a stack of whole frames, this component renders the top of the
 * stack, and going back is a pop. Two things writing one transcript is how a
 * chat surface starts double-posting, so the widget writes none of it.
 */
export function ConditionalChatbot({ enabledPaths }: { enabledPaths: readonly string[] }) {
  const pathname = usePathname();

  /*
   * Null until the panel is first opened. The greeting is not seeded at mount
   * for two reasons: a bot message arriving while the panel is shut counts as
   * unread and would put a nudge on a launcher nobody has touched, and the
   * opening typing beat is what stops the greeting reading as a canned banner.
   */
  const [session, setSession] = React.useState<FinderSession | null>(null);
  /** The half-turn shown for the length of the typing beat. Never on the stack. */
  const [pending, setPending] = React.useState<FinderFrame | null>(null);
  const [typing, setTyping] = React.useState(false);

  const timers = React.useRef<number[]>([]);
  const clearTimers = React.useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);
  const after = React.useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  React.useEffect(() => clearTimers, [clearTimers]);

  /** The typing beat, then the answer. Matches the widget's own 900ms cadence. */
  const answer = React.useCallback(
    (echo: FinderFrame, next: FinderSession) => {
      setPending(echo);
      setTyping(true);
      after(900, () => {
        setTyping(false);
        setPending(null);
        setSession(next);
      });
    },
    [after],
  );

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open || session) return;
      setTyping(true);
      after(900, () => {
        setTyping(false);
        setSession(finderSessionStart(CHATBOT_SCRIPT));
      });
    },
    [session, after],
  );

  const handleQuickReply = React.useCallback(
    (pressed: ChatbotQuickReply) => {
      if (!session) return;
      const next = finderSessionAnswer(session, CHATBOT_SCRIPT, pressed);
      // Going back is a pop, so there is nothing to type out and no echo — the
      // transcript simply returns to where it was.
      if (next.frames.length < session.frames.length) {
        setPending(null);
        setSession(next);
        return;
      }
      answer(finderEcho(session, pressed.label), next);
    },
    [session, answer],
  );

  const handleSubmit = React.useCallback(
    (text: string) => {
      if (!session) return;
      answer(finderEcho(session, text), finderSessionSubmit(session, CHATBOT_SCRIPT, text));
    },
    [session, answer],
  );

  /**
   * End chat: drop the session, and with it the whole frame stack.
   *
   * The timers go FIRST. A typing beat in flight would otherwise land a
   * committed answer a moment after the transcript was cleared, and the
   * conversation a citizen just ended would reappear on its own.
   *
   * Reopening replays the greeting with its opening beat, because the session
   * being null is exactly what `handleOpenChange` starts from.
   */
  const handleEndChat = React.useCallback(() => {
    clearTimers();
    setTyping(false);
    setPending(null);
    setSession(null);
  }, [clearTimers]);

  if (!chatbotEnabledAt(pathname, enabledPaths)) return null;

  const view = pending ?? (session ? finderCurrent(session) : null);

  return (
    <Chatbot
      placement="fixed"
      onOpenChange={handleOpenChange}
      messages={view?.messages ?? []}
      typing={typing}
      quickReplies={view?.quickReplies ?? []}
      onQuickReply={handleQuickReply}
      onSubmit={handleSubmit}
      onEndChat={handleEndChat}
      launcherLabel="Samajik Sahayak, chat assistant"
    />
  );
}
