import type { ReactNode } from "react";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="vg-logo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b66f5" />
          <stop offset="1" stopColor="#4538cc" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="7" fill="url(#vg-logo)" />
      <path d="M16 7.5v12M10.5 14.5l5.5 5.5 5.5-5.5M9.5 24.5h13" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SectionHead({ eyebrow, title, lede }: { eyebrow: string; title: ReactNode; lede?: ReactNode }) {
  return (
    <div className="section-head reveal">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}

/** Opening band for inner pages, with a timeline ruler along its bottom edge. */
export function PageIntro({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-intro">
      <div className="glow" aria-hidden="true" />
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
        {children}
      </div>
    </section>
  );
}
