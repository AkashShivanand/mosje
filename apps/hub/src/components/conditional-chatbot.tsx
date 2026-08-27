"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Chatbot, type ChatbotMessage, type ChatbotQuickReply } from "@mosje/design-system";
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
  /**
   * Conversations already finished with, kept above the live one.
   *
   * "Start over" does not clear — it starts a new session and pushes the old
   * transcript in here, under a rule. The finder's own stack is a stack of
   * FRAMES within one conversation, and going back is a pop of it; this is a
   * different thing entirely, which is why it lives beside the session rather
   * than inside it. The finder never has to know a restart happened.
   */
  const [carried, setCarried] = React.useState<readonly ChatbotMessage[]>([]);
  /**
   * How many times Start over has been pressed. It exists ONLY to keep React
   * keys unique: the finder derives message ids from script nodes, so a second
   * run of the same conversation produces the SAME ids as the first, and two
   * children with one key is a rendering defect rather than a visible one.
   */
  const [restarts, setRestarts] = React.useState(0);

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
   * Start over: carry the conversation up, then greet again beneath it.
   *
   * IT DOES NOT CLEAR, AND THAT IS THE WHOLE DESIGN. It used to, and the cost
   * was a control that could take away every answer a citizen had given — which
   * is what made its position, 25px under Send in the same column, worth an
   * argument. Nothing is destroyed now, so the mis-tap costs a scroll.
   *
   * The timers go FIRST. A typing beat in flight would otherwise land a
   * committed answer a moment after the restart, and the conversation the
   * citizen just left would carry on writing itself underneath the new one.
   *
   * THE REPLAY IS THE PART THAT IS EASY TO MISS. This used to end with
   * `setSession(null)` and stop, which was correct only because the widget also
   * closed the panel — the next OPEN ran `handleOpenChange`, which greets from a
   * null session. The panel no longer closes, so nothing would call it, and the
   * citizen would be left looking at an empty panel with a composer. Greeting
   * here restores the behaviour the close was accidentally providing, and does
   * it with the same 900ms beat so a fresh start reads exactly like a first one.
   */
  const handleEndChat = React.useCallback(() => {
    clearTimers();
    // Whatever is on screen right now, including a half-landed echo.
    const shown = pending ?? (session ? finderCurrent(session) : null);
    const round = restarts + 1;
    setCarried((prev) => [
      ...prev,
      // Re-keyed per round: the finder's ids repeat across runs of the script.
      ...(shown?.messages ?? []).map((m) => ({ ...m, id: `r${round}:${m.id}` })),
      { id: `r${round}:break`, from: "system" as const, text: "New conversation" },
    ]);
    setRestarts(round);
    setPending(null);
    setSession(null);
    setTyping(true);
    after(900, () => {
      setTyping(false);
      setSession(finderSessionStart(CHATBOT_SCRIPT));
    });
  }, [clearTimers, after, pending, session, restarts]);

  if (!chatbotEnabledAt(pathname, enabledPaths)) return null;

  const view = pending ?? (session ? finderCurrent(session) : null);

  return (
    <Chatbot
      placement="fixed"
      onOpenChange={handleOpenChange}
      messages={carried.length > 0 ? [...carried, ...(view?.messages ?? [])] : (view?.messages ?? [])}
      typing={typing}
      quickReplies={view?.quickReplies ?? []}
      onQuickReply={handleQuickReply}
      onSubmit={handleSubmit}
      onEndChat={handleEndChat}
      launcherLabel="Samajik Sahayak, chat assistant"
    />
  );
}
