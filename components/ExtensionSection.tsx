import Link from "next/link";
import { ArrowRight, Check, Download, Puzzle, Sparkles } from "lucide-react";
import { STORE_URL } from "./Footer";

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

export default function ExtensionSection() {
  return (
    <section id="extension" className="scroll-mt-20 py-16 sm:py-20">
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1 text-xs font-medium text-muted">
            <Puzzle size={14} className="text-accent" /> Chrome extension · Available now
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            EchoGPT, right inside your browser
          </h2>
          <p className="mt-3 text-muted">
            Open EchoGPT in the Chrome side panel. Ask about the page you are reading,
            summarize it, or explain any text you select, without leaving the tab.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Chat with page context",
              "Explain selected text with Ctrl + Shift + E",
              "Switch models from the side panel",
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-fg transition hover:opacity-90"
            >
              <Download size={16} /> Add to Chrome
            </Link>
            <Link
              href="/extension"
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-panel px-6 py-3 text-sm font-medium transition hover:bg-border/50"
            >
              See the redesign <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Side panel mock */}
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
            Selected text detected: &ldquo;Access tokens live for a short time...&rdquo;
          </div>
          <div className="mt-3 rounded-2xl border border-border px-3 py-2.5 text-sm">
            This explains why short lived tokens limit the damage if one is stolen.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Summarize page", "Key points", "Explain selected text"].map((t) => (
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