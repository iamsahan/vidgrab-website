import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./ui";

const columns = [
  { title: "Product", links: [["/features/", "Features"], ["/google-drive/", "Google Drive"], ["/download/", "Download"], ["/faq/", "FAQ"]] },
  { title: "Engineering", links: [["/architecture/", "Architecture"], ["/security/", "Security"], [site.repo, "Source on GitHub"]] },
  { title: "Legal", links: [["/responsible-use/", "Responsible use"], ["/privacy/", "Privacy"], ["/terms/", "Terms"]] },
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-ruler" aria-hidden="true" />
      <div className="wrap footer-top">
        <div className="footer-brand">
          <Link className="brand" href="/"><Logo />{site.name}</Link>
          <p>A download manager for macOS with a Chrome extension and optional Google Drive.</p>
          <ul className="footer-chips">
            <li>v{site.version}</li>
            <li>macOS 14+</li>
            <li>Apple silicon</li>
          </ul>
          <a className="btn footer-star" href={site.repo} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor" /></svg>
            Star on GitHub
          </a>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h4>{column.title}</h4>
            <ul>
              {column.links.map(([href, label]) => (
                <li key={href}>
                  {href.startsWith("http")
                    ? <a href={href} target="_blank" rel="noopener noreferrer">{label} <span aria-hidden="true">↗</span></a>
                    : <Link href={href}>{label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="wrap footer-bottom">
        <span>VidGrab {site.version} · Made for macOS</span>
        <span>Includes yt-dlp (Unlicense), ffmpeg (GPL v3) and Deno (MIT)</span>
        <a className="to-top" href="#content">Back to top <span aria-hidden="true">↑</span></a>
      </div>
      <div className="footer-wordmark" aria-hidden="true">VidGrab</div>
    </footer>
  );
}
