import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AttractionBrowser from "@/components/AttractionBrowser";
import { Breadcrumb, Html, PageHero } from "@/components/ui";
import { assets, attractionsInCounty, categoriesFor, counties, getCounty, toCard } from "@/lib/data";

/**
 * ONE template for all 36 county pages.
 * Content comes from data/counties.json — add a county there and its page exists.
 */
export function generateStaticParams() {
  return counties.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const county = getCounty((await params).slug);
  if (!county) return {};
  return {
    title: county.name,
    description: county.intro,
    openGraph: { images: county.heroImage ? [county.heroImage] : [] },
  };
}

export default async function CountyPage({ params }: Props) {
  const county = getCounty((await params).slug);
  if (!county) notFound();

  const list = attractionsInCounty(county.slug);
  const stats = [
    { icon: assets.icons.seat, label: "County Seat:", value: county.seat },
    { icon: assets.icons.founded, label: "Founded:", value: county.founded },
    { icon: assets.icons.area, label: "Area:", value: county.area },
    { icon: assets.icons.population, label: "Population:", value: county.population },
  ];
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(county.mapLabel)}`;

  return (
    <>
      <PageHero title={county.tagline} image={county.heroImage} variant="county">
        {county.intro && <p>{county.intro}</p>}
      </PageHero>

      <div className="container">
        <div className="stat-bar">
          <div className="stat name">
            <div className="logo">
              <Image src={county.logo || assets.countyBadge} alt={`${county.name} logo`} fill sizes="150px" />
            </div>
            <h3>{county.name}</h3>
          </div>
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="icon">
                <Image src={s.icon} alt="" fill sizes="50px" />
              </div>
              <h3>{s.label}</h3>
              {s.value || "—"}
            </div>
          ))}
          <a className="stat map" href={mapUrl} target="_blank" rel="noopener noreferrer">
            <div className="icon">
              <Image src={assets.icons.map} alt="" fill sizes="50px" />
            </div>
            <h3>MAP</h3>
            {county.mapLabel}
          </a>
        </div>
      </div>

      <AttractionBrowser
        attractions={list.map(toCard)}
        filters={categoriesFor(list)}
        filterBy="categories"
        sidebarTop={
          <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/county-tags/", label: "County Tags" }, { label: county.name }]} />
        }
      >
        <Html className="prose" html={county.contentHtml} />

        {county.gallery.length > 0 && (
          <>
            <h2 className="block-title">Gallery</h2>
            <div className="gallery">
              {county.gallery.map((src) => (
                <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                  <Image src={src} alt={`${county.name} gallery photo`} fill sizes="(max-width: 860px) 50vw, 400px" style={{ objectFit: "cover" }} />
                </a>
              ))}
            </div>
          </>
        )}
      </AttractionBrowser>
    </>
  );
}
