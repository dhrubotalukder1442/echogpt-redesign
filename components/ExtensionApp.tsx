"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  FileText,
  Globe,
  Highlighter,
  History,
  Languages,
  Lightbulb,
  ListChecks,
  MessageSquare,
  PanelRight,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AccountMenu from "./AccountMenu";
import Skeleton from "./Skeleton";

type Msg = { id: number; role: "user" | "assistant"; text: string };
type Chat = { id: number; title: string; messages: Msg[] };
type Tab = "chat" | "history" | "settings";
type AppSettings = {
  defaultModel: string;
  endpoint: string;
  pageContext: boolean;
  showQuick: boolean;
};

const MODELS = ["GPT-4o", "Claude Sonnet", "Gemini Pro", "Llama 3"];
const KEY = "echogpt_ext_settings";
const DEFAULTS: AppSettings = {
  defaultModel: MODELS[0],
  endpoint: "",
  pageContext: true,
  showQuick: true,
};

const PAGE = {
  title: "How JWT Authentication Works",
  url: "example.dev/blog/jwt-auth",
};

const SAMPLE =
  "Access tokens live for a short time. A longer lived refresh token is used to get a new access token, which limits the damage if one is stolen.";
const SEL_PREFIX = "Explain this selected text";

const QUICK: { id: string; icon: typeof FileText; label: string; prompt: string }[] = [
  { id: "summarize", icon: FileText, label: "Summarize page", prompt: "Summarize this page" },
  { id: "simple", icon: Lightbulb, label: "Explain simply", prompt: "Explain this page in simple words" },
  { id: "points", icon: ListChecks, label: "Key points", prompt: "List the key points of this page" },
  { id: "translate", icon: Languages, label: "Translate", prompt: "Translate this page to Bangla" },
  { id: "selection", icon: Highlighter, label: "Explain selected text", prompt: "" },
];

const TABS: { id: Tab; label: string; icon: typeof MessageSquare }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

const SEED: Chat[] = [
  {
    id: 1,
    title: "Summarize this article",
    messages: [
      { id: 1, role: "user", text: "Summarize this article" },
      {
        id: 2,
        role: "assistant",
        text: "The article explains how a server issues a signed token, and how the client sends it back on every request for verification.",
      },
    ],
  },
  { id: 2, title: "Explain refresh tokens", messages: [] },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-bg px-1.5 py-0.5 font-sans text-[11px] font-medium text-text">
      {children}
    </kbd>
  );
}

