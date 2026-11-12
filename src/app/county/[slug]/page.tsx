import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Photo from "@/components/Photo";
import { Breadcrumb, Html, PageHero } from "@/components/ui";
import { assets, attractions, getAttraction, getCategory, getCounty, photoCandidates } from "@/lib/data";

/**
 * ONE template for every attraction (data/attractions.json, generated
 * from the county documents in /doc). Sections follow the document:
 * info bar → map → banner photo → gallery → about → note → timings.
 */
export function generateStaticParams() {
  return attractions.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getAttraction((await params).slug);
  if (!a) return {};
  const county = a.counties[0] ? getCounty(a.counties[0]) : undefined;
  return {
    title: county ? `${a.title}, ${county.name}` : a.title,
    description: a.excerpt,
    openGraph: { images: a.image ? [a.image] : [] },
  };
}

const DAY_ORDER = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default async function AttractionPage({ params }: Props) {
  const a = getAttraction((await params).slug);
  if (!a) notFound();

  const county = a.counties[0] ? getCounty(a.counties[0]) : undefined;
  const cats = a.categories.map(getCategory).filter((c) => c !== undefined);
  const hasCoords = a.latitude !== null && a.longitude !== null;
  const mapQuery = hasCoords ? `${a.latitude},${a.longitude}` : [a.title, a.address].filter(Boolean).join(", ");
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=m&z=12&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const timings = [...a.timings].sort((x, y) => DAY_ORDER.indexOf(x.day) - DAY_ORDER.indexOf(y.day));
  const gallery = a.gallery;
  const sources = [...new Map([a.banner, ...a.gallery].filter((p) => p?.sourcePage).map((p) => [p!.sourceSite, p!.sourcePage!])).entries()];

  const info = [
    {
      icon: assets.icons.seat,
      label: "Website:",
      value: a.websiteUrl ? (
        <a href={a.websiteUrl} target="_blank" rel="noopener noreferrer">{a.website}</a>
      ) : null,
    },
    { icon: assets.icons.founded, label: "Phone:", value: a.phone ? <a href={`tel:${a.phone.replace(/[^\d+]/g, "")}`}>{a.phone}</a> : null },
    { icon: assets.icons.area, label: "Email:", value: a.email ? <a href={`mailto:${a.email}`}>{a.email}</a> : null },
    { icon: assets.icons.population, label: "Address:", value: a.address || null },
  ];

  return (
    <>
      <PageHero title={a.title} image={photoCandidates(a, 8)} variant="attraction" />

      <div className="info-bar">
        <div className="container inner">
          <div className="badge-wrap">
            <div className="badge">
              <Image src={county?.logo || assets.countyBadge} alt="" fill sizes="120px" />
            </div>
            <strong>{a.title}</strong>
          </div>
          {info.map((i) => (
            <div className="info-item" key={i.label}>
              <div className="icon">
                <Image src={i.icon} alt="" fill sizes="46px" />
              </div>
              <div>
                <b>{i.label}</b>
                <span>{i.value || "—"}</span>
              </div>
            </div>
          ))}
          <a className="map-link" href={mapLink} target="_blank" rel="noopener noreferrer">
            <Image src={assets.icons.map} alt="" width={44} height={44} />
            Map
          </a>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 30 }}>
        <Breadcrumb
          items={[
            { href: "/", label: "Home" },
            ...(county ? [{ href: `/county-tags/${county.slug}/`, label: county.name }] : []),
            ...(cats[0] ? [{ href: `/county-categories/${cats[0].slug}/`, label: cats[0].name }] : []),
            { label: a.title },
          ]}
        />
      </div>

      <div className="container attraction-layout">
        <div className="about">
          <h1>About {a.title}</h1>
          <Html className="content" html={a.contentHtml} />

          {a.note && (
            <>
              <h4 className="note-label">Note</h4>
              <div className="note-box">{a.note}</div>
            </>
          )}

          {gallery.length > 0 && (
            <>
              <h2 className="block-title">Gallery</h2>
              <div className="photo-grid">
                {gallery.map((p) => (
                  <figure key={p.src}>
                    <a href={p.src} target="_blank" rel="noopener noreferrer" className="frame">
                      <Photo src={p.src} alt={p.alt} sizes="(max-width: 860px) 50vw, 260px" />
                    </a>
                    <figcaption>{p.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </>
          )}

          <p className="tags">
            {cats.map((c) => (
              <Link key={c.slug} href={`/county-categories/${c.slug}/`} className="chip">
                {c.name}
              </Link>
            ))}
            {county && (
              <Link href={`/county-tags/${county.slug}/`} className="chip chip-teal">
                {county.name}
              </Link>
            )}
          </p>

          {(a.photoCredit || sources.length > 0) && (
            <p className="credit">
              {a.photoCredit && <>Photos: {a.photoCredit}. </>}
              {sources.length > 0 && (
                <>
                  Source:{" "}
                  {sources.map(([site, url], i) => (
                    <span key={site}>
                      {i > 0 && ", "}
                      <a href={url} target="_blank" rel="noopener noreferrer">{site}</a>
                    </span>
                  ))}
                </>
              )}
            </p>
          )}
        </div>

        <aside>
          <div className="timings">
            <iframe src={mapEmbed} title={`Map of ${a.title}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <div className="body">
              {hasCoords && (
                <p className="coords">
                  {a.latitude}, {a.longitude}
                </p>
              )}
              {timings.length > 0 && (
                <>
                  <div className="head">
                    <h2>Timings</h2>
                  </div>
                  <ul>
                    {timings.map((t) => (
                      <li key={t.day}>
                        <b>{t.day}</b>
                        <span>{t.hours || "—"}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
