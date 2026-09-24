import Link from "next/link";
import {
  ArrowRight,
  Check,
  Cpu,
  FileText,
  History,
  Languages,
  Layers,
  Lock,
  MessageSquare,
  Puzzle,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

function Heading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-muted">{sub}</p>}
    </div>
  );
}

/* ---------------- Hero ---------------- */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-accent/20 blur-3xl"
      />
      <div className={`${wrap} flex flex-col items-center py-16 text-center sm:py-24`}>
        <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1 text-xs font-medium text-muted">
          <Sparkles size={14} className="text-accent" />
          One workspace, every AI model
        </span>

        <h1
          className="animate-rise mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          style={{ animationDelay: "0.05s" }}
        >
          Chat with every AI model in{" "}
          <span className="text-accent">one place</span>
        </h1>

        <p
          className="animate-rise mt-5 max-w-xl text-base text-muted sm:text-lg"
          style={{ animationDelay: "0.1s" }}
        >
          Stop switching tabs and accounts. Pick a model, ask your question, and
          compare the answers, all from a single clean interface.
        </p>

        <div
          className="animate-rise mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          style={{ animationDelay: "0.15s" }}
        >
          <Link
            href="/chat"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition hover:opacity-90 sm:w-auto"
          >
            Start chatting <ArrowRight size={16} />
          </Link>
          <a href="#features" className="w-full rounded-xl border border-border bg-panel px-6 py-3 text-center text-sm font-medium transition hover:bg-border/50 sm:w-auto">See features</a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- AI Models ---------------- */
const MODELS = [
  { name: "GPT-4o", tag: "General purpose", desc: "Balanced and fast for everyday questions, writing and analysis." },
  { name: "Claude Sonnet", tag: "Writing & reasoning", desc: "Great for long documents, careful reasoning and clear writing." },
  { name: "Gemini Pro", tag: "Multimodal", desc: "Handles text and images together for richer conversations." },
  { name: "Llama 3", tag: "Open source", desc: "A flexible open model that is quick and cost friendly." },
  { name: "Mistral", tag: "Fast & efficient", desc: "Lightweight responses when you just need speed." },
  { name: "DeepSeek", tag: "Code & math", desc: "Strong pick for programming help and step-by-step problem solving." },
];

