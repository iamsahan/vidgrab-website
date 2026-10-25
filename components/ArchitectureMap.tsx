"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/*
  Grid layout in a 1280 × 700 space. Columns: browser (x 44, width 196), Mac (x 310 / 550 / 790,
  width 180) and internet (x 1040, width 196). Rows are centred on y 150, 300, 450 and 600.
  The request path runs along the 450 row; every connection is a straight or right-angled line.
*/
type NodeId = "web" | "content" | "worker" | "host" | "socket" | "disk" | "keychain" | "app" | "engine" | "github" | "drive" | "sites";
type Zone = "browser" | "mac" | "internet";
type Box = { x: number; y: number; w: number; h: number; title: string; sub: string; zone: Zone; icon: ReactNode; lines?: string[] };

const icons = {
  globe: <><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c2.2 2.2 2.2 9.8 0 12M8 2c-2.2 2.2-2.2 9.8 0 12" /></>,
  cursor: <path d="M4 2.5l8.5 5.3-4 1.1-1.3 4.2z" />,
  bolt: <path d="M9 1.5L3.5 9H8l-1 5.5L12.5 7H8z" />,
  plug: <path d="M6 1.5v3.5M10 1.5v3.5M4 5h8v2.5a4 4 0 0 1-8 0zM8 11.5v3" />,
  lock: <><rect x="3.5" y="7" width="9" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" /></>,
  folder: <path d="M2 4.5a1 1 0 0 1 1-1h3.2l1.6 1.6H13a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />,
  key: <><circle cx="5" cy="8" r="2.6" /><path d="M7.6 8H14M12 8v2.6" /></>,
  app: <><rect x="2" y="3" width="12" height="10" rx="2" /><path d="M2 6.2h12" /></>,
  chip: <><rect x="4" y="4" width="8" height="8" rx="1.5" /><path d="M6 2v2M10 2v2M6 12v2M10 12v2M2 6h2M2 10h2M12 6h2M12 10h2" /></>,
  tag: <><path d="M2 2.5h5.5l6.5 6.5-5 5L2.5 7.5z" /><circle cx="5.3" cy="5.6" r="1" /></>,
  cloud: <path d="M4.5 12.5a3 3 0 0 1-.3-6 4.3 4.3 0 0 1 8.3 1.2 2.4 2.4 0 0 1-.5 4.8z" />,
  film: <><rect x="2" y="3" width="12" height="10" rx="1.5" /><path d="M5 3v10M11 3v10M2 6.5h3M2 9.5h3M11 6.5h3M11 9.5h3" /></>,
};

const nodes: Record<NodeId, Box> = {
  web: { x: 44, y: 112, w: 196, h: 76, zone: "browser", icon: icons.globe, title: "Web page", sub: "the video you watch" },
  content: { x: 44, y: 262, w: 196, h: 76, zone: "browser", icon: icons.cursor, title: "Content script", sub: "button in shadow DOM" },
  worker: { x: 44, y: 412, w: 196, h: 76, zone: "browser", icon: icons.bolt, title: "Service worker", sub: "streams · cookies" },
  host: { x: 310, y: 412, w: 180, h: 76, zone: "mac", icon: icons.plug, title: "Native host", sub: "validates · re-encodes" },
  socket: { x: 550, y: 412, w: 180, h: 76, zone: "mac", icon: icons.lock, title: "Private socket", sub: "Unix · 0600 · peer uid" },
  disk: { x: 550, y: 562, w: 180, h: 76, zone: "mac", icon: icons.folder, title: "Downloads", sub: "files · private queue" },
  keychain: { x: 790, y: 112, w: 180, h: 76, zone: "mac", icon: icons.key, title: "Keychain", sub: "Google tokens, local" },
  app: { x: 790, y: 262, w: 180, h: 226, zone: "mac", icon: icons.app, title: "VidGrab app", sub: "Swift 6 · re-validates", lines: ["Bridge service", "Download queue", "Uploader & library"] },
  engine: { x: 790, y: 562, w: 180, h: 76, zone: "mac", icon: icons.chip, title: "Engine", sub: "yt-dlp · ffmpeg · Deno" },
  github: { x: 1040, y: 112, w: 196, h: 76, zone: "internet", icon: icons.tag, title: "GitHub releases", sub: "yt-dlp · SHA-256 sums" },
  drive: { x: 1040, y: 292, w: 196, h: 76, zone: "internet", icon: icons.cloud, title: "Google Drive", sub: "uploads · streaming" },
  sites: { x: 1040, y: 562, w: 196, h: 76, zone: "internet", icon: icons.film, title: "Video sites", sub: "what you download from" },
};

type EdgeId = "webContent" | "contentWorker" | "workerHost" | "hostSocket" | "socketApp" | "appEngine" | "engineSites" | "engineDisk" | "appKeychain" | "appDrive" | "appGithub";
type Edge = { from: NodeId; to: NodeId; d: string; label: string; lx: number; ly: number; start: [number, number]; end: [number, number] };

