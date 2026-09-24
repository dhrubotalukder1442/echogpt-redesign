import Link from "next/link";
import { CircleHelp, MessageSquare, Puzzle } from "lucide-react";
import PageShell from "@/components/PageShell";
import SupportForm from "@/components/SupportForm";
import { STORE_URL } from "@/components/Footer";

export const metadata = {
  title: "Support · EchoGPT",
  description: "Get help with EchoGPT.",
};

const CARDS = [
  {
    icon: CircleHelp,
    title: "Read the FAQ",
    desc: "Quick answers about models, plans and privacy.",
    href: "/#faq",
    label: "Open FAQ",
  },
  {
    icon: Puzzle,
    title: "Chrome extension",
    desc: "Install the side panel extension from the Chrome Web Store.",
    href: STORE_URL,
    label: "Add to Chrome",
    external: true,
  },
  {
    icon: MessageSquare,
    title: "Real EchoGPT support",
    desc: "Need help with the live product? Use the official support site.",
    href: "https://echogpt.live/support",
    label: "Visit support",
    external: true,
  },
];

export default function SupportPage() {
  return (
    <PageShell
      title="Need help?"
      intro="Pick the quickest way to get unstuck."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map(({ icon: Icon, title, desc, href, label, external }) => (
          <div key={title} className="flex flex-col rounded-2xl border border-border bg-panel p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-accent/10 text-accent">
              <Icon size={20} />
            </span>
            <h2 className="mt-4 font-semibold">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted">{desc}</p>
            <Link
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-4 text-sm font-medium text-accent hover:underline"
            >
              {label}
            </Link>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-12 text-xl font-semibold">Contact support</h2>
      <SupportForm />
    </PageShell>
  );
}