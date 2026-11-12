import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AttractionBrowser from "@/components/AttractionBrowser";
import { Breadcrumb, PageHero, Trail } from "@/components/ui";
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
      <PageHero title={category.name} image={null} />
      <section className="listing" style={{ paddingBottom: 0 }}>
        <div className="container">
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <div>
              <Trail items={[{ href: "/", label: "Home" }, { href: "/capers-categories/", label: "Capers" }]} />
              <h2>{category.name}</h2>
            </div>
          </div>
        </div>
      </section>
      <AttractionBrowser
        attractions={list.map(toCard)}
        filters={countiesFor(list)}
        filterBy="counties"
        filterTitle="Filter by county"
        heading="Attractions"
        emptyText="Attractions in this category are coming soon."
        columns={5}
        sidebarTop={
          <Breadcrumb
            items={[{ href: "/", label: "Home" }, { href: "/capers-categories/", label: "County Attractions" }, { label: category.name }]}
          />
        }
      />
    </>
  );
}
