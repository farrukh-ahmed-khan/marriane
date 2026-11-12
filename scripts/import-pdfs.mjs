/**
 * Builds data/attractions.json and data/categories.json from the county
 * content documents in /doc (one PDF per county, e.g. doc/Benton_County.pdf).
 *
 *   npm run import            # all PDFs in /doc
 *
 * Text is read from the PDFs. Every photo link ("Open image file") is
 * downloaded once, resized (max 1280px wide, WebP) and saved under
 * public/images/attractions/<county>/. data/photo-sources.json remembers
 * which link became which file, so re-running only downloads new photos.
 * Photos that can't be downloaded are left out (listed in the summary).
 *
 * Each attraction section in a PDF looks like:
 *   <CATEGORY> · 01 OF 36 / Title
 *   INFO BAR AND MAP   (Attraction name, County, Website, Phone, Email, Address, Map latitude, Map longitude)
 *   TOP BANNER PHOTO   (caption + Open image file · Shown on site)
 *   PHOTO GALLERY      (PHOTO 1..7, same format, two columns)
 *   ABOUT <TITLE>      (paragraphs)
 *   NOTE UNDER ABOUT TEXT
 *   TIMINGS            (Saturday … Friday) + "Photos: credit"
 */
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOC = process.env.DOC_DIR ? path.resolve(process.env.DOC_DIR) : path.join(ROOT, "doc");
const DATA = path.join(ROOT, "data");

const LABEL_X = 69; // left column (labels, photo column 1)
const VALUE_X = 169; // right column of info bar / timings
const near = (a, b, tol = 6) => Math.abs(a - b) <= tol;
const squash = (s) => s.replace(/\s+/g, "");
const slugify = (s) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const blank = (v) => (!v || /^leave blank$/i.test(v.trim()) ? "" : v.trim());
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Read every text item on every page (with position, font, link). */
async function readPdf(file) {
  const pdf = await getDocument({ data: new Uint8Array(await fs.readFile(file)), verbosity: 0 }).promise;
  const lines = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const [tc, annots] = await Promise.all([page.getTextContent(), page.getAnnotations()]);
    const links = annots.filter((a) => a.url).map((a) => ({ rect: a.rect, url: a.url }));
    const items = [];
    for (const it of tc.items) {
      if (!("str" in it) || !it.str.trim()) continue;
      const x = it.transform[4];
      const y = it.transform[5];
      if (y >= 750 || y <= 40) continue; // running header / page number
      const link = links.find((l) => x >= l.rect[0] - 2 && x <= l.rect[2] && y >= l.rect[1] - 3 && y <= l.rect[3] + 3);
      items.push({
        page: p,
        x,
        y,
        str: it.str,
        size: Math.round(Math.hypot(it.transform[0], it.transform[1])),
        bold: /_f1$|_f3$/.test(it.fontName),
        font: it.fontName.replace(/^.*_/, ""),
        url: link?.url,
      });
    }
    items.sort((a, b) => b.y - a.y || a.x - b.x);
    for (const it of items) {
      let line = lines.find((l) => l.page === p && Math.abs(l.y - it.y) < 3);
      if (!line) lines.push((line = { page: p, y: it.y, items: [] }));
      line.items.push(it);
    }
  }
  for (const l of lines) {
    l.items.sort((a, b) => a.x - b.x);
    l.text = l.items.map((i) => i.str).join("").replace(/\s+/g, " ").trim();
    l.key = squash(l.text).toUpperCase();
    l.size = Math.max(...l.items.map((i) => i.size));
    l.x = l.items[0].x;
  }
  return lines;
}