const edges: Record<EdgeId, Edge> = {
  webContent: { from: "web", to: "content", d: "M142 188 V262", label: "hover", lx: 142, ly: 225, start: [142, 188], end: [142, 262] },
  contentWorker: { from: "content", to: "worker", d: "M142 338 V412", label: "message", lx: 142, ly: 375, start: [142, 338], end: [142, 412] },
  workerHost: { from: "worker", to: "host", d: "M240 450 H310", label: "stdio", lx: 275, ly: 450, start: [240, 450], end: [310, 450] },
  hostSocket: { from: "host", to: "socket", d: "M490 450 H550", label: "JSON", lx: 520, ly: 450, start: [490, 450], end: [550, 450] },
  socketApp: { from: "socket", to: "app", d: "M730 450 H790", label: "IPC", lx: 760, ly: 450, start: [730, 450], end: [790, 450] },
  appKeychain: { from: "app", to: "keychain", d: "M880 262 V188", label: "token", lx: 880, ly: 225, start: [880, 262], end: [880, 188] },
  appEngine: { from: "app", to: "engine", d: "M880 488 V562", label: "argv", lx: 880, ly: 525, start: [880, 488], end: [880, 562] },
  engineDisk: { from: "engine", to: "disk", d: "M790 600 H730", label: "write", lx: 760, ly: 600, start: [790, 600], end: [730, 600] },
  engineSites: { from: "engine", to: "sites", d: "M970 600 H1040", label: "HTTPS", lx: 1005, ly: 600, start: [970, 600], end: [1040, 600] },
  appDrive: { from: "app", to: "drive", d: "M970 330 H1040", label: "HTTPS", lx: 1005, ly: 330, start: [970, 330], end: [1040, 330] },
  appGithub: { from: "app", to: "github", d: "M970 282 H1005 V150 H1040", label: "update", lx: 1005, ly: 214, start: [970, 282], end: [1040, 150] },
};

type Flow = { id: string; name: string; edges: { id: EdgeId; reverse?: boolean }[]; steps: string[] };

const flows: Flow[] = [
  {
    id: "download",
    name: "Download a video",
    edges: [{ id: "webContent" }, { id: "contentWorker" }, { id: "workerHost" }, { id: "hostSocket" }, { id: "socketApp" }, { id: "appEngine" }, { id: "engineSites", reverse: true }, { id: "engineDisk" }],
    steps: [
      "You click Download on the video; the content script passes the request to the service worker.",
      "The service worker adds that video's cookies and sends it to the native host over stdio.",
      "The host validates the message, re-encodes it, and relays it through the private socket.",
      "The app validates it again, queues the job, and starts the engine with a fixed argument list.",
      "yt-dlp fetches the video over HTTPS in parallel fragments; ffmpeg writes the MP4 to your folder.",
    ],
  },
  {
    id: "upload",
    name: "Upload to Drive",
    edges: [{ id: "engineDisk", reverse: true }, { id: "appEngine", reverse: true }, { id: "appKeychain" }, { id: "appDrive" }],
    steps: [
      "The finished file is read from your Downloads folder.",
      "The app takes a Google access token from the Keychain, refreshing it if needed.",
      "It uploads in resumable 8 MB chunks to your VidGrab folder, then removes the local copy if you chose to.",
    ],
  },
  {
    id: "stream",
    name: "Stream from Drive",
    edges: [{ id: "appKeychain" }, { id: "appDrive", reverse: true }],
    steps: [
      "You pick a video from a folder you chose; VidGrab checks it's inside those folders.",
      "The app uses its read-only Google token from the Keychain.",
      "The player asks for byte ranges as you watch and seek; nothing is written to disk.",
    ],
  },
  {
    id: "update",
    name: "Update yt-dlp",
    edges: [{ id: "appGithub", reverse: true }, { id: "appEngine" }],
    steps: [
      "Once a day the app asks GitHub for yt-dlp's latest release.",
      "A newer build is downloaded and checked against the published SHA-256 checksum.",
      "It must report the right version, then replaces the engine's yt-dlp in one atomic step.",
    ],
  },
];

const zones: { x: number; w: number; label: string; zone: Zone }[] = [
  { x: 24, w: 236, label: "Browser · untrusted", zone: "browser" },
  { x: 280, w: 720, label: "Your Mac · your account only", zone: "mac" },
  { x: 1020, w: 236, label: "Internet", zone: "internet" },
];

