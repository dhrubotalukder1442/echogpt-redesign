"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const ITEMS = [
  {
    q: "Which AI models can I use?",
    a: "You can switch between multiple models from one selector, including GPT-4o, Claude Sonnet, Gemini Pro and Llama 3. More models can be added over time.",
  },
  {
    q: "Do I need separate accounts for each model?",
    a: "No. EchoGPT gives you one workspace, so you don't have to juggle different apps and logins.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan lets you try the core chat experience with a limited number of messages each day.",
  },
  {
    q: "What does the Chrome extension do?",
    a: "It opens EchoGPT in the Chrome side panel so you can chat about the page you are on, summarize it, or explain selected text without switching tabs. It is available on the Chrome Web Store.",
  },
  {
    q: "Is my data private?",
    a: "Your conversations are yours. You can delete any chat from your history at any time. See the Privacy page for details.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium text-accent">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered
          </h2>
        </div>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-panel">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={`faq-btn-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-medium"
                  >
                    {item.q}
                    <Plus
                      size={18}
                      aria-hidden="true"
                      className={`shrink-0 text-muted transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}