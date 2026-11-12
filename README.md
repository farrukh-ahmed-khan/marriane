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

Static images (logo, county badges, hero backgrounds) are local files in `public/`.
Attraction photos are the **image links from the documents**, loaded directly from
the site that hosts them.

## Adding / updating attractions

1. Put the county document in `doc/` (same format as the existing ones:
   one attraction per section with INFO BAR AND MAP, TOP BANNER PHOTO, PHOTO GALLERY,
   ABOUT, NOTE UNDER ABOUT TEXT, TIMINGS).
2. Run `npm run import` — it rewrites `data/attractions.json` and `data/categories.json`
   from **all** PDFs in `doc/` and prints a summary.
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

## Photos that can't be shown

Some sites block other websites from displaying their images (hotlink protection).
`www.fs.usda.gov` does this; it's listed in `BLOCKED_HOSTS` in `src/lib/data.ts`, so those
photos are tried last. Any photo that fails to load falls back to the attraction's next photo,
then to a neutral placeholder.

`reports/attractions-needing-photos.csv` lists attractions with no displayable photo.
To fix one, either put a photo from a site that allows embedding in the document, or download
a photo you have rights to into `public/` and reference it as `/path/to/photo.jpg`.

## Not migrated (needs a decision)

- **Shop checkout / cart / my-account**: products display; "Add to cart" is disabled.
- **Newsletter form** doesn't send anywhere yet (`src/components/Newsletter.tsx`).
- Footer contact details / social links are placeholders.
- 12 counties (Grant, Multnomah, Polk, Sherman, Tillamook, Umatilla, Union, Wallowa, Wasco,
  Washington, Wheeler, Yamhill) have no document yet — their pages say attractions are coming soon.