/** Interactive map of VidGrab's components, with packets travelling along each flow. */
export function ArchitectureMap() {
  const [flowIndex, setFlowIndex] = useState(0);
  const [hovered, setHovered] = useState<NodeId | null>(null);
  const [drawn, setDrawn] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const element = frame.current;
    if (!element) return;
    const watcher = new IntersectionObserver(([entry]) => { if (entry?.isIntersecting) setDrawn(true); }, { threshold: 0.25 });
    watcher.observe(element);
    return () => watcher.disconnect();
  }, []);

  // Cycle through the flows until the reader picks one.
  useEffect(() => {
    if (interacted || !drawn || reduced.current) return;
    const timer = setInterval(() => setFlowIndex((i) => (i + 1) % flows.length), 7000);
    return () => clearInterval(timer);
  }, [interacted, drawn]);

  const flow = flows[flowIndex] ?? flows[0]!;
  const activeEdges = new Map(flow.edges.map((e) => [e.id, e.reverse ?? false]));
  const activeNodes = new Set<NodeId>(flow.edges.flatMap((e) => [edges[e.id].from, edges[e.id].to]));
  const touches = (id: EdgeId) => hovered !== null && (edges[id].from === hovered || edges[id].to === hovered);

  return (
    <div className={`arch-map${drawn ? " drawn" : ""}`} ref={frame}>
      <div className="flow-tabs" role="tablist" aria-label="Choose a flow">
        {flows.map((f, i) => (
          <button key={f.id} type="button" role="tab" aria-selected={i === flowIndex} className={i === flowIndex ? "on" : ""} onClick={() => { setFlowIndex(i); setInteracted(true); }}>
            {f.name}
          </button>
        ))}
      </div>

      <div className="map-scroll">
        <svg viewBox="0 0 1280 700" role="img" aria-label={`VidGrab architecture. Highlighted flow: ${flow.name}.`}>
          <defs>
            <pattern id="map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className="grid-dot" />
            </pattern>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 1 L9 5 L0 9 z" className="arrow-head" />
            </marker>
            <marker id="arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 1 L9 5 L0 9 z" className="arrow-head on" />
            </marker>
            <radialGradient id="packet-glow">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.35" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1280" height="700" fill="url(#map-grid)" />

          {zones.map((z) => (
            <g key={z.label} className={`zone ${z.zone}`}>
              <rect x={z.x} y="40" width={z.w} height="630" rx="20" />
              <text x={z.x + 20} y="74">{z.label}</text>
            </g>
          ))}

          {(Object.keys(edges) as EdgeId[]).map((id, i) => {
            const edge = edges[id];
            const active = activeEdges.has(id);
            const reverse = activeEdges.get(id) ?? false;
            const pillWidth = edge.label.length * 7 + 18;
            return (
              <g key={id} className={`edge${active ? " on" : ""}${touches(id) ? " touch" : ""}${reverse ? " reverse" : ""}`}>
                <path id={`edge-${id}`} className="edge-base" d={edge.d} pathLength={1} markerEnd={`url(#${active ? "arrow-on" : "arrow"})`} style={{ transitionDelay: `${i * 0.07}s` }} />
                <path className="edge-flow" d={edge.d} />
                <circle className="port" cx={edge.start[0]} cy={edge.start[1]} r="3.5" />
                <g className="edge-pill" transform={`translate(${edge.lx} ${edge.ly})`}>
                  <rect x={-pillWidth / 2} y="-11" width={pillWidth} height="22" rx="11" />
                  <text y="4">{edge.label}</text>
                </g>
              </g>
            );
          })}

          {flow.edges.map((e, i) => (
            <circle key={`${flow.id}-${e.id}`} r="7" className="packet" fill="url(#packet-glow)">
              <animateMotion dur="1.5s" repeatCount="indefinite" begin={`${i * 0.22}s`} keyPoints={e.reverse ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear">
                <mpath href={`#edge-${e.id}`} />
              </animateMotion>
            </circle>
          ))}

          {(Object.keys(nodes) as NodeId[]).map((id) => {
            const n = nodes[id];
            const on = activeNodes.has(id) || hovered === id;
            return (
              <g key={id} className={`node ${n.zone}${on ? " on" : ""}`} onPointerEnter={() => setHovered(id)} onPointerLeave={() => setHovered(null)} tabIndex={0} onFocus={() => setHovered(id)} onBlur={() => setHovered(null)}>
                <rect className="node-box" x={n.x} y={n.y} width={n.w} height={n.h} rx="14" />
                <rect className="node-icon-bg" x={n.x + 16} y={n.y + 14} width="28" height="28" rx="8" />
                <g className="node-icon" transform={`translate(${n.x + 22} ${n.y + 20})`}>{n.icon}</g>
                <text className="node-title" x={n.x + 54} y={n.y + 33}>{n.title}</text>
                <text className="node-sub" x={n.x + 16} y={n.y + 62}>{n.sub}</text>
                {n.lines?.map((line, li) => (
                  <g key={line}>
                    <rect className="node-chip" x={n.x + 16} y={n.y + 84 + li * 40} width={n.w - 32} height="30" rx="8" />
                    <circle className="node-chip-dot" cx={n.x + 32} cy={n.y + 99 + li * 40} r="3.5" />
                    <text className="node-chip-text" x={n.x + 44} y={n.y + 103 + li * 40}>{line}</text>
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <ol className="flow-steps" aria-live="polite">
        {flow.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
    </div>
  );
}
