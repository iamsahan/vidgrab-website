import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = {
  title: "Responsible use",
  description: "Download only what you have the right to. VidGrab doesn't bypass DRM and refuses protected services.",
};

export default function ResponsibleUse() {
  return (
    <>
      <PageIntro eyebrow="Responsible use" title="Download only what you have the right to." lede="VidGrab is a tool, and how it's used is up to you. Here's what that means in practice." />
      <section className="band">
        <div className="wrap prose">
          <h2>Good uses</h2>
          <ul>
            <li>Your own videos, from your channels, cloud storage or past uploads</li>
            <li>Openly licensed content, such as Creative Commons or public domain material</li>
            <li>Anything a site or its owner lets you save, such as course material you're allowed to keep</li>
          </ul>
          <h2>What VidGrab won&apos;t do</h2>
          <p>VidGrab doesn&apos;t bypass DRM or other copy protection. Subscription streaming services that protect their videos are refused with a clear message, and VidGrab must not be used to try to get around that.</p>
          <h2>Your responsibility</h2>
          <p>Copyright law and each website&apos;s terms still apply to what you download. If you&apos;re not sure whether you may keep a video, ask its owner or don&apos;t download it.</p>
        </div>
      </section>
    </>
  );
}
