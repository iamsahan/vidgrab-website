import type { Metadata } from "next";
import { FragmentGrid } from "@/components/FragmentGrid";
import { ArchitectureMap } from "@/components/ArchitectureMap";
import { ExplodedStack } from "@/components/ExplodedStack";
import { ProtocolInspector } from "@/components/ProtocolInspector";
import { PageIntro, SectionHead } from "@/components/ui";
import { components, layers, tech } from "@/lib/site";

export const metadata: Metadata = {
  title: "Architecture",
  description: "How a click in Chrome becomes a file on your Mac: a Chrome extension, a native messaging host, a private socket, a Swift app and a pinned download engine.",
};

export default function Architecture() {
  return (
    <>
      <PageIntro eyebrow="Architecture" title="Six layers, one direction of trust." lede="Every request crosses each boundary in order, and each layer checks it again. Nothing on your Mac listens on a network port." />

      <section className="band">
        <div className="wrap">
          <SectionHead eyebrow="System map" title="Every component, every connection." lede="Pick a flow to see how data moves through VidGrab, or hover a component to see what it talks to." />
          <ArchitectureMap />
        </div>
      </section>

      <section className="band alt">
        <div className="wrap">
          <ProtocolInspector
            intro={<SectionHead eyebrow="Protocol" title="Small, versioned, validated." lede="The extension and the app talk in length-prefixed JSON frames, the format Chrome uses for native messaging. Pick a message to see it on the wire and the checks it passes." />}
          />
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <SectionHead eyebrow="Engine" title="Proven tools, pinned and kept current." lede="VidGrab ships its engine inside the app, pinned to exact versions and checked against SHA-256 checksums when it's built." />
          <div className="table-wrap reveal">
            <table>
              <thead><tr><th>Component</th><th>Version</th><th>Licence</th><th>Role</th></tr></thead>
              <tbody>
                {components.map((c) => (
                  <tr key={c.name}><td><b>{c.name}</b></td><td className="mono">{c.version}</td><td>{c.license}</td><td>{c.role}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="wrap arch">
          <ExplodedStack />
          <div>
            <SectionHead eyebrow="Request path" title="From button to file." />
            <ol className="flow">
              {layers.map((layer) => (
                <li className="reveal" key={layer.name}>
                  <div><b>{layer.name}</b><small>{layer.detail}</small><span>{layer.body}</span></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="band alt">
        <div className="wrap">
          <SectionHead eyebrow="Built with" title="Native where it matters." lede="A Swift 6 app with strict concurrency checking, a TypeScript extension with no runtime dependencies, and open-source engines underneath." />
          <div className="tech reveal">
            {tech.map((t) => <span key={t.name}><b>{t.name}</b> <i>{t.note}</i></span>)}
          </div>
        </div>
      </section>
      <FragmentGrid />
    </>
  );
}
