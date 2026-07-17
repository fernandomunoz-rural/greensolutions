"use client";

import { useState } from "react";
import { Button } from "./ui";
import { Icon } from "./icons";

const interests = [
  "Mentorship / advice",
  "Sharing experience",
  "Research & planning",
  "Shaping tools & ideas",
  "Just here to learn",
];

export function InvolveForm() {
  const [submitted, setSubmitted] = useState(false);
  const [interest, setInterest] = useState(interests[0]);

  if (submitted) {
    return (
      <div className="rounded-xl border border-line bg-white p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-leaf/10 text-leaf">
          <Icon.Check className="h-6 w-6" />
        </span>
        <h3 className="font-display mt-4 text-xl font-semibold text-forest">
          Thank you for reaching out
        </h3>
        <p className="mt-2 text-sm text-ink/70">
          We&apos;ve received your message. Involvement is flexible and based on
          interest and availability — we&apos;ll be in touch as the project
          takes shape.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-5 text-sm font-semibold text-leaf hover:text-forest"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="rounded-xl border border-line bg-white p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={inputCls}
            placeholder="Your name"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputCls}
            placeholder="you@example.com"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="How would you like to be involved?" htmlFor="interest">
          <select
            id="interest"
            name="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className={inputCls}
          >
            {interests.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" htmlFor="message">
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`${inputCls} resize-none`}
            placeholder="Tell us a little about your interest, experience, or how you'd like to help."
          />
        </Field>
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full">
        Send message
      </Button>
      <p className="mt-3 text-center text-xs text-ink/45">
        This is a demo form for the testing phase — submissions aren&apos;t
        stored yet.
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-semibold text-forest">
        {label}
      </span>
      {children}
    </label>
  );
}
