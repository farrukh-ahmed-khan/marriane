/**
 * Dumps a PDF's text (line by line) plus every hyperlink annotation,
 * so we can see how county documents are structured.
 * Usage: node scripts/pdf-dump.mjs doc/Benton_County.pdf
 */
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import fs from "node:fs";

const file = process.argv[2];
const pdf = await getDocument({ data: new Uint8Array(fs.readFileSync(file)), verbosity: 0 }).promise;
console.log(`# ${file} — ${pdf.numPages} pages`);

for (let p = 1; p <= pdf.numPages; p++) {
  const page = await pdf.getPage(p);
  const tc = await page.getTextContent();
  const annots = await page.getAnnotations();
  // group text items into lines by y position
  const lines = [];
  for (const it of tc.items) {
    if (!("str" in it)) continue;
    const y = Math.round(it.transform[5]);
    const size = Math.round(Math.hypot(it.transform[0], it.transform[1]));
    let line = lines.find((l) => Math.abs(l.y - y) < 3);
    if (!line) lines.push((line = { y, parts: [], size }));
    line.parts.push({ x: it.transform[4], s: it.str, bold: /bold/i.test(it.fontName), font: it.fontName });
    line.size = Math.max(line.size, size);
  }
  lines.sort((a, b) => b.y - a.y);
  console.log(`\n--- page ${p} ---`);
  for (const l of lines) {
    const text = l.parts.sort((a, b) => a.x - b.x).map((x) => x.s).join("").trim();
    if (text) console.log(`[${l.size}] ${text}`);
  }
  for (const a of annots) if (a.url || a.unsafeUrl) console.log(`  LINK y=${Math.round(a.rect[1])}: ${a.url || a.unsafeUrl}`);
}
