import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const pages = ["", "features/", "google-drive/", "architecture/", "security/", "download/", "faq/", "responsible-use/", "privacy/", "terms/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  return pages.map((path) => ({ url: `${base}/${path}`, changeFrequency: "monthly", priority: path === "" ? 1 : 0.7 }));
}
