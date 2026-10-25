"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

function format(frames: number) {
  return `${pad(Math.floor(frames / 90000))}:${pad(Math.floor(frames / 1500) % 60)}:${pad(Math.floor(frames / 25) % 60)}:${pad(frames % 25)}`;
}

/** A running 25 fps timecode, like a recorder's display. */
export function Timecode({ startSeconds = 252 }: { startSeconds?: number }) {
  const [value, setValue] = useState(format(startSeconds * 25));
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setValue(format(startSeconds * 25 + Math.floor((now - start) / 40)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [startSeconds]);
  return <b>{value}</b>;
}
