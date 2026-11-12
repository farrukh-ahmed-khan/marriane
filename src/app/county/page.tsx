import type { Metadata } from "next";
import AttractionBrowser from "@/components/AttractionBrowser";
import { Breadcrumb, PageHero } from "@/components/ui";
import { attractions, categoriesFor, toCard } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Attractions",
  description: "Campgrounds, museums, state parks, waterfalls, wineries and more across Oregon.",
};

export default function AllAttractionsPage() {
  return (
    <>
      <PageHero title="All Attractions" image={null} />
      <div className="container" style={{ paddingTop: 28, marginBottom: -20 }}>
        <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Attractions" }]} />
      </div>
      <AttractionBrowser
        attractions={attractions.map(toCard)}
        filters={categoriesFor(attractions)}
        filterBy="categories"
        heading="All Attractions"
      />
    </>
  );
}
