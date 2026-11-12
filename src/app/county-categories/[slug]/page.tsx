import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AttractionBrowser from "@/components/AttractionBrowser";
import { Breadcrumb, PageHero } from "@/components/ui";
import { attractionsInCategory, categories, countiesFor, getCategory, toCard } from "@/lib/data";

/** ONE template for every attraction category (Museums, State Parks, …). */
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).slug);
  return c ? { title: c.name, description: `${c.name} across Oregon's counties.` } : {};
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  const list = attractionsInCategory(category.slug);

  return (
    <>
      <PageHero title={category.name} image={list.find((a) => a.banner)?.banner?.src ?? null} />
      <div className="container" style={{ paddingTop: 28, marginBottom: -20 }}>
        <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/capers-categories/", label: "Capers" }, { label: category.name }]} />
      </div>
      <AttractionBrowser
        attractions={list.map(toCard)}
        filters={countiesFor(list)}
        filterBy="counties"
        filterTitle="Filter by county"
        heading={category.name}
        emptyText="Attractions in this category are coming soon."
      />
    </>
  );
}
