"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronUp, LogIn, LogOut, Settings } from "lucide-react";

type User = { name: string; email: string };

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

export default function AccountMenu({
  compact = false,
  up = false,
  onSettings,
}: {
  compact?: boolean;
  up?: boolean;
  onSettings?: () => void;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("echogpt_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function logout() {
    try {
      localStorage.removeItem("echogpt_user");
    } catch {}
    setUser(null);
    setOpen(false);
    router.push("/login");
  }

  if (!ready) return <div className={compact ? "size-8" : "h-11"} />;

  if (!user) {
    return (
      <Link
        href="/login"
        className={
          compact
            ? "flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-border/50"
            : "flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium transition hover:bg-border/50"
        }
      >
        <LogIn size={compact ? 14 : 16} /> Sign in
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={
          compact
            ? "grid size-8 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-fg"
            : "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-border/50"
        }
      >
        {compact ? (
          initials(user.name)
        ) : (
          <>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-fg">
              {initials(user.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user.name}</span>
              <span className="block truncate text-xs text-muted">{user.email}</span>
            </span>
            <ChevronUp
              size={16}
              className={`shrink-0 text-muted transition-transform ${open ? "" : "rotate-180"}`}
            />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className={`animate-fade absolute z-30 rounded-xl border border-border bg-panel p-1 shadow-lg ${
            up ? "bottom-full left-0 right-0 mb-2" : "right-0 top-full mt-2 w-56"
          }`}
        >
          <div className="border-b border-border px-3 py-2">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          {onSettings && (
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSettings();
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-border/50"
            >
              <Settings size={15} /> Settings
            </button>
          )}
          <button
            role="menuitem"
            onClick={logout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-border/50"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}