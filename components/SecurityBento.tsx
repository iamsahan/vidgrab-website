"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { securityGroups } from "@/lib/site";

const paths = {
  link: "M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  shield: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z",
  key: "M12 12a4 4 0 1 1-1-1l8-8M16 6l2 2M14 8l2 2",
  braces: "M9 4C7 4 7 6 7 8s-2 4-2 4 2 2 2 4 0 4 2 4M15 4c2 0 2 2 2 4s2 4 2 4-2 2-2 4 0 4-2 4",
  file: "M7 3h7l5 5v13H7zM14 3v5h5",
  terminal: "M4 5h16v14H4zM8 10l3 2-3 2M13 15h4",
  check: "M5 12l5 5 9-10",
  x: "M6 6l12 12M18 6L6 18",
  lines: "M4 6h16M4 12h10M4 18h13",
  hash: "M5 9h14M5 15h14M10 4L8 20M16 4l-2 16",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  ruler: "M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2",
} as const;

type IconName = keyof typeof paths;

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

/** Messages flowing past a gate; rejected ones carry a red mark. */
function BoundaryVisual() {
  const top: [IconName, boolean][] = [["link", true], ["braces", true], ["lines", false], ["ruler", true], ["file", false], ["link", true], ["user", true]];
  const bottom: [IconName, boolean][] = [["braces", false], ["lines", true], ["link", true], ["ruler", false], ["braces", true], ["file", true], ["lines", true]];
  const row = (items: [IconName, boolean][], reverse: boolean) => (
    <div className={`bv-row${reverse ? " reverse" : ""}`}>
      {[...items, ...items].map(([name, ok], i) => (
        <span className="bv-tile" key={i}>
          <Icon name={name} />
          <i className={ok ? "ok" : "bad"}><Icon name={ok ? "check" : "x"} size={10} /></i>
        </span>
      ))}
    </div>
  );
  return (
    <div className="bv">
      <svg className="bv-wires" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M300 0v40h-40v20" /><path d="M300 220v-40h40v-20" />
      </svg>
      {row(top, false)}
      {row(bottom, true)}
      <span className="bv-gate"><Icon name="shield" size={28} /></span>
    </div>
  );
}

/** Host to app over a private socket, with the peer check. */
function SocketVisual() {
  return (
    <div className="sv">
      <span className="pill">getpeereid · uid matches <b>✓</b></span>
      <svg viewBox="0 0 300 140" aria-hidden="true">
        <defs>
          <linearGradient id="sv-line" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="0.5" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path id="sv-path" d="M0 110 C 60 110, 70 40, 150 60 S 240 20, 300 30" stroke="url(#sv-line)" strokeWidth="2" fill="none" />
        <line x1="150" y1="60" x2="150" y2="140" className="sv-drop" />
        <circle r="5" className="sv-dot" cx="150" cy="60" />
        <circle r="3.5" className="sv-packet">
          <animateMotion dur="3.4s" repeatCount="indefinite" path="M0 110 C 60 110, 70 40, 150 60 S 240 20, 300 30" />
        </circle>
      </svg>
      <span className="sv-mode">0700 folder · 0600 socket</span>
    </div>
  );
}

/** The argument list a download runs with, and the shell it never uses. */
function ArgvVisual() {
  return (
    <div className="av">
      <div className="av-dots" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
      <div className="av-stack">
        <span className="pill mono" style={{ "--d": "0s" } as CSSProperties}>yt-dlp</span>
        <span className="pill mono" style={{ "--d": "0.15s" } as CSSProperties}>--ignore-config</span>
        <span className="pill mono" style={{ "--d": "0.3s" } as CSSProperties}>--</span>
        <span className="pill mono" style={{ "--d": "0.45s" } as CSSProperties}>https://…</span>
        <span className="pill mono struck">sh -c</span>
      </div>
    </div>
  );
}

