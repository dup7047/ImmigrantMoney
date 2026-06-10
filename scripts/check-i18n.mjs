#!/usr/bin/env node
/**
 * i18n parity check: every locale catalog in messages/ must expose exactly
 * the same set of leaf keys, and no leaf may be an empty string. Run via
 * `npm run check:i18n`; exits non-zero on drift so it can gate CI.
 */
import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";

const MESSAGES_DIR = new URL("../messages", import.meta.url).pathname;

function leafKeys(node, prefix = "", out = new Map()) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") {
      leafKeys(value, path, out);
    } else {
      out.set(path, value);
    }
  }
  return out;
}

const catalogs = readdirSync(MESSAGES_DIR)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({
    locale: file.replace(/\.json$/, ""),
    keys: leafKeys(JSON.parse(readFileSync(join(MESSAGES_DIR, file), "utf8")))
  }));

if (catalogs.length < 2) {
  console.error(`Expected at least 2 catalogs in messages/, found ${catalogs.length}.`);
  process.exit(1);
}

const [reference, ...rest] = catalogs;
let failed = false;

for (const catalog of rest) {
  const missing = [...reference.keys.keys()].filter((key) => !catalog.keys.has(key));
  const extra = [...catalog.keys.keys()].filter((key) => !reference.keys.has(key));
  for (const key of missing) {
    console.error(`✗ ${catalog.locale}.json is missing "${key}" (present in ${reference.locale}.json)`);
    failed = true;
  }
  for (const key of extra) {
    console.error(`✗ ${catalog.locale}.json has extra key "${key}" (absent from ${reference.locale}.json)`);
    failed = true;
  }
}

for (const catalog of catalogs) {
  for (const [key, value] of catalog.keys) {
    if (typeof value === "string" && value.trim() === "") {
      console.error(`✗ ${catalog.locale}.json has empty value at "${key}"`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log(
  `✓ i18n parity OK — ${catalogs.map((c) => `${c.locale} (${c.keys.size} keys)`).join(", ")}`
);