export function Models() {
  return (
    <section id="models" className="scroll-mt-20 py-16 sm:py-20">
      <div className={wrap}>
        <Heading
          eyebrow="AI Models"
          title="The right model for every task"
          sub="Switch models mid-conversation with a single click."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-border bg-panel p-5 transition hover:-translate-y-1 hover:border-accent hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Cpu size={20} />
                </span>
                <div>
                  <h3 className="font-semibold leading-tight">{m.name}</h3>
                  <p className="text-xs text-muted">{m.tag}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
const FEATURES = [
  { icon: Layers, title: "Multi-model chat", desc: "Use several AI models without leaving the conversation." },
  { icon: Zap, title: "Quick actions", desc: "One-tap prompts for emails, debugging, brainstorming and summaries." },
  { icon: History, title: "Conversation history", desc: "Every chat is saved in the sidebar so you can pick up where you left off." },
  { icon: Languages, title: "Any language", desc: "Ask in the language you think in and get answers back the same way." },
  { icon: FileText, title: "Summarize anything", desc: "Paste long text and get the key points in seconds." },
  { icon: Lock, title: "You stay in control", desc: "Delete conversations whenever you want." },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-16 sm:py-20">
      <div className={wrap}>
        <Heading
          eyebrow="Features"
          title="Everything you need, nothing you don't"
        />
        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <span className="grid size-11 place-items-center rounded-xl border border-border bg-panel text-accent">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Product Preview ---------------- */
export function Preview() {
  return (
    <section className="py-16 sm:py-20">
      <div className={wrap}>
        <Heading
          eyebrow="Product preview"
          title="A calm, focused chat experience"
          sub="Clean sidebar, simple prompt box, and light or dark mode."
        />

        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-border bg-panel shadow-xl">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="size-3 rounded-full bg-red-400/80" />
            <span className="size-3 rounded-full bg-yellow-400/80" />
            <span className="size-3 rounded-full bg-green-400/80" />
            <span className="ml-3 text-xs text-muted">EchoGPT · Chat</span>
          </div>

          <div className="flex h-80 sm:h-96">
            <div className="hidden w-48 shrink-0 space-y-1 border-r border-border p-3 sm:block">
              <div className="mb-3 rounded-lg border border-border px-3 py-2 text-xs font-medium">
                + New chat
              </div>
              {["Portfolio website ideas", "Explain JWT auth", "Trip plan"].map(
                (t, i) => (
                  <div
                    key={t}
                    className={`flex items-center gap-2 truncate rounded-lg px-3 py-2 text-xs ${
                      i === 0 ? "bg-border/60 font-medium" : "text-muted"
                    }`}
                  >
                    <MessageSquare size={13} className="shrink-0" />
                    <span className="truncate">{t}</span>
                  </div>
                )
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-end gap-3 p-4">
              <div className="ml-auto max-w-[80%] rounded-2xl bg-accent px-4 py-2.5 text-sm text-accent-fg">
                Give me portfolio website ideas.
              </div>
              <div className="flex gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-accent-fg">
                  <Sparkles size={13} />
                </span>
                <div className="max-w-[85%] rounded-2xl border border-border px-4 py-2.5 text-sm">
                  Try a dashboard-style layout with a live GitHub feed and a
                  dark theme.
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-sm text-muted">
                Message GPT-4o...
                <span className="grid size-7 place-items-center rounded-lg bg-accent text-accent-fg">
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Chrome Extension ---------------- */
export function Extension() {
  return (
    <section id="extension" className="scroll-mt-20 py-16 sm:py-20">
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1 text-xs font-medium text-muted">
            <Puzzle size={14} className="text-accent" /> Chrome extension · Coming soon
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            EchoGPT, right inside your browser
          </h2>
          <p className="mt-3 text-muted">
            Ask about the page you're reading, summarize an article, or run a
            quick action without leaving the tab.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Chat with page context",
              "Switch models from the popup",
              "Quick actions and saved history",
            ].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid size-5 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check size={13} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Popup mock */}
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-panel p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="grid size-6 place-items-center rounded-md bg-accent text-accent-fg">
                <Sparkles size={12} />
              </span>
              EchoGPT
            </div>
            <span className="rounded-md border border-border px-2 py-1 text-xs text-muted">
              Claude Sonnet
            </span>
          </div>
          <div className="mt-3 rounded-lg bg-border/40 px-3 py-2 text-xs text-muted">
            Page context: "How JWT authentication works"
          </div>
          <div className="mt-3 rounded-2xl border border-border px-3 py-2.5 text-sm">
            This article explains how tokens are issued, signed and verified.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Summarize", "Explain simply", "Key points"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Why EchoGPT ---------------- */
const WHY = [
  { title: "Less tab switching", desc: "All your favorite models live in one interface." },
  { title: "Fast by design", desc: "A lightweight UI that stays out of your way." },
  { title: "Works on every screen", desc: "Phone, tablet, laptop or desktop, it adapts." },
  { title: "Made for daily use", desc: "History, quick actions and dark mode built in." },
];

export function Why() {
  return (
    <section className="py-16 sm:py-20">
      <div className={wrap}>
        <Heading eyebrow="Why EchoGPT" title="Built for the way you actually work" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {WHY.map((w) => (
            <div
              key={w.title}
              className="flex gap-4 rounded-2xl border border-border bg-panel p-5"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                <Check size={18} />
              </span>
              <div>
                <h3 className="font-semibold">{w.title}</h3>
                <p className="mt-1 text-sm text-muted">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing ---------------- */
const PLANS = [
  {
    name: "Free",
    price: "$0",
    per: "forever",
    desc: "Try the core experience.",
    features: ["Limited daily messages", "2 AI models", "Conversation history"],
    featured: false,
  },
  {
    name: "Pro",
    price: "$12",
    per: "/ month",
    desc: "For daily power users.",
    features: ["Unlimited messages", "All AI models", "Chrome extension access", "Priority speed"],
    featured: true,
  },
  {
    name: "Team",
    price: "$25",
    per: "/ user / month",
    desc: "For small teams.",
    features: ["Everything in Pro", "Shared workspaces", "Admin controls"],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 py-16 sm:py-20">
      <div className={wrap}>
        <Heading
          eyebrow="Pricing"
          title="Simple pricing"
          sub="Start free, upgrade when you need more."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                p.featured
                  ? "border-accent bg-panel shadow-lg md:-translate-y-2"
                  : "border-border bg-panel"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-medium text-accent-fg">
                  Popular
                </span>
              )}
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">{p.desc}</p>
              <p className="mt-5">
                <span className="text-4xl font-semibold">{p.price}</span>{" "}
                <span className="text-sm text-muted">{p.per}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check size={16} className="shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/chat"
                className={`mt-6 rounded-xl px-4 py-2.5 text-center text-sm font-medium transition ${
                  p.featured
                    ? "bg-accent text-accent-fg hover:opacity-90"
                    : "border border-border hover:bg-border/50"
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
export function CTA() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-accent px-6 py-12 text-center text-accent-fg sm:px-12 sm:py-16">
        <Rocket className="mx-auto" size={28} />
        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Ready to try EchoGPT?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm opacity-90 sm:text-base">
          Open the app and start your first conversation in seconds.
        </p>
        <Link
          href="/chat"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-stone-900 transition hover:opacity-90"
        >
          Open EchoGPT <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className={`${wrap} flex flex-col gap-8 py-10 sm:flex-row sm:justify-between`}>
        <div className="max-w-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg">
              <Sparkles size={16} />
            </span>
            EchoGPT
          </div>
          <p className="mt-3 text-sm text-muted">
            One place for every AI model.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm">
          <div className="space-y-2">
            <p className="font-medium">Product</p>
            <a href="#features" className="block text-muted hover:text-text">Features</a>
            <a href="#pricing" className="block text-muted hover:text-text">Pricing</a>
            <a href="#extension" className="block text-muted hover:text-text">Extension</a>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Start</p>
            <Link href="/chat" className="block text-muted hover:text-text">Open app</Link>
            <a href="#faq" className="block text-muted hover:text-text">FAQ</a>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} EchoGPT. All rights reserved.
      </div>
    </footer>
  );
}