import type { Metadata } from "next";
import { FragmentGrid } from "@/components/FragmentGrid";
import { PageIntro, SectionHead } from "@/components/ui";
import { drive } from "@/lib/site";

export const metadata: Metadata = {
  title: "Google Drive",
  description: "Upload videos to Google Drive as they download, or browse and stream videos from Drive folders you choose. Both optional, both with minimal access.",
};

const uploadSteps = [
  { title: "Download", body: "The video downloads to your Mac as usual." },
  { title: "Upload in chunks", body: "VidGrab sends it in 8 MB chunks. If the connection drops, it asks Drive what arrived and continues." },
  { title: "Tidy up", body: "Once Drive confirms the file, the local copy is removed, unless you chose to keep one." },
];

export default function GoogleDrive() {
  return (
    <>
      <PageIntro eyebrow="Google Drive" title="Save to Drive. Stream from Drive." lede="Both features are optional and stay off until you turn them on. VidGrab signs in through Google's own page and asks only for the access each feature needs.">
        <div className="chips"><span className="chip good">{drive.upload.scope}</span><span className="chip good">{drive.library.scope}</span><span className="chip tally">Off by default</span></div>
      </PageIntro>

      <section className="band">
        <div className="wrap">
          <div className="grid-2">
            {[drive.upload, drive.library].map((feature) => (
              <article className="card reveal" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
                <span className="scope">scope: {feature.scope}</span>
                <p>{feature.scopeNote}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band alt">
        <div className="wrap">
          <SectionHead eyebrow="Uploads" title="Resumable from the first byte." lede="Large videos and unreliable connections are the normal case, so uploads are built to survive both." />
          <div className="grid-3 steps">
            {uploadSteps.map((step) => (
              <article className="card step reveal" key={step.title}><h3>{step.title}</h3><p>{step.body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHead eyebrow="Drive Library" title="Your Drive videos, playable in place." lede="Choose the folders VidGrab should show. Their videos appear in the sidebar with thumbnails, length and resolution, ready to stream." />
          <div className="grid-4">
            {[
              ["Instant seeking", "Only the part you watch is fetched, so you can jump anywhere straight away."],
              ["Picks up where you stopped", "Your position is remembered for each video."],
              ["Picture in Picture", "Keep watching in a floating window while you work."],
              ["Download to Mac", "Save any library video locally through the normal queue."],
            ].map(([title, body]) => (
              <article className="card reveal" key={title}><h3>{title}</h3><p>{body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="band alt">
        <div className="wrap">
          <SectionHead eyebrow="Your control" title="Access you can see and take back." />
          <div className="card reveal"><ul>{drive.controls.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
      </section>
      <FragmentGrid />
    </>
  );
}
