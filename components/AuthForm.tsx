"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

type Mode = "login" | "signup";
type Errors = { name?: string; email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERKS = [
  "Switch between AI models in one chat",
  "Your history saved in the sidebar",
  "Works on phone, tablet and desktop",
];

function inputCls(error?: string) {
  return `w-full rounded-xl border bg-bg px-3.5 py-2.5 text-base outline-none transition placeholder:text-muted focus:border-accent ${
    error ? "border-red-500" : "border-border"
  }`;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: Errors = {};
    if (isSignup && name.trim().length < 2) e.name = "Please enter your name.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (password.length < 8) e.password = "Password must be at least 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function finish(user: { name: string; email: string }) {
    try {
      localStorage.setItem("echogpt_user", JSON.stringify(user));
    } catch {}
    router.push("/chat");
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (loading || !validate()) return;
    setLoading(true);
    const cleanEmail = email.trim();
    setTimeout(() => {
      finish({
        name: isSignup ? name.trim() : cleanEmail.split("@")[0],
        email: cleanEmail,
      });
    }, 700);
  }

  function google() {
    if (loading) return;
    setLoading(true);
    setTimeout(() => finish({ name: "Demo User", email: "demo@example.com" }), 600);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg lg:flex-row">
      {/* Brand panel (desktop only) */}
      <aside className="hidden w-1/2 max-w-xl flex-col justify-between bg-accent p-10 text-accent-fg lg:flex">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-white/20">
            <Sparkles size={16} />
          </span>
          EchoGPT
        </Link>
        <div>
          <h2 className="text-3xl font-semibold leading-tight">
            One place for every AI model.
          </h2>
          <ul className="mt-6 space-y-3 text-sm">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-white/20">
                  <Check size={13} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs opacity-80">Demo UI. No real account is created.</p>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted transition hover:text-text"
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="animate-rise w-full max-w-sm">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {isSignup ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {isSignup
                ? "Start chatting with every AI model in one place."
                : "Log in to continue your conversations."}
            </p>

            <button
              type="button"
              onClick={google}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-panel px-4 py-2.5 text-sm font-medium transition hover:bg-border/50 disabled:opacity-60"
            >
              <GoogleIcon /> Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-border" />
              or use email
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} noValidate className="space-y-4">
              {isSignup && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputCls(errors.name)}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputCls(errors.email)}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    className={`${inputCls(errors.password)} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    aria-label={show ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-border/50 hover:text-text"
                  >
                    {show ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" role="alert" className="mt-1.5 text-xs text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition hover:opacity-90 disabled:opacity-70"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {isSignup ? "Create account" : "Log in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              {isSignup ? "Already have an account? " : "Don\u2019t have an account? "}
              <Link
                href={isSignup ? "/login" : "/signup"}
                className="font-medium text-accent hover:underline"
              >
                {isSignup ? "Log in" : "Sign up"}
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}