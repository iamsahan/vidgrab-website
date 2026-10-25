import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy",
  description: "VidGrab has no analytics. It works on your Mac and connects to Google only when you turn on Drive features.",
};

export default function Privacy() {
  return (
    <>
      <PageIntro eyebrow="Privacy" title="Your downloads stay yours." lede="VidGrab works on your Mac. This page explains exactly what it connects to and what it stores." />
      <section className="band">
        <div className="wrap prose">
          <p className="updated">Applies to VidGrab 0.1.0</p>
          <h2>No analytics</h2>
          <p>VidGrab doesn&apos;t collect usage data, crash reports or identifiers, and it has no account of its own.</p>
          <h2>What it connects to</h2>
          <ul>
            <li>The websites you download from, to fetch the videos you ask for</li>
            <li>GitHub, once a day, to check for a new yt-dlp release (you can turn this off)</li>
            <li>Google, only if you turn on Drive uploads or the Drive Library</li>
          </ul>
          <h2>What it stores on your Mac</h2>
          <ul>
            <li>Your download list and settings, in your user Library, readable only by you</li>
            <li>Google access tokens, in the macOS Keychain, on this Mac only</li>
            <li>For the Drive Library, the list of videos in your chosen folders and where you stopped watching</li>
          </ul>
          <h2>Cookies</h2>
          <p>When a download needs your login, the Chrome extension reads the cookies for that one video at the moment you click. They are passed to the download engine in a private file that is deleted when the download ends, and they are never saved.</p>
          <h2>Removing your data</h2>
          <p>Disconnect Google Drive in Settings to delete and revoke its access. Turning off the Drive Library deletes its saved list and positions. Deleting VidGrab&apos;s folder in Application Support removes everything else.</p>
        </div>
      </section>
    </>
  );
}
