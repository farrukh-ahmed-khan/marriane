import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb, Html, PageHero } from "@/components/ui";
import { getProduct, products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();

  return (
    <>
      <PageHero title={p.name} image={null} />
      <div className="container" style={{ paddingTop: 28 }}>
        <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/shop/", label: "Shop" }, { label: p.name }]} />
      </div>
      <div className="container product-layout">
        <div className="img">
          {p.image && <Image src={p.image} alt={p.name} fill sizes="(max-width: 860px) 100vw, 600px" style={{ objectFit: "contain" }} />}
        </div>
        <div>
          <h1>{p.name}</h1>
          <div className="price">
            {p.currency}
            {p.price}
          </div>
          {p.descriptionHtml ? <Html html={p.descriptionHtml} /> : p.shortDescription && <p>{p.shortDescription}</p>}
          {/* Checkout is not migrated yet — connect Stripe/Shopify here when ready. */}
          <button className="btn btn-orange" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            Add to cart (coming soon)
          </button>
        </div>
      </div>
    </>
  );
}
