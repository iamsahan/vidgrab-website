# VidGrab website

The promotional site for [VidGrab](https://github.com/iamsahan/vidgrab-download-manager), a video download manager for macOS.
Built with Next.js as a static export, with Three.js scenes and Lenis smooth scrolling.

## Develop

```sh
npm ci
npm run dev      # http://localhost:3000
```

## Build

```sh
npm run build    # static HTML in out/
```

Deploy `out/` to any static host. Set `SITE_URL` to its public address, and `PAGES_BASE_PATH`
when it's served from a subfolder.

## Layout

- `app/`: pages (App Router) and `globals.css`
- `components/`: client components such as the hero scene, architecture map and FAQ
- `lib/site.ts`: all site content and product facts in one place

Dependencies are pinned exactly, and `.npmrc` disables install scripts.
