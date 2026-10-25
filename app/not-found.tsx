import Link from "next/link";
import { PageIntro } from "@/components/ui";

export default function NotFound() {
  return (
    <PageIntro eyebrow="404" title="This page didn't download." lede="The address may be wrong, or the page has moved.">
      <div className="cta-row"><Link className="btn primary" href="/">Back to home</Link></div>
    </PageIntro>
  );
}
