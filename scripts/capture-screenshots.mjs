#!/usr/bin/env node
/**
 * Reproducible README screenshot capture.
 *
 * Usage:
 *   npm run build && npm run start          # serve the production build
 *   npm i --no-save playwright              # not a project dependency
 *   npx playwright install chromium         # one-time browser download
 *   node scripts/capture-screenshots.mjs
 *
 * Writes docs/screenshots/{home-en,home-es,tool-wizard}.png. Third-party
 * requests (ads, analytics) are blocked so captures are deterministic and
 * contain no ad content. Override the target with BASE_URL.
 */
import {mkdirSync} from "node:fs";
import {chromium} from "playwright";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = new URL("../docs/screenshots", import.meta.url).pathname;

const shots = [
  {path: "/en", file: "home-en.png"},
  {path: "/es", file: "home-es.png"},
  {path: "/en/tools/credit-builder-roadmap", file: "tool-wizard.png"}
];

// AdSlot renders a dashed placeholder when AdSense is disabled (the default
// without env vars). Hide those boxes so captures show the product, not the
// dev placeholder. Labels per locale: messages/*.json → toolLayout.adPlaceholder.
const AD_PLACEHOLDER_CSS = ["Advertisement placeholder", "Espacio de anuncio", "广告位"]
  .map((label) => `[aria-label="${label}"] { display: none !important; }`)
  .join("\n");

mkdirSync(OUT_DIR, {recursive: true});

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: {width: 1440, height: 900},
  deviceScaleFactor: 2
});

// Keep captures deterministic: only allow same-origin requests.
const origin = new URL(BASE_URL).host;
await context.route("**/*", (route) => {
  const host = new URL(route.request().url()).host;
  return host === origin ? route.continue() : route.abort();
});

for (const {path, file} of shots) {
  const page = await context.newPage();
  await page.goto(`${BASE_URL}${path}`, {waitUntil: "networkidle"});
  await page.addStyleTag({content: AD_PLACEHOLDER_CSS});
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({path: `${OUT_DIR}/${file}`});
  console.log(`✓ ${file}  ←  ${path}`);
  await page.close();
}

await browser.close();