function Switch({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        on ? "bg-accent" : "bg-border"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function ExtensionApp() {
  const [tab, setTab] = useState<Tab>("chat");
  const [chats, setChats] = useState<Chat[]>(SEED);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [model, setModel] = useState(MODELS[0]);
  const [menu, setMenu] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState("");
  const [notice, setNotice] = useState("");
  const [histLoading, setHistLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [endpointDraft, setEndpointDraft] = useState("");
  const [endpointStatus, setEndpointStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const active = chats.find((c) => c.id === activeId);
  const messages = active?.messages ?? [];
  const q = query.trim().toLowerCase();
  const filtered = q ? chats.filter((c) => c.title.toLowerCase().includes(q)) : chats;

  function update(patch: Partial<AppSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  // Load saved settings
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Partial<AppSettings>;
        const next: AppSettings = {
          defaultModel: MODELS.includes(s.defaultModel ?? "")
            ? (s.defaultModel as string)
            : DEFAULTS.defaultModel,
          endpoint: typeof s.endpoint === "string" ? s.endpoint : "",
          pageContext: typeof s.pageContext === "boolean" ? s.pageContext : true,
          showQuick: typeof s.showQuick === "boolean" ? s.showQuick : true,
        };
        setSettings(next);
        setModel(next.defaultModel);
        setEndpointDraft(next.endpoint);
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Save settings
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {}
  }, [settings, loaded]);

  // Fake loading for history
  useEffect(() => {
    const t = setTimeout(() => setHistLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, busy, tab]);

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  }

  function readSelection() {
    const s = window.getSelection()?.toString().trim() ?? "";
    setSelected(s.length >= 3 ? s.slice(0, 300) : "");
  }

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;

    const isSel = t.startsWith(SEL_PREFIX);
    const userMsg: Msg = { id: Date.now(), role: "user", text: t };
    const chatId = activeId ?? Date.now();

    if (activeId === null) {
      setChats((p) => [
        { id: chatId, title: isSel ? "Explain selected text" : t.slice(0, 32), messages: [userMsg] },
        ...p,
      ]);
      setActiveId(chatId);
    } else {
      setChats((p) =>
        p.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, userMsg] } : c))
      );
    }

    setTab("chat");
    setBusy(true);
    const usedContext = settings.pageContext;
    const usedModel = model;

    setTimeout(() => {
      const source = usedContext ? `the page "${PAGE.title}"` : "no page context";
      const reply: Msg = {
        id: Date.now() + 1,
        role: "assistant",
        text: isSel
          ? `[${usedModel}] Demo explanation of your selected text. Connect a real AI API to get a real answer.`
          : `[${usedModel}] Demo reply using ${source}. Connect a real AI API here later.`,
      };
      setChats((p) =>
        p.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, reply] } : c))
      );
      setBusy(false);
    }, 900);
  }

  function explainSelected() {
    if (busy) return;
    setPanelOpen(true);
    setTab("chat");
    if (!selected) {
      flash("Select some text on the page first, or use the sample text.");
      return;
    }
    send(`${SEL_PREFIX}: "${selected}"`);
  }

  // Keyboard shortcut: Ctrl/Cmd + Shift + E, Escape closes the model menu
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(false);
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        explainSelected();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function submit() {
    if (!input.trim() || busy) return;
    send(input);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
  }

  function newChat() {
    setActiveId(null);
    setTab("chat");
  }

  function deleteChat(id: number) {
    setChats((p) => p.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function saveEndpoint(e: React.FormEvent) {
    e.preventDefault();
    const v = endpointDraft.trim();
    if (v === "") {
      update({ endpoint: "" });
      setEndpointStatus({ ok: true, msg: "Endpoint cleared." });
      return;
    }
    try {
      const u = new URL(v);
      if (u.protocol !== "https:") {
        setEndpointStatus({ ok: false, msg: "Enter a valid https:// URL." });
        return;
      }
      update({ endpoint: v });
      setEndpointStatus({ ok: true, msg: "Saved locally. No requests are sent in this demo." });
    } catch {
      setEndpointStatus({ ok: false, msg: "Enter a valid https:// URL." });
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {/* Page header */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted transition hover:text-text"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>
        <span className="hidden text-sm font-medium sm:block">Extension redesign</span>
        <ThemeToggle />
      </header>

      <main id="main" className="flex flex-1 lg:items-center lg:justify-center lg:p-8">
        {/* Fake browser window */}
        <div className="flex w-full flex-col overflow-hidden bg-panel lg:h-[680px] lg:max-w-6xl lg:rounded-2xl lg:border lg:border-border lg:shadow-xl">
          {/* Browser toolbar (desktop only) */}
          <div className="hidden shrink-0 items-center gap-2 border-b border-border px-4 py-3 lg:flex">
            <span className="size-3 rounded-full bg-red-400/80" />
            <span className="size-3 rounded-full bg-yellow-400/80" />
            <span className="size-3 rounded-full bg-green-400/80" />
            <div className="ml-3 flex flex-1 items-center gap-2 rounded-lg bg-border/40 px-3 py-1.5 text-xs text-muted">
              <Globe size={13} /> {PAGE.url}
            </div>
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              aria-pressed={panelOpen}
              aria-label={panelOpen ? "Close EchoGPT side panel" : "Open EchoGPT side panel"}
              className={`grid size-8 place-items-center rounded-lg transition hover:bg-border/60 ${
                panelOpen ? "bg-border/60 text-accent" : "text-muted"
              }`}
            >
              <PanelRight size={17} />
            </button>
          </div>

          <div className="flex min-h-0 flex-1">
            {/* Web page (desktop only) */}
            <article
              aria-label="Sample web page"
              onMouseUp={readSelection}
              onKeyUp={readSelection}
              className="hidden min-w-0 flex-1 space-y-4 overflow-y-auto p-8 lg:block"
            >
              <p className="rounded-lg bg-border/40 px-3 py-2 text-xs text-muted">
                Tip: select any sentence, then press Ctrl + Shift + E (Cmd + Shift + E on Mac).
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">{PAGE.title}</h1>
              <p className="text-xs text-muted">5 min read</p>
              <p className="leading-relaxed text-muted">
                A JSON Web Token is a compact, signed string that a server hands to a client after
                login. The client stores it and sends it back with every request, so the server can
                confirm who is calling without looking up a session.
              </p>
              <h2 className="pt-2 text-xl font-semibold">Structure of a token</h2>
              <p className="leading-relaxed text-muted">
                A token has three parts: a header that names the algorithm, a payload with claims
                such as the user id and expiry time, and a signature created with a secret key.
              </p>
              <h2 className="pt-2 text-xl font-semibold">Access and refresh tokens</h2>
              <p className="leading-relaxed text-muted">
                Access tokens live for a short time. A longer lived refresh token is used to get a
                new access token, which limits the damage if one is stolen.
              </p>
            </article>

            {/* Chrome-style side panel */}
            <section
              aria-label="EchoGPT side panel"
              className={`${
                panelOpen ? "flex" : "flex lg:hidden"
              } h-[calc(100dvh-3.5rem)] min-h-0 w-full flex-col bg-panel lg:h-auto lg:w-[380px] lg:shrink-0 lg:border-l lg:border-border`}
            >
              {/* Header + model selector + account */}
              <div className="relative flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="grid size-7 place-items-center rounded-lg bg-accent text-accent-fg">
                    <Sparkles size={14} />
                  </span>
                  EchoGPT
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setMenu(!menu)}
                      aria-haspopup="listbox"
                      aria-expanded={menu}
                      aria-label="Choose AI model"
                      className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-border/50"
                    >
                      {model}
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className={`transition-transform ${menu ? "rotate-180" : ""}`}
                      />
                    </button>
                    {menu && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                        <ul
                          role="listbox"
                          aria-label="AI models"
                          className="animate-fade absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-border bg-panel p-1 shadow-lg"
                        >
                          {MODELS.map((m) => (
                            <li key={m} role="presentation">
                              <button
                                role="option"
                                aria-selected={m === model}
                                onClick={() => {
                                  setModel(m);
                                  setMenu(false);
                                }}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-border/50 ${
                                  m === model ? "font-medium text-accent" : ""
                                }`}
                              >
                                {m}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <AccountMenu compact onSettings={() => setTab("settings")} />
                </div>
              </div>

              {/* CHAT TAB */}
              {tab === "chat" && (
                <>
                  {/* Page context */}
                  <button
                    onClick={() => update({ pageContext: !settings.pageContext })}
                    aria-pressed={settings.pageContext}
                    className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2 text-left text-xs transition hover:bg-border/30"
                  >
                    <Globe
                      size={14}
                      className={settings.pageContext ? "shrink-0 text-accent" : "shrink-0 text-muted"}
                    />
                    <span className="min-w-0 flex-1 truncate text-muted">
                      {settings.pageContext ? PAGE.title : "Page context is off"}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        settings.pageContext ? "bg-accent/15 text-accent" : "bg-border text-muted"
                      }`}
                    >
                      {settings.pageContext ? "ON" : "OFF"}
                    </span>
                  </button>

                  {/* Selected text */}
                  <div className="shrink-0 border-b border-border px-3 py-2 text-xs">
                    {selected ? (
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-accent">Selected text detected</p>
                          <button
                            onClick={() => setSelected("")}
                            aria-label="Clear selected text"
                            className="grid size-6 place-items-center rounded-md text-muted hover:bg-border/50"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <p className="line-clamp-2 text-muted">&ldquo;{selected}&rdquo;</p>
                        <button
                          onClick={explainSelected}
                          disabled={busy}
                          className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1.5 font-medium text-accent-fg transition hover:opacity-90 disabled:opacity-50"
                        >
                          <Highlighter size={13} /> Explain selected text
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 text-muted">
                        <span>
                          Select text on the page, then press <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> +{" "}
                          <Kbd>E</Kbd>
                        </span>
                        <button
                          onClick={() => setSelected(SAMPLE)}
                          className="shrink-0 font-medium text-accent hover:underline"
                        >
                          Use sample
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div
                    role="log"
                    aria-live="polite"
                    aria-label="Conversation"
                    className="flex-1 space-y-3 overflow-y-auto p-3"
                  >
                    {messages.length === 0 ? (
                      <div className="animate-rise flex flex-col items-center px-4 pt-8 text-center">
                        <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-fg">
                          <Sparkles size={22} />
                        </span>
                        <h2 className="mt-4 text-lg font-semibold">Ask about this page</h2>
                        <p className="mt-1 text-sm text-muted">
                          Use a quick action below or type your own question.
                        </p>
                      </div>
                    ) : (
                      messages.map((m) => (
                        <div
                          key={m.id}
                          className={`animate-rise flex gap-2 ${
                            m.role === "user" ? "justify-end" : ""
                          }`}
                        >
                          {m.role === "assistant" && (
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
                              <Sparkles size={13} />
                            </span>
                          )}
                          <div
                            className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                              m.role === "user"
                                ? "bg-accent text-accent-fg"
                                : "border border-border bg-bg"
                            }`}
                          >
                            {m.text}
                          </div>
                        </div>
                      ))
                    )}

                    {busy && (
                      <div className="animate-rise flex gap-2" role="status">
                        <span className="sr-only">EchoGPT is typing</span>
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
                          <Sparkles size={13} />
                        </span>
                        <div className="flex items-center gap-1 rounded-2xl border border-border bg-bg px-3 py-3">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="dot size-1.5 rounded-full bg-muted"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={endRef} />
                  </div>

                  {notice && (
                    <p
                      role="status"
                      className="animate-fade shrink-0 px-3 pb-2 text-xs font-medium text-accent"
                    >
                      {notice}
                    </p>
                  )}

                  {/* Quick actions */}
                  {settings.showQuick && (
                    <div className="flex shrink-0 gap-2 overflow-x-auto px-3 pb-2">
                      {QUICK.map(({ id, icon: Icon, label, prompt }) => (
                        <button
                          key={id}
                          onClick={() => (id === "selection" ? explainSelected() : send(prompt))}
                          disabled={busy}
                          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition hover:border-accent hover:text-accent disabled:opacity-50"
                        >
                          <Icon size={13} /> {label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Prompt input */}
                  <div className="shrink-0 border-t border-border p-3">
                    <div className="flex items-end gap-2 rounded-xl border border-border bg-bg p-1.5 focus-within:border-accent">
                      <textarea
                        ref={taRef}
                        rows={1}
                        value={input}
                        placeholder={`Ask ${model}...`}
                        aria-label="Ask EchoGPT"
                        onChange={(e) => setInput(e.target.value)}
                        onInput={(e) => {
                          e.currentTarget.style.height = "auto";
                          e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                          }
                        }}
                        className="max-h-28 flex-1 resize-none bg-transparent px-2 py-1.5 text-base outline-none placeholder:text-muted"
                      />
                      <button
                        onClick={submit}
                        disabled={!input.trim() || busy}
                        aria-label="Send message"
                        className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg transition hover:opacity-90 disabled:opacity-40"
                      >
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* HISTORY TAB */}
              {tab === "history" && (
                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="flex shrink-0 items-center justify-between px-3 pt-3">
                    <h2 className="text-sm font-semibold">History</h2>
                    <button
                      onClick={newChat}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-border/50"
                    >
                      + New chat
                    </button>
                  </div>

                  <div className="relative shrink-0 px-3 py-3">
                    <Search
                      size={15}
                      aria-hidden="true"
                      className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-muted"
                    />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search conversations"
                      aria-label="Search conversations"
                      className="w-full rounded-xl border border-border bg-bg py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-accent"
                    />
                  </div>

                  <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
                    {histLoading ? (
                      <div role="status" className="space-y-2 px-2">
                        <p className="text-xs text-muted">Loading conversations...</p>
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-5/6" />
                        <Skeleton className="h-12 w-11/12" />
                      </div>
                    ) : chats.length === 0 ? (
                      <div className="px-4 pt-10 text-center">
                        <p className="text-sm font-medium">No conversations yet</p>
                        <p className="mt-1 text-xs text-muted">
                          Start your first conversation with EchoGPT.
                        </p>
                        <button
                          onClick={newChat}
                          className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-fg hover:opacity-90"
                        >
                          New chat
                        </button>
                      </div>
                    ) : filtered.length === 0 ? (
                      <p className="px-3 pt-10 text-center text-sm text-muted">
                        No conversations found.
                      </p>
                    ) : (
                      filtered.map((c) => (
                        <div
                          key={c.id}
                          className={`flex items-center gap-1 rounded-lg pr-1 hover:bg-border/40 ${
                            c.id === activeId ? "bg-border/60" : ""
                          }`}
                        >
                          <button
                            onClick={() => {
                              setActiveId(c.id);
                              setTab("chat");
                            }}
                            className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-left text-sm"
                          >
                            <MessageSquare size={15} className="shrink-0 text-muted" />
                            <span className="min-w-0">
                              <span className="block truncate">{c.title}</span>
                              <span className="block text-xs text-muted">
                                {c.messages.length} messages
                              </span>
                            </span>
                          </button>
                          <button
                            onClick={() => deleteChat(c.id)}
                            aria-label={`Delete conversation: ${c.title}`}
                            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-border hover:text-text"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {tab === "settings" && (
                <div className="flex-1 space-y-3 overflow-y-auto p-3">
                  <h2 className="px-1 text-sm font-semibold">Settings</h2>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">Use page context</p>
                      <p className="text-xs text-muted">Let the assistant read the current page.</p>
                    </div>
                    <Switch
                      on={settings.pageContext}
                      onChange={() => update({ pageContext: !settings.pageContext })}
                      label="Use page context"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">Show quick actions</p>
                      <p className="text-xs text-muted">Chips above the prompt box.</p>
                    </div>
                    <Switch
                      on={settings.showQuick}
                      onChange={() => update({ showQuick: !settings.showQuick })}
                      label="Show quick actions"
                    />
                  </div>

                  <div className="rounded-xl border border-border p-3">
                    <label htmlFor="default-model" className="text-sm font-medium">
                      Default AI model
                    </label>
                    <select
                      id="default-model"
                      value={settings.defaultModel}
                      onChange={(e) => {
                        update({ defaultModel: e.target.value });
                        setModel(e.target.value);
                      }}
                      className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
                    >
                      {MODELS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <form onSubmit={saveEndpoint} className="rounded-xl border border-border p-3">
                    <label htmlFor="endpoint" className="text-sm font-medium">
                      API endpoint
                    </label>
                    <p className="mt-0.5 text-xs text-muted">
                      Stored locally. It is never called in this demo.
                    </p>
                    <input
                      id="endpoint"
                      type="url"
                      inputMode="url"
                      value={endpointDraft}
                      onChange={(e) => {
                        setEndpointDraft(e.target.value);
                        setEndpointStatus(null);
                      }}
                      placeholder="https://api.example.com/v1/chat"
                      aria-invalid={endpointStatus ? !endpointStatus.ok : undefined}
                      aria-describedby="endpoint-status"
                      className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-accent"
                    />
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p
                        id="endpoint-status"
                        role="status"
                        className={`text-xs ${
                          endpointStatus?.ok === false ? "text-red-500" : "text-muted"
                        }`}
                      >
                        {endpointStatus?.msg ?? ""}
                      </p>
                      <button
                        type="submit"
                        className="shrink-0 rounded-lg bg-accent px-4 py-1.5 text-xs font-medium text-accent-fg hover:opacity-90"
                      >
                        Save
                      </button>
                    </div>
                  </form>

                  <div className="rounded-xl border border-border p-3">
                    <p className="text-sm font-medium">Keyboard shortcut</p>
                    <p className="mt-1 text-xs text-muted">Explain the text you selected on the page.</p>
                    <p className="mt-2 flex flex-wrap items-center gap-1 text-xs text-muted">
                      <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>E</Kbd>
                      <span className="ml-1">(Cmd on Mac)</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">Clear history</p>
                      <p className="text-xs text-muted">Delete all saved conversations.</p>
                    </div>
                    <button
                      onClick={() => {
                        setChats([]);
                        setActiveId(null);
                      }}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-border/50"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="rounded-xl border border-border bg-bg p-3">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <ShieldCheck size={16} className="text-accent" /> Privacy
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      Conversations stay in this browser tab in this demo, and settings are saved
                      locally. No real AI requests are sent.{" "}
                      <Link href="/privacy" className="font-medium text-accent hover:underline">
                        Read more
                      </Link>
                    </p>
                  </div>

                  <p className="pt-1 text-center text-xs text-muted">
                    EchoGPT Extension · redesign v0.2
                  </p>
                </div>
              )}

              {/* Bottom tab bar */}
              <nav aria-label="Extension sections" className="grid shrink-0 grid-cols-3 border-t border-border">
                {TABS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    aria-current={tab === id ? "page" : undefined}
                    className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
                      tab === id ? "text-accent" : "text-muted hover:text-text"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </nav>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}