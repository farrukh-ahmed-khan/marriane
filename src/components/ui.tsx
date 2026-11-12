import Link from "next/link";
import type { ReactNode } from "react";
import Photo from "./Photo";
import { assets, type AttractionCard, type County } from "@/lib/data";

/**
 * Full-width image hero used on every inner page.
 * variant mirrors the original templates: listing pages (counties, capers,
 * categories), county pages, attraction pages and the history page each
 * use a slightly different top padding / overlay.
 */
export function PageHero({
  title,
  image,
  children,
  variant = "list",
}: {
  title: string;
  image: string | null | string[];
  children?: ReactNode;
  variant?: "list" | "county" | "attraction" | "history";
}) {
  return (
    <section className={`hero hero-${variant}`}>
      <Photo src={[...(Array.isArray(image) ? image : [image]), assets.listingHero]} alt="" priority sizes="100vw" className="bg" />
      <div className="hero-inner">
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="sep" aria-hidden> / </span>}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="current">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** "Home > Capers" style trail used above listing headings. */
export function Trail({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="trail" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="chev" aria-hidden>›</span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/** Image tile with title overlay (attractions grid). */
export function AttractionTile({ a }: { a: AttractionCard }) {
  return (
    <Link href={`/county/${a.slug}/`} className="tile">
      <Photo src={a.images} alt={a.imageAlt} sizes="(max-width: 767px) 50vw, 240px" />
      <span className="tile-title">{a.title}</span>
    </Link>
  );
}

/** County card (counties archive). */
export function CountyCard({ c, count }: { c: County; count?: number }) {
  return (
    <Link href={`/county-tags/${c.slug}/`} className="county-card">
      <div className="img">
        <span className="tag">{c.name}</span>
        <Photo src={c.cardImage || c.heroImage} alt={c.name} sizes="(max-width: 767px) 50vw, 240px" />
      </div>
      <div className="badge">
        <Photo src={c.logo || assets.countyBadge} alt="" sizes="80px" style={{ objectFit: "contain" }} />
      </div>
      <h3>{c.name}</h3>
      {count !== undefined && <p className="count-note">{count ? `${count} places` : "Coming soon"}</p>}
    </Link>
  );
}

export function Html({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
