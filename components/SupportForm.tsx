"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = { name?: string; email?: string; message?: string };

function cls(error?: string) {
  return `w-full rounded-xl border bg-bg px-3.5 py-2.5 text-base outline-none transition placeholder:text-muted focus:border-accent ${
    error ? "border-red-500" : "border-border"
  }`;
}

export default function SupportForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (loading) return;
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (message.trim().length < 10) e.message = "Please write at least 10 characters.";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 800);
  }

  if (sent) {
    return (
      <div
        role="status"
        className="animate-rise rounded-2xl border border-border bg-panel p-6 text-center"
      >
        <CheckCircle2 className="mx-auto text-accent" size={32} />
        <h3 className="mt-3 font-semibold">Message received</h3>
        <p className="mt-1 text-sm text-muted">
          This is a demo form, so nothing was actually sent.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-border/50"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-4 rounded-2xl border border-border bg-panel p-5"
    >
      <div>
        <label htmlFor="s-name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input
          id="s-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "s-name-err" : undefined}
          className={cls(errors.name)}
        />
        {errors.name && (
          <p id="s-name-err" role="alert" className="mt-1.5 text-xs text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="s-email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="s-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "s-email-err" : undefined}
          className={cls(errors.email)}
        />
        {errors.email && (
          <p id="s-email-err" role="alert" className="mt-1.5 text-xs text-red-500">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="s-msg" className="mb-1.5 block text-sm font-medium">
          How can we help?
        </label>
        <textarea
          id="s-msg"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "s-msg-err" : undefined}
          className={`${cls(errors.message)} resize-y`}
        />
        {errors.message && (
          <p id="s-msg-err" role="alert" className="mt-1.5 text-xs text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition hover:opacity-90 disabled:opacity-70"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        Send message
      </button>
    </form>
  );
}