"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "./logo";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/data/site";

type Mode = "login" | "signup";

type Errors = Partial<Record<"name" | "email" | "password", string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const brandPoints = [
  "Plain-language guidance built for island growing.",
  "Tools that help you decide what, when, and how to plant.",
  "Free to join while we're in early design.",
];

export function AuthScreen({ mode }: { mode: Mode }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const next: Errors = {};
    if (isSignup && !values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter your email.";
    else if (!emailRe.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Please enter a password.";
    else if (isSignup && values.password.length < 8)
      next.password = "Use at least 8 characters.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setFormError(null);
    const supabase = createClient();

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            // Stored on auth.users.raw_user_meta_data; the DB trigger copies
            // full_name into the profiles table on signup.
            data: { full_name: values.name.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
          },
        });
        if (error) throw error;

        // With email confirmation on, there's no session until they confirm.
        if (data.session) {
          router.push("/account");
          router.refresh();
        } else {
          setSubmitted(true);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;

        const params = new URLSearchParams(window.location.search);
        router.push(params.get("next") || "/account");
        router.refresh();
      }
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function update(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  return (
    <div className="grid min-h-[calc(100vh-4.5rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden flex-col justify-between bg-forest p-12 text-mint-100 lg:flex">
        <Logo variant="light" className="text-[14px]" />
        <div className="max-w-md">
          <p className="font-display text-3xl font-semibold leading-tight text-white">
            {site.motto}
          </p>
          <ul className="mt-10 space-y-4">
            {brandPoints.map((p) => (
              <li key={p} className="flex items-start gap-3 text-mint-100/85">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                <span className="text-[0.95rem] leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-mint-100/60">
          {site.tagline} · {site.location}
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-md">
          {submitted ? (
            <SuccessCard email={values.email} name={values.name} />
          ) : (
            <>
              <div className="lg:hidden">
                <Logo className="text-[13px]" />
              </div>
              <h1 className="font-display mt-8 text-3xl font-semibold text-forest lg:mt-0">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-ink/60">
                {isSignup
                  ? "Join Green Solutions and grow with us."
                  : "Log in to continue where you left off."}
              </p>

              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
                {isSignup ? (
                  <Field
                    label="Full name"
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Maurice Curry"
                    value={values.name}
                    error={errors.name}
                    onChange={(v) => update("name", v)}
                  />
                ) : null}

                <Field
                  label="Email"
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={values.email}
                  error={errors.email}
                  onChange={(v) => update("email", v)}
                />

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-forest"
                    >
                      Password
                    </label>
                    {!isSignup ? (
                      <span className="text-xs font-medium text-ink/40">
                        Forgot password?
                      </span>
                    ) : null}
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      placeholder={isSignup ? "At least 8 characters" : "Your password"}
                      value={values.password}
                      onChange={(e) => update("password", e.target.value)}
                      aria-invalid={!!errors.password}
                      className={`w-full rounded-lg border bg-white px-4 py-2.5 pr-12 text-ink outline-none transition-colors placeholder:text-ink/35 focus:ring-2 focus:ring-forest/20 ${
                        errors.password
                          ? "border-red-400 focus:border-red-400"
                          : "border-line focus:border-forest"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 flex items-center px-3.5 text-ink/45 hover:text-forest"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                  ) : null}
                </div>

                {formError ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {formError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-forest px-6 py-3 text-[0.95rem] font-semibold text-paper transition-colors hover:bg-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? isSignup
                      ? "Creating account…"
                      : "Logging in…"
                    : isSignup
                      ? "Create account"
                      : "Log in"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ink/60">
                {isSignup ? "Already have an account? " : "New to Green Solutions? "}
                <Link
                  href={isSignup ? "/login" : "/signup"}
                  className="font-semibold text-forest underline-offset-2 hover:underline"
                >
                  {isSignup ? "Log in" : "Create an account"}
                </Link>
              </p>

            </>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  id,
  type,
  value,
  error,
  placeholder,
  autoComplete,
  onChange,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-forest">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-2.5 text-ink outline-none transition-colors placeholder:text-ink/35 focus:ring-2 focus:ring-forest/20 ${
          error ? "border-red-400 focus:border-red-400" : "border-line focus:border-forest"
        }`}
      />
      {error ? <p className="mt-1.5 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function SuccessCard({ email, name }: { email: string; name: string }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint/25 text-forest">
        <CheckIcon className="h-7 w-7" />
      </span>
      <h1 className="font-display mt-6 text-2xl font-semibold text-forest">
        Confirm your email{name ? `, ${name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-3 text-ink/65">
        We sent a confirmation link to{" "}
        <span className="font-semibold text-forest">{email}</span>. Click it to
        activate your account, then log in.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-forest px-6 py-3 text-[0.95rem] font-semibold text-paper transition-colors hover:bg-forest-700"
      >
        Go to log in
      </Link>
    </div>
  );
}

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2M6.1 6.1A18.5 18.5 0 0 0 2 11s3.5 7 10 7a10.9 10.9 0 0 0 4-.75" />
      <path d="m3 3 18 18" />
      <path d="M9.5 9.6a3 3 0 0 0 4.2 4.2" />
    </svg>
  );
}
