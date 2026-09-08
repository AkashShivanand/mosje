"use client";

import { useRef, useState } from "react";
import { Chatbot, SectionTitle, Card, CardBody, CardTitle, Badge } from "@mosje/design-system";
import type { ChatbotQuickReply, ChatbotReply } from "@mosje/design-system";
import "./assistant.css";

/**
 * The assistant option, built from the design system's own Chatbot rather than a
 * hand-rolled imitation of it. Everything a viewer sees here — the panel, the
 * seal, the bubbles, the quick replies, the composer and the disclaimer — is the
 * component the estate ships, so what is demonstrated is what would be built.
 *
 * DS Audit: Chatbot ✅ existing · SectionTitle ✅ existing · Card ✅ existing ·
 * Badge ✅ existing. DocumentLibrary was considered for the backdrop and passed
 * over: it carries filtering and pagination this page has no use for, and the
 * point here is the assistant, not the list behind it.
 */

type Step = { text: string; quickReplies: ChatbotQuickReply[] };

const q = (...labels: string[]): ChatbotQuickReply[] =>
  labels.map((label) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label }));

/** The five questions, in the order the design file asks them. */
const STEPS: Step[] = [
  {
    text:
      "I can narrow it down with five short questions. Skip any of them — skipping widens the answer rather than ending it.\n\nQuestion 1 of 5. Who is this for?",
    quickReplies: q("Myself", "Someone in my family", "An organisation I run"),
  },
  {
    text: "Question 2 of 5. Which of these describes you?",
    quickReplies: q("Scheduled Caste", "OBC or EBC", "Sanitation work", "Senior citizen", "Skip this"),
  },
  {
    text: "Question 3 of 5. What stage of life?",
    quickReplies: q("In school", "In college or beyond", "Of working age", "A senior citizen"),
  },
  {
    text: "Question 4 of 5. What kind of help do you need?",
    quickReplies: q("Education and fees", "Money to work with", "A home", "Health and care"),
  },
  {
    text: "Question 5 of 5. Which State do you live in?",
    quickReplies: q("Bihar", "Maharashtra", "Skip this"),
  },
  {
    /* One bubble, not a wall. The transcript renders a message as a single
       paragraph, so the three schemes are named here and opened from the
       suggestions beneath rather than stacked inside the sentence. */
    text:
      "That leaves 3, all run by MoSJE: the Post-Matric Scholarship, the Central Sector " +
      "Scholarship of Top Class Education, and the National Fellowship for M.Phil and PhD. " +
      "They list you as their target group — whether an application succeeds is the " +
      "sanctioning authority's decision, not mine.",
    quickReplies: q("Open Post-Matric Scholarship", "Open Top Class Education", "Open National Fellowship", "Start over"),
  },
];


/** Real publications from the Department's own Documents page. */
const DOCUMENTS = [
  { title: "Annual Report 2024\u201325", date: "29 July 2026", kind: "Report", size: "PDF, 2.4 MB" },
  { title: "NAMASTE \u2014 Revised Scheme Guidelines", date: "15 August 2026", kind: "Guidelines", size: "PDF, 3.1 MB" },
  { title: "PM-AJAY Operational Guidelines", date: "10 September 2025", kind: "Guidelines", size: "PDF, 2.0 MB" },
];

const GREETING =
  "This is the assistant for the Department of Social Justice & Empowerment. How can I help?";
const OPENERS = q("Which scheme applies to me?", "Where do I complain?");

export default function AssistantPrototype() {
  const step = useRef(0);
  const [open, setOpen] = useState(false);

  const onQuickReply = (reply: ChatbotQuickReply): ChatbotReply => {
    if (reply.label === "Start over") {
      step.current = 0;
      return { text: GREETING, quickReplies: OPENERS };
    }
    if (reply.label.startsWith("Open ")) {
      return {
        text: "Opening the National Scholarship Portal, where that application is made.",
        quickReplies: q("Start over"),
      };
    }
    if (reply.label === "Where do I complain?") {
      return {
        text:
          "The Public Grievance Portal takes complaints about a right denied, discrimination, or a benefit not received.",
        quickReplies: q("Which scheme applies to me?"),
      };
    }
    const next = STEPS[step.current];
    step.current = Math.min(step.current + 1, STEPS.length - 1);
    return next ? { text: next.text, quickReplies: next.quickReplies } : { text: GREETING };
  };

  return (
    <>
      <main className="sa-container sd-assistant">
        <SectionTitle
          eyebrow="The Assistant"
          title="Samajik Sahayak"
          description="The assistant sits in the corner of every page and can be opened without leaving what you were reading. It asks the same five questions, one at a time."
          as={2}
        />
        <div className="sd-assistant__page">
          <p className="sd-assistant__label">Documents</p>
          <ul className="sd-assistant__docs">
            {DOCUMENTS.map((d) => (
              <li key={d.title}>
                <Card>
                  <CardBody>
                    <CardTitle>{d.title}</CardTitle>
                    <p className="sd-assistant__meta">
                      {d.date} · {d.kind}
                    </p>
                    <Badge status="neutral" emphasis="subtle">{d.size}</Badge>
                  </CardBody>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <Chatbot
        open={open}
        onOpenChange={setOpen}
        greeting={GREETING}
        quickReplies={OPENERS}
        onQuickReply={onQuickReply}
        note="Samajik Sahayak points you to the right portal. It cannot decide or change an application."
        typingDelayMs={700}
      />
    </>
  );
}
