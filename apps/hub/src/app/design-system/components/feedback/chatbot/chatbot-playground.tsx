"use client";

import * as React from "react";
import { Chatbot, type ChatbotReply, Checkbox } from "@mosje/design-system";

/**
 * The scripted answers the demo replies with. Kept beside the playground rather
 * than inside the component: `Chatbot` deliberately owns no content of its own,
 * and a docs page that pretended otherwise would teach the wrong shape.
 */
const ANSWERS: Record<string, ChatbotReply> = {
  otp: {
    text: "OTP can take up to 60 seconds. Check that the mobile number on your profile is the one linked to Aadhaar.",
    quickReplies: [
      { id: "otp-still", label: "Still not received" },
      { id: "back", label: "Something else" },
    ],
  },
  scheme: {
    text: "Tell me who the scheme is for and I can point you at the right department page.",
    quickReplies: [
      { id: "student", label: "A student" },
      { id: "senior", label: "A senior citizen" },
      { id: "back", label: "Something else" },
    ],
  },
  status: {
    text: "Application status lives inside the portal you applied through. I cannot see it from here.",
    quickReplies: [{ id: "back", label: "Something else" }],
  },
};

const OPENING = [
  { id: "scheme", label: "Find a scheme" },
  { id: "status", label: "Check application status" },
  { id: "otp", label: "I'm not receiving OTP" },
];

export function ChatbotPlayground(): React.JSX.Element {
  const [composer, setComposer] = React.useState(true);
  const [subtitle, setSubtitle] = React.useState(true);
  const [note, setNote] = React.useState(true);

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-24)", flexWrap: "wrap" }}>
        <Checkbox label="Composer" size="sm" checked={composer} onCheckedChange={setComposer} />
        <Checkbox label="Devanagari subtitle" size="sm" checked={subtitle} onCheckedChange={setSubtitle} />
        <Checkbox label="Note under the log" size="sm" checked={note} onCheckedChange={setNote} />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <Chatbot
          placement="inline"
          defaultOpen
          composer={composer}
          note={note ? "Samajik Sahayak points you to the right portal. It cannot see your application." : ""}
          restartNotice="Your earlier conversation was cleared when you ended the chat."
          subtitle={subtitle ? undefined : ""}
          greeting="This is an assistant for the Ministry of Social Justice. How can I help you?"
          quickReplies={OPENING}
          onQuickReply={(reply) =>
            ANSWERS[reply.id] ?? {
              text: "I only follow a fixed script, so I cannot answer that one. Here is what I can do.",
              quickReplies: OPENING,
            }
          }
          onSubmit={() => ({
            text: "I follow a fixed script and cannot read free text yet. Try one of these.",
            quickReplies: OPENING,
          })}
        />
      </div>
    </div>
  );
}
