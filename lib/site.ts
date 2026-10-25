// Every product fact on the site lives here, so pages never contradict each other.
// Keep it in step with the app: numbers and names below describe what VidGrab actually does.

export const site = {
  name: "VidGrab",
  version: "0.1.0",
  tagline: "Every video, saved to your Mac.",
  description:
    "VidGrab is a download manager for macOS with a Chrome extension. Hover a video, pick a quality, and save it with parallel transfers, pause and resume, a rich library and optional Google Drive.",
  repo: "https://github.com/iamsahan/vidgrab-download-manager",
  // Set SITE_URL at build time to the address the site is served from.
  url: process.env.SITE_URL ?? "http://localhost:3000",
};

export const nav = [
  { href: "/features/", label: "Features" },
  { href: "/google-drive/", label: "Google Drive" },
  { href: "/architecture/", label: "Architecture" },
  { href: "/security/", label: "Security" },
  { href: "/faq/", label: "FAQ" },
];

export const stats = [
  { value: "1,000+", label: "sites supported through yt-dlp" },
  { value: "8×", label: "parallel fragments per stream" },
  { value: "0", label: "network ports opened on your Mac" },
  { value: "150", label: "automated tests, app and extension" },
];

export const steps = [
  { title: "Hover any video", body: "A Download button appears on the video in Chrome, even inside embedded players and full screen.", chip: "↓ Download" },
  { title: "Pick a quality", body: "VidGrab reads what the site offers and lists every quality with its real size.", chip: "1080p · MP4 · 240 MB" },
  { title: "VidGrab takes over", body: "The Mac app downloads in parallel, merges video and audio without re-encoding, and keeps the queue through restarts.", chip: "42% · 6.1 MB/s · 38s left", tally: true },
  { title: "Watch or send it on", body: "Play it from the library with previews and Quick Look, or let VidGrab upload it to Google Drive.", chip: "In Google Drive" },
];

export type Feature = { title: string; body: string };

export const featureGroups: { id: string; eyebrow: string; title: string; lede: string; items: Feature[] }[] = [
  {
    id: "downloads",
    eyebrow: "Downloads",
    title: "A queue that keeps going.",
    lede: "VidGrab runs downloads in parallel and never loses your place.",
    items: [
      { title: "Pause, resume, retry", body: "Every download can be paused and resumed. Interrupted ones continue from their partial files, even after you quit." },
      { title: "Best quality, merged", body: "Separate video and audio streams are combined into one MP4 by ffmpeg, with no re-encoding and no quality loss." },
      { title: "Parallel fragments", body: "Streaming formats download 8 fragments at a time, with automatic retries when the connection hiccups." },
      { title: "No duplicates", body: "Asking for a video that's already in the queue reuses the existing job instead of starting a second copy." },
    ],
  },
  {
    id: "library",
    eyebrow: "Library",
    title: "A library worth browsing.",
    lede: "Finished downloads look like a media library, not a list of file names.",
    items: [
      { title: "Real thumbnails", body: "Every finished video gets a frame thumbnail, its length, resolution and size, read from the file on your Mac." },
      { title: "Preview in place", body: "Select a video to play it in the preview panel, or press Space for Quick Look." },
      { title: "Search and filters", body: "Filter by Downloading, Completed or Needs Attention, and search by title or site." },
      { title: "Drag it anywhere", body: "Drag a finished video straight into Finder, Messages or your editor." },
    ],
  },
  {
    id: "extension",
    eyebrow: "Chrome extension",
    title: "Right where the video is.",
    lede: "The extension adds one button and stays out of the way.",
    items: [
      { title: "Hover button", body: "A Download button appears on any video you hover, including embedded players and full screen." },
      { title: "Quality menu", body: "Pick from every available quality, see the size up front, and choose Save to Mac or Drive." },
      { title: "Live progress", body: "The button shows 42%, then Finishing, then Downloaded, so you never have to switch apps." },
      { title: "Popup", body: "See whether VidGrab is connected, which streams the page has, and your recent downloads." },
    ],
  },
  {
    id: "mac",
    eyebrow: "On your Mac",
    title: "A proper Mac app.",
    lede: "Built natively in Swift, it behaves the way Mac apps should.",
    items: [
      { title: "Menu bar", body: "A menu bar icon shows active downloads and gives you pause, resume and Show in Finder in one click." },
      { title: "Notifications", body: "Get notified when a download finishes or needs attention. Click the notification to reveal the file." },
      { title: "Your rules", body: "Set how many downloads run at once, a per-download speed limit, file naming styles and a folder per site." },
      { title: "Guided installer", body: "Install with a step-by-step installer that shows the terms, installs, and opens VidGrab for you." },
    ],
  },
];