function parseCounty(lines, file) {
  const out = [];
  let category = null;
  let cur = null;
  let mode = "none";
  let photoCols = {}; // column x -> { label, caption[] }
  let lastAbout = null; // { page, y, text }

  const finish = () => {
    if (cur) out.push(cur);
    cur = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const k = l.key;

    // --- category intro page ---
    if (/^CATEGORY\d+OF\d+$/.test(k)) {
      finish();
      mode = "category";
      // category name may wrap onto several big lines
      const parts = [];
      while (lines[i + 1] && lines[i + 1].size >= 24) parts.push(lines[++i].text);
      if (parts.length) category = parts.join(" ");
      continue;
    }
    // --- start of an attraction: "<CAT> · 01 OF 36" then big title ---
    if (l.size >= 20 && lines[i - 1] && /·\d+OF\d+$/.test(lines[i - 1].key)) {
      finish();
      cur = {
        title: l.text,
        category,
        info: {},
        banner: null,
        gallery: [],
        about: [],
        note: [],
        timings: [],
        credit: "",
        source: path.basename(file),
      };
      mode = "head";
      continue;
    }
    if (!cur) continue;

    // --- section markers ---
    if (k === "INFOBARANDMAP") { mode = "info"; continue; }
    if (k === "TOPBANNERPHOTO") { mode = "banner"; photoCols = {}; continue; }
    if (k === "PHOTOGALLERY") { mode = "gallery"; photoCols = {}; continue; }
    if (k.startsWith("ABOUT") && l.size <= 9 && l.text.includes(" ")) { mode = "about"; lastAbout = null; continue; }
    if (k === "NOTEUNDERABOUTTEXT") { mode = "note"; continue; }
    if (k === "TIMINGS") { mode = "timings"; continue; }

    switch (mode) {
      case "info": {
        const labelItems = l.items.filter((it) => near(it.x, LABEL_X) && it.size <= 9);
        const valueText = l.items.filter((it) => it.x >= VALUE_X - 6).map((it) => it.str).join("").trim();
        if (labelItems.length) {
          const label = labelItems.map((it) => it.str).join("").trim().toLowerCase();
          cur.info[label] = valueText;
          cur._lastInfo = label;
        } else if (cur._lastInfo && near(l.x, VALUE_X, 8)) {
          cur.info[cur._lastInfo] += " " + valueText;
        }
        break;
      }
      case "banner":
      case "gallery": {
        if (/^Photos? \d+ to \d+:|^No gallery photos|^No banner/i.test(l.text)) break;
        // split the line into columns (two photos can share a row)
        for (const it of l.items) {
          const colX = Object.keys(photoCols).map(Number).find((cx) => it.x >= cx - 4 && it.x < cx + 230);
          const label = squash(it.str).toUpperCase();
          if (/^(BANNER|PHOTO)$/.test(label) && it.size <= 8) {
            photoCols[Math.round(it.x)] = { caption: [], src: null, page: null };
            continue;
          }
          if (colX === undefined) continue;
          const col = photoCols[colX];
          if (it.size <= 8 && /^\d+$/.test(it.str.trim())) continue; // the "1" in "PHOTO 1"
          if (/^Open image file$/i.test(it.str.trim())) {
            col.src = it.url || null;
            if (col.src) {
              col.photo = { src: col.src, alt: col.caption.join(" ").trim(), sourcePage: null, sourceSite: "" };
              if (mode === "banner") cur.banner = col.photo;
              else cur.gallery.push(col.photo);
            }
          } else if (/^Shown on /i.test(it.str.trim())) {
            if (col.photo) {
              col.photo.sourcePage = it.url || null;
              col.photo.sourceSite = it.str.replace(/^Shown on /i, "").trim();
            }
            delete photoCols[colX];
          } else if (it.str.trim() !== "·" && !col.src) {
            col.caption.push(it.str.trim());
          }
        }
        break;
      }
      case "about": {
        if (l.size < 10) break;
        const startsNew =
          !lastAbout ||
          (lastAbout.page === l.page ? lastAbout.y - l.y > 20 : /[.!?)"”]$/.test(lastAbout.text));
        if (startsNew) cur.about.push(l.text);
        else cur.about[cur.about.length - 1] += " " + l.text;
        lastAbout = { page: l.page, y: l.y, text: l.text };
        break;
      }
      case "note": {
        if (l.size < 10) break;
        cur.note.push(l.text);
        break;
      }
      case "timings": {
        if (l.size <= 8 && /^Photos?:/i.test(l.text)) {
          cur.credit = l.text.replace(/^Photos?:\s*/i, "");
          mode = "done";
          break;
        }
        const dayItem = l.items.find((it) => near(it.x, LABEL_X) && DAYS.includes(it.str.trim()));
        const valueText = l.items.filter((it) => it.x >= VALUE_X - 6).map((it) => it.str).join("").trim();
        if (dayItem) cur.timings.push({ day: dayItem.str.trim(), hours: valueText });
        else if (cur.timings.length && near(l.x, VALUE_X, 8)) cur.timings[cur.timings.length - 1].hours += " " + valueText;
        break;
      }
    }
  }
  finish();
  return out;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------------- photo download ----------------
const PUBLIC = path.join(ROOT, "public");
const PHOTO_MAP = path.join(DATA, "photo-sources.json");
const MAX_WIDTH = 1280;
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

async function downloadOne(url, destNoExt) {
  let lastErr = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { headers: BROWSER_HEADERS, redirect: "follow", signal: AbortSignal.timeout(45000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const out = await sharp(buf, { failOn: "none" })
        .rotate() // respect EXIF orientation
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toBuffer();
      const rel = `${destNoExt}.webp`;
      await fs.mkdir(path.dirname(path.join(PUBLIC, rel)), { recursive: true });
      await fs.writeFile(path.join(PUBLIC, rel), out);
      return { path: rel };
    } catch (e) {
      lastErr = e.name === "TimeoutError" ? "timeout" : e.message.split("\n")[0];
      if (/HTTP 4\d\d/.test(lastErr)) break; // don't retry 403/404
    }
  }
  return { error: lastErr };
}

/** Download every photo link; returns {url: {path} | {error}}. */
async function downloadPhotos(attractions) {
  let map = {};
  try {
    map = JSON.parse(await fs.readFile(PHOTO_MAP, "utf8"));
  } catch {}
  // drop cache entries whose file was deleted
  for (const [u, v] of Object.entries(map)) {
    if (v.path) {
      try {
        await fs.access(path.join(PUBLIC, v.path));
      } catch {
        delete map[u];
      }
    }
  }
  const retryFailed = process.argv.includes("--retry-failed");

  // Decide a file name for each new URL (first attraction that uses it)
  const jobs = [];
  const taken = new Set(Object.values(map).map((v) => v.path).filter(Boolean));
  for (const a of attractions) {
    const county = a.counties[0];
    [a.banner, ...a.gallery].filter(Boolean).forEach((p, i) => {
      if (map[p.src]?.path || (map[p.src]?.error && !retryFailed) || jobs.some((j) => j.url === p.src)) return;
      let name = `/images/attractions/${county}/${a.slug}-${i + 1}`;
      for (let n = 2; taken.has(`${name}.webp`); n++) name = `/images/attractions/${county}/${a.slug}-${i + 1}-${n}`;
      taken.add(`${name}.webp`);
      jobs.push({ url: p.src, dest: name });
    });
  }

  if (jobs.length) console.log(`\nDownloading ${jobs.length} new photos…`);
  // Limit to 2 parallel downloads per site and 12 overall.
  const perHost = new Map();
  let done = 0, active = 0, next = 0;
  await new Promise((resolve) => {
    if (!jobs.length) return resolve();
    const pump = () => {
      while (active < 12 && next < jobs.length) {
        const idx = jobs.findIndex((j, k) => k >= next && !j.started && (perHost.get(new URL(j.url).hostname) || 0) < 2);
        if (idx === -1) break;
        const job = jobs[idx];
        job.started = true;
        if (idx === next) while (next < jobs.length && jobs[next].started) next++;
        const host = new URL(job.url).hostname;
        perHost.set(host, (perHost.get(host) || 0) + 1);
        active++;
        downloadOne(job.url, job.dest).then(async (r) => {
          map[job.url] = r;
          perHost.set(host, perHost.get(host) - 1);
          active--;
          done++;
          if (done % 100 === 0 || done === jobs.length) {
            console.log(`  ${done}/${jobs.length}`);
            await fs.writeFile(PHOTO_MAP, JSON.stringify(map, null, 1) + "\n"); // checkpoint
          }
          if (done === jobs.length) resolve();
          else pump();
        });
      }
    };
    pump();
  });
  await fs.writeFile(PHOTO_MAP, JSON.stringify(map, null, 1) + "\n");
  return map;
}

/** Replace photo links with the downloaded local files; drop photos that failed. */
function useLocalPhotos(attractions, map) {
  const local = (p) => (p && map[p.src]?.path ? { ...p, src: map[p.src].path, original: p.src } : null);
  for (const a of attractions) {
    a.banner = local(a.banner);
    a.gallery = a.gallery.map(local).filter(Boolean);
    a.image = a.banner?.src || a.gallery[0]?.src || null;
    a.imageAlt = a.banner?.alt || a.gallery[0]?.alt || a.title;
  }
}

async function main() {
  const files = (await fs.readdir(DOC)).filter((f) => /\.pdf$/i.test(f));
  const seenHashes = new Map();
  const raw = [];

  for (const f of files.sort()) {
    const buf = await fs.readFile(path.join(DOC, f));
    // Skip duplicate documents (e.g. "Curry_County (1).pdf").
    const lines = await readPdf(path.join(DOC, f));
    const sig = crypto.createHash("sha1").update(lines.map((l) => l.text).join("\n")).digest("hex");
    if (seenHashes.has(sig)) {
      console.log(`  skip ${f} (same content as ${seenHashes.get(sig)})`);
      continue;
    }
    seenHashes.set(sig, f);
    const items = parseCounty(lines, f);
    console.log(`  ${f}: ${items.length} attractions (${(buf.length / 1e6).toFixed(1)} MB)`);
    raw.push(...items);
  }

  // ---- categories ----
  const catNames = [...new Set(raw.map((r) => r.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const categories = catNames.map((name, i) => ({ id: i + 1, slug: slugify(name), name, description: "" }));
  const catSlug = Object.fromEntries(categories.map((c) => [c.name, c.slug]));

  // ---- attractions (merge same place listed under several categories in one county) ----
  const byKey = new Map();
  for (const r of raw) {
    const countyName = (r.info["county"] || r.source.replace(/_county.*$/i, "").replace(/_/g, " ")).replace(/ County$/i, "");
    const countySlug = `${slugify(countyName)}-county`;
    const title = r.info["attraction name"] || r.title;
    const key = `${countySlug}|${title.toLowerCase()}|${r.about.join(" ").slice(0, 200)}`;
    const existing = byKey.get(key);
    if (existing) {
      if (r.category && !existing.categories.includes(catSlug[r.category])) existing.categories.push(catSlug[r.category]);
      continue;
    }
    const lat = parseFloat(r.info["map latitude"]);
    const lng = parseFloat(r.info["map longitude"]);
    const website = blank(r.info["website"]);
    const note = blank(r.note.join(" "));
    byKey.set(key, {
      id: 0,
      slug: "",
      title,
      order: byKey.size,
      image: r.banner?.src || r.gallery[0]?.src || null,
      imageAlt: r.banner?.alt || title,
      banner: r.banner,
      gallery: r.gallery,
      contentHtml: r.about.map((p) => `<p>${esc(p)}</p>`).join("\n"),
      excerpt: (r.about[0] || "").slice(0, 160),
      note,
      website: website.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      websiteUrl: website && /^https?:\/\//.test(website) ? website : website ? `https://${website}` : "",
      phone: blank(r.info["phone"]),
      email: blank(r.info["email"]),
      address: blank(r.info["address"]),
      latitude: Number.isFinite(lat) ? lat : null,
      longitude: Number.isFinite(lng) ? lng : null,
      mapQuery: "",
      timings: r.timings.map((t) => ({ day: t.day, hours: blank(t.hours) })),
      photoCredit: r.credit,
      counties: [countySlug],
      categories: r.category ? [catSlug[r.category]] : [],
    });
  }

  // ---- unique slugs: title, then title-county, then title-county-category ----
  const attractions = [...byKey.values()];
  const used = new Set();
  attractions.forEach((a, i) => {
    a.id = i + 1;
    const base = slugify(a.title);
    const county = a.counties[0].replace(/-county$/, "");
    const options = [base, `${base}-${county}`, `${base}-${county}-${a.categories[0] || "x"}`];
    let slug = options.find((s) => !used.has(s));
    for (let n = 2; !slug; n++) if (!used.has(`${options[1]}-${n}`)) slug = `${options[1]}-${n}`;
    used.add(slug);
    a.slug = slug;
  });

  await fs.mkdir(DATA, { recursive: true });
  const countPhotos = (list) => list.reduce((n, x) => n + (x.banner ? 1 : 0) + x.gallery.length, 0);
  const linkedPhotos = countPhotos(attractions);

  // ---- download photos and switch to local files ----
  const map = await downloadPhotos(attractions);
  useLocalPhotos(attractions, map);
  const failedByHost = {};
  for (const [u, v] of Object.entries(map)) if (v.error) failedByHost[new URL(u).hostname] = (failedByHost[new URL(u).hostname] || 0) + 1;

  await fs.writeFile(path.join(DATA, "attractions.json"), JSON.stringify(attractions, null, 2) + "\n");
  await fs.writeFile(path.join(DATA, "categories.json"), JSON.stringify(categories, null, 2) + "\n");

  // ---- report ----
  const noImg = attractions.filter((a) => !a.image).length;
  const noTime = attractions.filter((a) => a.timings.length !== 7).length;
  const noAbout = attractions.filter((a) => !a.contentHtml).length;
  console.log(`\nWrote ${attractions.length} attractions (${raw.length} PDF entries) in ${categories.length} categories.`);
  console.log(`  photos: ${countPhotos(raw)} links in PDFs, ${linkedPhotos} after merging repeats, ${countPhotos(attractions)} downloaded & used`);
  const failedTotal = Object.values(failedByHost).reduce((a, b) => a + b, 0);
  if (failedTotal) {
    console.log(`  ${failedTotal} photo links could not be downloaded (by site):`);
    for (const [h, n] of Object.entries(failedByHost).sort((a, b) => b[1] - a[1]).slice(0, 15)) console.log(`    ${h}: ${n}`);
    console.log(`  (run "npm run import -- --retry-failed" to try them again)`);
  }
  console.log(`  without any photo: ${noImg}, without 7 timing rows: ${noTime}, without about text: ${noAbout}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
