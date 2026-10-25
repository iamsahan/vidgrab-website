import Link from "next/link";
import { AppShowcase } from "@/components/AppShowcase";
import { FloatingTiles } from "@/components/FloatingTiles";
import { FragmentGrid } from "@/components/FragmentGrid";
import { HeroScene } from "@/components/HeroScene";
import { HowItWorks } from "@/components/HowItWorks";
import { Timecode } from "@/components/Timecode";
import { SectionHead } from "@/components/ui";
import { stats } from "@/lib/site";

const highlights = [
  { href: "/features/", eyebrow: "Features", title: "A real download manager", body: "Queue, pause and resume, a library with previews, menu bar controls and notifications." },
  { href: "/google-drive/", eyebrow: "Google Drive", title: "Save to Drive, stream from Drive", body: "Upload as you download, or browse and play videos from folders you choose." },
  { href: "/architecture/", eyebrow: "Architecture", title: "Six layers, one direction of trust", body: "How a click in Chrome becomes a file on your Mac, without opening a single network port." },
  { href: "/security/", eyebrow: "Security", title: "The browser is treated as untrusted", body: "Every boundary checks its own input and holds only the access it needs." },
];

export default function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <HeroScene />
        <div className="wrap hero-main">
          <h1 id="hero-title">Every video, <em>saved</em> to your Mac.</h1>
          <p className="lede">Hover a video in Chrome, pick a quality, and VidGrab downloads it with parallel transfers, pause and resume, and a library you&apos;ll actually want to browse. Send it straight to Google Drive if you like.</p>
          <div className="cta-row">
            <Link className="btn primary" href="/download/">Install for Mac</Link>
            <Link className="btn" href="/features/">Explore features</Link>
          </div>
          <div className="meta-row">
            <span>Apple silicon · macOS 14+</span>
            <span>No analytics</span>
            <span>Source on GitHub</span>
          </div>
        </div>
        <div className="hud" aria-hidden="true"><span>REC <Timecode /></span><span>1080p · MP4</span></div>
        <div className="hero-stats">
          <div className="stats wrap">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <FloatingTiles />

      <HowItWorks />

      <section className="band showcase-band">
        <div className="wrap">
          <div className="section-head centered reveal">
            <span className="eyebrow">The app</span>
            <h2>Built natively for macOS.</h2>
            <p className="lede">A real Mac app with a library, previews, a menu bar panel and notifications, paired with a Chrome extension that puts a Download button on every video.</p>
            <div className="cta-row"><Link className="btn" href="/features/">See every feature</Link></div>
          </div>
          <AppShowcase />
        </div>
      </section>

      <section className="band alt">
        <div className="wrap">
          <SectionHead eyebrow="Go deeper" title="How VidGrab is built, and why you can trust it." />
          <div className="grid-2">
            {highlights.map((item) => (
              <Link className="card link-card reveal" href={item.href} key={item.href}>
                <span className="eyebrow">{item.eyebrow}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="more">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FragmentGrid />
    </>
  );
}
