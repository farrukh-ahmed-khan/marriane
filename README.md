# Oregon County Capers — Next.js

Next.js (App Router) version of the WordPress site
`marriane-vydra-stage.devdesignbuild.com`. Same URLs, same images, same content —
but every repeated page is generated from **one template + JSON data**.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages pre-rendered as static HTML)
npm start
```

## How content works

All content lives in `/data`. Images live in `public/wp-content/uploads/` (same paths as WordPress).

| File | What it drives | Template |
| --- | --- | --- |
| `data/counties.json` | 36 county pages `/county-tags/<slug>/` + counties list | `src/app/county-tags/[slug]/page.tsx` |
| `data/attractions.json` | attraction pages `/county/<slug>/` | `src/app/county/[slug]/page.tsx` |
| `data/categories.json` | category pages `/county-categories/<slug>/` + Capers page | `src/app/county-categories/[slug]/page.tsx` |
| `data/capers.json` | `/capers/<slug>/` | `src/app/capers/[slug]/page.tsx` |
| `data/products.json` | `/shop/`, `/product/<slug>/`, home merch carousel | `src/app/product/[slug]/page.tsx` |

### Add a new attraction to a county

Add an object to `data/attractions.json`:

```json
{
  "id": 9001,
  "slug": "multnomah-falls",
  "title": "Multnomah Falls",
  "order": 100,
  "image": "/wp-content/uploads/my-images/multnomah.jpg",
  "imageAlt": "Multnomah Falls",
  "contentHtml": "<p>Oregon's tallest waterfall…</p>",
  "excerpt": "Oregon's tallest waterfall…",
  "website": "fs.usda.gov/…", "websiteUrl": "",
  "phone": "", "email": "",
  "address": "53000 E Historic Columbia River Hwy, Bridal Veil, OR",
  "mapQuery": "",
  "timings": [{ "day": "Monday", "hours": "Open daily" }],
  "counties": ["multnomah-county"],
  "categories": ["waterfalls"]
}
```

That's it — the attraction page is created, it appears on the Multnomah County page,
in the Waterfalls category, in the filters and in the home-page carousels.
Put new images anywhere under `public/` and reference them with a path starting with `/`.

### Edit a county

Edit its entry in `data/counties.json` (seat, founded, area, population, `contentHtml`, `gallery`, …).

## Re-importing from WordPress

While WordPress is still the place you edit content, pull the latest into the JSON files:

```bash
npm run import
# or from a different WordPress URL
WP_URL=https://example.com npm run import
```

`scripts/import-wordpress.mjs` reads the WordPress REST API plus the rendered pages
(JetEngine fields aren't in the API), rewrites image URLs to local paths and downloads
new images. **It overwrites the files in `/data`**, so don't hand-edit JSON and re-import
at the same time — pick one source of truth.

## Not migrated (needs a decision)

- **Shop checkout / cart / my-account** (WooCommerce). Products display; “Add to cart” is disabled.
  Hook up Stripe, Shopify Buy Button or Snipcart when ready.
- **Newsletter form** shows a thank-you message but doesn't send anywhere yet
  (see `src/components/Newsletter.tsx`).
- Footer contact details / social links are the same placeholders as the WordPress site.
