/**
 * What the assistant says.
 *
 * Deliberately code, not configuration. The admin panel decides WHERE the
 * assistant appears; it does not decide what it claims about government
 * schemes. A free-text box in an admin panel that publishes unreviewed answers
 * about eligibility and grievance routes to citizens is a content-governance
 * problem, not a settings toggle, and it should arrive with review attached
 * rather than by accident.
 *
 * Every answer here is deliberately a ROUTE, not a ruling — where to go, what
 * to have ready, who decides. Nothing states an eligibility outcome, because
 * this widget is not the authority on one and a citizen acting on a wrong
 * answer here has a real cost.
 */

import type { ChatbotQuickReply, ChatbotReply } from "@mosje/design-system";
import { FINDER_ENTRY_ID, type FinderScript } from "./finder.ts";

/**
  * Matches the live assistant's opening on dosje.gov.in almost word for word,
  * because a citizen who has met Samajik Sahayak there should meet the same
  * assistant here. The Figma mock's "Hey, I am Noddy" is gone — see
  * `CHATBOT_NAME` in the component for why that name could not ship.
  */
export const CHATBOT_GREETING =
  "This is an assistant for the Ministry of Social Justice. How can I help you?";

export const CHATBOT_QUICK_REPLIES: ChatbotQuickReply[] = [
  { id: FINDER_ENTRY_ID, label: "Which scheme applies to me?" },
  { id: "status", label: "Check my application status" },
  { id: "otp", label: "I'm not receiving OTP." },
  { id: "documents", label: "What documents do I need?" },
  { id: "grievance", label: "Raise a grievance" },
  { id: "contact", label: "Others" },
];

/*
 * "Which scheme applies to me?" is NOT in this table.
 *
 * It used to be, and it dead-ended: three bubbles that named some divisions and
 * then stopped, leaving the citizen exactly where they started. It now opens the
 * finder in `finder.ts`, which narrows a real catalogue over five questions and
 * ends at a page or a portal. The rule the old answer kept is the one the finder
 * keeps too — it reports what the catalogue RECORDS about a target group, never
 * what a person is entitled to.
 */
const ANSWERS: Record<string, ChatbotReply> = {
  status: {
    text:
      "Application status lives inside the portal you applied through. Sign in there with the mobile number you registered with, and it will be on your dashboard.",
    quickReplies: [
      { id: "otp", label: "I'm not receiving OTP." },
      { id: "contact", label: "Something else" },
    ],
  },
  otp: {
    text:
      "OTPs go to the mobile number seeded with your Aadhaar. Give it 90 seconds before asking for another, and check that DND is not blocking messages from the sender ID. If it still does not arrive, the portal's helpdesk can verify the number on file.",
    quickReplies: [
      { id: "grievance", label: "Raise a grievance" },
      { id: "contact", label: "Something else" },
    ],
  },
  documents: {
    text:
      "Almost every scheme asks for proof of identity, proof of income and a caste or disability certificate where the scheme is targeted. The exact list is on each scheme's own page, because it differs. Go by that, not by this summary.",
    quickReplies: [{ id: "status", label: "Check my application status" }],
  },
  grievance: {
    text:
      "Grievances go through the portal that handles your scheme, and each one has a grievance section once you are signed in. Keep your application number to hand, because it is what lets an officer find the case.",
    quickReplies: [{ id: "contact", label: "Something else" }],
  },
  contact: {
    text:
      "I can only point you at the right place. I cannot decide a case or change an application; the Contact page on the Ministry website has the helpline and the departmental email for anything beyond that.",
    quickReplies: [{ id: FINDER_ENTRY_ID, label: "Which scheme applies to me?" }],
  },
};

/**
 * The scripted answer for a suggestion, or a plain hand-off.
 *
 * Total by construction: an unknown id gets the contact answer rather than
 * silence, because a suggestion that visibly does nothing when pressed reads as
 * a broken page.
 */
export function chatbotAnswer(id: string): ChatbotReply {
  return ANSWERS[id] ?? ANSWERS.contact!;
}

/**
 * The scripted half of the assistant, handed to the finder's session.
 *
 * Injected rather than imported by `finder.ts`, so the two modules stay a
 * one-way dependency: content knows about the finder, the finder does not know
 * about content.
 */
export const CHATBOT_SCRIPT: FinderScript = {
  greeting: CHATBOT_GREETING,
  quickReplies: CHATBOT_QUICK_REPLIES,
  answer: chatbotAnswer,
};
