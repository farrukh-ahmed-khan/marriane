import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/Carousel";
import Photo from "@/components/Photo";
import { assets, attractionsInCategory, attractionsInCounty, categories, counties, getCounty, products } from "@/lib/data";

const U = "/images/home";

const choices = [
  { img: `${U}/choice-capers.png`, title: "Explore by Capers", text: "Find adventures that match your interests.", cta: "View All Capers", href: "/capers-categories/" },
  { img: `${U}/choice-county.png`, title: "Explore by County", text: "Start with any of Oregon’s 36 counties.", cta: "View All Counties", href: "/county-tags/" },
  { img: `${U}/choice-highlights.png`, title: "Popular Highlights", text: "See trending attractions across the state.", cta: "Explore Top Picks", href: "/county/" },
];

export default function Home() {
  // One card per interest (category), using a photo from that category.
  const interests = categories
    .map((c) => {
      const list = attractionsInCategory(c.slug);
      const pick = list.find((a) => a.banner);
      return {
        ...c,
        count: list.length,
        counties: new Set(list.flatMap((a) => a.counties)).size,
        image: pick?.banner?.src ?? null,
        alt: pick?.banner?.alt ?? c.name,
      };
    })
    .filter((c) => c.count > 0);

  // Featured: one attraction with a banner photo and a note from each of several counties.
  const featured = counties
    .map((c) => attractionsInCounty(c.slug).find((a) => a.banner && a.excerpt))
    .filter((a) => a !== undefined)
    .slice(0, 8);
  const countiesWithCounts = counties.map((c) => ({ ...c, count: attractionsInCounty(c.slug).length }));

  return (
    <>
      {/* HERO */}
      <section className="hero hero-home">
        <Image src={`${U}/hero.png`} alt="" fill priority sizes="100vw" className="bg" />
        <div>
          <h1>
            Discover Oregon,
            <br />
            One County at a Time
          </h1>
          <div className="pill">Explore all 36 counties through adventures, attractions, and hidden gems statewide.</div>
          <p>
            Find waterfalls, parks, trails, cultural sites, scenic drives, and local experiences across Oregon—organized
            by both category and county for easy trip planning.
          </p>
          <div className="buttons">
            <Link href="/capers-categories/" className="btn btn-orange">Explore by Capers</Link>
            <Link href="/county-tags/" className="btn btn-green">Explore by County</Link>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR WAY */}
      <section className="section choose-section">
        <div className="container">
          <h2 className="section-title center">Choose Your Way to Explore</h2>
          <div className="choice-grid">
            {choices.map((c) => (
              <div key={c.title} className="choice-card">
                <div className="img">
                  <Image src={c.img} alt={c.title} fill sizes="(max-width: 767px) 100vw, 360px" />
                </div>
                <div className="text">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                  <Link href={c.href} className="choice-link">{c.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section bg-section about-home" id="about">
        <Image src={`${U}/about-bg.png`} alt="" fill sizes="100vw" className="bg" />
        <div className="container inner">
          <div>
            <h2>About Oregon County Capers</h2>
            <p>
              Oregon County Capers is a statewide travel and discovery platform designed to showcase the natural beauty,
              outdoor adventures, and cultural highlights found across all 36 counties of Oregon.
            </p>
            <p>
              Oregon offers an incredible range of experiences—from iconic waterfalls and scenic rivers to hidden trails,
              historic towns, wine regions, and vibrant cultural spaces. Oregon County Capers brings everything together in
              one organized, easy-to-explore destination.
            </p>
            <p className="why">Why Oregon County Capers</p>
            <ul className="check-list">
              <li>Covers all 36 Oregon counties in one platform</li>
              <li>Combines statewide discovery with local depth</li>
              <li>Highlights both popular landmarks and hidden gems</li>
              <li>Designed to grow with new attractions and experiences</li>
            </ul>
            <Link href="/history/" className="btn-about">Read More About Us</Link>
          </div>
          <div className="collage">
            <Image src={`${U}/about-collage.png`} alt="Oregon waterfalls and coastline" fill sizes="(max-width: 767px) 100vw, 620px" />
          </div>
        </div>
      </section>

      {/* EXPLORE BY INTEREST */}
      <section className="section interest-section">
        <div className="container">
          <Carousel title="Explore Oregon by Interest" itemWidth="min(382px, 82vw)">
            {interests.map((c) => (
              <Link key={c.slug} href={`/county-categories/${c.slug}/`} className="flip-card" aria-label={`${c.name}: ${c.count} places`}>
                {/* front: photo only; back slides up on hover (Elementor "slide up" flip box) */}
                <div className="front">
                  <Photo src={c.image} alt={c.alt} sizes="(max-width: 767px) 82vw, 382px" />
                </div>
                <div className="back">
                  <h3>{c.name}</h3>
                  <p>
                    {c.count} places across {c.counties} {c.counties === 1 ? "county" : "counties"} in Oregon. Explore
                    every {c.name.toLowerCase()} spot by county.
                  </p>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section bg-section pad-70">
        <Image src={`${U}/featured-bg.png`} alt="" fill sizes="100vw" className="bg" />
        <div className="container">
          <Carousel title="Featured County" itemWidth="min(calc((100% - 20px) / 2), 88vw)">
            {featured.map((a) => (
              <div key={a.slug} className="featured-card">
                <Photo src={a.banner!.src} alt={a.banner!.alt} sizes="(max-width: 767px) 88vw, 620px" style={{ zIndex: -1 }} />
                <div className="body">
                  <div className="badge">
                    <Image src={getCounty(a.counties[0])?.logo || assets.countyBadge} alt="" fill sizes="90px" />
                  </div>
                  <div className="row">
                    <div>
                      <h3>{a.title}</h3>
                      <p>{a.excerpt}</p>
                    </div>
                    <Link href={`/county/${a.slug}/`} className="btn btn-green btn-sm">
                      Explore More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* EXPLORE COUNTY */}
      <section className="section pad-70">
        <div className="container">
          <Carousel title="Explore Oregon County" itemWidth="min(calc((100% - 120px) / 7), 60vw)">
            {countiesWithCounts.map((c) => (
              <Link key={c.slug} href={`/county-tags/${c.slug}/`} className="pill-card">
                <Photo src={c.cardImage} alt="" sizes="200px" />
                <div className="pill-body">
                  <div className="badge">
                    <Image src={c.logo || assets.countyBadge} alt="" fill sizes="74px" />
                  </div>
                  <span className="count">{c.count} Places</span>
                  <strong>{c.name.replace(/ County$/, "")}</strong>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
      </section>

      {/* MERCH */}
      {products.length > 0 && (
        <section className="section bg-section merch-section" style={{ background: "#1565d8" }}>
          <Image src={`${U}/merch-bg.png`} alt="" fill sizes="100vw" className="bg" />
          <div className="container">
            <Carousel title="Outfit Your Trip. Capture the Memories" itemWidth="min(calc((100% - 120px) / 3), 82vw)" gap="10px" dark>
              {products.map((p) => (
                <Link key={p.slug} href={`/product/${p.slug}/`} className="product-card">
                  <div className="img">
                    {p.image && <Image src={p.image} alt={p.name} fill sizes="300px" style={{ objectFit: "contain" }} />}
                  </div>
                  <h3>{p.name}</h3>
                  {p.shortDescription && <p>{p.shortDescription}</p>}
                  <span className="price">
                    {p.currency}
                    {p.price}
                  </span>
                </Link>
              ))}
            </Carousel>
          </div>
        </section>
      )}
    </>
  );
}
