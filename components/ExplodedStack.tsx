"use client";

import { useEffect, useRef } from "react";
import { layers } from "@/lib/site";

/**
 * VidGrab's six layers as a 3D stack. On wide screens it is pinned beside the request path and
 * unfolds top layer first as the section scrolls by; the layer for the step being read lifts and glows.
 * In one column it unfolds as it crosses the viewport.
 */
export function ExplodedStack() {
  const stack = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stack.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = matchMedia("(min-width: 961px)");
    const section = element.closest(".arch") ?? element;
    const steps = Array.from(section.querySelectorAll<HTMLElement>(".flow li"));
    const plates = Array.from(element.querySelectorAll<HTMLElement>(".layer"));
    let current = reduced ? 0.75 : 0;
    let target = current;
    let active = -1;
    let frame = 0;

    const measure = () => {
      let progress: number;
      if (wide.matches) {
        // From the section entering the lower quarter of the screen until its end reaches the bottom.
        const r = section.getBoundingClientRect();
        const start = innerHeight * 0.75;
        const end = Math.min(innerHeight * 0.25, innerHeight - r.height);
        progress = (start - r.top) / (start - end);
      } else {
        const r = element.getBoundingClientRect();
        progress = ((1 - (r.top + r.height / 2) / innerHeight) - 0.15) * 1.8;
      }
      target = reduced ? 0.75 : Math.min(1, Math.max(0, progress));

      // The step whose centre is nearest the middle of the screen, once the stack has started to open.
      let next = -1;
      if (target > 0.02 && wide.matches) {
        let best = Infinity;
        steps.forEach((step, i) => {
          const r = step.getBoundingClientRect();
          const distance = Math.abs(r.top + r.height / 2 - innerHeight / 2);
          if (distance < best) { best = distance; next = i; }
        });
      }
      if (next !== active) {
        active = next;
        steps.forEach((step, i) => step.classList.toggle("on", i === active));
        // Plates are drawn bottom first, so step 0 (the extension) is the last plate.
        plates.forEach((plate, i) => plate.classList.toggle("on", plates.length - 1 - i === active));
      }
    };

    const tick = () => {
      frame = 0;
      // Ease toward the scroll position so the stack glides rather than tracking the scrollbar.
      current += (target - current) * (reduced ? 1 : 0.09);
      if (Math.abs(target - current) < 0.0005) current = target;
      element.style.setProperty("--explode", current.toFixed(4));
      if (current !== target) frame = requestAnimationFrame(tick);
    };

    const update = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      steps.forEach((step) => step.classList.remove("on"));
    };
  }, []);

  // Bottom of the stack first: destinations, up to the extension at the top.
  const ordered = [...layers].reverse();
  return (
    <div className="stack-stage reveal" aria-hidden="true">
      <div className="stack" ref={stack}>
        {ordered.map((layer, i) => (
          <div key={layer.name} className={`layer${layer.hot ? " hot" : ""}${layer.tally ? " tally" : ""}`} style={{ "--i": i, "--j": ordered.length - 1 - i } as React.CSSProperties}>
            <span>{layer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
