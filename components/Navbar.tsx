"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "#models", label: "Models" },
  { href: "#features", label: "Features" },
  { href: "#extension", label: "Extension" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg">
            <Sparkles size={16} />
          </span>
          EchoGPT
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-text">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted transition hover:text-text sm:block"
          >
            Log in
          </Link>
          <Link
            href="/chat"
            className="hidden rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition hover:opacity-90 sm:block"
          >
            Open app
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-border/50 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade border-t border-border bg-bg md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-border/50 hover:text-text">
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-border/50 hover:text-text"
            >
              Log in
            </Link>
            <Link
              href="/chat"
              className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-fg"
            >
              Open app
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}