/** A private cookie file with a countdown to deletion. */
function CookieVisual() {
  return (
    <div className="cv">
      <div className="cv-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="52" className="cv-track" />
          <circle cx="60" cy="60" r="52" className="cv-arc" pathLength="100" />
        </svg>
        <span className="cv-file"><Icon name="file" size={30} /><b>cookies</b><small>0600</small></span>
      </div>
      <span className="pill">deleted when the job ends</span>
    </div>
  );
}

/** A row of sign-in safeguards around a key. */
function SignInVisual() {
  const side: IconName[] = ["eye", "lock", "key", "shield", "user"];
  return (
    <div className="gv">
      {side.map((name, i) => (
        <span key={name} className={`gv-orb${i === 2 ? " main" : ""}`}><Icon name={name} size={i === 2 ? 30 : 20} /></span>
      ))}
      <span className="gv-tags"><span className="pill mono">PKCE</span><span className="pill mono">drive.file</span><span className="pill mono">read-only</span></span>
    </div>
  );
}

/** A downloaded update checked against its published checksum. */
function ChecksumVisual() {
  return (
    <div className="hv">
      <div className="hv-line"><small>published</small><code>9f3c 41ad 0e7b … a71e</code></div>
      <div className="hv-line scan"><small>downloaded</small><code>9f3c 41ad 0e7b … a71e</code></div>
      <div className="hv-foot"><span className="pill good"><Icon name="check" size={12} /> sha-256 match</span><span className="pill mono">newer only</span></div>
    </div>
  );
}

/** The Download button sealed off from page scripts. */
function ShadowVisual() {
  return (
    <div className="dv">
      <div className="dv-page">
        <span className="dv-script"><Icon name="braces" size={16} /> page script</span>
        <span className="dv-probe" aria-hidden="true" />
        <div className="dv-video">
          <div className="dv-shadow">
            <small>closed shadow root</small>
            <span className="dv-button">↓ Download</span>
          </div>
        </div>
      </div>
      <ul className="dv-notes">
        <li><Icon name="x" size={12} /> no eval</li>
        <li><Icon name="x" size={12} /> no innerHTML</li>
        <li><Icon name="check" size={12} /> pinned dependencies</li>
      </ul>
    </div>
  );
}

/** Things VidGrab refuses, drifting past. */
function RefusalVisual() {
  const items = ["Analytics", "Tracking", "Local web server", "DRM bypass", "Drive-wide access", "Shell commands"];
  return (
    <div className="rv">
      <div className="rv-row">
        {[...items, ...items].map((item, i) => <span key={i} className="pill struck">{item}</span>)}
      </div>
    </div>
  );
}

const visuals: Record<string, { visual: ReactNode; span?: 2 | 3 }> = {
  "Browser boundary": { visual: <BoundaryVisual />, span: 2 },
  "Local connection": { visual: <SocketVisual /> },
  "Running the engine": { visual: <ArgvVisual /> },
  "Cookies and secrets": { visual: <CookieVisual /> },
  "Google sign-in": { visual: <SignInVisual /> },
  "Supply chain and updates": { visual: <ChecksumVisual /> },
  "Inside the browser": { visual: <ShadowVisual />, span: 2 },
  "What VidGrab won't do": { visual: <RefusalVisual />, span: 3 },
};

/** Security protections as a bento grid; each card illustrates what its rules stop. */
export function SecurityBento() {
  // A soft light follows the pointer across each card.
  const spotlight = (event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - r.left}px`);
    card.style.setProperty("--my", `${event.clientY - r.top}px`);
  };

  return (
    <div className="bento">
      {securityGroups.map((group) => {
        const entry = visuals[group.title];
        return (
          <article key={group.title} className={`bento-card reveal${entry?.span ? ` span-${entry.span}` : ""}`} onPointerMove={spotlight}>
            <div className="bento-visual" aria-hidden="true">{entry?.visual}</div>
            <div className="bento-text">
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
              <details>
                <summary>Details</summary>
                <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>
            </div>
          </article>
        );
      })}
    </div>
  );
}
