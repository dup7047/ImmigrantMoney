import type {Category, CategoryKey, ToolSlug} from "@/lib/types";
import {toolsMetadata} from "./tools-metadata";

export const categories: Category[] = [
  {key: "earn-protect", slug: "earn-protect", icon: "ShieldCheck", tone: "brand"},
  {key: "bank-credit", slug: "bank-credit", icon: "Wallet", tone: "positive"},
  {key: "send-spend", slug: "send-spend", icon: "Send", tone: "accent"},
  {key: "taxes-immigration", slug: "taxes-immigration", icon: "Landmark", tone: "caution"}
];

export function getCategory(key: CategoryKey): Category | undefined {
  return categories.find((category) => category.key === key);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getToolsByCategory(key: CategoryKey) {
  return toolsMetadata.filter((tool) => tool.category === key);
}

export function getCategoryToolSlugs(key: CategoryKey): ToolSlug[] {
  return getToolsByCategory(key).map((tool) => tool.slug);
}
