import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, Html, PageHero } from "@/components/ui";
import { capers, getCaper } from "@/lib/data";

/** ONE template for every caper story (data/capers.json). */
export function generateStaticParams() {
  return capers.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCaper((await params).slug);
  return c ? { title: c.title } : {};
}

export default async function CaperPage({ params }: Props) {
  const caper = getCaper((await params).slug);
  if (!caper) notFound();

  return (
    <>
      <PageHero title={caper.title} image={caper.image} />
      <section className="container" style={{ padding: "28px 16px 40px", maxWidth: 900 }}>
        <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/capers-categories/", label: "Capers" }, { label: caper.title }]} />
        <Html className="prose" html={caper.contentHtml} />
      </section>
    </>
  );
}
