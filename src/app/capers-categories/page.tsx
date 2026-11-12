import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, PageHero } from "@/components/ui";
import { categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Capers Categories",
  description: "Explore Oregon by interest: hiking, museums, waterfalls, state parks, wineries and more.",
};

export default function CapersCategoriesPage() {
  return (
    <>
      <PageHero title="Capers Categories" image={null} />
      <section className="container" style={{ padding: "28px 16px 40px" }}>
        <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Capers" }]} />
        <div className="toolbar">
          <h2>Capers Type</h2>
        </div>
        <div className="grid grid-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/county-categories/${c.slug}/`} className="cat-btn">
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
