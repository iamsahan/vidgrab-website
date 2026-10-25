"use client";

import { useState, type ReactNode } from "react";

type Example = {
  id: string;
  label: string;
  request: object;
  response: object;
  /** Index of the validation rule that rejects this request, if any. */
  failsAt?: number;
};

// Shapes follow docs/PROTOCOL.md and the Swift Messages / Validation types.
const examples: Example[] = [
  {
    id: "ping",
    label: "ping",
    request: { v: 1, id: "p1", type: "ping" },
    response: { v: 1, id: "p1", ok: true, app: { version: "0.1.0", toolsReady: true, destinations: ["local", "googleDrive"], defaultDestination: "local" } },
  },
  {
    id: "probe",
    label: "probe",
    request: { v: 1, id: "a2", type: "probe", media: { url: "https://example.com/watch", pageUrl: "https://example.com/watch" } },
    response: { v: 1, id: "a2", ok: true, probe: { title: "Sunset timelapse", durationSeconds: 754, options: [{ selector: "137+bestaudio[ext=m4a]/137+bestaudio", height: 1080, ext: "mp4", approxBytes: 240000000, audioOnly: false }] } },
  },
  {
    id: "enqueue",
    label: "enqueue",
    request: { v: 1, id: "a3", type: "enqueue", format: "137+bestaudio[ext=m4a]/137+bestaudio", destination: "googleDrive", media: { url: "https://example.com/watch", headers: { referer: "https://example.com/" } } },
    response: { v: 1, id: "a3", ok: true, jobId: "6F1C2E3A-1B2C-4D5E-8F90-123456789ABC" },
  },
  {
    id: "jobs",
    label: "jobs",
    request: { v: 1, id: "a4", type: "jobs", jobIds: ["6F1C2E3A-1B2C-4D5E-8F90-123456789ABC"] },
    response: { v: 1, id: "a4", ok: true, jobs: [{ id: "6F1C2E3A-…", state: "running", title: "Sunset timelapse", fraction: 0.42, postProcessing: false, destination: "googleDrive", uploading: false }] },
  },
  {
    id: "rejected",
    label: "rejected",
    request: { v: 1, id: "a5", type: "enqueue", media: { url: "file:///etc/passwd" } },
    response: { v: 1, id: "a5", ok: false, error: { code: "invalid_request", message: "invalid field: media.url" } },
    failsAt: 4,
  },
];

const rules = [
  { name: "Size", detail: "1 MB at most, checked before parsing" },
  { name: "Version", detail: "must be 1" },
  { name: "Request id", detail: "1–64 letters, digits or dashes" },
  { name: "Type", detail: "ping, probe, enqueue or jobs" },
  { name: "Links", detail: "http or https only, 8 KB at most" },
  { name: "Headers", detail: "cookie, referer, user-agent, origin" },
  { name: "Formats and ids", detail: "strict character sets, UUID job ids" },
];

/** Colours JSON as React elements; nothing is parsed as HTML. */
function highlight(json: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const token = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = token.exec(json))) {
    if (match.index > last) parts.push(json.slice(last, match.index));
    if (match[1] && match[2]) {
      parts.push(<span key={key++} className="j-key">{match[1]}</span>, match[2]);
    } else if (match[1]) {
      parts.push(<span key={key++} className="j-str">{match[1]}</span>);
    } else if (match[3]) {
      parts.push(<span key={key++} className="j-bool">{match[3]}</span>);
    } else {
      parts.push(<span key={key++} className="j-num">{match[4]}</span>);
    }
    last = token.lastIndex;
  }
  parts.push(json.slice(last));
  return parts;
}

/** The 4-byte little-endian length prefix native messaging puts before each JSON payload. */
function prefixHex(length: number) {
  return [0, 8, 16, 24].map((shift) => ((length >> shift) & 0xff).toString(16).padStart(2, "0").toUpperCase());
}

export function ProtocolInspector({ intro }: { intro: ReactNode }) {
  const [index, setIndex] = useState(2);
  const example = examples[index] ?? examples[0]!;
  const wire = JSON.stringify(example.request);
  const bytes = new TextEncoder().encode(wire).length;
  const rejected = example.failsAt !== undefined;

  return (
    <div className="protocol">
      <div className="protocol-left">
        {intro}
        <ol className="rules" key={example.id}>
          {rules.map((rule, i) => {
            const state = example.failsAt === undefined || i < example.failsAt ? "pass" : i === example.failsAt ? "fail" : "skip";
            return (
              <li key={rule.name} className={`rule ${state}`} style={{ animationDelay: `${i * 0.12}s` }}>
                <span className="rule-mark" aria-hidden="true">{state === "pass" ? "✓" : state === "fail" ? "✕" : "·"}</span>
                <span className="rule-text"><b>{rule.name}</b><span>{rule.detail}</span></span>
                <span className="sr-only">{state === "pass" ? "passed" : state === "fail" ? "rejected here" : "not reached"}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={`inspector${rejected ? " is-rejected" : ""}`}>
        <div className="inspector-tabs" role="tablist" aria-label="Message type">
          {examples.map((e, i) => (
            <button key={e.id} type="button" role="tab" aria-selected={i === index} className={`${i === index ? "on" : ""}${e.failsAt !== undefined ? " danger" : ""}`} onClick={() => setIndex(i)}>
              {e.label}
            </button>
          ))}
        </div>

        <div className="frame-strip" key={`frame-${example.id}`} aria-label={`Frame: 4-byte length prefix, then ${bytes} bytes of JSON`}>
          <span className="frame-prefix">
            <small>length · LE</small>
            <code>{prefixHex(bytes).join(" ")}</code>
          </span>
          <span className="frame-payload">
            <small>JSON payload</small>
            <code>{bytes} bytes</code>
            <i style={{ width: `${Math.min(100, (bytes / 320) * 100)}%` }} />
          </span>
        </div>

        <div className="io" key={`io-${example.id}`}>
          <div className="io-pane">
            <div className="io-head"><span className="io-dir out">→</span> Extension sends</div>
            <pre>{highlight(JSON.stringify(example.request, null, 2))}</pre>
          </div>
          <div className="io-pane">
            <div className="io-head"><span className={`io-dir ${rejected ? "bad" : "in"}`}>←</span> App replies</div>
            <pre>{highlight(JSON.stringify(example.response, null, 2))}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
