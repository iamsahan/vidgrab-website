"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Logo } from "./ui";

type Tile = {
  /** Position of the tile's centre, in % of the section. */
  x: number;
  y: number;
  /** How far it drifts while scrolling: farther tiles move less. */
  depth: number;
  tilt: number;
  tone: string;
  /** Hidden on narrow screens to keep the numbers readable. */
  wide?: boolean;
  label: string;
  glyph: ReactNode;
};

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 48 48" width="46%" height="46%" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const text = (value: string) => <span className="tile-text">{value}</span>;

const tiles: Tile[] = [
  { x: 20, y: 18, depth: 0.9, tilt: -6, tone: "ink", label: "4K", glyph: text("4K") },
  { x: 37, y: 25, depth: 0.5, tilt: 4, tone: "blue", label: "Upload to Google Drive", glyph: svg(<><path d="M14 34a9 9 0 0 1 1-18 12 12 0 0 1 22 4 7 7 0 0 1-1 14" /><path d="M24 38V24M18 29l6-6 6 6" /></>) },
  { x: 60, y: 15, depth: 1.1, tilt: -3, tone: "paper", label: "Film strip", glyph: svg(<><rect x="8" y="10" width="32" height="28" rx="4" /><path d="M16 10v28M32 10v28M8 19h8M8 29h8M32 19h8M32 29h8" /></>), wide: true },
  { x: 67, y: 31, depth: 0.6, tilt: 5, tone: "mist", label: "Waveform", glyph: svg(<path d="M8 24h4M16 16v16M22 10v28M28 18v12M34 13v22M40 24h0" />) },
  { x: 86, y: 25, depth: 1.3, tilt: -5, tone: "paper", label: "Recording", glyph: <span className="tile-dot" />, wide: true },
  { x: 25, y: 54, depth: 0.7, tilt: 3, tone: "yellow", label: "MP4", glyph: text("MP4") },
  { x: 52, y: 55, depth: 0.35, tilt: -2, tone: "brand", label: "VidGrab", glyph: <Logo size={56} /> },
  { x: 77, y: 53, depth: 1, tilt: 6, tone: "coral", label: "Play", glyph: svg(<path d="M18 13l17 11-17 11z" fill="currentColor" />) },
  { x: 11, y: 70, depth: 1.2, tilt: -4, tone: "night", label: "Timecode", glyph: <span className="tile-text mono">00:42</span>, wide: true },
  { x: 31, y: 83, depth: 0.8, tilt: 5, tone: "violet", label: "HLS stream", glyph: text("HLS") },
  { x: 50, y: 86, depth: 1.1, tilt: -6, tone: "lime", label: "Done", glyph: svg(<path d="M12 25l8 8 16-17" />) },
  { x: 76, y: 85, depth: 0.6, tilt: 3, tone: "paper", label: "Pause", glyph: svg(<><path d="M19 14v20M29 14v20" /></>) },
  { x: 92, y: 66, depth: 0.9, tilt: -3, tone: "teal", label: "Folder", glyph: svg(<path d="M8 16a3 3 0 0 1 3-3h8l4 4h14a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z" />), wide: true },
  { x: 92, y: 40, depth: 0.4, tilt: 4, tone: "pink", label: "M4A audio", glyph: text("M4A"), wide: true },
];

/** Big numbers surrounded by tiles from VidGrab's world, drifting at different depths on scroll. */
export function FloatingTiles() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = section.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(element.querySelectorAll<HTMLElement>(".tile"));
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
      frame = 0;
      const r = element.getBoundingClientRect();
      // -1 when the section is entering from below, 1 when it's leaving at the top.
      const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - (r.top + r.height / 2)) / (innerHeight / 2 + r.height / 2)));
      for (const tile of items) {
        const depth = Number(tile.dataset.depth);
        const tilt = Number(tile.dataset.tilt);
        const y = -progress * 160 * depth + pointerY * 18 * depth;
        const x = pointerX * 22 * depth;
        tile.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(tilt + progress * tilt).toFixed(2)}deg)`;
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onPointer = (event: PointerEvent) => {
      pointerX = event.clientX / innerWidth - 0.5;
      pointerY = event.clientY / innerHeight - 0.5;
      schedule();
    };

    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section className="tiles-section" ref={section} aria-labelledby="tiles-title">
      <div className="tiles" aria-hidden="true">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={`tile tone-${tile.tone}${tile.wide ? " wide" : ""}`}
            title={tile.label}
            data-depth={tile.depth}
            data-tilt={tile.tilt}
            style={{ left: `${tile.x}%`, top: `${tile.y}%`, transform: `translate(-50%, -50%) rotate(${tile.tilt}deg)` }}
          >
            {tile.glyph}
          </div>
        ))}
      </div>
      <div className="tiles-copy wrap">
        <p className="tiles-lead">Built to handle</p>
        <h2 id="tiles-title" className="tiles-numbers">
          <span>1,000+ sites</span>
          <span>144p to 4K</span>
          <span>1 click in Chrome</span>
        </h2>
      </div>
    </section>
  );
}
