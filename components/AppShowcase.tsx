"use client";

import { useEffect, useRef } from "react";
import { Logo } from "./ui";

const rows = [
  { tone: "t1", tc: "12:34", title: "Sunset timelapse over the harbour", site: "vimeo.com", state: "downloading", detail: "742 MB of 1.2 GB", meta: "6.1 MB/s · 1 min left", progress: 62 },
  { tone: "t4", tc: "08:15", title: "Product launch keynote", site: "example.com", state: "uploading", detail: "Uploading to Google Drive", meta: "180 MB of 450 MB", progress: 40 },
  { tone: "t2", tc: "03:58", title: "Swift concurrency, a practical talk", site: "conference.dev", state: "done", detail: "1080p · 3:58 · 413 MB · Today, 3:24 PM" },
  { tone: "t3", tc: "41:07", title: "Studio session, take 4", site: "studio.tv", state: "queued", detail: "Waiting" },
] as const;

const icon = {
  pause: <path d="M9 6v12M15 6v12" />,
  close: <path d="M7 7l10 10M17 7L7 17" />,
  play: <path d="M8 6l10 6-10 6z" fill="currentColor" />,
  folder: <path d="M4 8a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />,
  cloud: <><path d="M7 18a5 5 0 0 1 .5-10 6.5 6.5 0 0 1 12 2.5A4 4 0 0 1 18 18" /><path d="M12 20v-7M9 15.5l3-3 3 3" /></>,
};
const Icon = ({ name }: { name: keyof typeof icon }) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon[name]}</svg>
);

/** A faithful VidGrab window that rises from a tilt to flat as it scrolls into view. */
export function AppShowcase() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.style.setProperty("--rise", "1");
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = element.getBoundingClientRect();
      // 0 while the window's top is at the bottom of the screen, 1 once it reaches 35% from the top.
      const progress = (innerHeight - r.top) / (innerHeight * 0.65);
      element.style.setProperty("--rise", Math.min(1, Math.max(0, progress)).toFixed(3));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div className="showcase" ref={stage}>
      <div className="showcase-glow" aria-hidden="true" />
      <div className="app-window" role="img" aria-label="The VidGrab window: a sidebar, four downloads in different states, and a preview panel playing a finished video">
        <div className="aw-toolbar">
          <span className="lights"><i className="red" /><i className="amber" /><i className="green" /></span>
          <b>All Downloads</b>
          <span className="aw-tools"><span className="aw-btn">+</span><span className="aw-btn"><Icon name="pause" /></span><span className="aw-search">Search downloads</span></span>
        </div>
        <div className="aw-body">
          <aside className="aw-side">
            <small>Library</small>
            <span className="on">All Downloads <em>4</em></span>
            <span>Downloading <em>2</em></span>
            <span>Completed <em>1</em></span>
            <span>Needs Attention <em>0</em></span>
            <small>Google Drive</small>
            <span>All Videos <em>38</em></span>
            <span>Continue Watching</span>
            <span>Movies</span>
            <div className="aw-storage"><b>Downloads</b>182 GB available</div>
          </aside>
          <div className="aw-list">
            {rows.map((row, index) => (
              <div className={`aw-row${index === 2 ? " selected" : ""}`} key={row.title}>
                <div className={`thumb ${row.tone}`} data-tc={row.tc} />
                <div className="aw-text">
                  <b>{row.title}</b>
                  <span className="aw-meta"><i className="badge">{row.site}</i>{row.detail}</span>
                  {"progress" in row ? (
                    <span className={`aw-progress ${row.state}`}>
                      <span className="bar"><i style={{ width: `${row.progress}%` }} /></span>
                      <em>{row.meta}</em>
                    </span>
                  ) : null}
                </div>
                <span className="aw-actions">
                  {row.state === "done" ? <><Icon name="play" /><Icon name="folder" /></> : row.state === "uploading" ? <Icon name="cloud" /> : <><Icon name="pause" /><Icon name="close" /></>}
                </span>
              </div>
            ))}
          </div>
          <aside className="aw-preview">
            <div className="aw-player">
              <span className="aw-play"><Icon name="play" /></span>
              <span className="aw-scrub"><i /></span>
            </div>
            <b>Swift concurrency, a practical talk</b>
            <span className="pill">Done</span>
            <dl>
              <dt>Size</dt><dd>413 MB</dd>
              <dt>Duration</dt><dd>3:58</dd>
              <dt>Resolution</dt><dd>1920 × 1080</dd>
              <dt>Video</dt><dd>H.264</dd>
            </dl>
          </aside>
        </div>
        <div className="aw-status"><span>4 items</span><span className="live">↓ 6.1 MB/s · 2 active</span></div>
      </div>

      <div className="menubar-panel" aria-hidden="true">
        <div className="mp-head"><Logo size={18} /><b>VidGrab</b><span>2 downloading</span></div>
        <div className="mp-row"><span>Sunset timelapse…</span><span className="bar"><i style={{ width: "62%" }} /></span></div>
        <div className="mp-row"><span>Product launch…</span><span className="bar up"><i style={{ width: "40%" }} /></span></div>
      </div>

      <span className="callout c1" aria-hidden="true">Pause and resume anytime</span>
      <span className="callout c2" aria-hidden="true">Live speed and time left</span>
      <span className="callout c3" aria-hidden="true">Plays right in the preview</span>
      <span className="callout c4" aria-hidden="true">Sends finished videos to Drive</span>
    </div>
  );
}
