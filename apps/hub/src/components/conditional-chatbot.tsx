"use client";

import { usePathname } from "next/navigation";
import { Chatbot } from "@mosje/design-system";
import { chatbotEnabledAt } from "@/lib/chatbot/config";
import {
  CHATBOT_GREETING,
  CHATBOT_QUICK_REPLIES,
  chatbotAnswer,
} from "@/lib/chatbot/content";

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
 */
export function ConditionalChatbot({ enabledPaths }: { enabledPaths: readonly string[] }) {
  const pathname = usePathname();
  if (!chatbotEnabledAt(pathname, enabledPaths)) return null;

  return (
    <Chatbot
      placement="fixed"
      greeting={CHATBOT_GREETING}
      quickReplies={CHATBOT_QUICK_REPLIES}
      onQuickReply={(reply) => chatbotAnswer(reply.id)}
      launcherLabel="Samajik Sahayak, chat assistant"
    />
  );
}
