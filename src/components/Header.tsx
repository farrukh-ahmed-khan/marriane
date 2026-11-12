"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { assets } from "@/lib/data";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/history/", label: "History" },
  { href: "/county-tags/", label: "Counties" },
  { href: "/capers-categories/", label: "Capers" },
  { href: "/shop/", label: "Merch" },
  { href: "/#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href.replace(/\/$/, ""));

  return (
    <header className="site-header">
      <div className="bar">
        <nav className={open ? "open" : ""} aria-label="Main">
          <ul>
            {NAV.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={isActive(item.href) ? "active" : ""}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/" className="logo" aria-label="Oregon County Capers home">
          <Image src={assets.logo} alt="Oregon County Capers" fill sizes="(max-width: 1024px) 80px, 140px" style={{ objectFit: "contain" }} priority />
        </Link>
        <div className="actions">
          <Link href="/county/" aria-label="Search attractions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <a href="#" aria-label="My account">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
          </a>
          <Link href="/shop/" aria-label="Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20 8H6.2" />
              <circle cx="9" cy="20" r="1.3" />
              <circle cx="17" cy="20" r="1.3" />
            </svg>
          </Link>
        </div>
        <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </div>
    </header>
  );
}
