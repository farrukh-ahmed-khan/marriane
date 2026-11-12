import type { Metadata } from "next";
import CountyGrid from "@/components/CountyGrid";
import { PageHero } from "@/components/ui";
import { attractionsInCounty, counties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Oregon Counties",
  description: "Browse all 36 Oregon counties and discover their attractions, history and hidden gems.",
};

export default function CountiesPage() {
  return (
    <>
      <PageHero title="County Tags" image={null} />
      <section className="listing">
        <div className="container">
          <CountyGrid
            counties={counties}
            title="Oregon Counties"
            counts={Object.fromEntries(counties.map((c) => [c.slug, attractionsInCounty(c.slug).length]))}
          />
        </div>
      </section>
    </>
  );
}
