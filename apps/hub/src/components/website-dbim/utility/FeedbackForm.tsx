"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { BotCheck, Button, useBotCheck } from "@mosje/design-system";
import { dbimHref } from "@/lib/website-dbim/nav";

const MIN = 10;
const MAX = 2000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MOBILE = /^\d{10}$/;

interface Values {
  name: string;
  email: string;
  mobile: string;
  suggestions: string;
}
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;

const ORDER: Field[] = ["name", "email", "mobile", "suggestions"];

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Enter your name";
  if (!v.email.trim()) e.email = "Enter your email address";
  else if (!EMAIL.test(v.email.trim())) e.email = "Enter an email address in the correct format, like name@example.com";
  if (v.mobile.trim() && !MOBILE.test(v.mobile.trim())) e.mobile = "Enter a 10 digit mobile number";
  const n = v.suggestions.trim().length;
  if (n === 0) e.suggestions = "Enter your suggestions";
  else if (n < MIN) e.suggestions = `Your suggestions must be at least ${MIN} characters`;
  else if (n > MAX) e.suggestions = `Your suggestions must be ${MAX.toLocaleString("en-IN")} characters or fewer`;
  return e;
}

/**
 * The reference's feedback card, with the estate's behaviour
 * (components/website-next/templates/FeedbackForm.tsx):
 *
 * PROTOTYPE — there is no backend. A valid submit shows the confirmation and sends
 * nothing. Validation is client-side; every error sits at its field, and a failed
 * submit moves focus to the first one.
 *
 * CAPTCHA — the reference draws an image CAPTCHA with audio and refresh buttons. The
 * estate has no image CAPTCHA; its bot check is the design system's invisible
 * proof-of-work, which draws nothing unless it fails and then offers a way round it.
 * That is what is used here. A drawn CAPTCHA that verified nothing would be a fake.
 */
export function DbimFeedbackForm() {
  const [values, setValues] = useState<Values>({ name: "", email: "", mobile: "", suggestions: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const bot = useBotCheck();

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const set = (key: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [key]: e.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      document.getElementById(`db-fb-${first}`)?.focus();
      return;
    }
    if (bot.status === "failed") return;
    setDone(true);
  };

  if (done) {
    return (
      <div ref={doneRef} tabIndex={-1} className="db-u-fb__done" role="status">
        <h2 className="db-u-fb__done-title">Feedback Received</h2>
        <p>Thank you. Your feedback has been received.</p>
        <p>If a reply is needed, it is sent to {values.email.trim()}.</p>
        <p>
          A grievance about a scheme or a service is not handled through this form; register it on the{" "}
          <Link href={dbimHref("/connect/grievance-redressal")}>Grievance Redressal</Link> page.
        </p>
      </div>
    );
  }

  const field = (key: Field, label: string, required: boolean, input: ReactNode) => (
    <div className="db-u-fb__field">
      <label htmlFor={`db-fb-${key}`} className="db-u-fb__label">
        {label}
        {required && (
          <span className="db-u-req" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      {input}
      {errors[key] && (
        <p id={`db-fb-${key}-error`} className="db-u-fb__error">
          {errors[key]}
        </p>
      )}
    </div>
  );

  const common = (key: Field, required: boolean) => ({
    id: `db-fb-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    required,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `db-fb-${key}-error` : undefined,
    className: "db-u-fb__control",
  });

  return (
    <>
      <p className="db-u-fb__note">
        Note: Field marked with (<span className="db-u-req">*</span>) are required.
      </p>
    <form noValidate onSubmit={onSubmit} aria-label="Feedback" className="db-u-fb__form">
      {field("name", "Name", true, <input {...common("name", true)} type="text" autoComplete="name" placeholder="Enter your name" />)}
      {field("email", "Email", true, <input {...common("email", true)} type="email" autoComplete="email" inputMode="email" spellCheck={false} placeholder="Enter email" />)}
      {field("mobile", "Mobile", false, <input {...common("mobile", false)} type="tel" autoComplete="tel-national" inputMode="numeric" maxLength={10} placeholder="Enter 10 digit mobile" />)}
      {field("suggestions", "Suggestions", true, <textarea {...common("suggestions", true)} rows={3} maxLength={MAX} placeholder={`Enter suggestions (${MIN}–${MAX} characters)`} />)}
      <BotCheck mode="invisible" status={bot.status} helpHref={dbimHref("/connect")} helpLabel="Cannot complete this check? Contact the Department" />
      <div className="db-u-fb__actions">
        <Button type="submit" appearance="text" className="db-u-btn db-u-btn--pill">
          Submit
        </Button>
      </div>
    </form>
    </>
  );
}
