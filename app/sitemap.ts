import type {MetadataRoute} from "next";
import {categories} from "@/data/categories";
import {toolsMetadata} from "@/data/tools-metadata";
import {locales} from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://immigrantmoney.us";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/start", "/privacy-policy", "/terms-of-service"];
  const toolPaths = toolsMetadata.map((tool) => `/tools/${tool.slug}`);
  const categoryPaths = categories.map((category) => `/categories/${category.slug}`);

  return locales.flatMap((locale) =>
    [...staticPaths, ...categoryPaths, ...toolPaths].map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date("2026-05-03"),
      alternates: {
        languages: Object.fromEntries(locales.map((item) => [item, `${siteUrl}/${item}${path}`]))
      }
    }))
  );
}
