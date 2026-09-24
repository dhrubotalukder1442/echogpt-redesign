import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Privacy · EchoGPT",
  description: "How this EchoGPT redesign demo handles data.",
};

const SECTIONS = [
  {
    title: "Data handling",
    body: "This site is a frontend redesign demo. It has no backend, no database and no server side storage of your conversations.",
  },
  {
    title: "Local demo storage",
    body: "Your theme choice, demo sign-in details and extension settings are saved in your own browser using localStorage. Conversations stay in the open browser tab and disappear on refresh. You can clear everything by clearing site data in your browser.",
  },
  {
    title: "AI requests",
    body: "No real AI requests are sent. Every reply you see is a placeholder generated in your browser. The API endpoint field in the extension settings is stored locally and is never called.",
  },
  {
    title: "Cookies and sign-in",
    body: "The log in and sign up pages are visual demos. No real account is created and no password is stored or sent anywhere.",
  },
  {
    title: "Third-party services",
    body: "The page loads the Inter font through Next.js font optimization. This demo adds no analytics or advertising trackers.",
  },
];

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy"
      intro="A short, plain explanation of what happens to your data in this demo."
    >
      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <section key={s.title} className="rounded-2xl border border-border bg-panel p-5">
            <h2 className="font-semibold">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        Looking for the privacy policy of the real EchoGPT service? Read it at{" "}
        <Link
          href="https://echogpt.live/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent hover:underline"
        >
          echogpt.live/privacy-policy
        </Link>
        .
      </p>
    </PageShell>
  );
}