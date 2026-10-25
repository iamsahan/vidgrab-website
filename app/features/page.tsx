import type { Metadata } from "next";
import { FragmentGrid } from "@/components/FragmentGrid";
import { AppShowcase } from "@/components/AppShowcase";
import { PageIntro, SectionHead } from "@/components/ui";
import { featureGroups } from "@/lib/site";

export const metadata: Metadata = {
  title: "Features",
  description: "Queue, pause and resume, a library with previews, a menu bar app, notifications and a Chrome extension that puts a Download button on every video.",
};

export default function Features() {
  const [first, ...rest] = featureGroups;
  return (
    <>
      <PageIntro eyebrow="Features" title="Everything a download manager should do." lede="VidGrab pairs a native Mac app with a Chrome extension, so saving a video takes one click and keeping track of it takes none." />
      {first ? (
        <section className="band">
          <div className="wrap">
            <AppShowcase />
            <div style={{ marginTop: "clamp(48px, 7vw, 96px)" }}>
              <SectionHead eyebrow={first.eyebrow} title={first.title} lede={first.lede} />
              <div className="grid-4">
                {first.items.map((item) => (
                  <article className="card reveal" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
      {rest.map((group, index) => (
        <section className={`band${index % 2 === 0 ? " alt" : ""}`} id={group.id} key={group.id}>
          <div className="wrap">
            <SectionHead eyebrow={group.eyebrow} title={group.title} lede={group.lede} />
            <div className="grid-4">
              {group.items.map((item) => (
                <article className="card reveal" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>
              ))}
            </div>
          </div>
        </section>
      ))}
      <FragmentGrid />
    </>
  );
}
