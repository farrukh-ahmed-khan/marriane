import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, Trail } from "@/components/ui";
import { products } from "@/lib/data";

export const metadata: Metadata = { title: "Merch", description: "Oregon County Capers merchandise." };

export default function ShopPage() {
  return (
    <>
      <PageHero title="Shop" image={null} />
      <section className="listing">
        <div className="container">
          <div className="toolbar">
            <div>
              <Trail items={[{ href: "/", label: "Home" }, { label: "Shop" }]} />
              <h2>Outfit Your Trip</h2>
            </div>
          </div>
          <div className="grid grid-4">
            {products.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}/`} className="product-card">
                <div className="img">
                  {p.image && <Image src={p.image} alt={p.name} fill sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1024px) 33vw, 300px" style={{ objectFit: "contain" }} />}
                </div>
                <h3>{p.name}</h3>
                {p.shortDescription && <p>{p.shortDescription}</p>}
                <span className="price">
                  {p.currency}
                  {p.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
