"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { faqs, site } from "@/lib/site";

const topics = ["All", ...Array.from(new Set(faqs.map((item) => item.topic)))];

/** Topic filters beside an accordion that opens one answer at a time, with animated height. */
export function FaqExplorer() {
  const [topic, setTopic] = useState("All");
  const [open, setOpen] = useState<string | null>(faqs[0]?.q ?? null);
  const base = useId();
  const shown = faqs.filter((item) => topic === "All" || item.topic === topic);

  return (
    <div className="faq-layout">
      <aside className="faq-side">
        <div className="faq-filter" role="group" aria-label="Filter by topic">
          {topics.map((name) => {
            const count = name === "All" ? faqs.length : faqs.filter((item) => item.topic === name).length;
            return (
              <button key={name} type="button" aria-pressed={topic === name} className={topic === name ? "on" : ""} onClick={() => setTopic(name)}>
                {name}<span>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="faq-ask">
          <b>Still have a question?</b>
          <p>Open an issue on GitHub. Answers that help others end up on this page.</p>
          <div className="cta-row">
            <a className="btn primary" href={`${site.repo}/issues`} target="_blank" rel="noopener noreferrer">Ask on GitHub</a>
            <Link className="btn" href="/security/">Security</Link>
          </div>
        </div>
      </aside>

      <ul className="faq-list">
        {shown.map((item) => {
          const index = faqs.indexOf(item);
          const isOpen = open === item.q;
          const id = `${base}-${index}`;
          return (
            <li key={item.q} className={`faq-item${isOpen ? " open" : ""}`}>
              <h3>
                <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen(isOpen ? null : item.q)}>
                  <span className="faq-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="faq-q">{item.q}</span>
                  <span className="faq-topic">{item.topic}</span>
                  <span className="faq-toggle" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq-answer" id={id} role="region" aria-hidden={!isOpen}>
                <div><p>{item.a}</p></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
