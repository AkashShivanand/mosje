"use client";

import { useEffect, useRef, useState } from "react";
import { Chatbot, SectionTitle, Card, CardBody, CardTitle, Badge } from "@mosje/design-system";
import type { ChatbotQuickReply, ChatbotReply } from "@mosje/design-system";
import {
  SD_DEPWD,
  SD_PERSONAS,
  SD_SIGNPOST,
  SD_ROUTES,
  sdMatch,
  sdOffersFor,
} from "@/lib/explorations/service-discovery-master";
import "./assistant.css";

/**
 * The assistant option, built from the design system's own Chatbot rather than a
 * hand-rolled imitation of it. Everything a viewer sees here — the panel, the
 * seal, the bubbles, the quick replies, the composer and the disclaimer — is the
 * component the estate ships, so what is demonstrated is what would be built.
 *
 * It asks the SAME two questions as the home-page finder — who is looking, and
 * what kind of support — over the same scheme master, so the chat and the page
 * can never name different schemes for the same person. The 8 September 2026
 * review cut the five questions to these two.
 *
 * DS Audit: Chatbot ✅ existing · SectionTitle ✅ existing · Card ✅ existing ·
 * Badge ✅ existing.
 */

const q = (...labels: string[]): ChatbotQuickReply[] =>
  labels.map((label) => ({ id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label }));

const GREETING =
  "This is the assistant for the Department of Social Justice & Empowerment. How can I help?";
const OPENERS = q("Which scheme applies to me?", "Where do I complain?");

const PERSONA_LABELS = SD_PERSONAS.map((p) => p.short);

/** Real publications from the Department's own Documents page. */
const DOCUMENTS = [
  { title: "Annual Report 2025–26 (English)", date: "22 April 2026", kind: "Report" },
  { title: "Result of National Overseas Scholarship (NOS) for SC candidates 2025–26 (2nd Round)", date: "18 April 2026", kind: "Result" },
  { title: "Acceptance of Transgender Identity Certificate/Card in EPFO Records", date: "15 April 2026", kind: "Circular" },
];

/** Join names the way a sentence does: "A, B and C". */
const list = (xs: string[]) =>
  xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;

export default function AssistantPrototype() {
  const [open, setOpen] = useState(false);
  /* The conversation's state: which persona was chosen, and whether the
     offering question has been asked. Refs, because a reply handler must not
     re-render the panel mid-answer. */
  const persona = useRef<string | null>(null);
  const asked = useRef<"none" | "who" | "offer">("none");

  /* The UX4G accessibility widget is third-party chrome mounted at body level on
     every page of the estate. This route exists to demonstrate one component, and
     the widget shares its corner — so it is hidden HERE and nowhere else. */
  useEffect(() => {
    document.body.classList.add("sd-hide-a11y-widget");
    return () => document.body.classList.remove("sd-hide-a11y-widget");
  }, []);

  const reset = (): ChatbotReply => {
    persona.current = null;
    asked.current = "none";
    return { text: GREETING, quickReplies: OPENERS };
  };

  const askWho = (): ChatbotReply => {
    asked.current = "who";
    return {
      text:
        "Two short questions, and nothing you answer is stored.\n\nQuestion 1 of 2. Who is looking for support?",
      quickReplies: q(...PERSONA_LABELS, SD_SIGNPOST.label),
    };
  };

  const askOffer = (): ChatbotReply => {
    asked.current = "offer";
    const offers = sdOffersFor(persona.current!).map((o) => o.short);
    return {
      text: "Question 2 of 2. What kind of support? Skip this to see everything the Department provides for the group.",
      quickReplies: q(...offers, "Skip this"),
    };
  };

  const answer = (offerLabel?: string): ChatbotReply => {
    const who = SD_PERSONAS.find((p) => p.id === persona.current)!;
    const offer = offerLabel ? sdOffersFor(who.id).find((o) => o.short === offerLabel) : undefined;
    const hits = sdMatch(who.id, offer?.id).slice(0, 3);
    if (!hits.length) {
      return {
        text: `The Department's record has no scheme for ${who.label} under ${offer?.label ?? "that heading"}. Skipping the second question shows everything for the group.`,
        quickReplies: q("Skip this", "Start over"),
      };
    }
    /* One bubble, not a wall: the schemes are named in the sentence and opened
       from the suggestions beneath. No count — the sentence lists them. */
    return {
      text:
        `These name ${who.label}${offer ? ` under ${offer.label}` : ""}: ${list(hits.map((h) => h.name))}. ` +
        "A scheme naming you is not a decision on an application — the sanctioning authority decides that.",
      quickReplies: q(...hits.map((h) => `Open ${h.name}`), "Start over"),
    };
  };

  const onQuickReply = (reply: ChatbotQuickReply): ChatbotReply => {
    const label = reply.label;
    if (label === "Start over") return reset();
    if (label === "Where do I complain?") {
      return {
        text:
          "A complaint about a right denied or a benefit not received goes to the Public Grievance Portal. An atrocity against a member of a Scheduled Caste or Scheduled Tribe can be reported round the clock on the National Helpline Against Atrocities, 14566.",
        quickReplies: q("Which scheme applies to me?"),
      };
    }
    if (label === "Which scheme applies to me?") return askWho();
    if (label.startsWith("Open ")) {
      const name = label.slice(5);
      if (SD_DEPWD.schemes.some((s) => s.name === name)) {
        return { text: `Opening ${name} on ${SD_SIGNPOST.to}.`, quickReplies: q("Start over") };
      }
      const hit = sdMatch(persona.current ?? undefined).find((h) => h.name === name);
      const route = hit ? SD_ROUTES[hit.apply[0] ?? ""] : undefined;
      return {
        text: route
          ? `Opening the scheme's page. The application itself is made through ${route.label}.`
          : "Opening the scheme's page.",
        quickReplies: q("Start over"),
      };
    }
    if (asked.current === "who") {
      if (label === SD_SIGNPOST.label) {
        asked.current = "none";
        return {
          text:
            `Those schemes are run by the Department of Empowerment of Persons with Disabilities, a separate Department of the same Ministry, at ${SD_SIGNPOST.to}: ${list(SD_DEPWD.schemes.map((s) => s.name))}. The UDID card is issued there too.`,
          quickReplies: q(...SD_DEPWD.schemes.map((s) => `Open ${s.name}`), "Start over"),
        };
      }
      const p = SD_PERSONAS.find((x) => x.short === label);
      if (p) {
        persona.current = p.id;
        return askOffer();
      }
    }
    if (asked.current === "offer") {
      return answer(label === "Skip this" ? undefined : label);
    }
    return reset();
  };

  return (
    <>
      <main className="sa-container sd-assistant">
        <SectionTitle
          eyebrow="The Assistant"
          title="Samajik Sahayak"
          description="The assistant sits in the corner of every page and can be opened without leaving what you were reading. It asks the same two questions as the home page, one at a time."
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
                    <p className="sd-assistant__meta">{d.date}</p>
                    <Badge status="neutral" emphasis="subtle">{d.kind}</Badge>
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
