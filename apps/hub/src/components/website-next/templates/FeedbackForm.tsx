"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BotCheck,
  Button,
  ErrorSummary,
  FieldPolicyProvider,
  FormField,
  Icon,
  Input,
  Select,
  Textarea,
  useBotCheck,
  type ErrorSummaryItem,
} from "@mosje/design-system";

const CATEGORIES = [
  "A Problem With a Page",
  "Incorrect or Outdated Information",
  "An Accessibility Barrier",
  "A Broken Link or Document",
  "A Suggestion",
  "Something Else",
];

const MESSAGE_MAX = 2000;

interface Values {
  name: string;
  email: string;
  category: string;
  page: string;
  message: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.email.trim()) e.email = "Enter your email address";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter an email address in the correct format, like name@example.com";
  if (!v.category) e.category = "Select what your feedback is about";
  if (!v.message.trim()) e.message = "Enter your feedback";
  else if (v.message.length > MESSAGE_MAX) e.message = `Your feedback must be ${MESSAGE_MAX.toLocaleString("en-IN")} characters or fewer`;
  return e;
}

/**
 * Website feedback (issues X-GIGW-03, MAN-11, ACC-23).
 *
 * Labels sit above their fields, every error is shown at its field and listed in
 * an `ErrorSummary` that takes focus when a submit fails, and the page address
 * arrives filled in from `?page=` when the reader came from "Report a problem
 * with this page" in the footer.
 *
 * PROTOTYPE: there is no backend. A valid submit shows the confirmation panel and
 * sends nothing anywhere. The bot check is the DS's invisible proof-of-work, which
 * draws nothing unless it fails; a real deployment verifies its token on the
 * server, together with rate limiting.
 */
export function FeedbackForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", category: "", page: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const bot = useBotCheck();

  // The page the reader was on, from the footer's "Report a problem with this page".
  useEffect(() => {
    const from = new URLSearchParams(window.location.search).get("page");
    if (from && from.startsWith("/")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off read of the URL after hydration
      setValues((v) => ({ ...v, page: `${window.location.origin}${from}`, category: v.category || (CATEGORIES[0] ?? "") }));
    }
  }, []);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    // Once a submit has failed, a corrected field clears its own error as the reader fixes it.
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (bot.status === "failed") return;
    // Prototype: nothing is sent. See the note above.
    setDone(true);
  };

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} className="wn-fb__done" role="status">
        <div className="wn-fb__done-head">
          <span className="wn-fb__done-icon" aria-hidden="true">
            <Icon name="check_circle" size={32} />
          </span>
          <h2 className="wn-fb__done-title">Feedback Received</h2>
        </div>
        <p>Thank you. Your feedback has been received.</p>
        <h3 className="wn-contact__card-title">What Happens Next</h3>
        <ol>
          <li>The Department reviews the feedback and passes it to the office responsible for the page or information concerned.</li>
          <li>If a reply is needed, it is sent to {values.email.trim()}.</li>
          <li>
            A grievance about a scheme or a service is not handled through this form; file it on{" "}
            <a href="https://pgportal.gov.in/" target="_blank" rel="noopener noreferrer" className="wn-people-link">
              CPGRAMS<span className="sr-only"> (opens in a new window)</span>
            </a>
            .
          </li>
        </ol>
        <div className="wn-fb__actions">
          <Link href="/website" className="wn-contact__action">
            <span className="wn-contact__u">Return to the Home Page</span>
          </Link>
        </div>
      </div>
    );
  }

  const summary: ErrorSummaryItem[] = (
    [
      ["email", "fb-email"],
      ["category", "fb-category"],
      ["message", "fb-message"],
    ] as const
  )
    .filter(([k]) => errors[k])
    .map(([k, id]) => ({ fieldId: id, message: errors[k] }));

  return (
    <FieldPolicyProvider necessity="optional">
      {summary.length > 0 && (
        <div className="wn-fb__summary">
          <ErrorSummary errors={summary} />
        </div>
      )}
      <form className="wn-fb__form" noValidate onSubmit={onSubmit} aria-label="Website Feedback">
        <div className="wn-fb__row">
          <FormField label="Your Name" id="fb-name" optional>
            {(c) => <Input {...c} name="name" autoComplete="name" value={values.name} onChange={set("name")} />}
          </FormField>
          <FormField
            label="Email Address"
            id="fb-email"
            required
            hint="Used only to reply to this feedback."
            error={errors.email}
          >
            {(c) => (
              <Input {...c} type="email" name="email" autoComplete="email" inputMode="email" spellCheck={false} value={values.email} onChange={set("email")} />
            )}
          </FormField>
        </div>

        <FormField label="What Is Your Feedback About?" id="fb-category" required error={errors.category}>
          {(c) => (
            <Select
              {...c}
              name="category"
              value={values.category}
              onChange={set("category")}
              placeholder="Select a topic"
              options={CATEGORIES.map((x) => ({ label: x, value: x }))}
            />
          )}
        </FormField>

        <FormField
          label="Page Address"
          id="fb-page"
          optional
          hint="The web address of the page your feedback is about, if it is about one page."
        >
          {(c) => <Input {...c} type="url" name="page" inputMode="url" spellCheck={false} value={values.page} onChange={set("page")} />}
        </FormField>

        <FormField
          label="Your Feedback"
          id="fb-message"
          required
          error={errors.message}
          characterCount={{ value: values.message, maxLength: MESSAGE_MAX }}
        >
          {(c) => <Textarea {...c} name="message" size="lg" value={values.message} onChange={set("message")} />}
        </FormField>

        <BotCheck mode="invisible" status={bot.status} helpHref="/website/contact-us" helpLabel="Cannot complete this check? Contact the Department" />

        <div className="wn-fb__actions">
          <Button type="submit" variant="primary" size="lg">
            Send Feedback
          </Button>
        </div>
      </form>
    </FieldPolicyProvider>
  );
}
