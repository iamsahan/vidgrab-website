"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { steps } from "@/lib/site";
import { Logo } from "./ui";

/** Scenes for each step. `local` is how far through the step the reader has scrolled (0 to 1). */
function Scene({ index, local }: { index: number; local: number }) {
  if (index === 0) {
    return (
      <div className="scene browser">
        <div className="scene-bar"><span className="lights"><i className="red" /><i className="amber" /><i className="green" /></span><span className="url">example.com/watch?v=harbour</span></div>
        <div className="scene-video t1">
          <span className="scene-play" />
          <span className="dl-button">↓ Download</span>
          <span className="cursor" />
        </div>
        <div className="scene-caption"><b>Sunset timelapse over the harbour</b><span>12:34 · 4K available</span></div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="scene browser">
        <div className="scene-bar"><span className="lights"><i className="red" /><i className="amber" /><i className="green" /></span><span className="url">example.com/watch?v=harbour</span></div>
        <div className="scene-video t1 dim">
          <div className="quality-menu">
            <b>Sunset timelapse over the harbour</b>
            <div className="seg"><span className="on">Mac</span><span>Drive</span></div>
            <ul>
              <li><span>2160p</span><em>MP4 · 1.2 GB</em></li>
              <li className="pick"><span>1080p</span><em>MP4 · 240 MB</em></li>
              <li><span>720p</span><em>MP4 · 118 MB</em></li>
              <li><span>Audio only</span><em>M4A · 11 MB</em></li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  if (index === 2) {
    const done = Math.min(1, local * 1.15);
    const mb = Math.round(240 * done);
    const left = Math.max(0, Math.round(38 * (1 - done)));
    const finishing = done >= 1;
    return (
      <div className="scene app">
        <div className="scene-bar"><span className="lights"><i className="red" /><i className="amber" /><i className="green" /></span><span className="title-text">VidGrab</span></div>
        <div className="job">
          <div className="thumb t1" data-tc="12:34" />
          <div className="job-text">
            <b>Sunset timelapse over the harbour</b>
            <span className="job-state">{finishing ? "Finishing up, merging video and audio" : `${mb} MB of 240 MB`}</span>
            <span className="job-bar"><i style={{ width: `${done * 100}%` }} className={finishing ? "pulse" : ""} /></span>
            <span className="job-meta"><em>{finishing ? "100%" : `${Math.round(done * 100)}%`}</em><em>{finishing ? "ffmpeg · no re-encoding" : `6.1 MB/s · ${left}s left`}</em></span>
          </div>
        </div>
        <div className="fragments" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} style={{ "--f": Math.min(1, Math.max(0, done * 8 - i * 0.6)) } as CSSProperties} />
          ))}
        </div>
        <p className="scene-note">8 parallel fragments · resumes if the connection drops</p>
      </div>
    );
  }
  return (
    <div className="scene app">
      <div className="scene-bar"><span className="lights"><i className="red" /><i className="amber" /><i className="green" /></span><span className="title-text">VidGrab</span></div>
      <div className="toast"><Logo size={22} /><div><b>Download complete</b><span>Sunset timelapse over the harbour</span></div></div>
      <div className="library">
        <div className="lib-item"><div className="thumb t1" data-tc="12:34" /><div><b>Sunset timelapse over the harbour</b><span>1080p · 12:34 · 240 MB</span><span className="drive-badge">In Google Drive</span></div></div>
        <div className="lib-item faded"><div className="thumb t2" data-tc="03:58" /><div><b>Swift concurrency, a practical talk</b><span>1080p · 3:58 · 413 MB</span></div></div>
      </div>
    </div>
  );
}

/** A pinned, scroll-driven walkthrough of the four steps, with a timeline rail on the left. */
export function HowItWorks() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [local, setLocal] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = element.getBoundingClientRect();
      const travel = Math.max(1, r.height - innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / travel));
      const scaled = Math.min(steps.length - 0.0001, p * steps.length);
      setProgress(p);
      setActive(Math.floor(scaled));
      setLocal(scaled - Math.floor(scaled));
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

  const jump = (index: number) => {
    const element = track.current;
    if (!element) return;
    const travel = element.offsetHeight - innerHeight;
    const top = element.getBoundingClientRect().top + scrollY + (travel * (index + 0.35)) / steps.length;
    scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section className="how" aria-labelledby="how-title">
      <div className="how-track" ref={track} style={{ "--steps": steps.length } as CSSProperties}>
        <div className="how-sticky">
          <div className="wrap how-grid">
            <div className="how-left">
              <span className="eyebrow">How it works</span>
              <h2 id="how-title">From the page to your library in four steps.</h2>
              <ol className="how-steps">
                {steps.map((step, index) => {
                  const fill = index < active ? 1 : index === active ? local : 0;
                  return (
                    <li key={step.title} className={index === active ? "on" : index < active ? "past" : ""}>
                      <button type="button" onClick={() => jump(index)} aria-current={index === active ? "step" : undefined}>
                        <span className="how-num">{String(index + 1).padStart(2, "0")}</span>
                        <span className="how-text">
                          <b>{step.title}</b>
                          <span>{step.body}</span>
                        </span>
                      </button>
                      <span className="how-rail"><i style={{ height: `${fill * 100}%` }} /></span>
                      <div className="how-inline">{<Scene index={index} local={1} />}</div>
                    </li>
                  );
                })}
              </ol>
              <div className="how-timecode" aria-hidden="true">
                <span>STEP {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
                <span className="how-scrub"><i style={{ width: `${progress * 100}%` }} /></span>
              </div>
            </div>
            <div className="how-stage" aria-hidden="true">
              {steps.map((step, index) => (
                <div key={step.title} className={`how-scene${index === active ? " on" : ""}`}>
                  <Scene index={index} local={index === active ? local : index < active ? 1 : 0} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
