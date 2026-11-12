import type { Metadata } from "next";
import CountyGrid from "@/components/CountyGrid";
import { Breadcrumb, PageHero } from "@/components/ui";
import { attractionsInCounty, counties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Oregon Counties",
  description: "Browse all 36 Oregon counties and discover their attractions, history and hidden gems.",
};

export default function CountiesPage() {
  return (
    <>
      <PageHero title="County Tags" image={null} />
      <section className="container" style={{ padding: "28px 16px 40px" }}>
        <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Counties" }]} />
        <CountyGrid
          counties={counties}
          title="Oregon Counties"
          counts={Object.fromEntries(counties.map((c) => [c.slug, attractionsInCounty(c.slug).length]))}
        />
      </section>
    </>
  );
}
