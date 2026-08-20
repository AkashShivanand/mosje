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

/**
  * Matches the live assistant's opening on dosje.gov.in almost word for word,
  * because a citizen who has met Samajik Sahayak there should meet the same
  * assistant here. The Figma mock's "Hey, I am Noddy" is gone — see
  * `CHATBOT_NAME` in the component for why that name could not ship.
  */
export const CHATBOT_GREETING =
  "This is an assistant for the Ministry of Social Justice. How can I help you?";

export const CHATBOT_QUICK_REPLIES: ChatbotQuickReply[] = [
  { id: "schemes", label: "Which scheme applies to me?" },
  { id: "status", label: "Check my application status" },
  { id: "otp", label: "I'm not receiving OTP." },
  { id: "documents", label: "What documents do I need?" },
  { id: "grievance", label: "Raise a grievance" },
  { id: "contact", label: "Others" },
];

const ANSWERS: Record<string, ChatbotReply> = {
  schemes: {
    text:
      "The Ministry runs schemes across scholarships, social defence and financial support. Tell me who the applicant is and I can point you at the right portal.",
    quickReplies: [
      { id: "student", label: "A student seeking a scholarship" },
      { id: "senior", label: "A senior citizen" },
      { id: "documents", label: "What documents do I need?" },
    ],
  },
  student: {
    text:
      "Scholarships are handled portal by portal — Pre-Matric, Post-Matric, Top Class Education and the National Overseas Scholarship each have their own. The Portals page lists all of them with what each one covers.",
    quickReplies: [
      { id: "documents", label: "What documents do I need?" },
      { id: "status", label: "Check my application status" },
    ],
  },
  senior: {
    text:
      "Senior Citizens Welfare covers pensions, care homes and the volunteer programme. SAMBAL handles atrocity-related relief. Both are on the Portals page.",
    quickReplies: [{ id: "grievance", label: "Raise a grievance" }],
  },
  status: {
    text:
      "Application status lives inside the portal you applied through — sign in there with the mobile number you registered with, and it will be on your dashboard.",
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
      "Almost every scheme asks for proof of identity, proof of income and a caste or disability certificate where the scheme is targeted. The exact list is on each scheme's own page, because it differs — go by that, not by this summary.",
    quickReplies: [{ id: "status", label: "Check my application status" }],
  },
  grievance: {
    text:
      "Grievances go through the portal that handles your scheme, and each one has a grievance section once you are signed in. Keep your application number to hand — it is what lets an officer find the case.",
    quickReplies: [{ id: "contact", label: "Something else" }],
  },
  contact: {
    text:
      "I can only point you at the right place — I cannot decide a case or change an application. The Contact page on the Ministry website has the helpline and the departmental email for anything beyond that.",
    quickReplies: [{ id: "schemes", label: "Which scheme applies to me?" }],
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
