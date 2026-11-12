import Link from "next/link";
import type { ReactNode } from "react";
import Photo from "./Photo";
import { assets, type AttractionCard, type County } from "@/lib/data";

/** Full-width image hero used on every inner page. */
export function PageHero({
  title,
  image,
  children,
}: {
  title: string;
  image: string | null | string[];
  children?: ReactNode;
}) {
  return (
    <section className="hero">
      <Photo src={[...(Array.isArray(image) ? image : [image]), assets.listingHero]} alt="" priority sizes="100vw" className="bg" />
      <div>
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
          {i > 0 && <span aria-hidden> / </span>}
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

/** Image tile with title overlay (attractions grid). */
export function AttractionTile({ a }: { a: AttractionCard }) {
  return (
    <Link href={`/county/${a.slug}/`} className="tile">
      <Photo src={a.images} alt={a.imageAlt} sizes="(max-width: 860px) 50vw, 240px" />
      <span>{a.title}</span>
    </Link>
  );
}

/** County card (counties archive). */
export function CountyCard({ c, count }: { c: County; count?: number }) {
  return (
    <Link href={`/county-tags/${c.slug}/`} className="card county-card">
      <div className="img">
        <span className="tag">{c.name}</span>
        <Photo src={c.cardImage || c.heroImage} alt={c.name} sizes="(max-width: 600px) 50vw, 240px" />
      </div>
      <div className="badge">
        <Photo src={c.logo || assets.countyBadge} alt="" sizes="56px" />
      </div>
      <h3>{c.name}</h3>
      {count !== undefined && <p className="count-note">{count ? `${count} places` : "Coming soon"}</p>}
    </Link>
  );
}

export function Html({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
