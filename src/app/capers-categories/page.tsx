import type { Metadata } from "next";
import CapersGrid from "@/components/CapersGrid";
import { PageHero } from "@/components/ui";
import { attractionsInCategory, categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Capers Categories",
  description: "Explore Oregon by interest: hiking, museums, waterfalls, state parks, wineries and more.",
};

export default function CapersCategoriesPage() {
  const items = categories.map((c) => {
    const list = attractionsInCategory(c.slug);
    return { slug: c.slug, name: c.name, count: list.length, image: list.find((a) => a.banner)?.banner?.src ?? null };
  });

  return (
    <>
      <PageHero title="Capers Categories" image={null} />
      <section className="listing">
        <div className="container">
          <CapersGrid items={items} />
        </div>
      </section>
    </>
  );
}
