import type { Metadata } from "next";
import { FragmentGrid } from "@/components/FragmentGrid";
import { SecurityBento } from "@/components/SecurityBento";
import { PageIntro, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Security",
  description: "VidGrab treats the browser as untrusted: no local web server, no shell, validated messages, private cookies, least-privilege Google access and verified updates.",
};

const threats = [
  { risk: "A web page tries to send VidGrab commands", answer: "Only VidGrab's own extension can reach the app, through Chrome's native messaging. There is no local port to call." },
  { risk: "A crafted link tries to run a command", answer: "Tools run without a shell, the link always follows --, and only http and https links are accepted." },
  { risk: "Another program reads your cookies", answer: "Cookies never appear on the command line and are deleted from their private file when the job ends." },
  { risk: "Another user on the Mac talks to VidGrab", answer: "The socket is private to your account, and the app checks the connecting user." },
  { risk: "A tampered yt-dlp update", answer: "Updates must come from yt-dlp's official releases and match the published checksum, or they are discarded." },
  { risk: "Too much access to your Drive", answer: "Uploads can only see files VidGrab created; the library is read-only and limited to folders you choose." },
];

export default function Security() {
  return (
    <>
      <PageIntro eyebrow="Security" title="The browser is treated as untrusted." lede="VidGrab assumes any web page could be hostile. Every boundary validates its own input and holds only the access it needs.">
        <div className="chips">
          <span className="chip">No localhost server</span><span className="chip">No shell</span>
          <span className="chip">No telemetry</span><span className="chip tally">DRM refused</span>
        </div>
      </PageIntro>

      <section className="band">
        <div className="wrap">
          <SectionHead eyebrow="Threat model" title="What could go wrong, and what stops it." />
          <div className="table-wrap reveal">
            <table>
              <thead><tr><th>Risk</th><th>Protection</th></tr></thead>
              <tbody>{threats.map((t) => <tr key={t.risk}><td><b>{t.risk}</b></td><td>{t.answer}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="band alt">
        <div className="wrap">
          <SectionHead eyebrow="Protections" title="Defence at every boundary." />
          <SecurityBento />
        </div>
      </section>

      <section className="band">
        <div className="wrap">
          <div className="notice reveal">
            <span className="eyebrow">Tested</span>
            <h3>150 automated tests guard these rules.</h3>
            <p>The Swift test suite checks message validation, command building, cookie handling, the socket, sign-in, uploads, the Drive Library limits and the updater, including tampered and downgraded releases. The extension has its own suite. Every change runs both on GitHub Actions.</p>
          </div>
        </div>
      </section>
      <FragmentGrid />
    </>
  );
}