export const drive = {
  upload: {
    title: "Upload as you download",
    body: "Choose Save to: Drive in the video menu. VidGrab uploads in resumable 8 MB chunks, retries with backoff, refreshes access as needed, and removes the local copy afterwards if you want.",
    scope: "drive.file",
    scopeNote: "VidGrab can only see files it creates, in a VidGrab folder.",
  },
  library: {
    title: "Drive Library",
    body: "Pick the Drive folders you want, then browse and stream their videos inside VidGrab with instant seeking, Picture in Picture and resume where you stopped.",
    scope: "drive.readonly",
    scopeNote: "Read-only, and VidGrab only opens the folders you choose.",
  },
  controls: [
    "Both features are off until you turn them on",
    "Sign-in happens on Google's own page, never inside VidGrab",
    "Access is stored in your Mac's Keychain, this Mac only",
    "Disconnecting revokes access at Google",
    "The library can't change or delete anything in your Drive",
    "Removing a folder blocks its videos straight away",
    "Nothing is written to disk while you stream",
  ],
};

export const layers = [
  { name: "Chrome extension", detail: "Manifest V3 · TypeScript", body: "Spots streams on the page and puts the Download button on the video.", hot: true },
  { name: "Native messaging host", detail: "stdio · framed JSON", body: "Started by Chrome for VidGrab's extension ID only. Validates and re-encodes each message." },
  { name: "Private socket", detail: "Unix socket · 0600", body: "Relays to the app over a socket only your user account can open." },
  { name: "VidGrab app", detail: "Swift 6 · SwiftUI", body: "Validates again, queues the job, and runs the engine with a fixed argument list.", hot: true },
  { name: "Engine", detail: "yt-dlp · ffmpeg · Deno", body: "yt-dlp downloads, ffmpeg merges streams, Deno solves site challenges." },
  { name: "Destination", detail: "Your Mac · Google Drive", body: "Your download folder, or Google Drive through resumable uploads.", tally: true },
];

export const protocolExample = `{ "v": 1, "id": "a3", "type": "enqueue",
  "format": "137+bestaudio[ext=m4a]/137+bestaudio",
  "destination": "googleDrive",
  "media": { "url": "https://…",
             "headers": { "referer": "https://…" } } }`;

export const securityGroups = [
  {
    title: "Browser boundary",
    summary: "Only VidGrab's own extension can talk to the app, and every message is checked twice before anything runs.",
    items: [
      "Native Messaging only, limited to one pinned extension ID",
      "Every message validated twice: in the host, then again in the app",
      "Only http and https links, with an 8 KB URL cap and a 1 MB message cap",
      "Four allowed request headers; control characters are rejected",
    ],
  },
  {
    title: "Running the engine",
    summary: "Downloads run with a fixed list of arguments. No shell, no outside config files, no surprises.",
    items: [
      "Tools run with fixed argument lists, never through a shell",
      "The link always follows --, so it can't be read as an option",
      "--ignore-config blocks outside yt-dlp configuration files",
      "A minimal environment, and tools from fixed locations, never $PATH",
    ],
  },
  {
    title: "Cookies and secrets",
    summary: "Cookies are shared for one video, kept in a private file, and deleted when the job ends.",
    items: [
      "Cookies are read only when you click Download, only for that video",
      "They reach yt-dlp in a private 0600 file that's deleted when the job ends",
      "Never on the command line, never saved with the queue",
      "Google access tokens live in the Keychain, on this Mac only",
    ],
  },
  {
    title: "Local connection",
    summary: "A private socket only your account can open, with the caller checked on every connection.",
    items: [
      "Unix socket in a 0700 folder, with file mode 0600",
      "The connecting process's user is checked with getpeereid",
      "Length-prefixed messages with a hard size limit",
      "The download queue is written atomically with mode 0600",
    ],
  },
  {
    title: "Google sign-in",
    summary: "Sign-in uses PKCE in a private session and asks for the least Drive access each feature needs.",
    items: [
      "Authorization code with PKCE and state, and no client secret",
      "A private browser session for every sign-in",
      "Least access: drive.file for uploads, read-only for the library",
      "Granted permissions are checked before an account is saved",
    ],
  },
  {
    title: "Supply chain and updates",
    summary: "Tools are pinned by checksum, and yt-dlp updates are verified before they replace anything.",
    items: [
      "Bundled tools pinned by SHA-256 checksum",
      "yt-dlp updates come only from its official releases, newer versions only",
      "Each update must match its published checksum and report the right version",
      "Updates swap in atomically, so a failed one changes nothing",
    ],
  },
  {
    title: "Inside the browser",
    summary: "The Download button lives where page scripts can't reach it, and page text is never run as code.",
    items: [
      "The video button lives in a closed shadow DOM pages can't reach",
      "No eval and no innerHTML; page text is never parsed as HTML",
      "Extension pages only run scripts shipped with the extension",
      "Dependencies pinned exactly, with install scripts disabled",
    ],
  },
  {
    title: "What VidGrab won't do",
    summary: "Some lines VidGrab doesn't cross, whatever the site.",
    items: [
      "No analytics and no tracking",
      "No local web server any page could call",
      "No DRM bypass: protected services are refused",
      "No access to Drive files outside the features you turn on",
    ],
  },
];

