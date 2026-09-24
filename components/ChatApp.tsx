"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Code2,
  FileText,
  Lightbulb,
  Menu,
  MessageSquare,
  PenLine,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AccountMenu from "./AccountMenu";
import Skeleton from "./Skeleton";

type Msg = { id: number; role: "user" | "assistant"; text: string; error?: boolean };
type Chat = { id: number; title: string; messages: Msg[] };

const MODELS = ["GPT-4o", "Claude Sonnet", "Gemini Pro", "Llama 3"];

const QUICK = [
  { icon: PenLine, label: "Write an email", prompt: "Help me write a professional email to " },
  { icon: Code2, label: "Debug my code", prompt: "Help me debug this code:\n" },
  { icon: Lightbulb, label: "Brainstorm ideas", prompt: "Give me 10 creative ideas for " },
  { icon: FileText, label: "Summarize text", prompt: "Summarize the following text:\n" },
];

const SEED: Chat[] = [
  {
    id: 1,
    title: "Portfolio website ideas",
    messages: [
      { id: 1, role: "user", text: "Give me portfolio website ideas." },
      {
        id: 2,
        role: "assistant",
        text: "Try a dashboard-style layout with a live GitHub feed and a dark theme.",
      },
    ],
  },
  { id: 2, title: "Explain JWT auth", messages: [] },
];

