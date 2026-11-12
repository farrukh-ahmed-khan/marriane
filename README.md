# Oregon County Capers — Next.js

Static Next.js (App Router) site. Every repeated page is generated from **one
template + JSON data**; nothing is loaded from the old WordPress site.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # pre-renders every page (~2,200) as static HTML
npm start
```

## Where content comes from

| Data | Source | Drives |
| --- | --- | --- |
| `data/attractions.json` | **generated** from `doc/*.pdf` by `npm run import` | `/county/<slug>/` (one page per attraction) |
| `data/categories.json` | **generated** from `doc/*.pdf` | `/county-categories/<slug>/`, Capers page, filters |
| `data/counties.json` | edit by hand | `/county-tags/<slug>/` (36 county pages) |
| `data/capers.json`, `data/products.json` | edit by hand | `/capers/<slug>/`, `/shop/`, `/product/<slug>/` |

**Every image is a local file in `public/images/`** — nothing is loaded from another website:

```
public/images/
  site/          logo, county badge, stat icons, footer artwork, listing hero
  home/          home page backgrounds and cards
  history/       history page images (tribe-N-photo / tribe-N-badge)
  counties/<county-slug>/   hero, card, logo, gallery-N
  products/      shop images
  attractions/<county-slug>/<attraction-slug>-N.webp   downloaded from the document photo links
```

## Adding / updating attractions

1. Put the county document in `doc/` (same format as the existing ones:
   one attraction per section with INFO BAR AND MAP, TOP BANNER PHOTO, PHOTO GALLERY,
   ABOUT, NOTE UNDER ABOUT TEXT, TIMINGS).
2. Run `npm run import` — it rewrites `data/attractions.json` and `data/categories.json`
   from **all** PDFs in `doc/`, downloads any new photo links into
   `public/images/attractions/` (resized to max 1280px wide, WebP) and prints a summary.
   Photos already downloaded are reused (`data/photo-sources.json` maps link → file).
3. `npm run build`.

Notes on the import (`scripts/import-pdfs.mjs`):
- A place listed under several categories in the same county (same text) becomes one
  page with several categories.
- Duplicate PDFs (e.g. `Curry_County (1).pdf`) are detected and skipped.
- "leave blank" values become empty fields.
- The county comes from the "County" row, so it must match a county in `counties.json`
  (e.g. `Hood River` → `hood-river-county`).
- `node scripts/pdf-dump.mjs doc/X.pdf` prints a document's text and links — useful if a
  new document doesn't import as expected.

Don't hand-edit `attractions.json` — the next import overwrites it. Fix the document instead.

## Photos that couldn't be downloaded

Some sites refuse automated downloads (e.g. `www.fs.usda.gov` answers 403). Those photos are
left out; an attraction with no photo shows a neutral placeholder. The import summary lists
failures by site, and `npm run import -- --retry-failed` tries them again.

`reports/attractions-needing-photos.csv` lists attractions that ended up with no photo.
To fix one, save a photo you have rights to (e.g. downloaded manually in your browser) and
replace the link in the document, or add it under `public/images/attractions/…` and put that
link → file pair in `data/photo-sources.json` (`"https://link": { "path": "/images/attractions/…webp" }`).

## Not migrated (needs a decision)

- **Shop checkout / cart / my-account**: products display; "Add to cart" is disabled.
- **Newsletter form** doesn't send anywhere yet (`src/components/Newsletter.tsx`).
- Footer contact details / social links are placeholders.
- 12 counties (Grant, Multnomah, Polk, Sherman, Tillamook, Umatilla, Union, Wallowa, Wasco,
  Washington, Wheeler, Yamhill) have no document yet — their pages say attractions are coming soon.
