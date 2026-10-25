"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { Logo } from "./ui";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const current = (href: string) => (pathname === href || pathname === href.replace(/\/$/, "") ? "page" : undefined);

  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/" aria-label={`${site.name} home`}>
          <Logo />
          {site.name}
        </Link>
        <nav className="site-nav" aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} aria-current={current(item.href)}>{item.label}</Link>
          ))}
        </nav>
        <a className="btn" href={site.repo} target="_blank" rel="noopener noreferrer">GitHub</a>
        <Link className="btn primary" href="/download/">Get VidGrab</Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d={open ? "M4 4l10 10M14 4L4 14" : "M2 5h14M2 9h14M2 13h14"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Main" hidden={!open}>
        {[...nav, { href: "/download/", label: "Download" }].map((item) => (
          <Link key={item.href} href={item.href} aria-current={current(item.href)}>{item.label}</Link>
        ))}
      </nav>
    </header>
  );
}