export const tech = [
  { name: "Swift 6", note: "strict concurrency" },
  { name: "SwiftUI", note: "app and menu bar" },
  { name: "AVKit", note: "player and streaming" },
  { name: "Keychain", note: "access tokens" },
  { name: "TypeScript", note: "extension" },
  { name: "Manifest V3", note: "Chrome" },
  { name: "esbuild", note: "bundling" },
  { name: "yt-dlp", note: "extraction" },
  { name: "ffmpeg", note: "stream merging" },
  { name: "Deno", note: "challenge solving" },
  { name: "Google Drive API v3", note: "resumable uploads" },
  { name: "Swift Testing", note: "90 tests" },
  { name: "Vitest", note: "60 tests" },
  { name: "GitHub Actions", note: "CI" },
];

export const requirements = [
  { label: "Mac", value: "Apple silicon (M1 or later)" },
  { label: "macOS", value: "14 Sonoma or later" },
  { label: "Browser", value: "Chrome, Brave, Edge, Arc, Vivaldi" },
  { label: "Disk", value: "About 180 MB" },
  { label: "Google Drive", value: "Optional" },
];

export const components = [
  { name: "yt-dlp", version: "2026.10.21", license: "Unlicense", role: "Finds and downloads videos. Kept up to date automatically." },
  { name: "ffmpeg", version: "9.0.2", license: "GPL v3", role: "Combines video and audio into MP4 without re-encoding." },
  { name: "Deno", version: "2.9.8", license: "MIT", role: "Solves the JavaScript challenges some sites, including YouTube, require." },
];

export const faqs = [
  { q: "Does VidGrab collect any data?", topic: "Privacy", a: "No. There are no analytics. VidGrab only talks to the sites you download from, to GitHub to check for yt-dlp updates, and to Google if you turn on Drive features." },
  { q: "Which browsers work?", topic: "Compatibility", a: "Chrome and other Chromium browsers: Brave, Edge, Arc, Vivaldi and Chromium. VidGrab connects itself to each one it finds when it starts." },
  { q: "Which sites are supported?", topic: "Downloads", a: "More than a thousand, through yt-dlp, plus most pages that play standard video streams. Sites change often, which is why VidGrab keeps yt-dlp up to date." },
  { q: "Can it download from Netflix or other subscription services?", topic: "Downloads", a: "No. VidGrab doesn't bypass DRM, so protected services are refused with a clear message." },
  { q: "Why does YouTube need Deno?", topic: "Downloads", a: "YouTube now asks players to solve a JavaScript challenge. yt-dlp uses the built-in Deno runtime to do that, so downloads keep working without anything extra installed." },
  { q: "What happens when a site changes?", topic: "Downloads", a: "VidGrab checks for a new yt-dlp once a day and installs it only if it comes from yt-dlp's official releases and matches the published SHA-256 checksum." },
  { q: "Do I have to use Google Drive?", topic: "Privacy", a: "No. Uploads and the Drive Library are both off until you turn them on. Without them, VidGrab never contacts Google." },
  { q: "Does it work on Intel Macs?", topic: "Compatibility", a: "Not yet. The built-in tools are Apple silicon builds, and the installer stops with a clear message on Intel Macs." },
  { q: "Why does macOS say it can't verify the developer?", topic: "Install", a: "VidGrab isn't signed with an Apple Developer ID yet. Open System Settings, Privacy & Security, and click Open Anyway next to VidGrab." },
];
