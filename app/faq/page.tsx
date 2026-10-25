import type { Metadata } from "next";
import { FragmentGrid } from "@/components/FragmentGrid";
import { FaqExplorer } from "@/components/FaqExplorer";
import { PageIntro } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about VidGrab: privacy, supported browsers and sites, YouTube, Google Drive, updates and Mac compatibility.",
};

export default function Faq() {
  return (
    <>
      <PageIntro eyebrow="Questions" title="Good to know." lede="The questions people ask most about VidGrab." />
      <section className="band">
        <div className="wrap">
          <FaqExplorer />
        </div>
      </section>
      <FragmentGrid />
    </>
  );
}
