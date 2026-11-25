import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AttractionBrowser from "@/components/AttractionBrowser";
import MapCard from "@/components/MapCard";
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

type StatValue = { main: string; note?: string };

/**
 * County facts are written in different ways in the data
 * ("426,280, based on the U.S. Census Bureau's July 1, 2025 population estimate",
 * "40,926 (U.S. Census Bureau estimate, July 1, 2025)", "Approximately 1,879 square miles", …).
 * Split them into a short main figure + a small note so every card looks the same.
 */
function formatPopulation(raw: string): StatValue {
  const num = raw.match(/^\s*(\d{1,3}(?:,\d{3})+|\d{3,})/); // "426,280" (not the comma after it)
  if (!num) return { main: "—" }; // value missing or not a population figure
  const year = raw.match(/July 1,\s*(\d{4})/i)?.[1];
  const note = /census/i.test(raw) ? `${year ? `${year} ` : ""}Census estimate` : undefined;
  return { main: num[1], note };
}

function formatArea(raw: string): StatValue {
  const total = raw.match(/([\d,]+)\s*square miles/i);
  if (!total) return { main: raw || "—" };
  const split = raw.match(/([\d,]+)\s*square miles of land and ([\d,]+)\s*square miles of water/i);
  const note = split
    ? `${split[1]} sq mi land · ${split[2]} sq mi water`
    : /approx/i.test(raw)
      ? "Approximate"
      : undefined;
  return { main: `${total[1]} sq mi`, note };
}

export default async function CountyPage({ params }: Props) {
  const county = getCounty((await params).slug);
  if (!county) notFound();

  const list = attractionsInCounty(county.slug);
  const stats: { icon: string; label: string; value: StatValue }[] = [
    { icon: assets.icons.seat, label: "County Seat:", value: { main: county.seat || "—" } },
    { icon: assets.icons.founded, label: "Founded:", value: { main: county.founded || "—" } },
    { icon: assets.icons.area, label: "Area:", value: formatArea(county.area) },
    { icon: assets.icons.population, label: "Population:", value: formatPopulation(county.population) },
  ];

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
              <span className="stat-value">{s.value.main}</span>
              {s.value.note && <span className="stat-note">{s.value.note}</span>}
            </div>
          ))}
          <MapCard countyName={county.name} mapLabel={county.mapLabel} mapmeUrl={county.mapmeUrl} icon={assets.icons.map} />
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
