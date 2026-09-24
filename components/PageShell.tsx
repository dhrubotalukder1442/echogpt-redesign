import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Footer from "./Footer";

export default function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg">Skip to content</a>
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid size-8 place-items-center rounded-lg bg-accent text-accent-fg">
              <Sparkles size={16} />
            </span>
            EchoGPT
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted transition hover:text-text"
            >
              <ArrowLeft size={16} /> Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-muted">{intro}</p>
        <div className="mt-10">{children}</div>
      </main>

      <Footer />
    </div>
  );
}