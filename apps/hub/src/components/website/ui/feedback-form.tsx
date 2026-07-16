"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button, Alert } from "@mosje/design-system";

/** GIGW-compliant feedback form: instructions first, every field labelled, keyboard operable. */
export function FeedbackForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Alert status="success" title="Thank you">
        Your message has been received. We will get back to you shortly.
      </Alert>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <p className="text-[13px] text-ink-muted">
        Fields marked <span className="text-red-600">*</span> are required. We typically respond within 3 working days.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fb-name" className="mb-1 block text-[14px] font-medium text-ink">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="fb-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-[14px] outline-none focus:border-gov-blue focus:ring-2 focus:ring-gov-blue/20"
          />
        </div>
        <div>
          <label htmlFor="fb-email" className="mb-1 block text-[14px] font-medium text-ink">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="fb-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-[14px] outline-none focus:border-gov-blue focus:ring-2 focus:ring-gov-blue/20"
          />
        </div>
      </div>
      <div>
        <label htmlFor="fb-subject" className="mb-1 block text-[14px] font-medium text-ink">
          Subject <span className="text-red-600">*</span>
        </label>
        <input
          id="fb-subject"
          name="subject"
          type="text"
          required
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-[14px] outline-none focus:border-gov-blue focus:ring-2 focus:ring-gov-blue/20"
        />
      </div>
      <div>
        <label htmlFor="fb-message" className="mb-1 block text-[14px] font-medium text-ink">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="fb-message"
          name="message"
          rows={5}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[14px] outline-none focus:border-gov-blue focus:ring-2 focus:ring-gov-blue/20"
        />
      </div>
      <Button type="submit" iconLeft={<Send className="h-4 w-4" />}>
        Submit
      </Button>
    </form>
  );
}
