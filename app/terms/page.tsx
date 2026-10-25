import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for using VidGrab, the download manager for macOS.",
};

const sections = [
  ["Using VidGrab", "You may install and use VidGrab on Macs you own or control, for your own personal use. You may not sell, rent or sublicense it, or remove its notices."],
  ["Your responsibility for content", "Only download content you have the right to download. You are responsible for following copyright law and the terms of the websites you use. VidGrab does not bypass DRM or other copy protection, and must not be used to try to."],
  ["Third-party components", "VidGrab includes yt-dlp (Unlicense), Deno (MIT) and ffmpeg (GNU GPL version 3). Each is a separate program under its own license. Details are in VidGrab under Settings, Tools, Third-Party Notices."],
  ["Privacy", "VidGrab works on your Mac and does not collect analytics. If you connect Google Drive, VidGrab uses that access only for the features you turn on. See the privacy page for details."],
  ["Updates", "VidGrab can update its yt-dlp component automatically from the official yt-dlp releases, after checking it matches the published checksum. You can turn this off in Settings."],
  ["No warranty", "VidGrab is provided as is, without warranty of any kind. Websites change often and some downloads may stop working."],
  ["Limitation of liability", "To the extent the law allows, the developer of VidGrab is not liable for any loss or damage arising from its use, including lost data or content."],
  ["Changes", "These terms may be updated with new versions of VidGrab. Continuing to use VidGrab after an update means you accept the updated terms."],
];

export default function Terms() {
  return (
    <>
      <PageIntro eyebrow="Terms" title="Terms and conditions." lede="These are the same terms the VidGrab installer asks you to agree to." />
      <section className="band">
        <div className="wrap prose">
          <p className="updated">Applies to VidGrab 0.1.0</p>
          {sections.map(([title, body]) => (
            <div key={title} style={{ display: "grid", gap: 8 }}>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
