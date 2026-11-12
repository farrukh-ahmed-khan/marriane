import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb, PageHero } from "@/components/ui";
import { products } from "@/lib/data";

export const metadata: Metadata = { title: "Merch", description: "Oregon County Capers merchandise." };

export default function ShopPage() {
  return (
    <>
      <PageHero title="Shop" image={null} />
      <section className="container" style={{ padding: "28px 16px 40px" }}>
        <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Shop" }]} />
        <div className="toolbar">
          <h2>Outfit Your Trip</h2>
        </div>
        <div className="grid grid-4">
          {products.map((p) => (
            <Link key={p.slug} href={`/product/${p.slug}/`} className="product-card card">
              <div className="img">
                {p.image && <Image src={p.image} alt={p.name} fill sizes="300px" style={{ objectFit: "contain" }} />}
              </div>
              <h3>{p.name}</h3>
              <span className="price">
                {p.currency}
                {p.price}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
