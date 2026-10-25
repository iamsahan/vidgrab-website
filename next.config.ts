import type { NextConfig } from "next";

// Static export: `npm run build` writes plain HTML to out/, which any static host can serve.
// Set PAGES_BASE_PATH (for example "/vidgrab-download-manager") when hosting under a subfolder,
// such as GitHub Pages for a project repository.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.PAGES_BASE_PATH || undefined,
  reactStrictMode: true,
  poweredByHeader: false,
};

export default config;