const SKELETON_ROWS = ["w-full", "w-5/6", "w-4/6", "w-11/12"];

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>(SEED);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [sidebar, setSidebar] = useState(false);
  const [menu, setMenu] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const active = chats.find((c) => c.id === activeId);
  const messages = active?.messages ?? [];
  const q = query.trim().toLowerCase();
  const filtered = q ? chats.filter((c) => c.title.toLowerCase().includes(q)) : chats;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenu(false);
        setSidebar(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, busy]);

  function reply(chatId: number, fail: boolean) {
    setBusy(true);
    const usedModel = model;
    setTimeout(() => {
      const msg: Msg = fail
        ? {
            id: Date.now() + 1,
            role: "assistant",
            text: "Something went wrong. Please try again.",
            error: true,
          }
        : {
            id: Date.now() + 1,
            role: "assistant",
            text: `[${usedModel}] This is a demo reply. Connect a real AI API here later.`,
          };
      setChats((p) =>
        p.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c))
      );
      setBusy(false);
    }, 900);
  }

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;

    const userMsg: Msg = { id: Date.now(), role: "user", text: t };
    const chatId = activeId ?? Date.now();

    if (activeId === null) {
      setChats((p) => [{ id: chatId, title: t.slice(0, 32), messages: [userMsg] }, ...p]);
      setActiveId(chatId);
    } else {
      setChats((p) =>
        p.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, userMsg] } : c))
      );
    }

    reply(chatId, t.includes("/error"));
  }

  function retry(chatId: number, msgId: number) {
    if (busy) return;
    setChats((p) =>
      p.map((c) =>
        c.id === chatId ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) } : c
      )
    );
    reply(chatId, false);
  }

  function submit() {
    if (!input.trim() || busy) return;
    send(input);
    setInput("");
    if (taRef.current) taRef.current.style.height = "auto";
  }

  function newChat() {
    setActiveId(null);
    setSidebar(false);
  }

  function deleteChat(id: number) {
    setChats((p) => p.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
      {sidebar && (
        <div
          className="animate-fade fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      {/* Sidebar + conversation history */}
      <aside
        aria-label="Conversations"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-panel transition-transform duration-300 md:static md:translate-x-0 ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg">
              <Sparkles size={16} />
            </span>
            EchoGPT
          </div>
          <button
            onClick={() => setSidebar(false)}
            aria-label="Close sidebar"
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-border/50 md:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 px-3">
          <button
            onClick={newChat}
            className="flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-medium transition hover:bg-border/50"
          >
            <Plus size={16} /> New chat
          </button>
          <div className="relative">
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
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
        </div>

        <p className="px-4 pb-1 pt-5 text-xs font-medium uppercase tracking-wide text-muted">
          History
        </p>
        <nav aria-label="Conversation history" className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
          {loading ? (
            <div role="status" className="space-y-2 px-2 pt-1">
              <p className="text-xs text-muted">Loading conversations...</p>
              {SKELETON_ROWS.map((w) => (
                <Skeleton key={w} className={`h-8 ${w}`} />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="px-3 pt-6 text-center">
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="mt-1 text-xs text-muted">
                Start your first conversation with EchoGPT.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="px-3 pt-6 text-center text-sm text-muted">
              No conversations found.
            </p>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className={`group flex items-center rounded-lg pr-1 hover:bg-border/50 ${
                  c.id === activeId ? "bg-border/60" : ""
                }`}
              >
                <button
                  onClick={() => {
                    setActiveId(c.id);
                    setSidebar(false);
                  }}
                  aria-current={c.id === activeId ? "true" : undefined}
                  className={`flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm ${
                    c.id === activeId ? "font-medium" : "text-muted"
                  }`}
                >
                  <MessageSquare size={15} className="shrink-0" />
                  <span className="truncate">{c.title}</span>
                </button>
                <button
                  onClick={() => deleteChat(c.id)}
                  aria-label={`Delete conversation: ${c.title}`}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-border hover:text-text focus-visible:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </nav>

        <div className="border-t border-border p-2">
          <AccountMenu up />
        </div>
      </aside>

      {/* Main */}
      <main id="main" className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-1 border-b border-border px-2 sm:px-4">
          <button
            onClick={() => setSidebar(true)}
            aria-label="Open sidebar"
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-border/50 md:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenu(!menu)}
              disabled={loading}
              aria-haspopup="listbox"
              aria-expanded={menu}
              aria-label="Choose AI model"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-border/50 disabled:opacity-60"
            >
              {loading ? "Loading models..." : model}
              <ChevronDown
                size={16}
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
                  className="animate-fade absolute left-0 top-full z-20 mt-1 w-48 rounded-xl border border-border bg-panel p-1 shadow-lg"
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

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto">
          <div
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6"
          >
            {loading ? (
              <div role="status" className="space-y-5">
                <span className="sr-only">Loading chat...</span>
                <div className="flex justify-end">
                  <Skeleton className="h-10 w-2/3 rounded-2xl sm:w-1/2" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="animate-rise flex flex-col items-center pt-[10vh] text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-fg">
                  <Sparkles size={26} />
                </span>
                <h1 className="mt-5 text-2xl font-semibold sm:text-3xl">
                  How can I help today?
                </h1>
                <p className="mt-2 text-sm text-muted">
                  Pick a quick action or type your own prompt.
                </p>

                <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                  {QUICK.map(({ icon: Icon, label, prompt }) => (
                    <button
                      key={label}
                      onClick={() => {
                        setInput(prompt);
                        taRef.current?.focus();
                      }}
                      className="flex items-center gap-3 rounded-xl border border-border bg-panel px-4 py-3 text-left text-sm font-medium transition hover:-translate-y-0.5 hover:border-accent hover:shadow-sm"
                    >
                      <Icon size={18} className="text-accent" />
                      {label}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-xs text-muted">
                  Tip: type /error in a message to preview the error state.
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`animate-rise flex gap-3 ${
                    m.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {m.role === "assistant" && (
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
                      <Sparkles size={15} />
                    </span>
                  )}
                  {m.error ? (
                    <div
                      role="alert"
                      className="max-w-[85%] rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-[15px]"
                    >
                      <p className="flex items-center gap-2 font-medium">
                        <TriangleAlert size={16} className="shrink-0 text-red-500" />
                        {m.text}
                      </p>
                      <button
                        onClick={() => active && retry(active.id, m.id)}
                        disabled={busy}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel px-3 py-1.5 text-sm font-medium hover:bg-border/50 disabled:opacity-50"
                      >
                        <RotateCcw size={14} /> Try again
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                        m.role === "user"
                          ? "bg-accent text-accent-fg"
                          : "border border-border bg-panel"
                      }`}
                    >
                      {m.text}
                    </div>
                  )}
                </div>
              ))
            )}

            {busy && (
              <div className="animate-rise flex gap-3" role="status">
                <span className="sr-only">EchoGPT is typing</span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
                  <Sparkles size={15} />
                </span>
                <div className="flex items-center gap-1 rounded-2xl border border-border bg-panel px-4 py-3">
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
        </div>

        {/* Prompt input */}
        <div className="shrink-0 px-3 pb-3 sm:px-4 sm:pb-5">
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-panel p-2 shadow-sm focus-within:border-accent">
            <textarea
              ref={taRef}
              rows={1}
              value={input}
              placeholder={`Message ${model}...`}
              aria-label="Message EchoGPT"
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
              className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-base outline-none placeholder:text-muted"
            />
            <button
              onClick={submit}
              disabled={!input.trim() || busy}
              aria-label="Send message"
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-fg transition hover:opacity-90 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            EchoGPT can make mistakes. Check important info.
          </p>
        </div>
      </main>
    </div>
  );
}