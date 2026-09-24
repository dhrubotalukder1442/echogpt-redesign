import Link from "next/link";
import { Sparkles } from "lucide-react";

export const STORE_URL =
  "https://chromewebstore.google.com/detail/echogpt-multi-ai-chat-sid/negimdcamohmoheiifgecbjgjepkcfhj";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#extension", label: "Extension" },
    ],
  },
  {
    title: "Start",
    links: [
      { href: "/chat", label: "Open app" },
      { href: "/login", label: "Log in" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal & help",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/support", label: "Support" },
      { href: STORE_URL, label: "Add to Chrome", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg">
              <Sparkles size={16} />
            </span>
            EchoGPT
          </div>
          <p className="mt-3 text-sm text-muted">One place for every AI model.</p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 sm:gap-12">
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title} className="space-y-2">
              <p className="font-medium">{col.title}</p>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block text-muted transition hover:text-text"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} EchoGPT redesign. Frontend demo.
      </div>
    </footer>
  );
}