/**
 * Single place that reads site content.
 *
 * All content lives in /data/*.json:
 *  - attractions.json + categories.json are generated from the county
 *    documents in /doc by `npm run import` (scripts/import-pdfs.mjs)
 *  - counties.json, capers.json, products.json are edited by hand
 * Add an entry to a JSON file and its page is created automatically
 * from the shared template.
 */
import countiesJson from "../../data/counties.json";
import attractionsJson from "../../data/attractions.json";
import categoriesJson from "../../data/categories.json";
import capersJson from "../../data/capers.json";
import productsJson from "../../data/products.json";

export type County = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  heroImage: string | null;
  cardImage: string | null;
  logo: string | null;
  seat: string;
  founded: string;
  area: string;
  population: string;
  mapLabel: string;
  contentHtml: string;
  gallery: string[];
};

export type PhotoRef = { src: string; alt: string; sourcePage: string | null; sourceSite: string };

export type Attraction = {
  id: number;
  slug: string;
  title: string;
  order: number;
  image: string | null; // banner, or first gallery photo
  imageAlt: string;
  banner: PhotoRef | null;
  gallery: PhotoRef[];
  contentHtml: string;
  excerpt: string;
  note: string;
  website: string;
  websiteUrl: string;
  phone: string;
  email: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  mapQuery: string;
  timings: { day: string; hours: string }[];
  photoCredit: string;
  counties: string[];
  categories: string[];
};

/**
 * Sites that refuse to let other websites display their images (hotlink
 * protection). Their photos are only used as a last resort.
 */
const BLOCKED_HOSTS = ["www.fs.usda.gov"];
export const isBlocked = (src: string) => BLOCKED_HOSTS.some((h) => src.includes(`//${h}/`));

/** Photo candidates for an attraction: banner first, then gallery; blocked hosts last. */
export const photoCandidates = (a: Pick<Attraction, "banner" | "gallery">, max = 4) => {
  const all = [a.banner, ...a.gallery].filter((p) => p !== null).map((p) => p.src);
  return [...all.filter((s) => !isBlocked(s)), ...all.filter(isBlocked)].slice(0, max);
};

/** Small version of an attraction for grids/filters sent to the browser. */
export type AttractionCard = Pick<Attraction, "slug" | "title" | "imageAlt" | "counties" | "categories"> & {
  images: string[];
};
export const toCard = (a: Attraction): AttractionCard => ({
  slug: a.slug,
  title: a.title,
  images: photoCandidates(a, 3),
  imageAlt: a.imageAlt,
  counties: a.counties,
  categories: a.categories,
});

export type Category = { id: number; slug: string; name: string; description: string };

export type Caper = { id: number; slug: string; title: string; image: string | null; contentHtml: string };

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: string;
  currency: string;
  shortDescription: string;
  descriptionHtml: string;
  image: string | null;
  images: string[];
};

export const counties = countiesJson as County[];
export const attractions = (attractionsJson as Attraction[]).slice().sort((a, b) => a.order - b.order);
export const categories = categoriesJson as Category[];
export const capers = capersJson as Caper[];
export const products = productsJson as Product[];

export const getCounty = (slug: string) => counties.find((c) => c.slug === slug);
const attractionBySlug = new Map(attractions.map((a) => [a.slug, a]));
export const getAttraction = (slug: string) => attractionBySlug.get(slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getCaper = (slug: string) => capers.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const attractionsInCounty = (countySlug: string) => attractions.filter((a) => a.counties.includes(countySlug));
export const attractionsInCategory = (categorySlug: string) =>
  attractions.filter((a) => a.categories.includes(categorySlug));

/** Categories that actually have attractions in a given list. */
export const categoriesFor = (list: Pick<Attraction, "categories">[]) => {
  const used = new Set(list.flatMap((a) => a.categories));
  return categories.filter((c) => used.has(c.slug));
};

/** Counties that actually have attractions in a given list. */
export const countiesFor = (list: Pick<Attraction, "counties">[]) => {
  const used = new Set(list.flatMap((a) => a.counties));
  return counties.filter((c) => used.has(c.slug)).map((c) => ({ slug: c.slug, name: c.name }));
};

/** Shared images used across templates. */
export const assets = {
  logo: "/images/site/logo.png",
  countyBadge: "/images/site/county-badge.png",
  listingHero: "/images/site/listing-hero.jpg",
  newsletterBg: "/images/site/newsletter-bg.png",
  footerWordmark: "/images/site/footer-wordmark.png",
  payment: "/images/site/payment-methods.png",
  icons: {
    seat: "/images/site/icon-seat.png",
    founded: "/images/site/icon-founded.png",
    area: "/images/site/icon-area.png",
    population: "/images/site/icon-population.png",
    map: "/images/site/icon-map.png",
  },
};
