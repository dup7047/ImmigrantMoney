import type {Locale} from "@/i18n/routing";

export type {Locale};

export type ToolSlug =
  | "wage-theft-checker"
  | "itin-tax-guide"
  | "uscis-fee-calculator"
  | "scam-detector"
  | "bank-without-ssn"
  | "credit-builder-roadmap"
  | "remittance-calculator"
  | "affordability-planner";

export type CategoryKey =
  | "earn-protect"
  | "bank-credit"
  | "send-spend"
  | "taxes-immigration";

export type SourceNote = {
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  lastReviewedAt: string;
};

export type LocalizedText = Record<Locale, string>;

export type ToolMetadata = {
  slug: ToolSlug;
  icon: string;
  category: CategoryKey;
  title: LocalizedText;
  shortDescription: LocalizedText;
  cta: LocalizedText;
  seoTitle: LocalizedText;
  metaDescription: LocalizedText;
  evidence: LocalizedText;
  sourceNotes: SourceNote[];
  related: ToolSlug[];
};

export type Category = {
  key: CategoryKey;
  slug: string;
  icon: string;
  tone: "brand" | "positive" | "caution" | "accent";
};

export type AdSlotKind = "leaderboard" | "sidebar" | "mobile";

export type AffiliateLink = {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  href: string;
  priority: number;
  tools: ToolSlug[];
};

export type CalculationResult<T> = {
  ok: boolean;
  data: T;
  warnings: string[];
  sourceNotes?: SourceNote[];
};

export type UsState = {
  code: string;
  name: string;
};
