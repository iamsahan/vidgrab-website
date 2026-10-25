import type { Metadata } from "next";
import { PageIntro, SectionHead } from "@/components/ui";
import { requirements, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download",
  description: "Install VidGrab with a guided macOS installer. yt-dlp, ffmpeg and Deno are built in, so there is nothing else to set up.",
};

const installSteps = [
  { title: "Run the installer", body: "Open VidGrab.pkg. It shows the welcome page and the terms, installs to Applications, and opens VidGrab when it's done." },
  { title: "Allow it the first time", body: "If macOS says it can't verify the developer, open System Settings, Privacy & Security, and click Open Anyway." },
  { title: "Add the Chrome extension", body: "In VidGrab, open Settings, General, Show Chrome Extension. Turn on Developer mode at chrome://extensions and drag the folder onto the page." },
  { title: "Download something", body: "Hover any video, click Download, and pick a quality." },
];

export default function Download() {
  return (
    <>
      <PageIntro eyebrow="Download" title="A guided installer, everything included." lede="The installer walks you through the terms, shows progress, and opens VidGrab when it finishes. yt-dlp, ffmpeg and Deno come built in.">
        <div className="cta-row">
          <a className="btn primary" href={`${site.repo}/releases`} target="_blank" rel="noopener noreferrer">Download from GitHub</a>
          <a className="btn" href={site.repo} target="_blank" rel="noopener noreferrer">View source</a>
        </div>
      </PageIntro>

      <section className="band">
        <div className="wrap">
          <SectionHead eyebrow="Install" title="Up and running in four steps." />
          <div className="grid-4 steps">
            {installSteps.map((step) => (
              <article className="card step reveal" key={step.title}><h3>{step.title}</h3><p>{step.body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="band alt">
        <div className="wrap install">
          <div className="card reveal">
            <h3>Build it from source</h3>
            <div className="term"><span className="p">$ </span>git clone {site.repo}{"\n"}<span className="p">$ </span>cd vidgrab-download-manager{"\n"}<span className="p">$ </span>make pkg   <span className="p"># builds build/VidGrab-{site.version}.pkg</span></div>
            <p>Needs Xcode 16 or later and Node 24. The build downloads the pinned tools and refuses any file whose checksum doesn&apos;t match.</p>
          </div>
          <div className="card reveal">
            <h3>Requirements</h3>
            <ul className="reqs">
              {requirements.map((r) => <li key={r.label}><span>{r.label}</span><span>{r.value}</span></li>)}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
